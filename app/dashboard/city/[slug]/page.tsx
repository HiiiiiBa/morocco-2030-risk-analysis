"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Trophy,
  LogOut,
  Bus,
  Train,
  Info,
  AlertTriangle,
  Heart,
  ArrowLeft,
  Users,
  Shield,
  TrendingUp,
  Clock,
  Star,
  Navigation,
  Wifi,
  Camera,
  Phone,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import CommentSection from "@/components/comment-section"
import WeatherWidget from "@/components/weather-widget"
import Chatbot from "@/components/chatbot"
import CityTransportContent from "@/components/city-transport-content"
import CityInfoContent from "@/components/city-info-content"

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
    description:
      "Capitale du Royaume, Rabat combine patrimoine historique et modernité pour accueillir les matchs de la Coupe du Monde.",
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
    description:
      "Capitale économique du Maroc, Casablanca accueillera les plus grands matchs dans le plus grand stade du monde.",
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
    description:
      "Perle du Sud, Marrakech fascine par ses souks, ses palais et l'hospitalité légendaire de ses habitants.",
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

export default function CityPage() {
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Faible":
        return "text-green-600"
      case "Moyen":
        return "text-yellow-600"
      case "Élevé":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
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
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Trophy className="h-8 w-8 text-red-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">{city.name}</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{city.stadium}</p>
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
        {/* En-tête de la ville */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{city.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">{city.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-4 py-2 rounded-lg border-2 ${
                city.risk === "Faible" 
                  ? "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-400 dark:text-green-300"
                  : city.risk === "Moyen"
                  ? "bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-400 dark:text-yellow-300"
                  : "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/20 dark:border-red-400 dark:text-red-300"
              }`}>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold text-lg">Niveau de Risque: {city.risk}</span>
                </div>
                <div className="text-sm mt-1">
                  {city.risk === "Faible" && "Zone sécurisée - Accès libre"}
                  {city.risk === "Moyen" && "Vigilance recommandée - Précautions normales"}
                  {city.risk === "Élevé" && "Attention requise - Éviter si possible"}
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">{city.criminalite}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Indice Criminalité</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{city.pollution}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Indice Pollution</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{city.infrastructure}/5</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Infrastructure</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{city.capacity}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Capacité Stade</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Widget météo */}
        <div className="mb-6">
          <WeatherWidget cityName={city.name} citySlug={city.slug} />
        </div>

        {/* Navigation par onglets */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="transport">Transport</TabsTrigger>
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="map">Carte & Signalements</TabsTrigger>
            <TabsTrigger value="fan-experience">Fan Experience</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Analyse de Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Criminalité</span>
                      <span className="font-bold text-red-600">{city.criminalite}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: `${city.criminalite}%` }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sécurité Générale</span>
                      <span className="font-bold text-green-600">{100 - city.criminalite}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${100 - city.criminalite}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Infrastructure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Score Infrastructure</span>
                      <span className="font-bold text-green-600">{city.infrastructure}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(city.infrastructure / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Pollution</span>
                      <span className="font-bold text-blue-600">{city.pollution}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${city.pollution}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides */}
            <div className="grid md:grid-cols-4 gap-4">
              <Link href={`/dashboard/city/${city.slug}/transport`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Bus className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Transport</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tramway, train, bus</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/dashboard/city/${city.slug}/info`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Info className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Informations</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Indices détaillés</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/dashboard/city/${city.slug}/map`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <MapPin className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Carte</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Signalements</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/dashboard/city/${city.slug}/fan-experience`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Fan Experience</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ambiance & événements</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          {/* Autres onglets avec contenu simplifié */}
          <TabsContent value="transport" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bus className="h-5 w-5" />
                  Réseau de Transport - {city.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CityTransportContent citySlug={city.slug} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Informations détaillées - {city.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CityInfoContent citySlug={city.slug} cityName={city.name} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Carte Interactive - {city.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MapPin className="h-16 w-16 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Carte interactive</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Visualisez les zones à risque et signalez des incidents en temps réel.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fan-experience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Fan Experience - {city.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Heart className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Expérience des supporters</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Découvrez les fan zones et événements organisés dans {city.name}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <CommentSection
            title={`Commentaires sur ${city.name}`}
            placeholder={`Partagez vos expériences, conseils ou observations sur ${city.name}...`}
            context="city"
            cityName={city.name}
          />
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}



