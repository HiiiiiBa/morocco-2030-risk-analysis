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

# Configuration CORS (plusieurs ports : Next.js peut basculer si 3000 est pris)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3003",
    ],
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

class DistrictReview(BaseModel):
    city_id: str
    district_id: str
    criminalite: int
    pollution: int
    infrastructure: int
    commentaire: str

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
        CREATE TABLE IF NOT EXISTS district_comments (
            id SERIAL PRIMARY KEY,
            city_id VARCHAR(50) NOT NULL,
            district_id VARCHAR(100) NOT NULL,
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
    
    # Insérer des données FAQ initiales si la table est vide
    cur.execute("SELECT COUNT(*) FROM faq")
    faq_count = cur.fetchone()[0]
    
    if faq_count == 0:
        faq_data = [
            ("Quelles sont les villes hôtes de la Coupe du Monde 2030 au Maroc ?", 
             "Les villes hôtes de la Coupe du Monde 2030 au Maroc sont : Casablanca, Rabat, Marrakech, Fès, Agadir et Tanger. Chaque ville offre des infrastructures modernes et une expérience unique pour les supporters."),
            
            ("Comment se déplacer à Rabat ?", 
             "À Rabat, vous pouvez utiliser le tramway qui relie les principales zones de la ville, les bus urbains, les taxis, ou louer une voiture. Le tramway est particulièrement pratique pour se rendre au stade et dans le centre-ville."),
            
            ("Quels sont les risques de sécurité au Maroc ?", 
             "Le Maroc est généralement un pays sûr pour les touristes. Les principales préoccupations sont le vol à la tire dans les zones touristiques et la circulation dense. Il est recommandé de rester vigilant dans les grandes villes et d'éviter les zones isolées la nuit."),
            
            ("Où sont les fan zones ?", 
             "Les fan zones seront installées dans chaque ville hôte, généralement dans les centres-villes ou près des stades. Elles offriront des écrans géants, de la nourriture locale, des animations et une ambiance festive pour tous les supporters."),
            
            ("Quel est le niveau de pollution à Casablanca ?", 
             "Casablanca a un niveau de pollution modéré à élevé, principalement due au trafic automobile dense. Il est recommandé aux personnes sensibles de porter un masque lors des pics de pollution et d'éviter les zones de fort trafic."),
            
            ("Comment est l'infrastructure de transport à Marrakech ?", 
             "Marrakech dispose d'un réseau de bus urbains et de taxis. La ville est également bien desservie par les taxis collectifs (grands taxis) pour les déplacements inter-villes. Un système de transport en commun moderne est en cours de développement."),
            
            ("Quels sont les meilleurs hôtels à Agadir ?", 
             "Agadir propose une large gamme d'hôtels, des établissements de luxe en bord de mer aux hôtels économiques. Les zones les plus populaires sont la corniche, le centre-ville et les environs de la marina."),
            
            ("Y a-t-il des risques de criminalité à Fès ?", 
             "Fès a un niveau de criminalité modéré. Les principaux risques sont les vols à la tire dans la médina et les arnaques touristiques. Il est conseillé de rester vigilant, surtout dans les souks et les zones touristiques."),
            
            ("Comment se rendre de Tanger à Rabat ?", 
             "Pour aller de Tanger à Rabat, vous pouvez prendre le train (2h30), l'autocar (3h), ou louer une voiture (2h45). Le train est le moyen le plus confortable et économique."),
            
            ("Quelle est la meilleure période pour visiter le Maroc ?", 
             "La meilleure période pour visiter le Maroc est d'octobre à avril, avec des températures agréables. Pendant la Coupe du Monde 2030 (juin-juillet), attendez-vous à des températures élevées, surtout dans les villes du sud comme Marrakech et Agadir.")
        ]
        
        cur.executemany(
            "INSERT INTO faq (question, reponse) VALUES (%s, %s)",
            faq_data
        )
        conn.commit()
        print("Données FAQ initiales insérées avec succès")
    
    cur.close()
    conn.close()

# Initialiser la base de données au démarrage
init_database()

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
            try:
                user_vec = self.vectorizer.transform([user_question])
                sims = cosine_similarity(user_vec, self.question_vectors)
                max_sim = sims.max()
                if max_sim > 0.3:
                    idx = sims.argmax()
                    return self.answers[idx]
                return None
            except Exception as e:
                print(f"Erreur lors de la recherche locale: {e}")
                return None
    
    def call_gemini_api(self, question: str) -> str:
        headers = {
            "Content-Type": "application/json"
        }
        
        url = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"
        
        prompt = f"""Tu es un assistant spécialisé pour la Coupe du Monde 2030 au Maroc. 
        Tu peux répondre aux questions sur :
        - Les villes hôtes : Casablanca, Rabat, Marrakech, Fès, Agadir, Tanger
        - Les transports et déplacements
        - La sécurité et les risques
        - Les hébergements et restaurants
        - Les attractions touristiques
        - Les fan zones et événements
        - La météo et le climat
        - La culture et les traditions marocaines
        
        Réponds de manière concise et utile en français. Si tu ne connais pas la réponse, dis-le poliment.
        
        Question : {question}"""
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 1024,
            }
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=15)
            if response.status_code == 429:
                return (
                    "Quota Gemini dépassé (trop de requêtes). "
                    "Attendez quelques minutes, ou configurez votre propre clé "
                    "GEMINI_API_KEY dans backend/.env."
                )
            response.raise_for_status()
            data = response.json()
            
            if 'candidates' in data and len(data['candidates']) > 0:
                candidate = data['candidates'][0]
                if 'content' in candidate and 'parts' in candidate['content']:
                    return candidate['content']['parts'][0]['text']
            
            return "Je n'ai pas pu obtenir une réponse de l'IA. Veuillez reformuler votre question."
            
        except requests.exceptions.Timeout:
            return "Désolé, la requête a pris trop de temps. Veuillez réessayer."
        except requests.exceptions.RequestException as e:
            return f"Erreur de communication avec l'IA: {str(e)}"
        except Exception as e:
            return f"Erreur inattendue: {str(e)}"

