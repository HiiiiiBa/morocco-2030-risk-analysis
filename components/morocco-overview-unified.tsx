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
import { CityData, NationalStats, parseCSV, calculateNationalStats, mapCSVToCityComparison } from "@/lib/csv-utils"

export default function MoroccoOverviewUnified() {
  const [userData, setUserData] = useState<any>(null)
  const [selectedCityFromMap, setSelectedCityFromMap] = useState<any>(null)
  const [cityComparison, setCityComparison] = useState<CityData[]>([])
  const [nationalStats, setNationalStats] = useState<NationalStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Récupérer les données utilisateur depuis localStorage
    const user = localStorage.getItem("user")
    if (user) {
      setUserData(JSON.parse(user))
    }

    // Charger les données CSV
    loadCSVData()
  }, [])

  const loadCSVData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Chemin vers votre fichier CSV - modifiez selon votre structure
      const csvPath = '/data/cities.csv' 
      
      const response = await fetch(csvPath)
      if (!response.ok) {
        throw new Error(`Erreur lors du chargement du fichier CSV: ${response.statusText}`)
      }
      
      const csvContent = await response.text()
      const parsedData = parseCSV(csvContent)
      const mappedData = mapCSVToCityComparison(parsedData)
      const stats = calculateNationalStats(parsedData)
      
      setCityComparison(mappedData)
      setNationalStats(stats)
    } catch (err) {
      console.error('Erreur lors du chargement des données CSV:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      

      setNationalStats({
        totalCapacity: 410000,
        averageCriminalite: 30,
        averagePollution: 38,
        averageInfrastructure: 3.5,
        totalMatches: 32,
        expectedVisitors: 2500000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    window.location.href = "/"
  }


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

          
          {/* Indicateur de chargement et d'erreur */}
          {loading && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-700 dark:text-blue-300">Chargement des données depuis le fichier CSV...</p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-red-700 dark:text-red-300">
                <strong>Erreur:</strong> {error}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Utilisation des données par défaut. Vérifiez que votre fichier CSV est accessible.
              </p>
            </div>
          )}
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
              <div className="text-2xl font-bold text-green-600 mb-1">
                {loading ? "..." : nationalStats ? `${Math.round(nationalStats.totalCapacity / 1000)}K` : "410K"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Capacité Totale</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {loading ? "..." : nationalStats?.totalMatches || 32}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Matchs Prévus</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {loading ? "..." : nationalStats ? `${(nationalStats.expectedVisitors / 1000000).toFixed(1)}M` : "2.5M"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Visiteurs Attendus</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {loading ? "..." : nationalStats?.averageCriminalite || 30}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Criminalité Moy.</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-teal-600 mb-1">
                {loading ? "..." : nationalStats?.averagePollution || 38}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pollution Moy.</div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Carte Interactive du Maroc 
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InteractiveMap onCitySelect={handleCitySelect} />

          </CardContent>
        </Card>

      </div>
      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}
