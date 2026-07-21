"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Trophy,
  LogOut,
  ArrowLeft,
  AlertTriangle,
  Shield,
  Camera,
  Phone,
  Navigation,
  Users,
  Clock,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import RabatMap from "@/components/rabat-map"
import CasaMap from "@/components/casa-map"
import FesMap from "@/components/fes-map"
import TangerMap from "@/components/tanger-map"
import MarrakechMap from "@/components/marrakech-map"
import AgadirMap from "@/components/agadir-map"

interface City {
  name: string
  slug: string
  image: string
  stadium: string
  capacity: string
  risk: "Faible" | "Moyen" | "Élevé"
  criminalite: number
  pollution: number
  infrastructure: number
  description: string
}

const moroccanCities: City[] = [
  {
    name: "Rabat",
    slug: "rabat",
    image: "/image/rabat.png",
    stadium: "Stade du Prince Moulay-Abdallah",
    capacity: "68 000",
    risk: "Faible",
    criminalite: 25,
    pollution: 35,
    infrastructure: 4,
    description: "Capitale du Royaume, Rabat combine patrimoine historique et modernité pour accueillir les matchs de la Coupe du Monde.",
  },
  {
    name: "Casablanca",
    slug: "casablanca",
    image: "/image/casa.png",
    stadium: "Stade Hassan-II",
    capacity: "115 000",
    risk: "Moyen",
    criminalite: 45,
    pollution: 55,
    infrastructure: 4,
    description: "Capitale économique du Maroc, Casablanca accueillera les plus grands matchs dans le plus grand stade du monde.",
  },
  {
    name: "Fès",
    slug: "fes",
    image: "/image/fes.png",
    stadium: "Stade de Fès",
    capacity: "55 000",
    risk: "Faible",
    criminalite: 20,
    pollution: 30,
    infrastructure: 3,
    description: "Ville impériale et centre spirituel, Fès apporte son riche patrimoine culturel à la Coupe du Monde.",
  },
  {
    name: "Agadir",
    slug: "agadir",
    image: "/image/agadir.png",
    stadium: "Stade Adrar",
    capacity: "46 000",
    risk: "Faible",
    criminalite: 15,
    pollution: 25,
    infrastructure: 3,
    description: "Station balnéaire moderne, Agadir offre un cadre idyllique avec ses plages et son climat ensoleillé.",
  },
  {
    name: "Marrakech",
    slug: "marrakech",
    image: "/image/kech.png",
    stadium: "Stade de Marrakech",
    capacity: "45 000",
    risk: "Moyen",
    criminalite: 40,
    pollution: 45,
    infrastructure: 3,
    description: "Perle du Sud, Marrakech fascine par ses souks, ses palais et l'hospitalité légendaire de ses habitants.",
  },
  {
    name: "Tanger",
    slug: "tanger",
    image: "/image/tanger.png",
    stadium: "Stade Ibn-Batouta",
    capacity: "76 000",
    risk: "Moyen",
    criminalite: 35,
    pollution: 40,
    infrastructure: 4,
    description: "Porte de l'Afrique vers l'Europe, Tanger est un carrefour culturel unique entre deux continents.",
  },
]

