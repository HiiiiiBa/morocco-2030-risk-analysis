#!/usr/bin/env python3
"""
Script de test pour le chatbot Morocco 2030
"""

import requests
import json
import time

def test_chatbot():
    """Teste le chatbot avec différentes questions"""
    
    # URL du backend
    backend_url = "http://localhost:8000"
    
    # Questions de test
    test_questions = [
        "Quelles sont les villes hôtes ?",
        "Comment se déplacer à Rabat ?",
        "Quels sont les risques de sécurité ?",
        "Où sont les fan zones ?",
        "Quel est le meilleur restaurant à Marrakech ?",
        "Comment est la météo à Agadir ?",
        "Quelle est la culture marocaine ?"
    ]
    
    print("🤖 Test du Chatbot Morocco 2030")
    print("=" * 50)
    
    for i, question in enumerate(test_questions, 1):
        print(f"\n{i}. Question: {question}")
        
        try:
            # Appel à l'API
            response = requests.post(
                f"{backend_url}/chat",
                json={"question": question},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"   Source: {data.get('source', 'unknown')}")
                print(f"   Réponse: {data.get('answer', 'Pas de réponse')[:100]}...")
            else:
                print(f"   ❌ Erreur HTTP: {response.status_code}")
                print(f"   Réponse: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print("   ❌ Impossible de se connecter au backend")
            print("   Vérifiez que le backend Python est démarré sur le port 8000")
            break
        except requests.exceptions.Timeout:
            print("   ⏰ Timeout - la requête a pris trop de temps")
        except Exception as e:
            print(f"   ❌ Erreur: {e}")
        
        # Pause entre les questions
        time.sleep(1)
    
    print("\n" + "=" * 50)
    print("Test terminé")

if __name__ == "__main__":
    test_chatbot()


