import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')
    const city = searchParams.get('city')

    if (!lat || !lon || !city) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 })
    }

    // Simulation de données météo réalistes pour le Maroc
    // En production, vous utiliseriez une vraie API météo comme OpenWeatherMap
    const weatherData = {
      temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
      description: getRandomDescription(),
      humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
      windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
      visibility: Math.floor(Math.random() * 5) + 8, // 8-13 km
      icon: "sun",
      city: city
    }

    return NextResponse.json(weatherData)
    
  } catch (error) {
    console.error("Erreur météo:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données météo" },
      { status: 500 }
    )
  }
}

function getRandomDescription(): string {
  const descriptions = [
    "Ensoleillé",
    "Partiellement nuageux", 
    "Nuageux",
    "Ciel dégagé",
    "Quelques nuages",
    "Brouillard léger"
  ]
  return descriptions[Math.floor(Math.random() * descriptions.length)]
}
