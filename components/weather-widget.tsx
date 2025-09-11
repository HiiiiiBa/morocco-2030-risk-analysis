"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  Droplets, 
  Eye,
  Thermometer,
  RefreshCw
} from "lucide-react"

interface WeatherData {
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  visibility: number
  icon: string
  city: string
}

interface WeatherWidgetProps {
  cityName: string
  citySlug: string
}

const cityCoordinates: { [key: string]: { lat: number; lon: number } } = {
  rabat: { lat: 34.0209, lon: -6.8416 },
  casablanca: { lat: 33.5731, lon: -7.5898 },
  fes: { lat: 34.0331, lon: -5.0003 },
  agadir: { lat: 30.4278, lon: -9.5981 },
  marrakech: { lat: 31.6295, lon: -7.9811 },
  tanger: { lat: 35.7595, lon: -5.8340 }
}

export default function WeatherWidget({ cityName, citySlug }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase()
    if (desc.includes("sun") || desc.includes("clear")) return <Sun className="h-8 w-8 text-yellow-500" />
    if (desc.includes("cloud")) return <Cloud className="h-8 w-8 text-gray-500" />
    if (desc.includes("rain")) return <CloudRain className="h-8 w-8 text-blue-500" />
    if (desc.includes("snow")) return <CloudSnow className="h-8 w-8 text-blue-300" />
    return <Sun className="h-8 w-8 text-yellow-500" />
  }

  const fetchWeather = async () => {
    try {
      setLoading(true)
      setError(null)

      const coords = cityCoordinates[citySlug]
      if (!coords) {
        throw new Error("Coordonnées de ville non trouvées")
      }

      // Utilisation d'une API météo gratuite (OpenWeatherMap)
      const response = await fetch(
        `/api/weather?lat=${coords.lat}&lon=${coords.lon}&city=${encodeURIComponent(cityName)}`
      )

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données météo")
      }

      const data = await response.json()
      setWeather(data)
    } catch (err) {
      console.error("Erreur météo:", err)
      setError("Impossible de charger les données météo")
      // Données de simulation en cas d'erreur
      setWeather({
        temperature: 22,
        description: "Ensoleillé",
        humidity: 65,
        windSpeed: 12,
        visibility: 10,
        icon: "sun",
        city: cityName
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
  }, [cityName, citySlug])

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            Météo - {cityName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Chargement des données météo...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && !weather) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            Météo - {cityName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-red-500 mb-2">{error}</p>
            <button 
              onClick={fetchWeather}
              className="text-sm text-blue-600 hover:underline"
            >
              Réessayer
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weather) return null

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getWeatherIcon(weather.description)}
            <span>Météo - {weather.city}</span>
          </div>
          <button 
            onClick={fetchWeather}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Température */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Thermometer className="h-5 w-5 text-red-500 mr-1" />
              <span className="text-2xl font-bold">{weather.temperature}°C</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{weather.description}</p>
          </div>

          {/* Humidité */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Droplets className="h-5 w-5 text-blue-500 mr-1" />
              <span className="text-xl font-bold">{weather.humidity}%</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Humidité</p>
          </div>

          {/* Vent */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Wind className="h-5 w-5 text-green-500 mr-1" />
              <span className="text-xl font-bold">{weather.windSpeed} km/h</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Vent</p>
          </div>

          {/* Visibilité */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Eye className="h-5 w-5 text-purple-500 mr-1" />
              <span className="text-xl font-bold">{weather.visibility} km</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Visibilité</p>
          </div>
        </div>

        {/* Recommandations météo */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Recommandations</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {weather.temperature > 25 && "☀️ Temps chaud - Pensez à vous hydrater et porter un chapeau"}
            {weather.temperature < 15 && "🧥 Temps frais - Prévoyez des vêtements chauds"}
            {weather.humidity > 70 && "💧 Humidité élevée - Conditions confortables"}
            {weather.windSpeed > 20 && "💨 Vent fort - Attention aux objets volants"}
            {weather.visibility < 5 && "🌫️ Visibilité réduite - Prudence sur les routes"}
            {weather.temperature >= 15 && weather.temperature <= 25 && weather.humidity <= 70 && weather.windSpeed <= 20 && weather.visibility >= 5 && "✅ Conditions météo parfaites pour les activités extérieures"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
