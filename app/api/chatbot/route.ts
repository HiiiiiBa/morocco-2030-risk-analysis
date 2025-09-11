import { NextRequest, NextResponse } from "next/server"

// Données des villes avec informations détaillées du backend
const citiesData = {
  "casablanca": {
    "name": "Casablanca",
    "criminalite": 62,
    "pollution": 70,
    "infrastructure": 4,
    "riskLevel": "Moyen",
    "stadium": "Stade Hassan-II",
    "capacity": "115 000",
    "description": "Capitale économique du Maroc, Casablanca accueillera les plus grands matchs dans le plus grand stade du monde.",
    "transport": {
      "bus": "Réseau de bus urbain avec 50+ lignes, fréquence 5-10 min",
      "tramway": "Ligne 1 et 2 du tramway, 31 stations, 6h-23h",
      "train": "Gare Casa-Port et Casa-Voyageurs, connexions ONCF et Al Boraq",
      "airport": "Aéroport Mohammed V, 2e plus grand d'Afrique"
    },
    "attractions": ["Mosquée Hassan II", "Corniche", "Place Mohammed V", "Marché Central"],
    "fanZones": ["Place Mohammed V", "Corniche Ain Diab", "Boulevard Zerktouni"]
  },
  "rabat": {
    "name": "Rabat",
    "criminalite": 40,
    "pollution": 55,
    "infrastructure": 5,
    "riskLevel": "Faible",
    "stadium": "Stade du Prince Moulay-Abdallah",
    "capacity": "68 000",
    "description": "Capitale du Royaume, Rabat combine patrimoine historique et modernité pour accueillir les matchs de la Coupe du Monde.",
    "transport": {
      "bus": "Réseau Al Bidaoui, 20+ lignes, tarif 3-5 MAD",
      "tramway": "Ligne unique, 23 stations, 5h30-23h30",
      "train": "Gare Rabat-Ville, connexions vers toutes les villes",
      "airport": "Aéroport Rabat-Salé, vols domestiques et internationaux"
    },
    "attractions": ["Kasbah des Oudayas", "Tour Hassan", "Mausolée Mohammed V", "Chellah"],
    "fanZones": ["Place Bouregreg", "Avenue Mohammed V", "Agdal"]
  },
  "fes": {
    "name": "Fès",
    "criminalite": 45,
    "pollution": 60,
    "infrastructure": 3,
    "riskLevel": "Moyen",
    "stadium": "Stade de Fès",
    "capacity": "55 000",
    "description": "Ville impériale et centre spirituel, Fès apporte son riche patrimoine culturel à la Coupe du Monde.",
    "transport": {
      "bus": "Réseau urbain limité, 15 lignes principales",
      "taxi": "Taxis bleus (petits) et blancs (grands), tarifs négociables",
      "train": "Gare Fès-Ville, connexions ONCF",
      "airport": "Aéroport Fès-Saïss, vols domestiques"
    },
    "attractions": ["Médina de Fès", "Université Al Quaraouiyine", "Tanneries", "Palais Royal"],
    "fanZones": ["Place Boujloud", "Avenue Hassan II", "Nouvelle Ville"]
  },
  "agadir": {
    "name": "Agadir",
    "criminalite": 35,
    "pollution": 40,
    "infrastructure": 4,
    "riskLevel": "Faible",
    "stadium": "Stade Adrar",
    "capacity": "46 000",
    "description": "Station balnéaire moderne, Agadir offre un cadre idyllique avec ses plages et son climat ensoleillé.",
    "transport": {
      "bus": "Réseau urbain, 10 lignes, tarif 3 MAD",
      "taxi": "Taxis urbains, tarif fixe 8 MAD",
      "train": "Pas de gare, bus inter-villes",
      "airport": "Aéroport Agadir-Al Massira, 2e aéroport du Maroc"
    },
    "attractions": ["Plage d'Agadir", "Kasbah d'Agadir", "Souk El Had", "Vallée du Paradis"],
    "fanZones": ["Plage d'Agadir", "Marina", "Boulevard Hassan II"]
  },
  "marrakech": {
    "name": "Marrakech",
    "criminalite": 58,
    "pollution": 65,
    "infrastructure": 3,
    "riskLevel": "Moyen",
    "stadium": "Stade de Marrakech",
    "capacity": "45 000",
    "description": "Perle du Sud, Marrakech fascine par ses souks, ses palais et l'hospitalité légendaire de ses habitants.",
    "transport": {
      "bus": "Réseau urbain, 15 lignes, tarif 4 MAD",
      "taxi": "Taxis rouges, tarifs négociables",
      "train": "Gare Marrakech, connexions ONCF",
      "airport": "Aéroport Marrakech-Ménara, vols internationaux"
    },
    "attractions": ["Place Jemaa el-Fnaa", "Palais Bahia", "Jardin Majorelle", "Souk Semmarine"],
    "fanZones": ["Place Jemaa el-Fnaa", "Gueliz", "Hivernage"]
  },
  "tanger": {
    "name": "Tanger",
    "criminalite": 50,
    "pollution": 58,
    "infrastructure": 3,
    "riskLevel": "Moyen",
    "stadium": "Stade Ibn-Batouta",
    "capacity": "76 000",
    "description": "Porte de l'Afrique vers l'Europe, Tanger est un carrefour culturel unique entre deux continents.",
    "transport": {
      "bus": "Réseau urbain, 12 lignes, tarif 3 MAD",
      "taxi": "Taxis bleus, tarifs fixes",
      "train": "Gare Tanger-Ville, Al Boraq vers Casablanca",
      "airport": "Aéroport Tanger-Ibn Battouta, vols internationaux"
    },
    "attractions": ["Médina de Tanger", "Cap Spartel", "Grottes d'Hercule", "Place de France"],
    "fanZones": ["Place de France", "Boulevard Pasteur", "Malabata"]
  }
}

