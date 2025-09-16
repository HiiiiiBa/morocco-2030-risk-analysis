"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Users, Calendar, Car, Train, Plane, Building, Shield, Trophy, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import { ThemeToggle } from "@/components/theme-toggle"
import AuthModal from "@/components/auth-modal"

interface CityData {
  name: string
  stadium: string
  capacity: string
  netCapacity: string
  risk: string
  description: string
  location: string
  accessibility: {
    highways: string[]
    railway: string
    airport: string
    travelTimes: {
      casablanca: string
      rabat: string
      airport: string
    }
  }
  facilities: {
    vvipArea: string
    vipArea: string
    indoor: string
    outdoor: string
    skyboxSeats: string
    mixedZone: string
    wheelchairSeats: string
    easyAccessSeats: string
    accessibleToilets: string
    accessibleParking: string
  }
  images: string[]
  features: string[]
}

const citiesData: Record<string, CityData> = {
  casablanca: {
    name: "Casablanca",
    stadium: "Grand Stade Hassan II",
    capacity: "115 000 places brutes",
    netCapacity: "108 800 places nettes",
    risk: "Moyen",
    description: "Ce stade de 115.000 places s'inscrira dans un complexe multidisciplinaire, au sein d'un vaste programme d'aménagement urbain régional qui comprendra un stade d'athlétisme de 25.000 places, une piscine olympique, un centre de congrès et d'exposition, un centre commercial, un parc et un hôtel ; ce qui en fera un lieu de sport et de divertissement complet.",
    location: "Situé à Benslimane dans la région de Casablanca-Settat, à mi-chemin entre Casablanca et Rabat",
    accessibility: {
      highways: ["R313", "A1", "N1"],
      railway: "Gare du futur Grand Stade Hassan II avec RER et train Al Boraq",
      airport: "Aéroport Mohammed V de Casablanca",
      travelTimes: {
        casablanca: "15 minutes",
        rabat: "20 minutes",
        airport: "20 minutes"
      }
    },
    facilities: {
      vvipArea: "2,228 m²",
      vipArea: "6,091 m²",
      indoor: "22,494 m²",
      outdoor: "90,600 m²",
      skyboxSeats: "737 m²",
      mixedZone: "548 m²",
      wheelchairSeats: "426",
      easyAccessSeats: "99",
      accessibleToilets: "325",
      accessibleParking: "2,533 places"
    },
    images: [
      "/image/casa1.png",
      "/image/casa2.png",
      "/image/casa3.png",
      "/image/casa4.png",
    ],
    features: [
      "Complexe multidisciplinaire complet",
      "Stade d'athlétisme de 25.000 places",
      "Piscine olympique",
      "Centre de congrès et d'exposition",
      "Centre commercial intégré",
      "Parc et hôtel"
    ]
  },
  rabat: {
    name: "Rabat",
    stadium: "Stade du Prince Moulay-Abdallah",
    capacity: "68 000 places",
    netCapacity: "65 000 places nettes",
    risk: "Faible",
    description: "Le Stade du Prince Moulay-Abdallah est un stade moderne situé dans la capitale du Maroc. Il bénéficie d'une position stratégique et d'excellentes infrastructures de transport.",
    location: "Situé au cœur de Rabat, capitale administrative du Royaume du Maroc",
    accessibility: {
      highways: ["A1", "N1", "R410"],
      railway: "Gare de Rabat-Ville avec connexions TGV Al Boraq",
      airport: "Aéroport Rabat-Salé",
      travelTimes: {
        casablanca: "45 minutes",
        rabat: "Centre-ville",
        airport: "15 minutes"
      }
    },
    facilities: {
      vvipArea: "1,800 m²",
      vipArea: "4,500 m²",
      indoor: "18,000 m²",
      outdoor: "75,000 m²",
      skyboxSeats: "600 m²",
      mixedZone: "450 m²",
      wheelchairSeats: "340",
      easyAccessSeats: "80",
      accessibleToilets: "280",
      accessibleParking: "2,000 places"
    },
    images: [
      "/image/rabat.png",
      "/image/rabat2.png",
      "/image/rabat3.png",
      "/image/rabat4.png",
    ],
    features: [
      "Stade de la capitale",
      "Architecture moderne",
      "Excellente accessibilité",
      "Infrastructures gouvernementales",
      "Centre historique UNESCO",
      "Facilités diplomatiques"
    ]
  },
  fes: {
    name: "Fès",
    stadium: "Stade de Fès",
    capacity: "55 000 places",
    netCapacity: "52 000 places nettes",
    risk: "Moyen",
    description: "Le Stade de Fès combine tradition et modernité dans la ville impériale. Il offre une expérience unique aux visiteurs avec sa proximité des sites historiques.",
    location: "Situé dans la ville impériale de Fès, au cœur du Maroc",
    accessibility: {
      highways: ["A2", "N8", "R503"],
      railway: "Gare de Fès avec connexions nationales",
      airport: "Aéroport Fès-Saïs",
      travelTimes: {
        casablanca: "3h30",
        rabat: "2h30",
        airport: "25 minutes"
      }
    },
    facilities: {
      vvipArea: "1,500 m²",
      vipArea: "3,800 m²",
      indoor: "15,500 m²",
      outdoor: "65,000 m²",
      skyboxSeats: "500 m²",
      mixedZone: "380 m²",
      wheelchairSeats: "275",
      easyAccessSeats: "65",
      accessibleToilets: "220",
      accessibleParking: "1,650 places"
    },
    images: [
      "/image/fes1.png",
      "/image/fes2.png",
      "/image/fes3.png",
      "/image/fes4.png",
    ],
    features: [
      "Ville impériale historique",
      "Médina UNESCO",
      "Artisanat traditionnel",
      "Université Al Quaraouiyine",
      "Architecture islamique",
      "Centre culturel"
    ]
  },
  marrakech: {
    name: "Marrakech",
    stadium: "Stade de Marrakech",
    capacity: "45 000 places",
    netCapacity: "42 500 places nettes",
    risk: "Faible",
    description: "Le Stade de Marrakech offre une expérience unique dans la ville rouge, combinant sport moderne et patrimoine historique exceptionnel.",
    location: "Situé dans la ville rouge de Marrakech, porte du Sud marocain",
    accessibility: {
      highways: ["A7", "N9", "R210"],
      railway: "Gare de Marrakech avec TGV Al Boraq",
      airport: "Aéroport Marrakech Menara",
      travelTimes: {
        casablanca: "2h30",
        rabat: "3h00",
        airport: "20 minutes"
      }
    },
    facilities: {
      vvipArea: "1,350 m²",
      vipArea: "3,200 m²",
      indoor: "13,500 m²",
      outdoor: "55,000 m²",
      skyboxSeats: "450 m²",
      mixedZone: "320 m²",
      wheelchairSeats: "225",
      easyAccessSeats: "55",
      accessibleToilets: "190",
      accessibleParking: "1,350 places"
    },
    images: [
      "/image/kech1.png",
      "/image/kech2.png",
      "/image/kech3.png",
      "/image/kech4.png",
    ],
    features: [
      "Ville rouge historique",
      "Place Jemaa el-Fna",
      "Palais et jardins",
      "Montagnes de l'Atlas",
      "Destination touristique",
      "Artisanat local"
    ]
  },
  agadir: {
    name: "Agadir",
    stadium: "Stade Adrar",
    capacity: "46 000 places",
    netCapacity: "43 500 places nettes",
    risk: "Faible",
    description: "Le Stade Adrar d'Agadir bénéficie d'un climat exceptionnel et d'une position stratégique sur la côte atlantique, offrant une expérience balnéaire unique.",
    location: "Situé à Agadir, perle du Sud atlantique marocain",
    accessibility: {
      highways: ["A7", "N1", "R104"],
      railway: "Connexion routière (projet ferroviaire en cours)",
      airport: "Aéroport Agadir Al Massira",
      travelTimes: {
        casablanca: "4h30",
        rabat: "5h00",
        airport: "30 minutes"
      }
    },
    facilities: {
      vvipArea: "1,380 m²",
      vipArea: "3,300 m²",
      indoor: "13,800 m²",
      outdoor: "56,000 m²",
      skyboxSeats: "460 m²",
      mixedZone: "330 m²",
      wheelchairSeats: "230",
      easyAccessSeats: "57",
      accessibleToilets: "195",
      accessibleParking: "1,380 places"
    },
    images: [
      "/image/agadir1.png",
      "/image/agadir2.png",
      "/image/agadir3.png",
      "/image/agadir4.png",
    ],
    features: [
      "Station balnéaire moderne",
      "Climat subtropical",
      "Plages atlantiques",
      "Marina et port",
      "Golf et loisirs",
      "Porte du Sahara"
    ]
  },
  tanger: {
    name: "Tanger",
    stadium: "Stade Ibn-Batouta",
    capacity: "76 000 places",
    netCapacity: "72 000 places nettes",
    risk: "Moyen",
    description: "Le Stade Ibn-Batouta de Tanger offre une position unique entre deux continents et deux mers, symbolisant l'ouverture du Maroc sur le monde.",
    location: "Situé à Tanger, porte de l'Afrique sur l'Europe",
    accessibility: {
      highways: ["A1", "A4", "N1"],
      railway: "Gare Tanger-Ville avec TGV Al Boraq",
      airport: "Aéroport Tanger Ibn Battouta",
      travelTimes: {
        casablanca: "4h00",
        rabat: "3h30",
        airport: "25 minutes"
      }
    },
    facilities: {
      vvipArea: "2,100 m²",
      vipArea: "5,500 m²",
      indoor: "20,000 m²",
      outdoor: "85,000 m²",
      skyboxSeats: "680 m²",
      mixedZone: "500 m²",
      wheelchairSeats: "380",
      easyAccessSeats: "90",
      accessibleToilets: "300",
      accessibleParking: "2,280 places"
    },
    images: [
      "/image/tanger1.png",
      "/image/tanger2.png",
      "/image/tanger3.png",
      "/image/tanger4.png",
    ],
    features: [
      "Détroit de Gibraltar",
      "Port Tanger Med",
      "Zone franche industrielle",
      "Connexion Europe-Afrique",
      "Histoire internationale",
      "Développement économique"
    ]
  }
}

