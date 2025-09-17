"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogOut, ArrowLeft, Users, Shield, TrendingUp, Globe, BarChart3, AlertTriangle, MapPin } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import CommentSection from "@/components/comment-section"
import Chatbot from "@/components/chatbot"
import InteractiveMap from "@/components/interactive-map"

export default function MoroccoOverviewUnified() {
  const [userData, setUserData] = useState<any>(null)
  const [selectedCityFromMap, setSelectedCityFromMap] = useState<any>(null)

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

  const nationalStats = {
    totalCapacity: 410000,
    averageCriminalite: 30,
    averagePollution: 38,
    averageInfrastructure: 3.5,
    totalMatches: 32,
    expectedVisitors: 2500000,
  }

  const cityComparison = [
    { name: "Casablanca", capacity: 115000, risk: "Moyen", criminalite: 45, pollution: 55 },
    { name: "Tanger", capacity: 76000, risk: "Moyen", criminalite: 35, pollution: 40 },
    { name: "Rabat", capacity: 68000, risk: "Faible", criminalite: 25, pollution: 35 },
    { name: "Fès", capacity: 55000, risk: "Faible", criminalite: 20, pollution: 30 },
    { name: "Agadir", capacity: 46000, risk: "Faible", criminalite: 15, pollution: 25 },
    { name: "Marrakech", capacity: 45000, risk: "Moyen", criminalite: 40, pollution: 45 },
  ]

  const handleCitySelect = (city: any) => {
    setSelectedCityFromMap(city)
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
                <Globe className="h-8 w-8 text-red-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Maroc - Vue Globale</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Analyse nationale Morocco 2030</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {userData && (
                <div className="hidden md:flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {userData.first_name?.[0]}
                      {userData.last_name?.[0]}
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Vue d'ensemble du Maroc</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Analyse globale de toutes les villes hôtes et coordination nationale pour la Coupe du Monde 2030
          </p>
        </div>

        {/* Statistiques nationales */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
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
              <div className="text-2xl font-bold text-blue-600 mb-1">{nationalStats.totalMatches}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Matchs Prévus</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">2.5M</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Visiteurs Attendus</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">{nationalStats.averageCriminalite}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Criminalité Moy.</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-teal-600 mb-1">{nationalStats.averagePollution}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pollution Moy.</div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Carte Interactive du Maroc - Villes Hôtes 2030
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InteractiveMap onCitySelect={handleCitySelect} />

            {selectedCityFromMap && (
              <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-green-50 dark:from-red-900/20 dark:to-green-900/20 rounded-lg border">
                <h4 className="font-semibold text-lg mb-2">Ville sélectionnée: {selectedCityFromMap.name}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Criminalité:</span> {selectedCityFromMap.Indice_Criminalite}
                  </div>
                  <div>
                    <span className="font-medium">Pollution:</span> {selectedCityFromMap.Indice_Pollution}
                  </div>
                  <div>
                    <span className="font-medium">Infrastructure:</span> {selectedCityFromMap.Score_Infrastructures}/5
                  </div>
                  <div>
                    <span className="font-medium">Risque Global:</span> {selectedCityFromMap.indice_global}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        

        {/* Analyses globales */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité Nationale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">Bon</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Niveau de sécurité global satisfaisant</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Villes à faible risque</span>
                    <span className="font-bold">3/6</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Villes à risque moyen</span>
                    <span className="font-bold">3/6</span>
                  </div>
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
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{nationalStats.averageInfrastructure}/5</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Score moyen d'infrastructure</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(nationalStats.averageInfrastructure / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Capacité d'Accueil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">410K</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Places totales disponibles</p>
                </div>
                <div className="text-sm text-center text-green-600 font-medium">
                  ✓ Capacité suffisante pour l'événement
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
        |

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}