export default function MapPage() {
  const params = useParams()
  const [city, setCity] = useState<City | null>(null)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    // Trouver la ville
    const foundCity = moroccanCities.find((c) => c.slug === params.slug)
    setCity(foundCity || null)

    // Récupérer les données utilisateur depuis localStorage
    const user = localStorage.getItem("user")
    if (user) {
      setUserData(JSON.parse(user))
    }
  }, [params.slug])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/dashboard/city/${city.slug}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <MapPin className="h-8 w-8 text-red-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Carte  {city.name}</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Zones de risque</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {userData && (
                <div className="hidden md:flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {userData.first_name?.[0]}{userData.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {userData.first_name} {userData.last_name}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Connecté</p>
                  </div>
                </div>
              )}
              <ThemeToggle />
              <Button
                variant="outline"
                className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950 bg-transparent"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Carte Interactive - {city.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Visualisez les zones à risque
          </p>
        </div>

        {/* Carte Interactive */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-blue-600" />
              Carte Interactive de {city.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {city.slug === "rabat" ? (
              <RabatMap />
            ) : city.slug === "casablanca" ? (
              <CasaMap />
            ) : city.slug === "fes" ? (
              <FesMap />
            ) : city.slug === "tanger" ? (
              <TangerMap />
            ) : city.slug === "marrakech" ? (
              <MarrakechMap />
            ) : city.slug === "agadir" ? (
              <AgadirMap />
            ) : (
              <div className="bg-gradient-to-br from-blue-100 via-yellow-50 to-orange-100 dark:from-blue-900 dark:via-yellow-900 dark:to-orange-900 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
                {/* Carte SVG personnalisée pour les autres villes */}
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Fond de la ville */}
                  <rect width="400" height="300" fill="#E5E7EB" className="opacity-30" />
                  
                  {/* Zones spécifiques à chaque ville */}
                  {city.slug === "casablanca" && (
                    <>
                      <circle cx="100" cy="80" r="25" fill="#10B981" opacity="0.3" />
                      <text x="100" y="85" textAnchor="middle" className="text-xs fill-green-800">Centre</text>
                      <circle cx="300" cy="120" r="20" fill="#F59E0B" opacity="0.3" />
                      <text x="300" y="125" textAnchor="middle" className="text-xs fill-yellow-800">Corniche</text>
                      <circle cx="200" cy="200" r="30" fill="#EF4444" opacity="0.3" />
                      <text x="200" y="205" textAnchor="middle" className="text-xs fill-red-800">Médina</text>
                    </>
                  )}
                  {city.slug === "fes" && (
                    <>
                      <circle cx="120" cy="100" r="35" fill="#F59E0B" opacity="0.3" />
                      <text x="120" y="105" textAnchor="middle" className="text-xs fill-yellow-800">Médina</text>
                      <circle cx="280" cy="150" r="25" fill="#10B981" opacity="0.3" />
                      <text x="280" y="155" textAnchor="middle" className="text-xs fill-green-800">Nouvelle Ville</text>
                      <circle cx="200" cy="200" r="20" fill="#F59E0B" opacity="0.3" />
                      <text x="200" y="205" textAnchor="middle" className="text-xs fill-yellow-800">Tanneries</text>
                    </>
                  )}
                  {city.slug === "agadir" && (
                    <>
                      <circle cx="100" cy="100" r="30" fill="#10B981" opacity="0.3" />
                      <text x="100" y="105" textAnchor="middle" className="text-xs fill-green-800">Plage</text>
                      <circle cx="300" cy="150" r="25" fill="#10B981" opacity="0.3" />
                      <text x="300" y="155" textAnchor="middle" className="text-xs fill-green-800">Marina</text>
                      <circle cx="200" cy="200" r="20" fill="#10B981" opacity="0.3" />
                      <text x="200" y="205" textAnchor="middle" className="text-xs fill-green-800">Centre</text>
                    </>
                  )}
                  {city.slug === "marrakech" && (
                    <>
                      <circle cx="100" cy="100" r="30" fill="#F59E0B" opacity="0.3" />
                      <text x="100" y="105" textAnchor="middle" className="text-xs fill-yellow-800">Médina</text>
                      <circle cx="300" cy="150" r="25" fill="#10B981" opacity="0.3" />
                      <text x="300" y="155" textAnchor="middle" className="text-xs fill-green-800">Gueliz</text>
                      <circle cx="200" cy="200" r="20" fill="#F59E0B" opacity="0.3" />
                      <text x="200" y="205" textAnchor="middle" className="text-xs fill-yellow-800">Souks</text>
                    </>
                  )}
                  {city.slug === "tanger" && (
                    <>
                      <circle cx="100" cy="100" r="25" fill="#F59E0B" opacity="0.3" />
                      <text x="100" y="105" textAnchor="middle" className="text-xs fill-yellow-800">Médina</text>
                      <circle cx="300" cy="150" r="30" fill="#10B981" opacity="0.3" />
                      <text x="300" y="155" textAnchor="middle" className="text-xs fill-green-800">Centre</text>
                      <circle cx="200" cy="200" r="20" fill="#F59E0B" opacity="0.3" />
                      <text x="200" y="205" textAnchor="middle" className="text-xs fill-yellow-800">Port</text>
                    </>
                  )}
                  
                  {/* Stade principal */}
                  <rect x="180" y="130" width="40" height="30" fill="#DC2626" rx="5" />
                  <text x="200" y="150" textAnchor="middle" className="text-xs fill-white font-bold">Stade</text>
                  
                  {/* Points d'intérêt */}
                  <circle cx="100" cy="100" r="5" fill="#3B82F6" />
                  <circle cx="300" cy="150" r="5" fill="#8B5CF6" />
                  <circle cx="200" cy="200" r="5" fill="#F59E0B" />
                  
                  {/* Légende */}
                  <rect x="10" y="10" width="120" height="80" fill="white" fillOpacity="0.9" rx="5" />
                  <text x="20" y="25" className="text-xs font-bold">Zones de {city.name}</text>
                  <circle cx="20" cy="40" r="3" fill="#10B981" />
                  <text x="30" y="45" className="text-xs">Zone sécurisée</text>
                  <circle cx="20" cy="55" r="3" fill="#F59E0B" />
                  <text x="30" y="60" className="text-xs">Zone de vigilance</text>
                  <circle cx="20" cy="70" r="3" fill="#EF4444" />
                  <text x="30" y="75" className="text-xs">Zone à risque</text>
                </svg>
                
                {/* Informations spécifiques à la ville */}
                <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
                  <h4 className="font-semibold text-sm mb-2">Points d'Intérêt</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded"></div>
                      <span>Stade {city.stadium}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded"></div>
                      <span>Centre-ville</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded"></div>
                      <span>Zone touristique</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-600 rounded"></div>
                      <span>Transport public</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}