chatbot = ChatbotSystem()

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import SGDClassifier
import psycopg2

# Fonction de connexion à la DB
def get_db_connection():
    return psycopg2.connect(
        dbname="Projet_stage",
        user="postgres",
        password="1314",
        host="localhost",
        port="5432"
    )

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import SGDClassifier
import psycopg2

# --- Classe RiskAnalysisSystem ---
class RiskAnalysisSystem:
    def __init__(self, csv_path="dataset.csv"):
        # Charger le dataset
        try:
            self.data = pd.read_csv(csv_path, sep=';', decimal=',')
            print(f"✅ Dataset chargé : {len(self.data)} lignes")
        except Exception as e:
            print(f"❌ Impossible de charger {csv_path} : {e}")
            print("➡️ Utilisation du dataset par défaut.")
            self.data = pd.DataFrame({
                "Ville": ["casablanca", "rabat", "marrakech", "fes", "agadir", "tanger"],
                "Indice_Criminalite": [65.0, 45.0, 55.0, 60.0, 40.0, 50.0],
                "Indice_Pollution": [70.0, 50.0, 45.0, 55.0, 35.0, 40.0],
                "Score_Infrastructures": [85.0, 90.0, 80.0, 75.0, 70.0, 80.0],
                "NiveauGlobalRisque": ["Moyen", "Faible", "Moyen", "Moyen", "Faible", "Faible"]
            })

        # Préparer les labels
        self.le = LabelEncoder()
        self.data["NiveauGlobalRisque_encoded"] = self.le.fit_transform(self.data["NiveauGlobalRisque"])

        # Initialiser les modèles
        X = self.data[["Indice_Criminalite", "Indice_Pollution", "Score_Infrastructures"]]
        y = self.data["NiveauGlobalRisque_encoded"]

        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)

        self.online_model = SGDClassifier(loss='log_loss', random_state=42)
        self.online_model.partial_fit(X, y, classes=np.unique(y))

        print("🚀 Système d’analyse des risques initialisé")

    def get_city_comments_from_db(self, city_id: str):
        """Récupère tous les commentaires depuis la DB"""
        try:
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute("""
                SELECT criminalite, pollution, infrastructure 
                FROM comments 
                WHERE city_id = %s
            """, (city_id,))
            comments = [{"criminalite": r[0], "pollution": r[1], "infrastructure": r[2]} for r in cur.fetchall()]
            return comments
        except Exception as e:
            print(f"❌ Erreur DB pour {city_id}: {e}")
            return []
        finally:
            cur.close()
            conn.close()

    def update_city_risk(self, city_id: str, user_id: int, new_criminalite: float, new_pollution: float, new_infrastructure: float, commentaire: str):
        """Ajoute un nouveau commentaire et met à jour la prédiction"""
        # Ajouter le commentaire dans la DB
        try:
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO comments (city_id, user_id, criminalite, pollution, infrastructure, commentaire)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (city_id, user_id, new_criminalite, new_pollution, new_infrastructure, commentaire))
            conn.commit()
        except Exception as e:
            print(f"❌ Impossible d'ajouter le commentaire pour {city_id}: {e}")
        finally:
            cur.close()
            conn.close()

        # Mise à jour du modèle en ligne
        X_new = np.array([[new_criminalite, new_pollution, new_infrastructure]])
        y_new = np.array([self.model.predict(X_new)[0]])
        self.online_model.partial_fit(X_new, y_new, classes=np.arange(len(self.le.classes_)))

        # Faire la prédiction finale basée sur tous les commentaires
        return self.get_city_data(city_id)

    def get_city_data(self, city_id: str):
        """Récupère les données et prédit le niveau de risque"""
        comments = self.get_city_comments_from_db(city_id)
        if comments:
            X = np.array([[c["criminalite"], c["pollution"], c["infrastructure"]] for c in comments])
            pred_encoded = self.online_model.predict(X)
            counts = np.bincount(pred_encoded)
            pred_final = np.argmax(counts)
            niveau_risque = self.le.inverse_transform([pred_final])[0]

            # Calcul des indices moyens pour retour complet
            avg_criminalite = round(np.mean([c["criminalite"] for c in comments]), 2)
            avg_pollution = round(np.mean([c["pollution"] for c in comments]), 2)
            avg_infrastructure = round(np.mean([c["infrastructure"] for c in comments]), 2)

            return {
                "NiveauGlobalRisque": niveau_risque,
                "comment_count": len(comments),
                "Indice_Criminalite": avg_criminalite,
                "Indice_Pollution": avg_pollution,
                "Score_Infrastructures": avg_infrastructure
            }
        else:
            mask = self.data["Ville"].str.lower() == city_id.lower()
            if mask.any():
                row = self.data[mask].iloc[0]
                return {
                    "NiveauGlobalRisque": row["NiveauGlobalRisque"],
                    "comment_count": 0,
                    "Indice_Criminalite": row["Indice_Criminalite"],
                    "Indice_Pollution": row["Indice_Pollution"],
                    "Score_Infrastructures": row["Score_Infrastructures"]
                }
            return None

