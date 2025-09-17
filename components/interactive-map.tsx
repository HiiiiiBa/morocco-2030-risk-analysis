"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  MapPin,
  Star,
  Cloud,
  Droplets,
  Wind,
  Search,
  X,
  MessageCircle,
  Edit,
  Trash2,
  Send,
  ThumbsUp,
} from "lucide-react"

interface CityData {
  id: string
  name: string
  lat: number
  lng: number
  Indice_Criminalite: number
  Indice_Pollution: number
  Score_Infrastructures: number
  riskLevel: string
  indice_global?: number
}

interface WeatherData {
  temperature: number
  description: string
  feelsLike: number
  humidity: number
  windSpeed: number
}

interface CityComment {
  id: string
  cityId: string
  author: string
  content: string
  timestamp: Date
  likes: number
  userRatings?: {
    criminalite?: number
    pollution?: number
    infrastructure?: number
  }
}

interface UserRating {
  criminalite: number
  pollution: number
  infrastructure: number
}

const calculerIndiceGlobal = (city: CityData): number => {
  const poids_criminalite = 0.5
  const poids_pollution = 0.3
  const poids_infrastructures = 0.2
  const scoreInfraInverse = 5 - city.Score_Infrastructures
  const scoreGlobal =
    city.Indice_Criminalite * poids_criminalite +
    city.Indice_Pollution * poids_pollution +
    scoreInfraInverse * poids_infrastructures
  return Math.round(scoreGlobal)
}

const getRiskColor = (indiceGlobal: number): string => {
  if (indiceGlobal <= 39) return "#22c55e"
  if (indiceGlobal <= 64) return "#eab308"
  return "#ef4444"
}

const getRiskLevel = (indiceGlobal: number): string => {
  if (indiceGlobal <= 39) return "Faible"
  if (indiceGlobal <= 64) return "Moyen"
  return "Élevé"
}

const getCriminaliteColor = (indice: number): string => {
  if (indice <= 30) return "#10b981"
  if (indice <= 60) return "#f59e0b"
  return "#ef4444"
}

const getPollutionColor = (indice: number): string => {
  if (indice <= 30) return "#10b981"
  if (indice <= 60) return "#f59e0b"
  return "#ef4444"
}

const getInfrastructureLevel = (score: number): string => {
  if (score >= 4) return "text-green-500"
  if (score >= 2.5) return "text-yellow-500"
  return "text-red-500"
}

const getWeatherIcon = (description: string) => {
  if (description.includes("rain") || description.includes("pluie")) return Droplets
  if (description.includes("cloud") || description.includes("nuage")) return Cloud
  return Cloud
}

interface InteractiveMapProps {
  onCitySelect?: (city: CityData) => void
  className?: string
}

