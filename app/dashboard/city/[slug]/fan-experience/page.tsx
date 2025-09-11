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
  Heart,
  ArrowLeft,
  Star,
  Users,
  Music,
  Camera,
  Calendar,
  Clock,
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

export default function FanExperiencePage() {
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
                <Heart className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Fan Experience - {city.name}</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ambiance, événements et expérience supporters</p>
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Fan Experience - {city.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Découvrez l'ambiance unique de {city.name} et les événements organisés pour les supporters
          </p>
        </div>

        {/* Fan Zones */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Fan Zones Principales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {city.slug === "casablanca" && (
                  <>
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div>
                        <span className="font-medium text-sm">Place Mohammed V</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Centre administratif</p>
                      </div>
                      <Badge variant="outline" className="text-green-600">Ouvert</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div>
                        <span className="font-medium text-sm">Corniche Ain Diab</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Front de mer</p>
                      </div>
                      <Badge variant="outline" className="text-green-600">Ouvert</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div>
                        <span className="font-medium text-sm">Boulevard Zerktouni</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Zone commerciale</p>
                      </div>
                      <Badge variant="outline" className="text-yellow-600">En préparation</Badge>
                    </div>
                  </>
                )}
                {city.slug === "rabat" && (
                  <>
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div>
                        <span className="font-medium text-sm">Place Bouregreg</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Rive du fleuve</p>
                      </div>
                      <Badge variant="outline" className="text-green-600">Ouvert</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div>
                        <span className="font-medium text-sm">Avenue Mohammed V</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Artère principale</p>
                      </div>
                      <Badge variant="outline" className="text-green-600">Ouvert</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div>
                        <span className="font-medium text-sm">Agdal</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Quartier résidentiel</p>
                      </div>
                      <Badge variant="outline" className="text-yellow-600">En préparation</Badge>
                    </div>
                  </>
                )}
                {city.slug === "fes" && (
                  <>
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div>
                        <span className="font-medium text-sm">Place Boujloud</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Porte de la médina</p>
                      </div>
                      <Badge variant="outline" className="text-green-600">Ouvert</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div>
                        <span className="font-medium text-sm">Avenue Hassan II</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Nouvelle ville</p>
                      </div>
                      <Badge variant="outline" className="text-green-600">Ouvert</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div>
                        <span className="font-medium text-sm">Nouvelle Ville</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Centre moderne</p>
                      </div>
                      <Badge variant="outline" className="text-yellow-600">En préparation</Badge>
                    </div>
                  </>
                )}
                {city.slug === "agadir" && (
                  <>
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div>
                        <span className="font-medium text-sm">Plage d'Agadir</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Front de mer</p>
                      </div>
                      <Badge variant="outline" className="text-green-600">Ouvert</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div>
                        <span className="font-medium text-sm">Marina</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Port de plaisance</p>
                      </div>
                      <Badge variant="outline" className="text-green-600">Ouvert</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div>
                        <span className="font-medium text-sm">Boulevard Hassan II</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Centre-ville</p>
                      </div>
                      <Badge variant="outline" className="text-yellow-600">En préparation</Badge>
                    </div>
                  </>
                )}
                {city.slug === "marrakech" && (
                  <>
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div>
                        <span className="font-medium text-sm">Place Jemaa el-Fnaa</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Cœur de la médina</p>
                      </div>
                      <Badge variant="outline" className="text-green-600">Ouvert</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div>
                        <span className="font-medium text-sm">Gueliz</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Nouvelle ville</p>
                      </div>
                      <Badge variant="outline" className="text-green-600">Ouvert</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div>
                        <span className="font-medium text-sm">Hivernage</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Quartier hôtelier</p>
                      </div>
                      <Badge variant="outline" className="text-yellow-600">En préparation</Badge>
                    </div>
                  </>
                )}
                {city.slug === "tanger" && (
                  <>
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div>
                        <span className="font-medium text-sm">Place de France</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Centre moderne</p>
                      </div>
                      <Badge variant="outline" className="text-green-600">Ouvert</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div>
                        <span className="font-medium text-sm">Boulevard Pasteur</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Artère principale</p>
                      </div>
                      <Badge variant="outline" className="text-green-600">Ouvert</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div>
                        <span className="font-medium text-sm">Malabata</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Zone résidentielle</p>
                      </div>
                      <Badge variant="outline" className="text-yellow-600">En préparation</Badge>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Événements à Venir
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <span className="font-medium text-sm">Cérémonie d'ouverture</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">15 juin 2030 - 20h00</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Music className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <span className="font-medium text-sm">Concert de supporters</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">20 juin 2030 - 19h00</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Camera className="h-5 w-5 text-purple-600" />
                  <div className="flex-1">
                    <span className="font-medium text-sm">Exposition photos</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">25 juin 2030 - 10h00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ambiance et Culture */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Ambiance et Culture Locale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Spécialités Culinaires de {city.name}</h4>
                <div className="space-y-2">
                  {city.slug === "casablanca" && (
                    <>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Tajine aux fruits de mer</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Pastilla au poulet</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Thé à la menthe</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Briouates</span>
                      </div>
                    </>
                  )}
                  {city.slug === "rabat" && (
                    <>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Tajine aux pruneaux</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Harira traditionnelle</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Thé à la menthe</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Ghoriba</span>
                      </div>
                    </>
                  )}
                  {city.slug === "fes" && (
                    <>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Tajine aux olives</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">B'stilla fassie</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Thé à la menthe</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Makrout</span>
                      </div>
                    </>
                  )}
                  {city.slug === "agadir" && (
                    <>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Tajine aux légumes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Couscous aux légumes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Thé à la menthe</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Amalou</span>
                      </div>
                    </>
                  )}
                  {city.slug === "marrakech" && (
                    <>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Tajine aux citrons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Tanjia marrakchie</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Thé à la menthe</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Chebakia</span>
                      </div>
                    </>
                  )}
                  {city.slug === "tanger" && (
                    <>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Tajine aux poissons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Couscous aux poissons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Thé à la menthe</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Kaab el ghzal</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Activités Culturelles</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Visite des monuments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Spectacles de musique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Sessions photo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Rencontres locales</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services pour Supporters */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-blue-600" />
                Services Digitaux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p>• WiFi gratuit dans les fan zones</p>
                <p>• App mobile officielle</p>
                <p>• Réseaux sociaux dédiés</p>
                <p>• Streaming en direct</p>
                <p>• Géolocalisation des événements</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                Support Supporters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p>• Hotline 24h/24</p>
                <p>• Points d'information</p>
                <p>• Traduction multilingue</p>
                <p>• Assistance médicale</p>
                <p>• Sécurité renforcée</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Horaires Fan Zones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Lundi - Jeudi</span>
                  <span>18h - 23h</span>
                </div>
                <div className="flex justify-between">
                  <span>Vendredi - Samedi</span>
                  <span>16h - 01h</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimanche</span>
                  <span>14h - 22h</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  * Horaires étendus les jours de match
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Témoignages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600" />
              Témoignages de Supporters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    "L'ambiance à {city.name} est incroyable ! Les fan zones sont parfaitement organisées et l'accueil des locaux est chaleureux."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">- Supporters brésiliens</p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Star className="h-4 w-4 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    "La sécurité est excellente et les transports fonctionnent parfaitement. Une expérience mémorable !"
                  </p>
                  <p className="text-xs text-gray-500 mt-2">- Supporters allemands</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    "La culture marocaine est fascinante. Les événements organisés nous permettent de découvrir le pays."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">- Supporters japonais</p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    "Les fan zones sont très bien équipées et l'organisation est au top. Je recommande vivement !"
                  </p>
                  <p className="text-xs text-gray-500 mt-2">- Supporters français</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}