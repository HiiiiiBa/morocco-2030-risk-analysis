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

export default function MoroccoOverviewPage() {
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

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Carte Nationale du Maroc - Villes Hôtes 2030
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-red-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8">
              <div className="relative w-full max-w-4xl mx-auto">
                <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-red-200 dark:border-red-800">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Royaume du Maroc - Analyse Géographique des Risques
                  </h3>

                  {/* Large Morocco map with detailed positioning */}
                  <div className="relative h-96 bg-gradient-to-b from-blue-100 via-yellow-50 to-orange-100 dark:from-blue-900 dark:via-yellow-900 dark:to-orange-900 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                    {/* Tanger - North (Strait of Gibraltar) */}
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                      <Link href="/dashboard/city/tanger">
                        <div className="bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-lg shadow-lg cursor-pointer transition-all">
                          <MapPin className="h-4 w-4 mx-auto mb-1" />
                          <div className="text-sm font-bold">Tanger</div>
                          <div className="text-xs">76K places</div>
                          <div className="text-xs bg-yellow-800 rounded px-1 mt-1">Risque Moyen</div>
                        </div>
                      </Link>
                    </div>

                    {/* Rabat - Center-West Coast (Capital) */}
                    <div className="absolute top-20 left-1/3">
                      <Link href="/dashboard/city/rabat">
                        <div className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg shadow-lg cursor-pointer transition-all">
                          <MapPin className="h-4 w-4 mx-auto mb-1" />
                          <div className="text-sm font-bold">Rabat</div>
                          <div className="text-xs">68K places</div>
                          <div className="text-xs bg-green-800 rounded px-1 mt-1">Risque Faible</div>
                        </div>
                      </Link>
                    </div>

                    {/* Casablanca - Center-West Coast (Economic Capital) */}
                    <div className="absolute top-32 left-1/4">
                      <Link href="/dashboard/city/casablanca">
                        <div className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-lg cursor-pointer transition-all">
                          <MapPin className="h-4 w-4 mx-auto mb-1" />
                          <div className="text-sm font-bold">Casablanca</div>
                          <div className="text-xs">115K places</div>
                          <div className="text-xs bg-yellow-800 rounded px-1 mt-1">Risque Moyen</div>
                        </div>
                      </Link>
                    </div>

                    {/* Fès - Center-East (Imperial City) */}
                    <div className="absolute top-24 right-1/4">
                      <Link href="/dashboard/city/fes">
                        <div className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg shadow-lg cursor-pointer transition-all">
                          <MapPin className="h-4 w-4 mx-auto mb-1" />
                          <div className="text-sm font-bold">Fès</div>
                          <div className="text-xs">55K places</div>
                          <div className="text-xs bg-green-800 rounded px-1 mt-1">Risque Faible</div>
                        </div>
                      </Link>
                    </div>

                    {/* Marrakech - Center-South (Imperial City) */}
                    <div className="absolute bottom-20 left-1/3">
                      <Link href="/dashboard/city/marrakech">
                        <div className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg shadow-lg cursor-pointer transition-all">
                          <MapPin className="h-4 w-4 mx-auto mb-1" />
                          <div className="text-sm font-bold">Marrakech</div>
                          <div className="text-xs">45K places</div>
                          <div className="text-xs bg-yellow-800 rounded px-1 mt-1">Risque Moyen</div>
                        </div>
                      </Link>
                    </div>

                    {/* Agadir - South-West Coast (Beach Resort) */}
                    <div className="absolute bottom-8 left-1/5">
                      <Link href="/dashboard/city/agadir">
                        <div className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-lg shadow-lg cursor-pointer transition-all">
                          <MapPin className="h-4 w-4 mx-auto mb-1" />
                          <div className="text-sm font-bold">Agadir</div>
                          <div className="text-xs">46K places</div>
                          <div className="text-xs bg-green-800 rounded px-1 mt-1">Risque Faible</div>
                        </div>
                      </Link>
                    </div>

                    {/* Geographic features labels */}
                    <div className="absolute top-2 left-2 text-xs text-blue-800 dark:text-blue-200 font-medium">
                      Détroit de Gibraltar
                    </div>
                    <div className="absolute top-2 right-2 text-xs text-brown-800 dark:text-brown-200 font-medium">
                      Atlas
                    </div>
                    <div className="absolute bottom-2 right-2 text-xs text-yellow-800 dark:text-yellow-200 font-medium">
                      Sahara
                    </div>
                    <div className="absolute bottom-2 left-2 text-xs text-blue-800 dark:text-blue-200 font-medium">
                      Océan Atlantique
                    </div>
                  </div>

                  {/* Enhanced legend */}
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-600 rounded"></div>
                      <span>Risque Faible (3 villes)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                      <span>Risque Moyen (3 villes)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      <span>Capitale Économique</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-600 rounded"></div>
                      <span>Villes Impériales</span>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Cliquez sur une ville pour accéder à ses analyses détaillées et cartes spécifiques
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white"
                      >
                        Analyse Globale
                      </Button>
                      <Button size="sm" variant="outline" className="bg-transparent">
                        Rapport Sécurité
                      </Button>
                      <Button size="sm" variant="outline" className="bg-transparent">
                        Coordination Nationale
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparaison des villes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Comparaison des Villes Hôtes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Ville</th>
                    <th className="text-center p-2">Capacité</th>
                    <th className="text-center p-2">Risque Global</th>
                    <th className="text-center p-2">Criminalité</th>
                    <th className="text-center p-2">Pollution</th>
                    <th className="text-center p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cityComparison.map((city, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-2 font-medium">{city.name}</td>
                      <td className="p-2 text-center">{city.capacity.toLocaleString()}</td>
                      <td className="p-2 text-center">
                        <Badge
                          variant="outline"
                          className={
                            city.risk === "Faible"
                              ? "text-green-600 border-green-600"
                              : city.risk === "Moyen"
                                ? "text-yellow-600 border-yellow-600"
                                : "text-red-600 border-red-600"
                          }
                        >
                          {city.risk}
                        </Badge>
                      </td>
                      <td className="p-2 text-center">{city.criminalite}</td>
                      <td className="p-2 text-center">{city.pollution}</td>
                      <td className="p-2 text-center">
                        <Link href={`/dashboard/city/${city.name.toLowerCase()}`}>
                          <Button size="sm" variant="outline">
                            Voir détails
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

        {/* Alertes et recommandations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertes et Recommandations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                      Surveillance renforcée recommandée
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Les villes de Casablanca, Marrakech et Tanger nécessitent une attention particulière en raison de
                      leurs indices de risque moyens.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200">Points forts identifiés</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Rabat, Fès et Agadir présentent d'excellents niveaux de sécurité et peuvent servir de modèles pour
                      les autres villes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <CommentSection
            title="Commentaires sur l'analyse nationale"
            placeholder="Partagez vos observations sur la coordination nationale, les analyses globales ou les recommandations pour Morocco 2030..."
            context="morocco"
          />
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}



