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
  Bus,
  Train,
  Car,
  Plane,
  ArrowLeft,
  Clock,
  Users,
  Navigation,
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

export default function TransportPage() {
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
                <Bus className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Transport - {city.name}</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Réseau de transport et mobilité</p>
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Transport en {city.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Découvrez les options de transport disponibles pour vous déplacer dans {city.name} pendant la Coupe du Monde 2030
          </p>
        </div>

        {/* Options de transport */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Transport public */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus className="h-5 w-5 text-blue-600" />
                Transport Public
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Bus urbain</span>
                  <Badge variant="outline" className="text-green-600">Disponible</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tramway</span>
                  <Badge variant="outline" className={city.slug === "fes" || city.slug === "agadir" || city.slug === "marrakech" || city.slug === "tanger" ? "text-yellow-600" : "text-green-600"}>
                    {city.slug === "fes" || city.slug === "agadir" || city.slug === "marrakech" || city.slug === "tanger" ? "En projet" : "Disponible"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Taxi</span>
                  <Badge variant="outline" className="text-green-600">Disponible</Badge>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {city.slug === "casablanca" && (
                  <>
                    <p>• Réseau de bus avec 50+ lignes</p>
                    <p>• Fréquence : 5-10 min</p>
                    <p>• Prix : 3-8 MAD</p>
                    <p>• Horaires : 6h-23h</p>
                  </>
                )}
                {city.slug === "rabat" && (
                  <>
                    <p>• Réseau Al Bidaoui</p>
                    <p>• 20+ lignes principales</p>
                    <p>• Prix : 3-5 MAD</p>
                    <p>• Horaires : 5h30-23h30</p>
                  </>
                )}
                {city.slug === "fes" && (
                  <>
                    <p>• Réseau urbain limité</p>
                    <p>• 15 lignes principales</p>
                    <p>• Prix : 4-6 MAD</p>
                    <p>• Horaires : 6h-22h</p>
                  </>
                )}
                {city.slug === "agadir" && (
                  <>
                    <p>• Réseau urbain moderne</p>
                    <p>• 10 lignes principales</p>
                    <p>• Prix : 3 MAD</p>
                    <p>• Horaires : 6h-23h</p>
                  </>
                )}
                {city.slug === "marrakech" && (
                  <>
                    <p>• Réseau urbain en développement</p>
                    <p>• 15 lignes principales</p>
                    <p>• Prix : 4 MAD</p>
                    <p>• Horaires : 6h-22h</p>
                  </>
                )}
                {city.slug === "tanger" && (
                  <>
                    <p>• Réseau urbain</p>
                    <p>• 12 lignes principales</p>
                    <p>• Prix : 3 MAD</p>
                    <p>• Horaires : 6h-23h</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Transport ferroviaire */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Train className="h-5 w-5 text-green-600" />
                Transport Ferroviaire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Train ONCF</span>
                  <Badge variant="outline" className="text-green-600">Disponible</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Al Boraq (TGV)</span>
                  <Badge variant="outline" className="text-green-600">Disponible</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Navette stade</span>
                  <Badge variant="outline" className="text-yellow-600">En projet</Badge>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {city.slug === "casablanca" && (
                  <>
                    <p>• Gares : Casa-Port et Casa-Voyageurs</p>
                    <p>• Al Boraq vers Tanger</p>
                    <p>• Prix : 25-180 MAD</p>
                    <p>• Temps : 30min-3h selon destination</p>
                  </>
                )}
                {city.slug === "rabat" && (
                  <>
                    <p>• Gare Rabat-Ville centrale</p>
                    <p>• Connexions vers toutes les villes</p>
                    <p>• Prix : 15-120 MAD</p>
                    <p>• Temps : 1-4h selon destination</p>
                  </>
                )}
                {city.slug === "fes" && (
                  <>
                    <p>• Gare Fès-Ville</p>
                    <p>• Connexions ONCF</p>
                    <p>• Prix : 20-100 MAD</p>
                    <p>• Temps : 1-3h selon destination</p>
                  </>
                )}
                {city.slug === "agadir" && (
                  <>
                    <p>• Pas de gare ferroviaire</p>
                    <p>• Bus inter-villes</p>
                    <p>• Prix : 30-80 MAD</p>
                    <p>• Temps : 2-5h selon destination</p>
                  </>
                )}
                {city.slug === "marrakech" && (
                  <>
                    <p>• Gare Marrakech</p>
                    <p>• Connexions ONCF</p>
                    <p>• Prix : 25-110 MAD</p>
                    <p>• Temps : 1-4h selon destination</p>
                  </>
                )}
                {city.slug === "tanger" && (
                  <>
                    <p>• Gare Tanger-Ville</p>
                    <p>• Al Boraq vers Casablanca</p>
                    <p>• Prix : 30-200 MAD</p>
                    <p>• Temps : 30min-3h selon destination</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Transport aérien */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-purple-600" />
                Transport Aérien
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Vols domestiques</span>
                  <Badge variant="outline" className="text-green-600">Disponible</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Vols internationaux</span>
                  <Badge variant="outline" className="text-green-600">Disponible</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Navette aéroport</span>
                  <Badge variant="outline" className="text-green-600">Disponible</Badge>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {city.slug === "casablanca" && (
                  <>
                    <p>• Aéroport Mohammed V</p>
                    <p>• 2e plus grand d'Afrique</p>
                    <p>• Vols internationaux</p>
                    <p>• Navette : 30 min vers centre</p>
                  </>
                )}
                {city.slug === "rabat" && (
                  <>
                    <p>• Aéroport Rabat-Salé</p>
                    <p>• Vols domestiques et internationaux</p>
                    <p>• Connexions européennes</p>
                    <p>• Navette : 20 min vers centre</p>
                  </>
                )}
                {city.slug === "fes" && (
                  <>
                    <p>• Aéroport Fès-Saïss</p>
                    <p>• Vols domestiques</p>
                    <p>• Connexions limitées</p>
                    <p>• Navette : 25 min vers centre</p>
                  </>
                )}
                {city.slug === "agadir" && (
                  <>
                    <p>• Aéroport Agadir-Al Massira</p>
                    <p>• 2e aéroport du Maroc</p>
                    <p>• Vols internationaux</p>
                    <p>• Navette : 15 min vers centre</p>
                  </>
                )}
                {city.slug === "marrakech" && (
                  <>
                    <p>• Aéroport Marrakech-Ménara</p>
                    <p>• Vols internationaux</p>
                    <p>• Destination touristique</p>
                    <p>• Navette : 20 min vers centre</p>
                  </>
                )}
                {city.slug === "tanger" && (
                  <>
                    <p>• Aéroport Tanger-Ibn Battouta</p>
                    <p>• Vols internationaux</p>
                    <p>• Connexions européennes</p>
                    <p>• Navette : 25 min vers centre</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plan de transport vers le stade */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-red-600" />
              Accès au Stade {city.stadium}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Depuis le centre-ville</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Bus className="h-4 w-4 text-blue-600" />
                    <span>Ligne principale - 15 min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-gray-600" />
                    <span>Taxi - 10 min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-green-600" />
                    <span>À pied - 25 min</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Depuis l'aéroport</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Bus className="h-4 w-4 text-blue-600" />
                    <span>Navette directe - 30 min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-gray-600" />
                    <span>Taxi - 20 min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Train className="h-4 w-4 text-green-600" />
                    <span>Train + Bus - 45 min</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Informations spécifiques à la ville */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Informations spécifiques à {city.name}</h4>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                {city.slug === "casablanca" && (
                  <p>• Tramway : Ligne 1 et 2, 31 stations, 6h-23h<br/>
                  • Gares : Casa-Port et Casa-Voyageurs<br/>
                  • Aéroport Mohammed V : 2e plus grand d'Afrique</p>
                )}
                {city.slug === "rabat" && (
                  <p>• Tramway : Ligne unique, 23 stations, 5h30-23h30<br/>
                  • Gare Rabat-Ville : Connexions vers toutes les villes<br/>
                  • Aéroport Rabat-Salé : Vols domestiques et internationaux</p>
                )}
                {city.slug === "fes" && (
                  <p>• Transport : Réseau urbain limité, 15 lignes principales<br/>
                  • Taxis : Bleus (petits) et blancs (grands)<br/>
                  • Aéroport Fès-Saïss : Vols domestiques</p>
                )}
                {city.slug === "agadir" && (
                  <p>• Transport : Réseau urbain, 10 lignes, tarif 3 MAD<br/>
                  • Taxis : Tarif fixe 8 MAD<br/>
                  • Aéroport Agadir-Al Massira : 2e aéroport du Maroc</p>
                )}
                {city.slug === "marrakech" && (
                  <p>• Transport : Réseau urbain, 15 lignes, tarif 4 MAD<br/>
                  • Taxis : Rouges, tarifs négociables<br/>
                  • Aéroport Marrakech-Ménara : Vols internationaux</p>
                )}
                {city.slug === "tanger" && (
                  <p>• Transport : Réseau urbain, 12 lignes, tarif 3 MAD<br/>
                  • Gare Tanger-Ville : Al Boraq vers Casablanca<br/>
                  • Aéroport Tanger-Ibn Battouta : Vols internationaux</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cartes interactives pour Rabat */}
        {city.slug === "rabat" && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Cartes Interactives - {city.name}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Carte Tramway */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Train className="h-5 w-5 text-blue-600" />
                    Plan du Tramway
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Consultez le plan détaillé des lignes de tramway de Rabat avec toutes les stations et itinéraires.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-blue-800 dark:text-blue-200">Ligne unique</span>
                        <Badge variant="outline" className="text-blue-600">23 stations</Badge>
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        <p>• Horaires : 5h30 - 23h30</p>
                        <p>• Fréquence : 3-8 minutes</p>
                        <p>• Prix : 6 MAD</p>
                      </div>
                    </div>
                    
                    {/* Image de la carte du tramway */}
                    <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 group relative">
                      <img
                        src="/images/TramRabat.jpg"
                        alt="Plan du tramway de Rabat"
                        className="w-full h-auto max-h-96 object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                        <button
                          onClick={() => window.open('/images/TramRabat.jpg', '_blank')}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          Cliquer pour agrandir
                        </button>
                      </div>
                    </div>
                    
                    <a
                      href="https://www.tram-way.ma/fr/plan-des-lignes/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <Navigation className="h-4 w-4" />
                      Ouvrir dans un nouvel onglet
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Carte Bus */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bus className="h-5 w-5 text-green-600" />
                    Plan des Bus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Découvrez les lignes de bus Al Bidaoui et trouvez les arrêts près de chez vous.
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-800 dark:text-green-200">Réseau Al Bidaoui</span>
                        <Badge variant="outline" className="text-green-600">20+ lignes</Badge>
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        <p>• Horaires : 5h30 - 23h30</p>
                        <p>• Fréquence : 5-10 minutes</p>
                        <p>• Prix : 3-5 MAD</p>
                      </div>
                    </div>
                    
                    {/* Image de la carte des bus */}
                    <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 group relative">
                      <img
                        src="/images/BusRabat.jpg"
                        alt="Carte du réseau d'autobus Rabat-Salé-Temara"
                        className="w-full h-auto max-h-96 object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                        <button
                          onClick={() => window.open('/images/BusRabat.jpg', '_blank')}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          Cliquer pour agrandir
                        </button>
                      </div>
                    </div>
                    
                    <a
                      href="https://www.alsacitybusrst.ma/fr/a-cote-de-moi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <MapPin className="h-4 w-4" />
                      Ouvrir dans un nouvel onglet
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Cartes interactives pour Casablanca */}
        {city.slug === "casablanca" && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Cartes Interactives - {city.name}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Carte Tramway */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Train className="h-5 w-5 text-blue-600" />
                    Plan du Tramway
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Consultez le plan détaillé des lignes de tramway de Casablanca avec toutes les stations et itinéraires.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-blue-800 dark:text-blue-200">Lignes T1, T2</span>
                        <Badge variant="outline" className="text-blue-600">En service</Badge>
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        <p>• Horaires : 5h30 - 23h30</p>
                        <p>• Fréquence : 3-8 minutes</p>
                        <p>• Prix : 6 MAD</p>
                      </div>
                    </div>
                    
                    {/* Image de la carte du tramway */}
                    <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 group relative">
                      <img
                        src="/images/TramCasa.jpg"
                        alt="Plan du tramway de Casablanca"
                        className="w-full h-auto max-h-96 object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                        <button
                          onClick={() => window.open('/images/TramCasa.jpg', '_blank')}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          Cliquer pour agrandir
                        </button>
                      </div>
                    </div>
                    
                    <a
                      href="https://www.casatramway.ma/nos-lignes/carte-reseau"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <Navigation className="h-4 w-4" />
                      Ouvrir dans un nouvel onglet
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Carte Bus */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bus className="h-5 w-5 text-green-600" />
                    Plan des Bus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Découvrez le réseau de bus de Casablanca et trouvez les arrêts près de chez vous.
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-800 dark:text-green-200">Casa Bus</span>
                        <Badge variant="outline" className="text-green-600">Réseau étendu</Badge>
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        <p>• Horaires : 6h00 - 23h00</p>
                        <p>• Fréquence : 5-10 minutes</p>
                        <p>• Prix : 3-8 MAD</p>
                      </div>
                    </div>
                    
                    {/* Image de la carte des bus */}
                    <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 group relative">
                      <img
                        src="/images/BusCasa.jpg"
                        alt="Carte du réseau de bus de Casablanca"
                        className="w-full h-auto max-h-96 object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                        <button
                          onClick={() => window.open('/images/BusCasa.jpg', '_blank')}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          Cliquer pour agrandir
                        </button>
                      </div>
                    </div>
                    
                    <a
                      href="https://www.casabus.ma/en/roulez-avec-nous/plan-du-reseau/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <MapPin className="h-4 w-4" />
                      Ouvrir dans un nouvel onglet
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Cartes interactives pour Agadir */}
        {city.slug === "agadir" && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Cartes Interactives - {city.name}</h3>
            <div className="grid md:grid-cols-1 gap-6">
              {/* Carte Bus */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bus className="h-5 w-5 text-green-600" />
                    Plan du Réseau de Bus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Découvrez le réseau de bus ALSA d'Agadir et trouvez les arrêts près de chez vous.
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-800 dark:text-green-200">ALSA Agadir</span>
                        <Badge variant="outline" className="text-green-600">40+ lignes</Badge>
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        <p>• Lignes urbaines : 30 lignes</p>
                        <p>• Lignes périurbaines : 10 lignes</p>
                        <p>• Correspondances : 4 points principaux</p>
                      </div>
                    </div>
                    
                    {/* Image de la carte des bus */}
                    <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 group relative">
                      <img
                        src="/images/BusAgadir.jpg"
                        alt="Plan du réseau de bus du Grand Agadir"
                        className="w-full h-auto max-h-96 object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                        <button
                          onClick={() => window.open('/images/BusAgadir.jpg', '_blank')}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          Cliquer pour agrandir
                        </button>
                      </div>
                    </div>
                    
                    <a
                      href="https://www.alsa.ma/en/agadir/lines"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <MapPin className="h-4 w-4" />
                      Ouvrir dans un nouvel onglet
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Informations pratiques */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Horaires et Fréquences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Bus urbain</span>
                <span className="text-sm text-gray-600">6h00 - 23h00 (5-10 min)</span>
              </div>
              <div className="flex justify-between">
                <span>Tramway</span>
                <span className="text-sm text-gray-600">5h30 - 23h30 (3-8 min)</span>
              </div>
              <div className="flex justify-between">
                <span>Train ONCF</span>
                <span className="text-sm text-gray-600">5h00 - 23h00 (30-60 min)</span>
              </div>
              <div className="flex justify-between">
                <span>Taxi</span>
                <span className="text-sm text-gray-600">24h/24 (sur appel)</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Tarifs et Paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Ticket bus</span>
                <span className="text-sm text-gray-600">3-5 MAD</span>
              </div>
              <div className="flex justify-between">
                <span>Ticket tramway</span>
                <span className="text-sm text-gray-600">6-8 MAD</span>
              </div>
              <div className="flex justify-between">
                <span>Taxi (course)</span>
                <span className="text-sm text-gray-600">15-50 MAD</span>
              </div>
              <div className="flex justify-between">
                <span>Train (inter-villes)</span>
                <span className="text-sm text-gray-600">15-120 MAD</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                * Paiement en espèces ou par carte bancaire
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}