export default function CityPage({ params }: { params: { slug: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [city, setCity] = useState<CityData | null>(null)
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: "login" | "register" | "forgot-password" | "reset-password" }>({
    isOpen: false,
    mode: "login",
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleAuthRequired = (mode: "login" | "register" = "login") => {
    console.log("🔐 Ouverture du modal d'authentification:", mode)
    setAuthModal({ isOpen: true, mode })
  }

  useEffect(() => {
    const cityData = citiesData[params.slug]
    if (cityData) {
      setCity(cityData)
    }
  }, [params.slug])

  if (!city) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ville non trouvée</h1>
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % city.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + city.images.length) % city.images.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
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
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                <Button
                  onClick={() => handleAuthRequired("login")}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                >
                  Connexion
                </Button>
                <Button
                  onClick={() => handleAuthRequired("register")}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                >
                  Inscription
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="h-9 w-9 px-0"
                >
                  {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </div>

              <ThemeToggle />
            </div>
          </div>
        </div>
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t dark:border-gray-700">
            <nav className="flex flex-col space-y-4 pt-4">
              <Link href="/" className="text-left text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                Accueil
              </Link>
              <Link href="/#cities" className="text-left text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                Villes hôtes
              </Link>
              <Link href="/#analysis" className="text-left text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                Analyses
              </Link>

              <div className="flex flex-col space-y-2 pt-2">
                <Button
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 bg-transparent justify-start"
                  onClick={() => {
                    setAuthModal({ isOpen: true, mode: "login" })
                    setMobileMenuOpen(false)
                  }}
                >
                  Connexion
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 justify-start"
                  onClick={() => {
                    setAuthModal({ isOpen: true, mode: "register" })
                    setMobileMenuOpen(false)
                  }}
                >
                  Inscription
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section with Image Carousel */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Carousel */}
            <div className="relative">
              <div className="relative h-96 rounded-xl overflow-hidden">
                <Image
                  src={city.images[currentImageIndex] || "/placeholder.svg"}
                  alt={`${city.name} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-2 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-2 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {city.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex
                          ? "bg-white"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* City Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{city.name}</h1>
                  <Badge
                    variant={city.risk === "Faible" ? "default" : "secondary"}
                    className={
                      city.risk === "Faible"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    }
                  >
                    Risque {city.risk}
                  </Badge>
                </div>
                <h2 className="text-2xl font-semibold text-red-600 mb-2">{city.stadium}</h2>
                <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    <span>{city.capacity}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>Capacité nette: {city.netCapacity}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {city.description}
              </p>

              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-red-600" />
                  Localisation
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{city.location}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Accessibilité et Transport</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Highways */}
            <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <Car className="h-6 w-6 mr-2" />
                  Autoroutes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {city.accessibility.highways.map((highway, index) => (
                    <Badge key={index} variant="outline" className="mr-2">
                      {highway}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Railway */}
            <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Train className="h-6 w-6 mr-2" />
                  Transport Ferroviaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {city.accessibility.railway}
                </p>
              </CardContent>
            </Card>

            {/* Airport */}
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Plane className="h-6 w-6 mr-2" />
                  Aéroport
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {city.accessibility.airport}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Travel Times */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">Temps de Trajet</h3>
            <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{city.accessibility.travelTimes.casablanca}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">vers Casablanca</div>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{city.accessibility.travelTimes.rabat}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">vers Rabat</div>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{city.accessibility.travelTimes.airport}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">vers l'aéroport</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stadium Facilities */}
      <section className="py-16 px-4 bg-gradient-to-r from-red-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Installations du Stade</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Areas */}
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-red-600">Espaces VIP</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Zone VVIP:</span>
                  <span className="font-semibold">{city.facilities.vvipArea}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Zone VIP:</span>
                  <span className="font-semibold">{city.facilities.vipArea}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Skybox:</span>
                  <span className="font-semibold">{city.facilities.skyboxSeats}</span>
                </div>
              </CardContent>
            </Card>

            {/* Spaces */}
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Espaces</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Intérieur:</span>
                  <span className="font-semibold">{city.facilities.indoor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Extérieur:</span>
                  <span className="font-semibold">{city.facilities.outdoor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Zone mixte:</span>
                  <span className="font-semibold">{city.facilities.mixedZone}</span>
                </div>
              </CardContent>
            </Card>

            {/* Accessibility */}
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-blue-600">Accessibilité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fauteuils roulants:</span>
                  <span className="font-semibold">{city.facilities.wheelchairSeats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Accès facile:</span>
                  <span className="font-semibold">{city.facilities.easyAccessSeats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Toilettes:</span>
                  <span className="font-semibold">{city.facilities.accessibleToilets}</span>
                </div>
              </CardContent>
            </Card>

            {/* Parking */}
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-purple-600">Stationnement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Places accessibles:</span>
                  <span className="font-semibold">{city.facilities.accessibleParking}</span>
                </div>
                <div className="flex items-center mt-4">
                  <Shield className="h-4 w-4 mr-2 text-green-600" />
                  <span className="text-sm text-green-600">Sécurisé 24h/24</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* City Features */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Caractéristiques de la Ville</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {city.features.map((feature, index) => (
              <Card key={index} className="border-0 bg-gradient-to-br from-red-50 to-green-50 dark:from-red-900/10 dark:to-green-900/10 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Building className="h-8 w-8 mx-auto mb-3 text-red-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{feature}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-green-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Découvrez plus sur {city.name}</h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Explorez les analyses détaillées et les rapports complets pour cette ville hôte
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3"
              onClick={() => handleAuthRequired("login")}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Accéder au dashboard
            </Button>
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-3 bg-transparent"
              >
                <ArrowLeft className="mr-2 h-5 w-4" />
                Retour aux villes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="h-6 w-6 text-red-500" />
                <span className="text-xl font-bold">Morocco 2030</span>
              </div>
              <p className="text-gray-400">Analyse des risques pour les villes marocaines de la Coupe du Monde 2030</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link href="/#cities" className="hover:text-white transition-colors">
                    Villes hôtes
                  </Link>
                </li>
                <li>
                  <Link href="/#analysis" className="hover:text-white transition-colors">
                    Analyses
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Ville Actuelle</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="text-white font-semibold">{city.name}</li>
                <li>{city.stadium}</li>
                <li>{city.capacity}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Morocco 2030 Risk Analysis. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        mode={authModal.mode}
        onModeChange={(mode) => setAuthModal({ ...authModal, mode })}
      />
    </div>
  )
}