// FAQ data enrichie avec les données du backend
const faqData = [
  {
    question: "villes hôtes",
    answer: "Les 6 villes hôtes de la Coupe du Monde 2030 au Maroc sont : Rabat (68K places, Risque Faible), Casablanca (115K places, Risque Moyen), Fès (55K places, Risque Moyen), Agadir (46K places, Risque Faible), Marrakech (45K places, Risque Moyen) et Tanger (76K places, Risque Moyen). Chaque ville dispose d'un stade moderne et d'infrastructures adaptées."
  },
  {
    question: "transport",
    answer: "Chaque ville dispose d'un réseau de transport complet : bus urbain (3-5 MAD), tramway (6-8 MAD), taxi (15-50 MAD), train ONCF et Al Boraq (TGV). Des navettes spéciales seront mises en place pour les matchs. Les horaires sont généralement de 6h à 23h."
  },
  {
    question: "sécurité",
    answer: "La sécurité est une priorité absolue. Rabat et Agadir ont un risque FAIBLE, Casablanca, Fès, Marrakech et Tanger ont un risque MOYEN. Chaque ville a des mesures de sécurité adaptées et des contacts d'urgence disponibles 24h/24 (Police: 19, Pompiers: 15, Samu: 141)."
  },
  {
    question: "fan zones",
    answer: "Des fan zones sont prévues dans chaque ville avec des événements, concerts, expositions et activités culturelles. Les horaires sont étendus pendant les matchs (16h-01h vendredi-samedi, 18h-23h en semaine)."
  },
  {
    question: "stade",
    answer: "Chaque ville dispose d'un stade moderne : Casablanca-Stade Hassan-II (115K), Tanger-Stade Ibn-Batouta (76K), Rabat-Stade Prince Moulay-Abdallah (68K), Fès-Stade de Fès (55K), Agadir-Stade Adrar (46K), Marrakech-Stade de Marrakech (45K)."
  },
  {
    question: "météo",
    answer: "Le Maroc bénéficie d'un climat méditerranéen avec des températures agréables (15-30°C). Agadir et Marrakech sont plus chauds, Rabat et Tanger plus tempérés. Des informations météo en temps réel sont disponibles sur chaque page de ville."
  },
  {
    question: "hébergement",
    answer: "De nombreux hôtels et logements sont disponibles dans chaque ville hôte, avec des tarifs spéciaux pour les supporters de la Coupe du Monde. Casablanca et Rabat offrent le plus de choix, Fès et Marrakech pour l'expérience culturelle."
  },
  {
    question: "culture",
    answer: "Le Maroc offre une richesse culturelle exceptionnelle : monuments historiques (Kasbah des Oudayas à Rabat, Médina de Fès, Place Jemaa el-Fnaa à Marrakech), souks, cuisine traditionnelle (tajine, couscous, thé à la menthe), musique et artisanat."
  }
]

