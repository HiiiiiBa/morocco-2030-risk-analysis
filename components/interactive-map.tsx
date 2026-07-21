"use client"

import { API_URL } from "@/lib/api"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
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
  if (indiceGlobal <= 39) return "#10b981"
  if (indiceGlobal <= 64) return "#f59e0b"
  return "#dc2626"
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

export default function InteractiveMap({ onCitySelect, className }: InteractiveMapProps) {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [loadingWeather, setLoadingWeather] = useState(false)
  const [cityComments, setCityComments] = useState<{ [cityId: string]: CityComment[] }>({})
  const [newComment, setNewComment] = useState("")
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [userData, setUserData] = useState<any>(null)
  const [userRating, setUserRating] = useState<UserRating>({
    criminalite: 0,
    pollution: 0,
    infrastructure: 0,
  })
  const [loadingComments, setLoadingComments] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersAddedRef = useRef(false)

  const cities = useMemo(() => {
    const moroccanCities: CityData[] = [
      {
        id: "rabat",
        name: "Rabat",
        lat: 34.021845,
        lng: -6.840893,
        Indice_Criminalite: 39,
        Indice_Pollution: 44,
        Score_Infrastructures: 4.5,
        riskLevel: "Faible",
      },
      {
        id: "casablanca",
        name: "Casablanca",
        lat: 33.594514,
        lng: -7.620028,
        Indice_Criminalite: 61.94,
        Indice_Pollution: 55,
        Score_Infrastructures: 4.8,
        riskLevel: "Modéré",
      },
      {
        id: "tanger",
        name: "Tanger",
        lat: 35.7625681,
        lng: -5.8295062,
        Indice_Criminalite: 55.11,
        Indice_Pollution: 59,
        Score_Infrastructures: 3.8,
        riskLevel: "Modéré",
      },
      {
        id: "agadir",
        name: "Agadir",
        lat: 30.4205162,
        lng: -9.5838532,
        Indice_Criminalite: 39.12,
        Indice_Pollution: 75,
        Score_Infrastructures: 3.4,
        riskLevel: "Faible",
      },
      {
        id: "marrakech",
        name: "Marrakech",
        lat: 31.6258257,
        lng: -7.9891608,
        Indice_Criminalite: 54.45,
        Indice_Pollution: 57,
        Score_Infrastructures: 2.5,
        riskLevel: "Modéré",
      },
      {
        id: "fes",
        name: "Fès",
        lat: 34.0346534,
        lng: -5.0161926,
        Indice_Criminalite: 60.5,
        Indice_Pollution: 55,
        Score_Infrastructures: 2,
        riskLevel: "Modéré",
      },
      {
        id: "tetouan",
        name: "Tétouan",
        lat: 35.570175,
        lng: -5.3742776,
        Indice_Criminalite: 22.09,
        Indice_Pollution: 60,
        Score_Infrastructures: 3.6,
        riskLevel: "Faible",
      },
      {
        id: "safi",
        name: "Safi",
        lat: 32.299424,
        lng: -9.239533,
        Indice_Criminalite: 34.71,
        Indice_Pollution: 68,
        Score_Infrastructures: 3,
        riskLevel: "Faible",
      },
      {
        id: "oujda",
        name: "Oujda",
        lat: 34.677874,
        lng: -1.929306,
        Indice_Criminalite: 44.65,
        Indice_Pollution: 58,
        Score_Infrastructures: 3,
        riskLevel: "Modéré",
      },
      {
        id: "nador",
        name: "Nador",
        lat: 35.1739922,
        lng: -2.9281198,
        Indice_Criminalite: 39.23,
        Indice_Pollution: 58,
        Score_Infrastructures: 2.9,
        riskLevel: "Faible",
      },
      {
        id: "mohammedia",
        name: "Mohammedia",
        lat: 33.6958383,
        lng: -7.3893292,
        Indice_Criminalite: 33.34,
        Indice_Pollution: 54,
        Score_Infrastructures: 2.5,
        riskLevel: "Faible",
      },
      {
        id: "meknes",
        name: "Meknès",
        lat: 33.8984131,
        lng: -5.5321582,
        Indice_Criminalite: 50.45,
        Indice_Pollution: 54,
        Score_Infrastructures: 3.2,
        riskLevel: "Modéré",
      },
      {
        id: "larache",
        name: "Larache",
        lat: 35.1952327,
        lng: -6.152913,
        Indice_Criminalite: 35,
        Indice_Pollution: 57,
        Score_Infrastructures: 2.5,
        riskLevel: "Faible",
      },
      {
        id: "el_jadida",
        name: "El Jadida",
        lat: 33.2433309,
        lng: -8.49884,
        Indice_Criminalite: 42.08,
        Indice_Pollution: 57,
        Score_Infrastructures: 2.5,
        riskLevel: "Faible",
      },
      {
        id: "kenitra",
        name: "Kénitra",
        lat: 34.26457,
        lng: -6.570169,
        Indice_Criminalite: 45.81,
        Indice_Pollution: 54,
        Score_Infrastructures: 3.8,
        riskLevel: "Faible",
      },
      {
        id: "settat",
        name: "Settat",
        lat: 33.002397,
        lng: -7.619867,
        Indice_Criminalite: 46.25,
        Indice_Pollution: 55,
        Score_Infrastructures: 2.1,
        riskLevel: "Modéré",
      },
      {
        id: "sidi_slimane",
        name: "Sidi Slimane",
        lat: 34.259878,
        lng: -5.927253,
        Indice_Criminalite: 22.46,
        Indice_Pollution: 54,
        Score_Infrastructures: 2.7,
        riskLevel: "Faible",
      },
      {
        id: "al_hoceima",
        name: "Al Hoceima",
        lat: 35.245114,
        lng: -3.930186,
        Indice_Criminalite: 32.41,
        Indice_Pollution: 60,
        Score_Infrastructures: 4,
        riskLevel: "Faible",
      },
      {
        id: "berrechid",
        name: "Berrechid",
        lat: 33.2676746,
        lng: -7.5811465,
        Indice_Criminalite: 25,
        Indice_Pollution: 55,
        Score_Infrastructures: 1.8,
        riskLevel: "Faible",
      },
      {
        id: "guelmim",
        name: "Guelmim",
        lat: 28.9863852,
        lng: -10.0574351,
        Indice_Criminalite: 40,
        Indice_Pollution: 69,
        Score_Infrastructures: 2.1,
        riskLevel: "Modéré",
      },
      {
        id: "ouarzazate",
        name: "Ouarzazate",
        lat: 30.920193,
        lng: -6.910923,
        Indice_Criminalite: 24.53,
        Indice_Pollution: 65,
        Score_Infrastructures: 3,
        riskLevel: "Faible",
      },
      {
        id: "dakhla",
        name: "Dakhla",
        lat: 23.6940663,
        lng: -15.9431274,
        Indice_Criminalite: 30.2,
        Indice_Pollution: 129,
        Score_Infrastructures: 2.5,
        riskLevel: "Modéré",
      },
      {
        id: "laayoune",
        name: "Laâyoune",
        lat: 27.154512,
        lng: -13.1953921,
        Indice_Criminalite: 32.43,
        Indice_Pollution: 65,
        Score_Infrastructures: 3.7,
        riskLevel: "Faible",
      },
      {
        id: "er_rachidia",
        name: "Er Rachidia",
        lat: 31.929089,
        lng: -4.4340807,
        Indice_Criminalite: 23.4,
        Indice_Pollution: 67,
        Score_Infrastructures: 2.4,
        riskLevel: "Faible",
      },
      {
        id: "beni_mellal",
        name: "Beni Mellal",
        lat: 32.334193,
        lng: -6.335335,
        Indice_Criminalite: 40.4,
        Indice_Pollution: 56,
        Score_Infrastructures: 2.5,
        riskLevel: "Faible",
      },
      {
        id: "essaouira",
        name: "Essaouira",
        lat: 31.5118281,
        lng: -9.7620903,
        Indice_Criminalite: 19.4,
        Indice_Pollution: 68,
        Score_Infrastructures: 2.1,
        riskLevel: "Faible",
      },
      {
        id: "sale",
        name: "Salé",
        lat: 34.044889,
        lng: -6.814017,
        Indice_Criminalite: 61.03,
        Indice_Pollution: 55,
        Score_Infrastructures: 4.1,
        riskLevel: "Modéré",
      },
      {
        id: "taroudant",
        name: "Taroudant",
        lat: 30.470651,
        lng: -8.877922,
        Indice_Criminalite: 28.4,
        Indice_Pollution: 77,
        Score_Infrastructures: 1.5,
        riskLevel: "Faible",
      },
      {
        id: "ifrane",
        name: "Ifrane",
        lat: 33.527605,
        lng: -5.107408,
        Indice_Criminalite: 10.91,
        Indice_Pollution: 55,
        Score_Infrastructures: 2.6,
        riskLevel: "Faible",
      },
      {
        id: "chefchaouen",
        name: "Chefchaouen",
        lat: 35.1700832,
        lng: -5.2766583,
        Indice_Criminalite: 14.59,
        Indice_Pollution: 58,
        Score_Infrastructures: 2.7,
        riskLevel: "Faible",
      },
      {
        id: "merzouga",
        name: "Merzouga",
        lat: 31.0999166,
        lng: -4.0140878,
        Indice_Criminalite: 19.54,
        Indice_Pollution: 81,
        Score_Infrastructures: 2.2,
        riskLevel: "Faible",
      },
      {
        id: "khenifra",
        name: "Khénifra",
        lat: 32.9357718,
        lng: -5.6696504,
        Indice_Criminalite: 21.44,
        Indice_Pollution: 54,
        Score_Infrastructures: 3.3,
        riskLevel: "Faible",
      },
      {
        id: "tiznit",
        name: "Tiznit",
        lat: 29.698624,
        lng: -9.7312815,
        Indice_Criminalite: 20.32,
        Indice_Pollution: 78,
        Score_Infrastructures: 3.5,
        riskLevel: "Faible",
      },
      {
        id: "ben_guerir",
        name: "Ben Guerir",
        lat: 32.239034,
        lng: -7.958131,
        Indice_Criminalite: 25.64,
        Indice_Pollution: 62,
        Score_Infrastructures: 2.3,
        riskLevel: "Faible",
      },
      {
        id: "inzegane",
        name: "Inzegane",
        lat: 33.5563151,
        lng: -7.6006099,
        Indice_Criminalite: 37.59,
        Indice_Pollution: 77,
        Score_Infrastructures: 3,
        riskLevel: "Modéré",
      },
      {
        id: "asilah",
        name: "Asilah",
        lat: 35.461928,
        lng: -6.036545,
        Indice_Criminalite: 15.03,
        Indice_Pollution: 58,
        Score_Infrastructures: 3.7,
        riskLevel: "Faible",
      },
      {
        id: "azilal",
        name: "Azilal",
        lat: 31.959295,
        lng: -6.570991,
        Indice_Criminalite: 20.48,
        Indice_Pollution: 57,
        Score_Infrastructures: 1.5,
        riskLevel: "Faible",
      },
      {
        id: "sidi_ifni",
        name: "Sidi Ifni",
        lat: 29.3791253,
        lng: -10.1715632,
        Indice_Criminalite: 21.4,
        Indice_Pollution: 69,
        Score_Infrastructures: 2,
        riskLevel: "Faible",
      },
      {
        id: "tinghir",
        name: "Tinghir",
        lat: 31.52133,
        lng: -5.531164,
        Indice_Criminalite: 21.34,
        Indice_Pollution: 59,
        Score_Infrastructures: 2.2,
        riskLevel: "Faible",
      },
      {
        id: "khouribga",
        name: "Khouribga",
        lat: 32.8856482,
        lng: -6.908798,
        Indice_Criminalite: 29.3,
        Indice_Pollution: 55,
        Score_Infrastructures: 2.5,
        riskLevel: "Faible",
      },
      {
        id: "khemisset",
        name: "Khémisset",
        lat: 33.830287,
        lng: -6.072605,
        Indice_Criminalite: 33.21,
        Indice_Pollution: 54,
        Score_Infrastructures: 2.3,
        riskLevel: "Faible",
      },
      {
        id: "berkane",
        name: "Berkane",
        lat: 34.9266755,
        lng: -2.3294087,
        Indice_Criminalite: 30.58,
        Indice_Pollution: 57,
        Score_Infrastructures: 2,
        riskLevel: "Faible",
      },
      {
        id: "fquih_ben_salah",
        name: "Fquih Ben Salah",
        lat: 32.4212148,
        lng: -6.7470785,
        Indice_Criminalite: 30.39,
        Indice_Pollution: 55,
        Score_Infrastructures: 1.5,
        riskLevel: "Faible",
      },
      {
        id: "ksar_el_kebir",
        name: "Ksar El Kebir",
        lat: 34.999218,
        lng: -5.898724,
        Indice_Criminalite: 35.4,
        Indice_Pollution: 56,
        Score_Infrastructures: 2.1,
        riskLevel: "Faible",
      },
      {
        id: "martil",
        name: "Martil",
        lat: 35.617441,
        lng: -5.274154,
        Indice_Criminalite: 23.49,
        Indice_Pollution: 61,
        Score_Infrastructures: 3.1,
        riskLevel: "Faible",
      },
      {
        id: "sidi_kacem",
        name: "Sidi Kacem",
        lat: 34.226412,
        lng: -5.711434,
        Indice_Criminalite: 22.5,
        Indice_Pollution: 55,
        Score_Infrastructures: 2.9,
        riskLevel: "Faible",
      },
      {
        id: "taza",
        name: "Taza",
        lat: 34.230155,
        lng: -4.010104,
        Indice_Criminalite: 17.49,
        Indice_Pollution: 58,
        Score_Infrastructures: 1.9,
        riskLevel: "Faible",
      },
      {
        id: "azrou",
        name: "Azrou",
        lat: 33.436117,
        lng: -5.221913,
        Indice_Criminalite: 18.45,
        Indice_Pollution: 55,
        Score_Infrastructures: 1.8,
        riskLevel: "Faible",
      },
      {
        id: "ait_melloul",
        name: "Ait Melloul",
        lat: 30.3387947,
        lng: -9.5044701,
        Indice_Criminalite: 35,
        Indice_Pollution: 57,
        Score_Infrastructures: 2.3,
        riskLevel: "Faible",
      },
    ]
    return moroccanCities
  }, [])

  const addAllMarkers = useCallback(() => {
    console.log("[v0] addAllMarkers called, markersAdded:", markersAddedRef.current)

    if (markersAddedRef.current) {
      console.log("[v0] Markers already added, skipping")
      return
    }

    if (mapInstanceRef.current && cities.length > 0 && (window as any).L) {
      const L = (window as any).L
      console.log("[v0] Starting to add markers for", cities.length, "cities")

      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer)
        }
      })

      if (!mapInstanceRef.current.getContainer()) {
        console.log("[v0] Map container not ready, retrying...")
        setTimeout(() => addAllMarkers(), 500)
        return
      }

      cities.forEach((city) => {
        const indiceGlobal = calculerIndiceGlobal(city)
        const color = getRiskColor(indiceGlobal)

        console.log(`[v0] Adding marker for ${city.name} at [${city.lat}, ${city.lng}]`)

        const customIcon = L.divIcon({
          className: "custom-marker",
          html: `<div style="
            background-color: ${color};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            cursor: pointer;
            pointer-events: auto;
          ">
            <div style="
              width: 6px;
              height: 6px;
              background-color: white;
              border-radius: 50%;
              opacity: 0.95;
              pointer-events: none;
            "></div>
          </div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        })

        const cityData = { ...city }

        const marker = L.marker([cityData.lat, cityData.lng], { 
          icon: customIcon,
          bubblingMouseEvents: false
        })
          .addTo(mapInstanceRef.current)
          .on("click", (e: any) => {
            console.log("[v0] Marker clicked for city:", cityData.name)
            e.originalEvent.stopPropagation()
            const cityWithGlobal = { ...cityData, indice_global: calculerIndiceGlobal(cityData) }
            setSelectedCity(cityWithGlobal)
            fetchWeatherData(cityData)
            loadCityComments(cityData.id)
            onCitySelect?.(cityWithGlobal)
          })

        marker.bindPopup(`
          <div style="padding: 10px; min-width: 180px; text-align: center;">
            <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 6px; color: #333;">${cityData.name}</h3>
            <div style="margin-top: 6px;">
              <span style="display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 12px; background-color: ${color}; color: white; font-weight: 600;">
                ${getRiskLevel(indiceGlobal)} (${indiceGlobal})
              </span>
            </div>
            <div style="margin-top: 6px; font-size: 11px; color: #666;">
              Cliquez pour plus de détails
            </div>
          </div>
        `)
      })

      markersAddedRef.current = true
      console.log("[v0] Finished adding", cities.length, "markers")
    } else {
      console.log("[v0] Cannot add markers - missing requirements:", {
        mapInstance: !!mapInstanceRef.current,
        citiesCount: cities.length,
        leafletLoaded: !!(window as any).L,
      })
    }
  }, [cities, onCitySelect])

  useEffect(() => {
    // Load user data from localStorage
    const user = localStorage.getItem("user")
    if (user) {
      setUserData(JSON.parse(user))
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && !mapInstanceRef.current) {
      console.log("[v0] Initializing map...")

      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)

      const style = document.createElement("style")
      style.textContent = `
        .custom-marker {
          pointer-events: auto !important;
          cursor: pointer !important;
        }
        .custom-marker * {
          pointer-events: none !important;
        }
        .leaflet-marker-icon {
          cursor: pointer !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        .leaflet-popup-tip {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        }
      `
      document.head.appendChild(style)

      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = () => {
        const L = (window as any).L

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
        console.log("[v0] Map initialized successfully")

        setTimeout(() => {
          mapInstance.invalidateSize()
          setTimeout(() => {
            addAllMarkers()
          }, 300)
        }, 200)
      }
      document.head.appendChild(script)
    }
  }, [addAllMarkers])

  const fetchWeatherData = async (city: CityData) => {
    setLoadingWeather(true)
    try {
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
      loadCityComments(foundCity.id)
      onCitySelect?.(cityWithGlobal)
      setSearchError(null)

      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([foundCity.lat, foundCity.lng], 10)
      }
    } else {
      setSearchError("Ville non trouvée")
    }
  }

  // Fonction pour charger les commentaires depuis l'API
  // Fonction pour charger les commentaires depuis l'API
const loadCityComments = async (cityId: string) => {
  if (!cityId) return
  
  setLoadingComments(true)
  try {
    const response = await fetch(`${API_URL}/cities/${cityId}/comments`)
    if (response.ok) {
      const data = await response.json()
      const comments = data.comments || []
      
      // Convertir les commentaires de l'API au format local AVEC LES VALEURS RÉELLES
      const formattedComments: CityComment[] = comments.map((comment: any) => ({
        id: comment.id,
        cityId: cityId,
        author: comment.author,
        content: comment.comment,
        timestamp: new Date(comment.date),
        likes: 0,
        userRatings: {
          criminalite: comment.criminalite || 0, // Utilisez la valeur réelle
          pollution: comment.pollution || 0,     // Utilisez la valeur réelle
          infrastructure: comment.infrastructure || 0 // Utilisez la valeur réelle
        }
      }))
      
      setCityComments(prev => ({
        ...prev,
        [cityId]: formattedComments
      }))
    }
  } catch (error) {
    console.error("Erreur lors du chargement des commentaires:", error)
  } finally {
    setLoadingComments(false)
  }
}

  const addComment = async () => {
    if (!selectedCity || !newComment.trim() || !userData) return

    setSubmittingComment(true)
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        alert("Vous devez être connecté pour poster un commentaire")
        return
      }

      // Créer un objet de review pour l'API
      const reviewData = {
        city_id: selectedCity.id,
        criminalite: userRating.criminalite || 3,
        pollution: userRating.pollution || 3,
        infrastructure: userRating.infrastructure || 3,
        commentaire: newComment
      }

      const response = await fetch(`${API_URL}/cities/${selectedCity.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      })

      if (response.ok) {
        // Recharger les commentaires après ajout
        await loadCityComments(selectedCity.id)
        setNewComment("")
        setUserRating({ criminalite: 0, pollution: 0, infrastructure: 0 })
      } else {
        const errorData = await response.json()
        alert(`Erreur: ${errorData.detail || "Impossible d'ajouter le commentaire"}`)
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error)
      alert("Erreur lors de l'ajout du commentaire")
    } finally {
      setSubmittingComment(false)
    }
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

  const renderSliderRating = (rating: number, onRate: (rating: number) => void, label: string) => {
    const isRiskFactor = label === "Criminalité" || label === "Pollution"
    
    return (
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
            background: isRiskFactor 
              ? `linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)`
              : `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-500">
          {isRiskFactor ? (
            <>
              <span>Très faible</span>
              <span>Moyen</span>
              <span>Très élevé</span>
            </>
          ) : (
            <>
              <span>Très mauvais</span>
              <span>Moyen</span>
              <span>Excellent</span>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                      style={{
                        color: getCriminaliteColor(selectedCity.Indice_Criminalite),
                      }}
                    >
                      {selectedCity.Indice_Criminalite.toFixed(2)}
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
                      style={{
                        color: getPollutionColor(selectedCity.Indice_Pollution),
                      }}
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
                      style={{
                        color: getRiskColor(calculerIndiceGlobal(selectedCity)),
                      }}
                    >
                      {calculerIndiceGlobal(selectedCity)}
                    </div>
                    <div className="text-sm font-medium">Indice Global</div>
                    <Badge
                      className="mt-2"
                      style={{
                        backgroundColor: getRiskColor(calculerIndiceGlobal(selectedCity)),
                        color: "white",
                      }}
                    >
                      Risque {getRiskLevel(calculerIndiceGlobal(selectedCity))}
                    </Badge>
                  </div>
                )}
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

      {selectedCity && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Commentaires et Évaluations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left column: Add comment form */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Ajouter un commentaire</h3>
                <Textarea
                  placeholder="Partagez votre expérience sur cette ville..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />

                {/* Rating form always visible */}
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-medium">Évaluer la ville</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Votre évaluation sera publiée avec votre commentaire
                  </p>
                  {renderSliderRating(
                    userRating.criminalite,
                    (rating) => setUserRating((prev) => ({ ...prev, criminalite: rating })),
                    "Criminalité",
                  )}
                  {renderSliderRating(
                    userRating.pollution,
                    (rating) => setUserRating((prev) => ({ ...prev, pollution: rating })),
                    "Pollution",
                  )}
                  {renderStarRating(
                    userRating.infrastructure,
                    (rating) => setUserRating((prev) => ({ ...prev, infrastructure: rating })),
                    "Infrastructure",
                  )}
                </div>

                <Button 
                  onClick={addComment} 
                  className="w-full" 
                  disabled={!newComment.trim() || submittingComment}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {submittingComment ? "Publication..." : "Publier le commentaire"}
                </Button>
              </div>

              {/* Right column: Comments list */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Commentaires ({cityComments[selectedCity.id]?.length || 0})</h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {loadingComments ? (
                    <div className="text-center py-4">
                      <p>Chargement des commentaires...</p>
                    </div>
                  ) : cityComments[selectedCity.id]?.length > 0 ? (
                    cityComments[selectedCity.id].map((comment) => (
                      <div key={comment.id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
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
                            <p className="text-sm mb-3">{comment.content}</p>

                            {/* User ratings display */}
                            {comment.userRatings && (
                              <div className="space-y-1 mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                                <div className="font-medium mb-2">Évaluations de l'utilisateur:</div>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="text-center">
                                    <div className="font-semibold text-blue-600">
                                      {comment.userRatings.criminalite}/100
                                    </div>
                                    <div className="text-gray-600">Criminalité</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-green-600">
                                      {comment.userRatings.pollution}/100
                                    </div>
                                    <div className="text-gray-600">Pollution</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-yellow-600">
                                      {comment.userRatings.infrastructure}/5
                                    </div>
                                    <div className="text-gray-600">Infrastructure</div>
                                  </div>
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
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">
                        Aucun commentaire pour cette ville.
                        <br />
                        Soyez le premier à partager votre expérience !
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
