# Morocco 2030 - Plateforme d'Analyse des Risques

Une plateforme complète pour l'analyse des risques et la gestion de la Coupe du Monde 2030 au Maroc, développée avec Next.js et FastAPI.

## 🚀 Fonctionnalités

### Frontend (Next.js)
- **Dashboard interactif** avec vue d'ensemble des 6 villes hôtes
- **Pages détaillées par ville** avec informations spécifiques
- **Système d'authentification** complet (inscription, connexion, réinitialisation)
- **Chatbot intelligent** avec logique Python intégrée
- **Cartes réelles** du Maroc avec OpenStreetMap
- **Météo en temps réel** pour chaque ville
- **Interface responsive** avec mode sombre/clair
- **Sections spécialisées** : Transport, Informations, Carte, Fan Experience

### Backend (FastAPI)
- **API REST** complète avec authentification JWT
- **Base de données PostgreSQL** pour la persistance
- **Système ML** pour l'analyse des risques (Random Forest, SGD)
- **Chatbot intelligent** avec TF-IDF et API Gemini
- **Gestion des commentaires** et évaluations utilisateurs
- **Mise à jour dynamique** des indices de risque

## 🏗️ Architecture

```
ProjetStage/
├── app/                          # Frontend Next.js
│   ├── api/                     # API Routes
│   ├── dashboard/               # Pages du dashboard
│   ├── components/              # Composants React
│   └── globals.css              # Styles globaux
├── backend/                     # Backend FastAPI
│   ├── main.py                  # Application principale
│   ├── requirements.txt         # Dépendances Python
│   └── env.example              # Variables d'environnement
├── components/                  # Composants partagés
└── README.md
```

## 🛠️ Installation

### Prérequis
- Node.js 18+
- Python 3.8+
- PostgreSQL 12+
- npm ou yarn

### Frontend (Next.js)

1. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

2. **Démarrer le serveur de développement**
```bash
npm run dev
# ou
yarn dev
```

3. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

### Backend (FastAPI)

1. **Créer un environnement virtuel**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

2. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

3. **Configurer la base de données**
```bash
# Créer la base de données PostgreSQL
createdb Projet_stage

# Exécuter les migrations (si disponibles)
# python manage.py migrate
```

4. **Configurer les variables d'environnement**
```bash
cp env.example .env
# Éditer .env avec vos paramètres
```

5. **Démarrer le serveur**
```bash
python main.py
# ou
uvicorn main:app --reload
```

## 🔧 Configuration

### Variables d'environnement

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Backend (.env)
```env
# Base de données
PG_DB=Projet_stage
PG_USER=postgres
PG_PASSWORD=votre_mot_de_passe
PG_HOST=localhost
PG_PORT=5432

# JWT
SECRET_KEY=votre_clé_secrète
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Gemini
GEMINI_API_KEY=votre_clé_gemini

# Météo (optionnel)
OPENWEATHER_API_KEY=votre_clé_openweather
```

## 📱 Utilisation

### 1. Authentification
- **Inscription** : Créez un compte avec email et mot de passe
- **Connexion** : Connectez-vous avec vos identifiants
- **Réinitialisation** : Mot de passe oublié via email

### 2. Dashboard
- **Vue d'ensemble** : Statistiques globales des 6 villes hôtes
- **Navigation** : Accès direct aux pages de chaque ville
- **Carte interactive** : Visualisation géographique du Maroc

### 3. Pages de ville
- **Informations générales** : Description, stade, capacité
- **Météo en temps réel** : Conditions actuelles
- **Transport** : Options de mobilité détaillées
- **Sécurité** : Analyses de risque et contacts d'urgence
- **Fan Experience** : Fan zones et événements culturels

### 4. Chatbot
- **Assistant intelligent** : Questions sur les villes, transports, sécurité
- **Réponses contextuelles** : Basées sur les données du backend
- **Interface intuitive** : Bouton flottant accessible partout

## 🎯 Villes Hôtes

| Ville | Stade | Capacité | Risque | Spécialités |
|-------|-------|----------|--------|-------------|
| **Casablanca** | Stade Hassan-II | 115 000 | Moyen | Capitale économique, tramway |
| **Rabat** | Prince Moulay-Abdallah | 68 000 | Faible | Capitale, patrimoine historique |
| **Fès** | Stade de Fès | 55 000 | Moyen | Ville impériale, médina UNESCO |
| **Agadir** | Stade Adrar | 46 000 | Faible | Station balnéaire, plages |
| **Marrakech** | Stade de Marrakech | 45 000 | Moyen | Perle du Sud, souks |
| **Tanger** | Stade Ibn-Batouta | 76 000 | Moyen | Porte de l'Afrique, Al Boraq |

## 🔍 Fonctionnalités Techniques

### Frontend
- **Next.js 14** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling
- **Radix UI** pour les composants
- **Lucide React** pour les icônes
- **Responsive Design** mobile-first

### Backend
- **FastAPI** avec documentation automatique
- **PostgreSQL** avec psycopg2
- **JWT** pour l'authentification
- **Scikit-learn** pour le machine learning
- **Pydantic** pour la validation des données
- **CORS** configuré pour le frontend

### Machine Learning
- **Random Forest** pour la classification des risques
- **SGD Classifier** pour l'apprentissage en ligne
- **TF-IDF** pour la similarité textuelle du chatbot
- **Mise à jour dynamique** des modèles

## 🚀 Déploiement

### Frontend (Vercel)
```bash
npm run build
# Déployer sur Vercel
```

### Backend (Railway/Heroku)
```bash
# Configurer les variables d'environnement
# Déployer avec Railway ou Heroku
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Contacter l'équipe de développement
- Consulter la documentation API sur `/docs` (FastAPI)

## 🎉 Remerciements

- **FIFA** pour l'organisation de la Coupe du Monde 2030
- **Royaume du Maroc** pour l'accueil de l'événement
- **Communauté open source** pour les outils utilisés

---

**Morocco 2030** - Une expérience unique pour la Coupe du Monde ! 🇲🇦⚽