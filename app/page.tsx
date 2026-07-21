"use client"

import { API_URL } from "@/lib/api"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Shield, TrendingUp, Users, Calendar, Trophy, AlertTriangle, Menu, X, Info } from 'lucide-react'
import AuthModal from "@/components/auth-modal"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: "login" | "register" | "forgot-password" | "reset-password" }>({
    isOpen: false,
    mode: "login",
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken')
      if (token) {
        try {
          // Vérifier si le token est valide
          const response = await fetch(`${API_URL}/user`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            console.log("🔍 Utilisateur déjà connecté, redirection vers /dashboard...")
            window.location.href = "/dashboard"
            return
          } else {
            // Token invalide, le supprimer
            localStorage.removeItem('authToken')
          }
        } catch (error) {
          console.error("Erreur lors de la vérification du token:", error)
          localStorage.removeItem('authToken')
        }
      }
      setIsCheckingAuth(false)
    }
    
    checkAuthStatus()
  }, [])

  const moroccanCities = [
    {
      name: "Casablanca",
      stadium: "Stade Hassan-II",
      capacity: "115 000 places",
      risk: "Moyen",
      image: "/image/casa.png",
      slug: "casablanca"
    },
    {
      name: "Rabat",
      stadium: "Stade du Prince Moulay-Abdallah",
      capacity: "68 000",
      risk: "Faible",
      image: "/image/rabat.png",
      slug: "rabat"
    },
    {
      name: "Fès",
      stadium: "Stade de Fès",
      capacity: "55 000",
      risk: "Moyen",
      image: "/image/fes.png",
      slug: "fes"
    },
    {
      name: "Marrakech",
      stadium: "Stade de Marrakech",
      capacity: "45,000",
      risk: "Moyen",
      image: "/image/kech.png",
      slug: "marrakech"
    },
    {
      name: "Agadir",
      stadium: "Stade Adrar",
      capacity: "46 000",
      risk: "Faible",
      image: "/image/agadir.png",
      slug: "agadir"
    },
    {
      name: "Tanger",
      stadium: "Stade Ibn-Batouta",
      capacity: "76 000",
      risk: "Moyen",
      image: "/image/tanger.png",
      slug: "tanger"
    },
  ]

  const riskFactors = [
    { icon: Users, title: "Capacité d'accueil", description: "Analyse de la capacité " },
    { icon: Shield, title: "Sécurité", description: "Évaluation des mesures de sécurité " },
    { icon: TrendingUp, title: "Infrastructure", description: "État des routes, transports..." },
    { icon: AlertTriangle, title: "Risques naturels", description: "Analyse des risques climatiques" },
  ]

  const handleAuthRequired = (mode: "login" | "register" = "login") => {
    console.log("🔐 Ouverture du modal d'authentification:", mode)
    setAuthModal({ isOpen: true, mode })
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  // Afficher un loader pendant la vérification d'authentification
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Vérification de l'authentification...</p>
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
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Morocco 2030</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Analyse des Risques</p>
              </div>
            </div>

            {/* Navigation desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                À propos
              </button>
              <button
                onClick={() => scrollToSection("cities")}
                className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                Villes
              </button>
              <button
                onClick={() => scrollToSection("analysis")}
                className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                Fonctionnalités
              </button>
              <ThemeToggle />
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
            </nav>

            {/* Menu mobile */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Menu mobile overlay */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-t shadow-lg">
              <div className="px-4 py-4 space-y-4">
                <button
                  onClick={() => scrollToSection("about")}
                  className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  À propos
                </button>
                <button
                  onClick={() => scrollToSection("cities")}
                  className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  Villes
                </button>
                <button
                  onClick={() => scrollToSection("analysis")}
                  className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  Fonctionnalités
                </button>
                <div className="pt-4 space-y-2">
                  <Button
                    onClick={() => handleAuthRequired("login")}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                  >
                    Connexion
                  </Button>
                  <Button
                    onClick={() => handleAuthRequired("register")}
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                  >
                    Inscription
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="about" className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                Morocco 2030
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              Analyse complète des risques pour la Coupe du Monde 2030 au Maroc
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => handleAuthRequired("login")}
                size="lg"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 text-lg"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Accéder au dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">6</div>
              <div className="text-gray-600 dark:text-gray-400">Villes Marocaines</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">3</div>
              <div className="text-gray-600 dark:text-gray-400">Pays Organisateurs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">48</div>
              <div className="text-gray-600 dark:text-gray-400">Équipes Participantes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">104</div>
              <div className="text-gray-600 dark:text-gray-400">Matchs Prévus</div>
            </div>
          </div>
        </div>
      </section>

      {/* Moroccan Cities Section */}
      <section
        id="cities"
        className="py-20 px-4 bg-gradient-to-r from-red-50 to-green-50 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Villes Marocaines Hôtes</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Découvrez les six villes marocaines qui accueilleront les matchs de la Coupe du Monde 2030
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moroccanCities.map((city, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              >
              <Image
                  src={city.image || "/placeholder.svg"}
                  alt={`Stade de ${city.name}`}
                  width={300}
                  height={200}
                  className="rounded-t-lg object-cover w-full h-48"
                />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{city.name}</CardTitle>
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
                  <CardDescription className="text-gray-600 dark:text-gray-400">{city.stadium}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-1" />
                      {city.capacity} places
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950 bg-transparent flex-1"
                      onClick={() => handleAuthRequired("login")}
                    >
                      Analyser
                    </Button>
                    <Link href={`/city/${city.slug}`} className="flex-1">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white w-full"
                      >
                        <Info className="h-4 w-4 mr-1" />
                        Plus d'infos
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Analysis Section */}
      <section id="analysis" className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Analyse des Risques</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Notre méthodologie d'analyse couvre tous les aspects critiques pour le succès de l'événement
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {riskFactors.map((factor, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-green-100 dark:from-red-900 dark:to-green-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <factor.icon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{factor.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-600 to-green-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Prêt à analyser les risques ?</h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Accédez à nos analyses détaillées et rapports complets pour chaque ville marocaine
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3"
              onClick={() => handleAuthRequired("register")}
            >
              <Calendar className="mr-2 h-5 w-5" />
              S'inscrire maintenant
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 dark:bg-black text-white py-12 px-4">
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
              <h3 className="text-lg font-semibold mb-4">Villes</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => handleAuthRequired("login")}
                    className="hover:text-white transition-colors text-left"
                  >
                    Casablanca
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAuthRequired("login")}
                    className="hover:text-white transition-colors text-left"
                  >
                    Rabat
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAuthRequired("login")}
                    className="hover:text-white transition-colors text-left"
                  >
                    Marrakech
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAuthRequired("login")}
                    className="hover:text-white transition-colors text-left"
                  >
                    Fès
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Analyses</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => handleAuthRequired("login")}
                    className="hover:text-white transition-colors text-left"
                  >
                    Sécurité
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAuthRequired("login")}
                    className="hover:text-white transition-colors text-left"
                  >
                    Infrastructure
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAuthRequired("login")}
                    className="hover:text-white transition-colors text-left"
                  >
                    Capacité
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Analyse des Risque Morocco 2030. Tous droits réservés.</p>
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