export default function InteractiveMap({ onCitySelect, className = "" }: InteractiveMapProps) {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [loadingWeather, setLoadingWeather] = useState(false)
  const [cities, setCities] = useState<CityData[]>([])
  const [cityComments, setCityComments] = useState<{ [cityId: string]: CityComment[] }>({})
  const [newComment, setNewComment] = useState("")
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [userRating, setUserRating] = useState<UserRating>({ criminalite: 0, pollution: 0, infrastructure: 0 })
  const [showRatingForm, setShowRatingForm] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    const moroccanCities: CityData[] = [
      {
        id: "casablanca",
        name: "Casablanca",
        lat: 33.5731,
        lng: -7.5898,
        Indice_Criminalite: 62,
        Indice_Pollution: 70,
        Score_Infrastructures: 4,
        riskLevel: "Moyen",
      },
      {
        id: "rabat",
        name: "Rabat",
        lat: 34.0209,
        lng: -6.8416,
        Indice_Criminalite: 40,
        Indice_Pollution: 55,
        Score_Infrastructures: 4.5,
        riskLevel: "Moyen",
      },
      {
        id: "fes",
        name: "Fès",
        lat: 34.0181,
        lng: -5.0078,
        Indice_Criminalite: 35,
        Indice_Pollution: 45,
        Score_Infrastructures: 3.5,
        riskLevel: "Moyen",
      },
      {
        id: "marrakech",
        name: "Marrakech",
        lat: 31.6295,
        lng: -7.9811,
        Indice_Criminalite: 50,
        Indice_Pollution: 60,
        Score_Infrastructures: 3.8,
        riskLevel: "Moyen",
      },
      {
        id: "tanger",
        name: "Tanger",
        lat: 35.7595,
        lng: -5.834,
        Indice_Criminalite: 45,
        Indice_Pollution: 50,
        Score_Infrastructures: 3.2,
        riskLevel: "Moyen",
      },
      {
        id: "agadir",
        name: "Agadir",
        lat: 30.4278,
        lng: -9.5981,
        Indice_Criminalite: 25,
        Indice_Pollution: 35,
        Score_Infrastructures: 4.2,
        riskLevel: "Faible",
      },
    ]
    setCities(moroccanCities)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && !mapInstanceRef.current) {
      // Load Leaflet CSS
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)

      // Load Leaflet JS
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = () => {
        const L = (window as any).L

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        })

        const mapInstance = L.map(mapRef.current, {
          center: [31.7917, -7.0926],
          zoom: 6,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true,
        })

        L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 18,
        }).addTo(mapInstance)

        mapInstanceRef.current = mapInstance

        setTimeout(() => {
          mapInstance.invalidateSize()
        }, 100)
      }
      document.head.appendChild(script)
    }
  }, [])

  useEffect(() => {
    if (mapInstanceRef.current && cities.length > 0 && (window as any).L) {
      const L = (window as any).L

      // Clear existing markers
      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer)
        }
      })

      // Add markers for each city
      cities.forEach((city) => {
        const indiceGlobal = calculerIndiceGlobal(city)
        const color = getRiskColor(indiceGlobal)

        const customIcon = L.divIcon({
          className: "custom-marker",
          html: `<div style="
            background-color: ${color}; 
            width: 24px; 
            height: 24px; 
            border-radius: 50%; 
            border: 4px solid white; 
            box-shadow: 0 4px 8px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2); 
            display: flex; 
            align-items: center; 
            justify-content: center;
            position: relative;
          ">
            <div style="
              width: 8px; 
              height: 8px; 
              background-color: white; 
              border-radius: 50%; 
              opacity: 0.9;
            "></div>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })

        const marker = L.marker([city.lat, city.lng], { icon: customIcon })
          .addTo(mapInstanceRef.current)
          .on("click", () => {
            const cityWithGlobal = { ...city, indice_global: indiceGlobal }
            setSelectedCity(cityWithGlobal)
            fetchWeatherData(city)
            onCitySelect?.(cityWithGlobal)
            mapInstanceRef.current.setView([city.lat, city.lng], 10)
          })

        marker.bindPopup(`
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">${city.name}</h3>
            <div style="margin-top: 8px;">
              <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; background-color: ${color}; color: white;">
                Risque ${getRiskLevel(indiceGlobal)} (${indiceGlobal})
              </span>
            </div>
          </div>
        `)
      })

      setTimeout(() => {
        mapInstanceRef.current.invalidateSize()
      }, 100)
    }
  }, [cities])

  const fetchWeatherData = async (city: CityData) => {
    setLoadingWeather(true)
    try {
      // Mock weather data for demo
      const mockWeather: WeatherData = {
        temperature: Math.round(Math.random() * 15 + 15),
        description: ["ensoleillé", "nuageux", "partiellement nuageux"][Math.floor(Math.random() * 3)],
        feelsLike: Math.round(Math.random() * 15 + 15),
        humidity: Math.round(Math.random() * 40 + 40),
        windSpeed: Math.round(Math.random() * 20 + 5),
      }
      setWeatherData(mockWeather)
    } catch (error) {
      console.error("Erreur lors de la récupération de la météo:", error)
    } finally {
      setLoadingWeather(false)
    }
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchError("Veuillez entrer un nom de ville")
      return
    }

    const foundCity = cities.find((city) => city.name.toLowerCase().includes(searchTerm.toLowerCase()))

    if (foundCity) {
      const cityWithGlobal = { ...foundCity, indice_global: calculerIndiceGlobal(foundCity) }
      setSelectedCity(cityWithGlobal)
      fetchWeatherData(foundCity)
      onCitySelect?.(cityWithGlobal)
      setSearchError(null)

      // Center map on found city
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([foundCity.lat, foundCity.lng], 10)
      }
    } else {
      setSearchError("Ville non trouvée")
    }
  }

  const addComment = () => {
    if (!selectedCity || !newComment.trim()) return

    const comment: CityComment = {
      id: Date.now().toString(),
      cityId: selectedCity.id,
      author: "Utilisateur", // In real app, get from auth
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      userRatings: showRatingForm ? { ...userRating } : undefined,
    }

    setCityComments((prev) => ({
      ...prev,
      [selectedCity.id]: [...(prev[selectedCity.id] || []), comment],
    }))

    setNewComment("")
    setUserRating({ criminalite: 0, pollution: 0, infrastructure: 0 })
    setShowRatingForm(false)
  }

  const deleteComment = (commentId: string) => {
    if (!selectedCity) return

    setCityComments((prev) => ({
      ...prev,
      [selectedCity.id]: prev[selectedCity.id]?.filter((c) => c.id !== commentId) || [],
    }))
  }

  const startEditComment = (comment: CityComment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
  }

  const saveEditComment = () => {
    if (!selectedCity || !editingComment) return

    setCityComments((prev) => ({
      ...prev,
      [selectedCity.id]:
        prev[selectedCity.id]?.map((c) => (c.id === editingComment ? { ...c, content: editContent } : c)) || [],
    }))

    setEditingComment(null)
    setEditContent("")
  }

  const likeComment = (commentId: string) => {
    if (!selectedCity) return

    setCityComments((prev) => ({
      ...prev,
      [selectedCity.id]:
        prev[selectedCity.id]?.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c)) || [],
    }))
  }

  const renderStarRating = (rating: number, onRate: (rating: number) => void, label: string) => (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium w-24">{label}:</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 cursor-pointer ${star <= rating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
            onClick={() => onRate(star)}
          />
        ))}
      </div>
    </div>
  )

  const renderSliderRating = (rating: number, onRate: (rating: number) => void, label: string) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}:</span>
        <span className="text-sm font-bold text-blue-600">{rating}/100</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={rating}
        onChange={(e) => onRate(Number.parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`,
        }}
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>Très mauvais</span>
        <span>Moyen</span>
        <span>Excellent</span>
      </div>
    </div>
  )

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 ${className}`}>
      {/* Left sidebar with controls */}
      <div className="lg:col-span-1 space-y-4">
        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Rechercher une ville</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Nom de la ville..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setSearchError(null)
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {searchError && (
              <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <X className="h-4 w-4" />
                <span>{searchError}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Légende</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">Faible (0-39)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-sm">Moyen (40-64)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm">Élevé (65-100)</span>
            </div>
          </CardContent>
        </Card>

        {/* Weather */}
        {selectedCity && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Météo - {selectedCity.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingWeather ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Chargement...</p>
                </div>
              ) : weatherData ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const WeatherIcon = getWeatherIcon(weatherData.description)
                        return <WeatherIcon className="h-6 w-6 text-blue-500" />
                      })()}
                      <span className="text-2xl font-bold">{weatherData.temperature}°C</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {weatherData.description}
                      </div>
                      <div className="text-xs text-gray-500">Ressenti {weatherData.feelsLike}°C</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span>{weatherData.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-gray-500" />
                      <span>{weatherData.windSpeed} km/h</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600">Sélectionnez une ville pour voir la météo</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* City details */}
        {selectedCity && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {selectedCity.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="text-center p-3 rounded-lg border"
                  style={{
                    backgroundColor: `${getCriminaliteColor(selectedCity.Indice_Criminalite)}20`,
                    borderColor: getCriminaliteColor(selectedCity.Indice_Criminalite),
                  }}
                >
                  <div
                    className="text-2xl font-bold"
                    style={{ color: getCriminaliteColor(selectedCity.Indice_Criminalite) }}
                  >
                    {selectedCity.Indice_Criminalite}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Criminalité</div>
                </div>
                <div
                  className="text-center p-3 rounded-lg border"
                  style={{
                    backgroundColor: `${getPollutionColor(selectedCity.Indice_Pollution)}20`,
                    borderColor: getPollutionColor(selectedCity.Indice_Pollution),
                  }}
                >
                  <div
                    className="text-2xl font-bold"
                    style={{ color: getPollutionColor(selectedCity.Indice_Pollution) }}
                  >
                    {selectedCity.Indice_Pollution}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Pollution</div>
                </div>
              </div>
              <div className="text-center p-3 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < selectedCity.Score_Infrastructures ? `${getInfrastructureLevel(selectedCity.Score_Infrastructures)} fill-current` : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Infrastructure ({selectedCity.Score_Infrastructures}/5)
                </div>
              </div>
              {selectedCity && (
                <div className="text-center p-4 bg-gradient-to-r from-red-100 to-green-100 dark:from-red-900 dark:to-green-900 rounded-lg">
                  <div
                    className="text-3xl font-bold"
                    style={{ color: getRiskColor(calculerIndiceGlobal(selectedCity)) }}
                  >
                    {calculerIndiceGlobal(selectedCity)}
                  </div>
                  <div className="text-sm font-medium">Indice Global</div>
                  <Badge
                    className="mt-2"
                    style={{ backgroundColor: getRiskColor(calculerIndiceGlobal(selectedCity)), color: "white" }}
                  >
                    Risque {getRiskLevel(calculerIndiceGlobal(selectedCity))}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Comments */}
        {selectedCity && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Commentaires - {selectedCity.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new comment */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Partagez votre expérience sur cette ville..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px]"
                />

                {/* Rating toggle */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={showRatingForm ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowRatingForm(!showRatingForm)}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Évaluer la ville
                  </Button>
                </div>

                {/* Rating form */}
                {showRatingForm && (
                  <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium text-sm">Votre évaluation:</h4>
                    {renderSliderRating(
                      userRating.criminalite,
                      (rating) => setUserRating((prev) => ({ ...prev, criminalite: rating })),
                      "Sécurité",
                    )}
                    {renderSliderRating(
                      userRating.pollution,
                      (rating) => setUserRating((prev) => ({ ...prev, pollution: rating })),
                      "Propreté",
                    )}
                    {renderStarRating(
                      userRating.infrastructure,
                      (rating) => setUserRating((prev) => ({ ...prev, infrastructure: rating })),
                      "Infrastructure",
                    )}
                  </div>
                )}

                <Button onClick={addComment} className="w-full" disabled={!newComment.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Publier le commentaire
                </Button>
              </div>

              {/* Comments list */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cityComments[selectedCity.id]?.length > 0 ? (
                  cityComments[selectedCity.id].map((comment) => (
                    <div key={comment.id} className="p-3 border rounded-lg bg-white dark:bg-gray-800">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-gray-500 ml-2">{comment.timestamp.toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => startEditComment(comment)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {editingComment === comment.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[60px]"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={saveEditComment}>
                              Sauvegarder
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setEditingComment(null)}>
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm mb-2">{comment.content}</p>

                          {/* User ratings display */}
                          {comment.userRatings && (
                            <div className="space-y-1 mb-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                              <div className="font-medium">Évaluations de l'utilisateur:</div>
                              <div className="flex items-center gap-4">
                                <span>Sécurité: {comment.userRatings.criminalite}/100</span>
                                <span>Propreté: {comment.userRatings.pollution}/100</span>
                                <span>Infrastructure: {comment.userRatings.infrastructure}/5</span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => likeComment(comment.id)}
                              className="text-xs"
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {comment.likes}
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Aucun commentaire pour cette ville. Soyez le premier à partager votre expérience !
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main map */}
      <div className="lg:col-span-3">
        <Card className="h-[600px] overflow-hidden">
          <CardContent className="p-4 h-full">
            <div ref={mapRef} className="w-full h-full rounded-lg" style={{ minHeight: "500px" }} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