// Simple TF-IDF-like matching function
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/)
  const words2 = text2.toLowerCase().split(/\s+/)
  
  const set1 = new Set(words1)
  const set2 = new Set(words2)
  
  const intersection = new Set([...set1].filter(x => set2.has(x)))
  const union = new Set([...set1, ...set2])
  
  return intersection.size / union.size
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: "Message requis" }, { status: 400 })
    }

    // Find best matching FAQ
    let bestMatch = null
    let bestScore = 0
    
    for (const faq of faqData) {
      const score = calculateSimilarity(message, faq.question)
      if (score > bestScore && score > 0.3) { // Threshold for relevance
        bestScore = score
        bestMatch = faq
      }
    }

    let response = ""
    
    if (bestMatch) {
      response = bestMatch.answer
    } else {
      // Fallback responses based on keywords with city-specific data
      const lowerMessage = message.toLowerCase()
      
      if (lowerMessage.includes("bonjour") || lowerMessage.includes("salut") || lowerMessage.includes("hello")) {
        response = "Bonjour ! Je suis ravi de vous aider avec vos questions sur Morocco 2030. Que souhaitez-vous savoir ?"
      } else if (lowerMessage.includes("merci") || lowerMessage.includes("thanks")) {
        response = "De rien ! N'hésitez pas si vous avez d'autres questions sur la Coupe du Monde 2030 au Maroc."
      } else if (lowerMessage.includes("aide") || lowerMessage.includes("help")) {
        response = "Je peux vous aider avec des informations sur les villes hôtes, les transports, la sécurité, les fan zones, les stades, la météo, l'hébergement et la culture marocaine."
      } else if (lowerMessage.includes("rabat")) {
        const city = citiesData.rabat
        response = `${city.name} - ${city.description}\n\n📊 Données de sécurité :\n• Criminalité : ${city.criminalite}/100\n• Pollution : ${city.pollution}/100\n• Infrastructure : ${city.infrastructure}/5\n• Niveau de risque : ${city.riskLevel}\n\n🏟️ Stade : ${city.stadium} (${city.capacity} places)\n\n🚌 Transport :\n• Bus : ${city.transport.bus}\n• Tramway : ${city.transport.tramway}\n• Train : ${city.transport.train}\n• Aéroport : ${city.transport.airport}\n\n🎯 Attractions : ${city.attractions.join(", ")}\n\n🎉 Fan Zones : ${city.fanZones.join(", ")}`
      } else if (lowerMessage.includes("casablanca")) {
        const city = citiesData.casablanca
        response = `${city.name} - ${city.description}\n\n📊 Données de sécurité :\n• Criminalité : ${city.criminalite}/100\n• Pollution : ${city.pollution}/100\n• Infrastructure : ${city.infrastructure}/5\n• Niveau de risque : ${city.riskLevel}\n\n🏟️ Stade : ${city.stadium} (${city.capacity} places)\n\n🚌 Transport :\n• Bus : ${city.transport.bus}\n• Tramway : ${city.transport.tramway}\n• Train : ${city.transport.train}\n• Aéroport : ${city.transport.airport}\n\n🎯 Attractions : ${city.attractions.join(", ")}\n\n🎉 Fan Zones : ${city.fanZones.join(", ")}`
      } else if (lowerMessage.includes("fès") || lowerMessage.includes("fes")) {
        const city = citiesData.fes
        response = `${city.name} - ${city.description}\n\n📊 Données de sécurité :\n• Criminalité : ${city.criminalite}/100\n• Pollution : ${city.pollution}/100\n• Infrastructure : ${city.infrastructure}/5\n• Niveau de risque : ${city.riskLevel}\n\n🏟️ Stade : ${city.stadium} (${city.capacity} places)\n\n🚌 Transport :\n• Bus : ${city.transport.bus}\n• Taxi : ${city.transport.taxi}\n• Train : ${city.transport.train}\n• Aéroport : ${city.transport.airport}\n\n🎯 Attractions : ${city.attractions.join(", ")}\n\n🎉 Fan Zones : ${city.fanZones.join(", ")}`
      } else if (lowerMessage.includes("agadir")) {
        const city = citiesData.agadir
        response = `${city.name} - ${city.description}\n\n📊 Données de sécurité :\n• Criminalité : ${city.criminalite}/100\n• Pollution : ${city.pollution}/100\n• Infrastructure : ${city.infrastructure}/5\n• Niveau de risque : ${city.riskLevel}\n\n🏟️ Stade : ${city.stadium} (${city.capacity} places)\n\n🚌 Transport :\n• Bus : ${city.transport.bus}\n• Taxi : ${city.transport.taxi}\n• Train : ${city.transport.train}\n• Aéroport : ${city.transport.airport}\n\n🎯 Attractions : ${city.attractions.join(", ")}\n\n🎉 Fan Zones : ${city.fanZones.join(", ")}`
      } else if (lowerMessage.includes("marrakech")) {
        const city = citiesData.marrakech
        response = `${city.name} - ${city.description}\n\n📊 Données de sécurité :\n• Criminalité : ${city.criminalite}/100\n• Pollution : ${city.pollution}/100\n• Infrastructure : ${city.infrastructure}/5\n• Niveau de risque : ${city.riskLevel}\n\n🏟️ Stade : ${city.stadium} (${city.capacity} places)\n\n🚌 Transport :\n• Bus : ${city.transport.bus}\n• Taxi : ${city.transport.taxi}\n• Train : ${city.transport.train}\n• Aéroport : ${city.transport.airport}\n\n🎯 Attractions : ${city.attractions.join(", ")}\n\n🎉 Fan Zones : ${city.fanZones.join(", ")}`
      } else if (lowerMessage.includes("tanger")) {
        const city = citiesData.tanger
        response = `${city.name} - ${city.description}\n\n📊 Données de sécurité :\n• Criminalité : ${city.criminalite}/100\n• Pollution : ${city.pollution}/100\n• Infrastructure : ${city.infrastructure}/5\n• Niveau de risque : ${city.riskLevel}\n\n🏟️ Stade : ${city.stadium} (${city.capacity} places)\n\n🚌 Transport :\n• Bus : ${city.transport.bus}\n• Taxi : ${city.transport.taxi}\n• Train : ${city.transport.train}\n• Aéroport : ${city.transport.airport}\n\n🎯 Attractions : ${city.attractions.join(", ")}\n\n🎉 Fan Zones : ${city.fanZones.join(", ")}`
      } else if (lowerMessage.includes("transport") && (lowerMessage.includes("rabat") || lowerMessage.includes("casablanca") || lowerMessage.includes("fès") || lowerMessage.includes("fes") || lowerMessage.includes("agadir") || lowerMessage.includes("marrakech") || lowerMessage.includes("tanger"))) {
        // Détecter la ville mentionnée
        let cityKey = ""
        if (lowerMessage.includes("rabat")) cityKey = "rabat"
        else if (lowerMessage.includes("casablanca")) cityKey = "casablanca"
        else if (lowerMessage.includes("fès") || lowerMessage.includes("fes")) cityKey = "fes"
        else if (lowerMessage.includes("agadir")) cityKey = "agadir"
        else if (lowerMessage.includes("marrakech")) cityKey = "marrakech"
        else if (lowerMessage.includes("tanger")) cityKey = "tanger"
        
        if (cityKey && citiesData[cityKey]) {
          const city = citiesData[cityKey]
          response = `🚌 Transport à ${city.name} :\n\n• Bus : ${city.transport.bus}\n• Tramway : ${city.transport.tramway || "Non disponible"}\n• Taxi : ${city.transport.taxi || "Taxis disponibles"}\n• Train : ${city.transport.train}\n• Aéroport : ${city.transport.airport}\n\n💡 Conseil : Utilisez les transports en commun pour économiser et éviter les embouteillages. Des navettes spéciales seront mises en place pour les matchs.`
        }
      } else if (lowerMessage.includes("sécurité") || lowerMessage.includes("securite") || lowerMessage.includes("risque")) {
        response = "🛡️ Sécurité Morocco 2030 :\n\n• Rabat et Agadir : Risque FAIBLE - Zones sécurisées\n• Casablanca, Fès, Marrakech, Tanger : Risque MOYEN - Vigilance recommandée\n\n📞 Contacts d'urgence :\n• Police : 19\n• Pompiers : 15\n• Samu : 141\n• Gendarmerie : 177\n\n💡 Conseils : Évitez les zones isolées la nuit, gardez vos objets de valeur en sécurité, respectez les consignes de sécurité."
      } else if (lowerMessage.includes("fan zone") || lowerMessage.includes("fanzone")) {
        response = "🎉 Fan Zones Morocco 2030 :\n\nChaque ville dispose de fan zones avec :\n• Événements et concerts\n• Expositions culturelles\n• Activités pour supporters\n• Restauration et boissons\n\n⏰ Horaires :\n• Lundi-Jeudi : 18h-23h\n• Vendredi-Samedi : 16h-01h\n• Dimanche : 14h-22h\n• Jours de match : Horaires étendus\n\n🎯 Fan zones principales :\n• Rabat : Place Bouregreg, Avenue Mohammed V\n• Casablanca : Place Mohammed V, Corniche Ain Diab\n• Marrakech : Place Jemaa el-Fnaa, Gueliz"
      } else {
        response = "Je comprends votre question. Pour des informations détaillées sur la Coupe du Monde 2030 au Maroc, je vous recommande de consulter les sections spécifiques du dashboard : villes hôtes, transports, sécurité, fan zones, ou contactez notre équipe support."
      }
    }

    return NextResponse.json({ response })
    
  } catch (error) {
    console.error("Erreur chatbot:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
