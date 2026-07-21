"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Trophy, LogOut, Bus, Info, Heart, Navigation } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import CommentSection from "@/components/comment-section"
import Chatbot from "@/components/chatbot"
import MoroccoMap from "@/components/morocco-map"

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
}

const dashboardCities: City[] = [
  {
    name: "Rabat",
    slug: "rabat",
    image: "/image/rabat.png",
    stadium: "Stade du Prince Moulay-Abdallah",
    capacity: "68 000",
    risk: "Faible",
    criminalite: 39,
    pollution: 44,
    infrastructure: 4.5,
  },
  {
    name: "Casablanca",
    slug: "casablanca",
    image: "/image/casa.png",
    stadium: "Stade Hassan-II",
    capacity: "115 000",
    risk: "Moyen",
    criminalite: 61.94,
    pollution: 55,
    infrastructure: 4.8,
  },
  {
    name: "Fès",
    slug: "fes",
    image: "/image/fes.png",
    stadium: "Stade de Fès",
    capacity: "55 000",
    risk: "Moyen",
    criminalite: 60.5,
    pollution: 55,
    infrastructure: 2,
  },
  {
    name: "Agadir",
    slug: "agadir",
    image: "/image/agadir.png",
    stadium: "Stade Adrar",
    capacity: "46 000",
    risk: "Faible",
    criminalite: 39.12,
    pollution: 75,
    infrastructure: 3.4,
  },
  {
    name: "Marrakech",
    slug: "marrakech",
    image: "/image/kech.png",
    stadium: "Stade de Marrakech",
    capacity: "45 000",
    risk: "Moyen",
    criminalite: 54.45,
    pollution: 57,
    infrastructure: 2.5,
  },
  {
    name: "Tanger",
    slug: "tanger",
    image: "/image/tanger.png",
    stadium: "Stade Ibn-Batouta",
    capacity: "76 000",
    risk: "Moyen",
    criminalite: 55.11,
    pollution: 55,
    infrastructure: 3.8,
  },
]

export default function DashboardPage() {
  const [selectedCity, setSelectedCity] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    // Récupérer les données utilisateur depuis localStorage
    const user = localStorage.getItem("user")
    if (user) {
      setUserData(JSON.parse(user))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const getRiskColorText = (risk: string) => {
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

  const getRiskBgColor = (risk: string) => {
    switch (risk) {
      case "Faible":
        return "bg-green-100 border-green-200"
      case "Moyen":
        return "bg-yellow-100 border-yellow-200"
      case "Élevé":
        return "bg-red-100 border-red-200"
      default:
        return "bg-gray-100 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header avec navigation par villes */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Morocco 2030</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dashboard</p>
              </div>
            </div>

          

            {/* Actions utilisateur */}
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

        {/* Statistiques globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">6</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Villes Hôtes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">410K</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Capacité Totale</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">32</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Matchs Prévus</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">2.5M</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Visiteurs Attendus</div>
            </CardContent>
          </Card>
        </div>

        {/* Grille des villes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardCities.map((city) => (
            <Card key={city.slug} className="hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{city.name}</CardTitle>
                  <Badge className={`${getRiskColorText(city.risk)} ${getRiskBgColor(city.risk)}`}>
                    Risque {city.risk}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{city.stadium}</p>
                <p className="text-xs text-gray-500">{city.capacity} places</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Indicateurs rapides */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <div className="font-bold text-red-600">{city.criminalite}</div>
                    <div className="text-gray-600 dark:text-gray-400">Criminalité</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="font-bold text-blue-600">{city.pollution}</div>
                    <div className="text-gray-600 dark:text-gray-400">Pollution</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="font-bold text-green-600">{city.infrastructure}/5</div>
                    <div className="text-gray-600 dark:text-gray-400">Infrastructure</div>
                  </div>
                </div>

                {/* Actions rapides */}
                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/dashboard/city/${city.slug}/transport`}>
                    <Button variant="outline" size="sm" className="w-full text-xs bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <Bus className="h-3 w-3 mr-1" />
                      Transport
                    </Button>
                  </Link>
                  <Link href={`/dashboard/city/${city.slug}/info`}>
                    <Button variant="outline" size="sm" className="w-full text-xs bg-transparent hover:bg-green-50 dark:hover:bg-green-900/20">
                      <Info className="h-3 w-3 mr-1" />
                      Infos
                    </Button>
                  </Link>
                  <Link href={`/dashboard/city/${city.slug}/map`}>
                    <Button variant="outline" size="sm" className="w-full text-xs bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20">
                      <MapPin className="h-3 w-3 mr-1" />
                      Carte
                    </Button>
                  </Link>
                  <Link href={`/dashboard/city/${city.slug}/fan-experience`}>
                    <Button variant="outline" size="sm" className="w-full text-xs bg-transparent hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      <Heart className="h-3 w-3 mr-1" />
                      Fan Zone
                    </Button>
                  </Link>
                </div>

                {/* Bouton principal */}
                <div className="mt-4">
                  <Link href={`/dashboard/city/${city.slug}`}>
                    <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                      Accéder à {city.name}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Accès rapide Maroc Global */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-red-600 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Vue d'ensemble du Maroc</h3>
                  <p className="text-red-100">Analyse globale de toutes les villes hôtes et coordination nationale</p>
                </div>
                <Link href="/dashboard/morocco">
                  <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                    <Navigation className="mr-2 h-5 w-5" />
                    Accéder
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}
