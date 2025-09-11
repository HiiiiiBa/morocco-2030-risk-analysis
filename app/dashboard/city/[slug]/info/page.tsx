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
  Info,
  Shield,
  TrendingUp,
  ArrowLeft,
  Clock,
  Users,
  AlertTriangle,
  Star,
  Phone,
  Wifi,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

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

export default function InfoPage() {
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
                <Info className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Informations - {city.name}</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Données détaillées et analyses</p>
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Informations détaillées - {city.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Analyses approfondies, statistiques et données complètes pour {city.name}
          </p>
        </div>

        {/* Indicateurs de sécurité */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Analyse de Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Indice de Criminalité</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-600">{city.criminalite}/100</span>
                    <Badge variant="outline" className={city.criminalite < 30 ? "text-green-600" : city.criminalite < 50 ? "text-yellow-600" : "text-red-600"}>
                      {city.criminalite < 30 ? "Faible" : city.criminalite < 50 ? "Moyen" : "Élevé"}
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: `${city.criminalite}%` }}></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Sécurité Générale</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-600">{100 - city.criminalite}/100</span>
                    <Badge variant="outline" className="text-green-600">Bon</Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${100 - city.criminalite}%` }}></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Sécurité Routière</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600">75/100</span>
                    <Badge variant="outline" className="text-green-600">Bon</Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Infrastructure & Environnement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Score Infrastructure</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-600">{city.infrastructure}/5</span>
                    <Badge variant="outline" className="text-green-600">Bon</Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(city.infrastructure / 5) * 100}%` }}></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Indice de Pollution</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600">{city.pollution}/100</span>
                    <Badge variant="outline" className={city.pollution < 40 ? "text-green-600" : city.pollution < 60 ? "text-yellow-600" : "text-red-600"}>
                      {city.pollution < 40 ? "Faible" : city.pollution < 60 ? "Moyen" : "Élevé"}
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${city.pollution}%` }}></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Qualité de l'Air</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-600">68/100</span>
                    <Badge variant="outline" className="text-green-600">Bon</Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "68%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informations du stade */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-red-600" />
              Informations du Stade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">{city.stadium}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Capacité</span>
                    <span className="font-bold text-red-600">{city.capacity} places</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type de terrain</span>
                    <span className="text-gray-600">Pelouse naturelle</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Éclairage</span>
                    <span className="text-gray-600">LED haute performance</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Parking</span>
                    <span className="text-gray-600">5 000 places</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Équipements</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-green-600" />
                    <span>WiFi gratuit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span>Accessibilité PMR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-purple-600" />
                    <span>Points de recharge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span>Restaurants & bars</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Informations spécifiques à la ville */}
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Attractions et Culture à {city.name}</h4>
              <div className="text-sm text-green-700 dark:text-green-300">
                {city.slug === "casablanca" && (
                  <p>• Mosquée Hassan II : Plus grande mosquée d'Afrique<br/>
                  • Corniche : Front de mer animé<br/>
                  • Place Mohammed V : Centre administratif<br/>
                  • Marché Central : Souk traditionnel</p>
                )}
                {city.slug === "rabat" && (
                  <p>• Kasbah des Oudayas : Forteresse historique<br/>
                  • Tour Hassan : Minaret inachevé du 12e siècle<br/>
                  • Mausolée Mohammed V : Tombeau royal<br/>
                  • Chellah : Site archéologique romain</p>
                )}
                {city.slug === "fes" && (
                  <p>• Médina de Fès : Patrimoine mondial UNESCO<br/>
                  • Université Al Quaraouiyine : Plus ancienne université du monde<br/>
                  • Tanneries : Ateliers de cuir traditionnels<br/>
                  • Palais Royal : Résidence du roi</p>
                )}
                {city.slug === "agadir" && (
                  <p>• Plage d'Agadir : 9km de sable fin<br/>
                  • Kasbah d'Agadir : Ruines historiques<br/>
                  • Souk El Had : Marché traditionnel<br/>
                  • Vallée du Paradis : Oasis naturelle</p>
                )}
                {city.slug === "marrakech" && (
                  <p>• Place Jemaa el-Fnaa : Cœur de la médina<br/>
                  • Palais Bahia : Architecture andalouse<br/>
                  • Jardin Majorelle : Oasis de Yves Saint Laurent<br/>
                  • Souk Semmarine : Marché aux épices</p>
                )}
                {city.slug === "tanger" && (
                  <p>• Médina de Tanger : Quartier historique<br/>
                  • Cap Spartel : Phare et grottes d'Hercule<br/>
                  • Grottes d'Hercule : Légende mythologique<br/>
                  • Place de France : Centre moderne</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations pratiques spécifiques */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Sécurité et Santé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Niveau de risque</span>
                  <Badge variant="outline" className={city.risk === "Faible" ? "text-green-600" : city.risk === "Moyen" ? "text-yellow-600" : "text-red-600"}>
                    {city.risk}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {city.slug === "casablanca" && (
                    <p>• Vigilance recommandée dans les zones touristiques<br/>
                    • Éviter les quartiers isolés la nuit<br/>
                    • Garder ses objets de valeur en sécurité</p>
                  )}
                  {city.slug === "rabat" && (
                    <p>• Zone sécurisée, circulation libre<br/>
                    • Présence policière renforcée<br/>
                    • Accès facilité aux monuments</p>
                  )}
                  {city.slug === "fes" && (
                    <p>• Vigilance dans la médina<br/>
                    • Accompagnement recommandé pour les touristes<br/>
                    • Respecter les coutumes locales</p>
                  )}
                  {city.slug === "agadir" && (
                    <p>• Zone très sécurisée<br/>
                    • Surveillance renforcée des plages<br/>
                    • Accès libre aux attractions</p>
                  )}
                  {city.slug === "marrakech" && (
                    <p>• Vigilance dans les souks<br/>
                    • Négociation des prix recommandée<br/>
                    • Respecter les traditions</p>
                  )}
                  {city.slug === "tanger" && (
                    <p>• Vigilance dans la médina<br/>
                    • Éviter les zones portuaires isolées<br/>
                    • Accompagnement recommandé</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                Contacts d'Urgence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Police</span>
                  <span className="font-mono text-red-600">19</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pompiers</span>
                  <span className="font-mono text-red-600">15</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Samu</span>
                  <span className="font-mono text-red-600">141</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>• Gendarmerie : 177<br/>
                  • Consulat France : +212 5 37 26 07 00<br/>
                  • Hôpital principal : {city.name} Central Hospital</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contacts d'urgence */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-red-600" />
                Contacts d'Urgence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Police</span>
                <span className="font-mono text-red-600">19</span>
              </div>
              <div className="flex justify-between">
                <span>Pompiers</span>
                <span className="font-mono text-red-600">15</span>
              </div>
              <div className="flex justify-between">
                <span>Samu</span>
                <span className="font-mono text-red-600">141</span>
              </div>
              <div className="flex justify-between">
                <span>Gendarmerie</span>
                <span className="font-mono text-red-600">177</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                * Numéros d'urgence disponibles 24h/24
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Recommandations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p>• Évitez les zones isolées la nuit</p>
                <p>• Gardez vos objets de valeur en sécurité</p>
                <p>• Respectez les consignes de sécurité</p>
                <p>• Ayez toujours une pièce d'identité</p>
                <p>• Informez-vous sur les zones à éviter</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}