from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import psycopg2
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import SGDClassifier
from sklearn.preprocessing import LabelEncoder
import threading
import requests
from jose import jwt, JWTError
import bcrypt
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from typing import List, Optional
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

app = FastAPI(title="Morocco 2030 Risk Analysis API")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBRNgO5qFgMG0qj6Da1phj3TJh2RV4TRxQ")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

# Configuration PostgreSQL
PG_DB = os.getenv("PG_DB", "Projet_stage")
PG_USER = os.getenv("PG_USER", "postgres")
PG_PASSWORD = os.getenv("PG_PASSWORD", "1314")
PG_HOST = os.getenv("PG_HOST", "localhost")
PG_PORT = os.getenv("PG_PORT", "5432")

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Modèles Pydantic
class UserRegister(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str

class UserLogin(BaseModel):
    email: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class QuestionRequest(BaseModel):
    question: str

class UserReview(BaseModel):
    city_id: str
    criminalite: int
    pollution: int
    infrastructure: int
    commentaire: str

class Comment(BaseModel):
    id: str
    author: str
    date: str
    rating: int
    comment: str
    avatar: Optional[str] = None

# Sécurité
security = HTTPBearer()

# Connexion PostgreSQL
def get_db_connection():
    return psycopg2.connect(
        dbname=PG_DB,
        user=PG_USER,
        password=PG_PASSWORD,
        host=PG_HOST,
        port=PG_PORT
    )

# Initialisation de la base de données
def init_database():
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Créer les tables si elles n'existent pas
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cur.execute("""
        CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            city_id VARCHAR(50) NOT NULL,
            user_id INTEGER REFERENCES users(id),
            criminalite INTEGER NOT NULL,
            pollution INTEGER NOT NULL,
            infrastructure INTEGER NOT NULL,
            commentaire TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cur.execute("""
        CREATE TABLE IF NOT EXISTS faq (
            id SERIAL PRIMARY KEY,
            question TEXT NOT NULL,
            reponse TEXT NOT NULL
        )
    """)


# Initialiser la base de données au démarrage
init_database()

# Système de chatbot
class ChatbotSystem:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        self.lock = threading.Lock()
        self.load_faq()
    
    def load_faq(self):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT question, reponse FROM faq")
        data = cur.fetchall()
        self.questions = [row[0] for row in data]
        self.answers = [row[1] for row in data]
        if self.questions:
            self.question_vectors = self.vectorizer.fit_transform(self.questions)
        cur.close()
        conn.close()
    
    def find_local_answer(self, user_question: str):
        with self.lock:
            if not self.questions:
                return None
            user_vec = self.vectorizer.transform([user_question])
            sims = cosine_similarity(user_vec, self.question_vectors)
            max_sim = sims.max()
            if max_sim > 0.5:
                idx = sims.argmax()
                return self.answers[idx]
            return None
    
    def call_gemini_api(self, question: str) -> str:
        GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
        headers = {
            "Content-Type": "application/json"
        }
        payload = {
            "contents": [{
                "parts": [{
                    "text": f"Tu es un assistant spécialisé dans l'analyse des risques pour la Coupe du Monde 2030 au Maroc. Réponds à cette question: {question}"
                }]
            }]
        }
        try:
            response = requests.post(GEMINI_API_URL, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            data = response.json()
            if 'candidates' in data and len(data['candidates']) > 0:
                return data['candidates'][0]['content']['parts'][0]['text']
            return "Je n'ai pas pu obtenir une réponse de l'IA."
        except Exception as e:
            return f"Erreur de communication avec l'IA: {str(e)}"

chatbot = ChatbotSystem()

# Système ML pour les indices de risque
class RiskAnalysisSystem:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.online_model = SGDClassifier(loss='log_loss', random_state=42)
        self.le = LabelEncoder()
        self.historique_avis = []
        self.load_initial_data()
    
    def load_initial_data(self):
        # Données initiales des villes marocaines
        self.cities_data = {
            "casablanca": {"Indice_Criminalite": 62, "Indice_Pollution": 70, "Score_Infrastructures": 4, "riskLevel": "Moyen"},
            "rabat": {"Indice_Criminalite": 40, "Indice_Pollution": 55, "Score_Infrastructures": 5, "riskLevel": "Faible"},
            "marrakech": {"Indice_Criminalite": 58, "Indice_Pollution": 65, "Score_Infrastructures": 3, "riskLevel": "Moyen"},
            "fes": {"Indice_Criminalite": 45, "Indice_Pollution": 60, "Score_Infrastructures": 3, "riskLevel": "Moyen"},
            "agadir": {"Indice_Criminalite": 35, "Indice_Pollution": 40, "Score_Infrastructures": 4, "riskLevel": "Faible"},
            "tanger": {"Indice_Criminalite": 50, "Indice_Pollution": 58, "Score_Infrastructures": 3, "riskLevel": "Moyen"}
        }
        
        # Créer un dataset synthétique pour l'entraînement
        data = []
        for city_id, city_data in self.cities_data.items():
            data.append([
                city_data["Indice_Criminalite"],
                city_data["Indice_Pollution"],
                city_data["Score_Infrastructures"],
                city_data["riskLevel"]
            ])
        
        df = pd.DataFrame(data, columns=["Indice_Criminalite", "Indice_Pollution", "Score_Infrastructures", "NiveauGlobalRisque"])
        df["NiveauGlobalRisque_encoded"] = self.le.fit_transform(df["NiveauGlobalRisque"])
        
        X = df[["Indice_Criminalite", "Indice_Pollution", "Score_Infrastructures"]]
        y = df["NiveauGlobalRisque_encoded"]
        
        self.model.fit(X, y)
        self.online_model.partial_fit(X, y, classes=np.unique(y))
    
    def update_city_risk(self, city_id: str, criminalite: int, pollution: int, infrastructure: int):
        if city_id not in self.cities_data:
            raise ValueError(f"Ville {city_id} non trouvée")
        
        # Mettre à jour les données de la ville
        self.cities_data[city_id]["Indice_Criminalite"] = criminalite
        self.cities_data[city_id]["Indice_Pollution"] = pollution
        self.cities_data[city_id]["Score_Infrastructures"] = infrastructure
        
        # Prédire le nouveau niveau de risque
        X_new = pd.DataFrame([[criminalite, pollution, infrastructure]], 
                           columns=["Indice_Criminalite", "Indice_Pollution", "Score_Infrastructures"])
        
        new_risk_encoded = self.online_model.predict(X_new)[0]
        new_risk_level = self.le.inverse_transform([new_risk_encoded])[0]
        
        self.cities_data[city_id]["riskLevel"] = new_risk_level
        
        # Mettre à jour le modèle en ligne
        self.online_model.partial_fit(X_new, [new_risk_encoded])
        
        return new_risk_level

risk_system = RiskAnalysisSystem()

# Fonctions utilitaires
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token invalide")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")

def get_current_user(payload: dict = Depends(verify_token)):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, email, first_name, last_name FROM users WHERE id = %s", (payload.get("user_id"),))
    user = cur.fetchone()
    cur.close()
    conn.close()
    
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    return {
        "id": user[0],
        "email": user[1],
        "first_name": user[2],
        "last_name": user[3]
    }

# Routes d'authentification
@app.post("/auth/register")
async def register(user_data: UserRegister):
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Vérifier si l'utilisateur existe déjà
        cur.execute("SELECT id FROM users WHERE email = %s", (user_data.email,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="Email déjà utilisé")
        
        # Hasher le mot de passe
        password_hash = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
        
        # Insérer l'utilisateur
        cur.execute(
            "INSERT INTO users (email, password_hash, first_name, last_name) VALUES (%s, %s, %s, %s) RETURNING id",
            (user_data.email, password_hash.decode('utf-8'), user_data.first_name, user_data.last_name)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        
        # Créer le token
        access_token = create_access_token(data={"user_id": user_id})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "email": user_data.email,
                "first_name": user_data.first_name,
                "last_name": user_data.last_name
            }
        }
    
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.post("/auth/login")
async def login(user_data: UserLogin):
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("SELECT id, password_hash, first_name, last_name FROM users WHERE email = %s", (user_data.email,))
        user = cur.fetchone()
        
        if not user or not bcrypt.checkpw(user_data.password.encode('utf-8'), user[1].encode('utf-8')):
            raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
        
        access_token = create_access_token(data={"user_id": user[0]})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user[0],
                "email": user_data.email,
                "first_name": user[2],
                "last_name": user[3]
            }
        }
    
    finally:
        cur.close()
        conn.close()

@app.post("/auth/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Vérifier si l'utilisateur existe
        cur.execute("SELECT id, first_name, last_name FROM users WHERE email = %s", (req.email,))
        user = cur.fetchone()
        
        if not user:
            # Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
            return {"message": "Si cet email existe dans notre base de données, vous recevrez un lien de réinitialisation."}
        
        # Générer un token de réinitialisation avec expiration (1 heure)
        expire = datetime.utcnow() + timedelta(hours=1)
        token_data = {
            "user_id": user[0],
            "action": "reset_password",
            "exp": expire
        }
        reset_token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
        
        # En production, vous devriez envoyer un vrai email ici
        # Pour l'instant, on simule l'envoi
        print(f"Email de réinitialisation envoyé à {req.email}")
        print(f"Token de réinitialisation: {reset_token}")
        
        return {
            "message": "Si cet email existe dans notre base de données, vous recevrez un lien de réinitialisation.",
            "token": reset_token  # À retirer en production
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.post("/auth/reset-password")
async def reset_password(req: ResetPasswordRequest):
    try:
        # Décoder et vérifier le token
        payload = jwt.decode(req.token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        action = payload.get("action")
        
        if action != "reset_password":
            raise HTTPException(status_code=400, detail="Token invalide")
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        try:
            # Vérifier que l'utilisateur existe
            cur.execute("SELECT id FROM users WHERE id = %s", (user_id,))
            user = cur.fetchone()
            
            if not user:
                raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
            
            # Hasher le nouveau mot de passe
            password_hash = bcrypt.hashpw(req.new_password.encode('utf-8'), bcrypt.gensalt())
            
            # Mettre à jour le mot de passe
            cur.execute("UPDATE users SET password_hash = %s WHERE id = %s", (password_hash.decode('utf-8'), user_id))
            conn.commit()
            
            return {"message": "Mot de passe réinitialisé avec succès"}
        
        finally:
            cur.close()
            conn.close()
    
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/user")
async def get_user_info(current_user: dict = Depends(get_current_user)):
    return current_user

# Route du chatbot
@app.post("/chat")
async def chat_endpoint(req: QuestionRequest):
    local_ans = chatbot.find_local_answer(req.question)
    if local_ans:
        return {"answer": local_ans, "source": "local"}
    else:
        gemini_ans = chatbot.call_gemini_api(req.question)
        return {"answer": gemini_ans, "source": "gemini"}

# Routes pour les villes et commentaires
@app.get("/cities")
async def get_cities():
    return {
        "cities": [
            {
                "id": "casablanca",
                "name": "Casablanca",
                "lat": 33.5731,
                "lng": -7.5898,
                **risk_system.cities_data["casablanca"]
            },
            {
                "id": "rabat",
                "name": "Rabat",
                "lat": 34.0209,
                "lng": -6.8416,
                **risk_system.cities_data["rabat"]
            },
            {
                "id": "marrakech",
                "name": "Marrakech",
                "lat": 31.6341,
                "lng": -8.0000,
                **risk_system.cities_data["marrakech"]
            },
            {
                "id": "fes",
                "name": "Fès",
                "lat": 34.0342,
                "lng": -5.0025,
                **risk_system.cities_data["fes"]
            },
            {
                "id": "agadir",
                "name": "Agadir",
                "lat": 30.4278,
                "lng": -9.5981,
                **risk_system.cities_data["agadir"]
            },
            {
                "id": "tanger",
                "name": "Tanger",
                "lat": 35.7595,
                "lng": -5.8340,
                **risk_system.cities_data["tanger"]
            }
        ]
    }

@app.get("/cities/{city_id}/comments")
async def get_city_comments(city_id: str):
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT c.id, u.first_name, u.last_name, c.criminalite, c.pollution, c.infrastructure, 
                   c.commentaire, c.created_at
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.city_id = %s
            ORDER BY c.created_at DESC
        """, (city_id,))
        
        comments = []
        for row in cur.fetchall():
            comments.append({
                "id": str(row[0]),
                "author": f"{row[1]} {row[2]}",
                "date": row[7].strftime("%Y-%m-%d"),
                "rating": round((row[3] + row[4] + row[5]) / 3),
                "comment": row[6],
                "avatar": f"{row[1][0]}{row[2][0]}"
            })
        
        return {"comments": comments}
    
    finally:
        cur.close()
        conn.close()

@app.post("/cities/{city_id}/comments")
async def add_city_comment(city_id: str, review: UserReview, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Insérer le commentaire
        cur.execute("""
            INSERT INTO comments (city_id, user_id, criminalite, pollution, infrastructure, commentaire)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (city_id, current_user["id"], review.criminalite, review.pollution, review.infrastructure, review.commentaire))
        
        # Mettre à jour les indices de risque de la ville
        new_risk_level = risk_system.update_city_risk(city_id, review.criminalite, review.pollution, review.infrastructure)
        
        conn.commit()
        
        return {
            "message": "Commentaire ajouté avec succès",
            "new_risk_level": new_risk_level,
            "updated_city_data": risk_system.cities_data[city_id]
        }
    
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# Route pour obtenir les données météo (proxy pour éviter les problèmes CORS)
@app.get("/weather/{city_id}")
async def get_weather(city_id: str):
    # Coordonnées des villes
    city_coords = {
        "casablanca": (33.5731, -7.5898),
        "rabat": (34.0209, -6.8416),
        "marrakech": (31.6341, -8.0000),
        "fes": (34.0342, -5.0025),
        "agadir": (30.4278, -9.5981),
        "tanger": (35.7595, -5.8340)
    }
    
    if city_id not in city_coords:
        raise HTTPException(status_code=404, detail="Ville non trouvée")
    
    lat, lon = city_coords[city_id]
    
    try:
        # Utiliser une API météo gratuite (OpenWeatherMap)
        API_KEY = os.getenv("OPENWEATHER_API_KEY", "demo_key")
        response = requests.get(
            f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric&lang=fr",
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            return {
                "temperature": round(data["main"]["temp"]),
                "description": data["weather"][0]["description"],
                "humidity": data["main"]["humidity"],
                "windSpeed": round(data["wind"]["speed"] * 3.6),  # m/s vers km/h
                "icon": data["weather"][0]["icon"],
                "feelsLike": round(data["main"]["feels_like"])
            }
        else:
            # Données simulées en cas d'erreur
            return {
                "temperature": 25,
                "description": "ensoleillé",
                "humidity": 65,
                "windSpeed": 12,
                "icon": "01d",
                "feelsLike": 26
            }
    
    except Exception as e:
        # Données simulées en cas d'erreur
        return {
            "temperature": 25,
            "description": "ensoleillé",
            "humidity": 65,
            "windSpeed": 12,
            "icon": "01d",
            "feelsLike": 26
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