# --- Fonction de connexion DB ---
def get_db_connection():
    return psycopg2.connect(
        dbname="Projet_stage",
        user="postgres",
        password="1314",
        host="localhost",
        port="5432"
    )

# --- Instanciation globale pour FastAPI ---
risk_system = RiskAnalysisSystem(csv_path="dataset.csv")



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
        cur.execute("SELECT id FROM users WHERE email = %s", (user_data.email,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="Email déjà utilisé")
        
        password_hash = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
        
        cur.execute(
            "INSERT INTO users (email, password_hash, first_name, last_name) VALUES (%s, %s, %s, %s) RETURNING id",
            (user_data.email, password_hash.decode('utf-8'), user_data.first_name, user_data.last_name)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        
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
        cur.execute("SELECT id, first_name, last_name FROM users WHERE email = %s", (req.email,))
        user = cur.fetchone()
        
        if not user:
            return {"message": "Si cet email existe dans notre base de données, vous recevrez un lien de réinitialisation."}
        
        expire = datetime.utcnow() + timedelta(hours=1)
        token_data = {
            "user_id": user[0],
            "action": "reset_password",
            "exp": expire
        }
        reset_token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
        
        print(f"Email de réinitialisation envoyé à {req.email}")
        print(f"Token de réinitialisation: {reset_token}")
        
        return {
            "message": "Si cet email existe dans notre base de données, vous recevrez un lien de réinitialisation.",
            "token": reset_token
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.post("/auth/reset-password")
async def reset_password(req: ResetPasswordRequest):
    try:
        payload = jwt.decode(req.token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        action = payload.get("action")
        
        if action != "reset_password":
            raise HTTPException(status_code=400, detail="Token invalide")
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        try:
            cur.execute("SELECT id FROM users WHERE id = %s", (user_id,))
            user = cur.fetchone()
            
            if not user:
                raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
            
            password_hash = bcrypt.hashpw(req.new_password.encode('utf-8'), bcrypt.gensalt())
            
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
    try:
        print(f"Question reçue: {req.question}")
        
        local_ans = chatbot.find_local_answer(req.question)
        if local_ans:
            print("Réponse trouvée dans la FAQ locale")
            return {"answer": local_ans, "source": "faq"}
        
        print("Aucune réponse dans la FAQ, utilisation de Gemini...")
        gemini_ans = chatbot.call_gemini_api(req.question)
        return {"answer": gemini_ans, "source": "gemini"}
        
    except Exception as e:
        print(f"Erreur dans le chatbot: {e}")
        return {
            "answer": "Désolé, je rencontre actuellement des difficultés techniques. Veuillez réessayer plus tard.",
            "source": "error"
        }

# Routes pour les villes et commentaires
@app.get("/cities")
async def get_cities():
    city_coords = {
        "casablanca": (33.5731, -7.5898),
        "rabat": (34.0209, -6.8416),
        "marrakech": (31.6341, -8.0000),
        "fes": (34.0342, -5.0025),
        "agadir": (30.4278, -9.5981),
        "tanger": (35.7595, -5.8340),
        "taza": (34.2100, -4.0100),
        "tetouan": (35.5889, -5.3626),
        "safi": (32.2994, -9.2395),
        "oujda": (34.6779, -1.9293),
        "nador": (35.1740, -2.9287),
        "mohammedia": (33.6864, -7.3829),
        "meknes": (33.8935, -5.5473),
        "larache": (35.1939, -6.1557),
        "eljadida": (33.2316, -8.5008),
        "kenitra": (34.2611, -6.5802),
        "settat": (33.0024, -7.6199),
        "sidibennour": (32.6500, -8.4333),
        "alhoceima": (35.2451, -3.9302),
        "berrechid": (33.2676, -7.5877),
        "khouribga": (32.8848, -6.9061),
        "benimellal": (32.3394, -6.3608),
        "ouarzazate": (30.9200, -6.9200),
        "errachidia": (31.9314, -4.4267),
        "tarfaya": (27.9378, -12.9286),
        "laayoune": (27.1536, -13.2033),
        "dakhla": (23.6848, -15.9580)
    }
    
    city_names = {
        "casablanca": "Casablanca",
        "rabat": "Rabat", 
        "marrakech": "Marrakech",
        "fes": "Fès",
        "agadir": "Agadir",
        "tanger": "Tanger",
        "taza": "Taza",
        "tetouan": "Tétouan",
        "safi": "Safi",
        "oujda": "Oujda",
        "nador": "Nador",
        "mohammedia": "Mohammedia",
        "meknes": "Meknès", 
        "larache": "Larache",
        "eljadida": "El Jadida",
        "kenitra": "Kénitra",
        "settat": "Settat",
        "sidibennour": "Sidi Bennour",
        "alhoceima": "Al Hoceima",
        "berrechid": "Berrechid",
        "khouribga": "Khouribga",
        "benimellal": "Beni Mellal",
        "ouarzazate": "Ouarzazate",
        "errachidia": "Errachidia",
        "tarfaya": "Tarfaya",
        "laayoune": "Laâyoune",
        "dakhla": "Dakhla"
    }
    
    cities = []
    for city_id in city_coords.keys():
        city_data = risk_system.get_city_data(city_id)
        
        if city_data:
            lat, lng = city_coords[city_id]
            name = city_names.get(city_id, city_id.title())
            
            cities.append({
                "id": city_id,
                "name": name,
                "lat": float(lat),
                "lng": float(lng),
                "Indice_Criminalite": float(city_data["Indice_Criminalite"]),
                "Indice_Pollution": float(city_data["Indice_Pollution"]), 
                "Score_Infrastructures": float(city_data["Score_Infrastructures"]),
                "NiveauGlobalRisque": city_data["NiveauGlobalRisque"],
                "comment_count": int(city_data.get("comment_count", 0))
            })
        else:
            # Données par défaut si la ville n'est pas trouvée
            lat, lng = city_coords[city_id]
            name = city_names.get(city_id, city_id.title())
            
            cities.append({
                "id": city_id,
                "name": name,
                "lat": lat,
                "lng": lng,
                "Indice_Criminalite": 50.0,
                "Indice_Pollution": 50.0,
                "Score_Infrastructures": 50.0,
                "NiveauGlobalRisque": "Moyen",
                "comment_count": 0
            })

    return {"cities": cities}

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
                "avatar": f"{row[1][0]}{row[2][0]}",
                "criminalite": row[3],
                "pollution": row[4],
                "infrastructure": row[5]
            })
        
        return {"comments": comments}
    
    finally:
        cur.close()
        conn.close()

@app.post("/cities/{city_id}/comments")
async def add_city_comment(city_id: str, review: UserReview, current_user: dict = Depends(get_current_user)):
    try:
        # Met à jour le risque et ajoute le commentaire
        new_risk_level = risk_system.update_city_risk(
            city_id=city_id,
            user_id=current_user["id"],
            new_criminalite=review.criminalite,
            new_pollution=review.pollution,
            new_infrastructure=review.infrastructure,
            commentaire=review.commentaire
        )

        return {
            "message": "Commentaire ajouté avec succès",
            "new_risk_level": new_risk_level
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Routes de debug
@app.get("/cities/{city_id}/debug")
async def debug_city_calculations(city_id: str):
    """Route pour debuguer les calculs d'une ville"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT criminalite, pollution, infrastructure 
            FROM comments 
            WHERE city_id = %s
        """, (city_id,))
        
        comments = []
        for row in cur.fetchall():
            comments.append({
                "criminalite": row[0],
                "pollution": row[1], 
                "infrastructure": row[2]
            })
        
        if comments:
            criminalites = [c["criminalite"] for c in comments]
            pollutions = [c["pollution"] for c in comments] 
            infrastructures = [c["infrastructure"] for c in comments]
            
            avg_criminalite = np.mean(criminalites)
            avg_pollution = np.mean(pollutions)
            avg_infrastructure = np.mean(infrastructures)
        else:
            avg_criminalite = avg_pollution = avg_infrastructure = 0
        
        final_data = risk_system.get_city_data(city_id)
        
        return {
            "city_id": city_id,
            "comment_count": len(comments),
            "comments_details": comments,
            "calculations": {
                "criminalites": criminalites if comments else [],
                "pollutions": pollutions if comments else [],
                "infrastructures": infrastructures if comments else [],
                "avg_criminalite": round(avg_criminalite, 2),
                "avg_pollution": round(avg_pollution, 2), 
                "avg_infrastructure": round(avg_infrastructure, 2)
            },
            "final_data": final_data
        }
        
    finally:
        cur.close()
        conn.close()

@app.get("/cities/{city_id}/stats")
async def get_city_stats(city_id: str):
    """Route pour vérifier les statistiques actuelles d'une ville"""
    city_data = risk_system.get_city_data(city_id)
    if not city_data:
        raise HTTPException(status_code=404, detail="Ville non trouvée")
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM comments WHERE city_id = %s", (city_id,))
    comment_count = cur.fetchone()[0]
    cur.close()
    conn.close()
    
    return {
        **city_data,
        "comment_count": comment_count
    }

# Routes de suppression et modification pour les commentaires
@app.delete("/cities/{city_id}/comments/{comment_id}")
async def delete_city_comment(city_id: str, comment_id: int, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT user_id FROM comments 
            WHERE id = %s AND city_id = %s
        """, (comment_id, city_id))
        
        result = cur.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="Commentaire non trouvé")
        
        if result[0] != current_user["id"]:
            raise HTTPException(status_code=403, detail="Vous ne pouvez supprimer que vos propres commentaires")
        
        cur.execute("""
            DELETE FROM comments 
            WHERE id = %s AND city_id = %s
        """, (comment_id, city_id))
        
        conn.commit()
        return {"message": "Commentaire supprimé avec succès"}
        
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.put("/cities/{city_id}/comments/{comment_id}")
async def update_city_comment(city_id: str, comment_id: int, review: UserReview, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT user_id FROM comments 
            WHERE id = %s AND city_id = %s
        """, (comment_id, city_id))
        
        result = cur.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="Commentaire non trouvé")
        
        if result[0] != current_user["id"]:
            raise HTTPException(status_code=403, detail="Vous ne pouvez modifier que vos propres commentaires")
        
        cur.execute("""
            UPDATE comments 
            SET criminalite = %s, pollution = %s, infrastructure = %s, commentaire = %s
            WHERE id = %s AND city_id = %s
        """, (review.criminalite, review.pollution, review.infrastructure, review.commentaire, comment_id, city_id))
        
        conn.commit()
        return {"message": "Commentaire modifié avec succès"}
        
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# Route pour obtenir les données météo
@app.get("/weather/{city_id}")
async def get_weather(city_id: str):
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
                "windSpeed": round(data["wind"]["speed"] * 3.6),
                "icon": data["weather"][0]["icon"],
                "feelsLike": round(data["main"]["feels_like"])
            }
        else:
            return {
                "temperature": 25,
                "description": "ensoleillé",
                "humidity": 65,
                "windSpeed": 12,
                "icon": "01d",
                "feelsLike": 26
            }
    
    except Exception as e:
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