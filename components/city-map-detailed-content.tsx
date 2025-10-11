"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Navigation,
  MapPin,
  AlertTriangle,
  Shield,
  Users,
  Clock,
} from "lucide-react"
import RabatMap from "@/components/rabat-map"

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

interface CityMapDetailedContentProps {
  city: City
}

export default function CityMapDetailedContent({ city }: CityMapDetailedContentProps) {
  return (
    <div className="space-y-6">
      {/* Carte Interactive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-blue-600" />
            Carte Interactive de {city.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {city.slug === "rabat" ? (
            <RabatMap />
          ) : (
            <div className="bg-gradient-to-br from-blue-100 via-yellow-50 to-orange-100 dark:from-blue-900 dark:via-yellow-900 dark:to-orange-900 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
              {/* Carte SVG personnalisée pour les autres villes */}
              <svg
                viewBox="0 0 400 300"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Fond de la ville */}
                <rect width="400" height="300" fill="#E5E7EB" className="opacity-30" />
                
                {/* Zones spécifiques à chaque ville */}
                {city.slug === "casablanca" && (
                  <>
                    <circle cx="100" cy="80" r="25" fill="#10B981" opacity="0.3" />
                    <text x="100" y="85" textAnchor="middle" className="text-xs fill-green-800">Centre</text>
                    <circle cx="300" cy="120" r="20" fill="#F59E0B" opacity="0.3" />
                    <text x="300" y="125" textAnchor="middle" className="text-xs fill-yellow-800">Corniche</text>
                    <circle cx="200" cy="200" r="30" fill="#EF4444" opacity="0.3" />
                    <text x="200" y="205" textAnchor="middle" className="text-xs fill-red-800">Médina</text>
                  </>
                )}
                {city.slug === "fes" && (
                  <>
                    <circle cx="120" cy="100" r="35" fill="#F59E0B" opacity="0.3" />
                    <text x="120" y="105" textAnchor="middle" className="text-xs fill-yellow-800">Médina</text>
                    <circle cx="280" cy="150" r="25" fill="#10B981" opacity="0.3" />
                    <text x="280" y="155" textAnchor="middle" className="text-xs fill-green-800">Nouvelle Ville</text>
                    <circle cx="200" cy="200" r="20" fill="#F59E0B" opacity="0.3" />
                    <text x="200" y="205" textAnchor="middle" className="text-xs fill-yellow-800">Tanneries</text>
                  </>
                )}
                {city.slug === "agadir" && (
                  <>
                    <circle cx="100" cy="100" r="30" fill="#10B981" opacity="0.3" />
                    <text x="100" y="105" textAnchor="middle" className="text-xs fill-green-800">Plage</text>
                    <circle cx="300" cy="150" r="25" fill="#10B981" opacity="0.3" />
                    <text x="300" y="155" textAnchor="middle" className="text-xs fill-green-800">Marina</text>
                    <circle cx="200" cy="200" r="20" fill="#10B981" opacity="0.3" />
                    <text x="200" y="205" textAnchor="middle" className="text-xs fill-green-800">Centre</text>
                  </>
                )}
                {city.slug === "marrakech" && (
                  <>
                    <circle cx="100" cy="100" r="30" fill="#F59E0B" opacity="0.3" />
                    <text x="100" y="105" textAnchor="middle" className="text-xs fill-yellow-800">Médina</text>
                    <circle cx="300" cy="150" r="25" fill="#10B981" opacity="0.3" />
                    <text x="300" y="155" textAnchor="middle" className="text-xs fill-green-800">Gueliz</text>
                    <circle cx="200" cy="200" r="20" fill="#F59E0B" opacity="0.3" />
                    <text x="200" y="205" textAnchor="middle" className="text-xs fill-yellow-800">Souks</text>
                  </>
                )}
                {city.slug === "tanger" && (
                  <>
                    <circle cx="100" cy="100" r="25" fill="#F59E0B" opacity="0.3" />
                    <text x="100" y="105" textAnchor="middle" className="text-xs fill-yellow-800">Médina</text>
                    <circle cx="300" cy="150" r="30" fill="#10B981" opacity="0.3" />
                    <text x="300" y="155" textAnchor="middle" className="text-xs fill-green-800">Centre</text>
                    <circle cx="200" cy="200" r="20" fill="#F59E0B" opacity="0.3" />
                    <text x="200" y="205" textAnchor="middle" className="text-xs fill-yellow-800">Port</text>
                  </>
                )}
                
                {/* Stade principal */}
                <rect x="180" y="130" width="40" height="30" fill="#DC2626" rx="5" />
                <text x="200" y="150" textAnchor="middle" className="text-xs fill-white font-bold">Stade</text>
                
                {/* Points d'intérêt */}
                <circle cx="100" cy="100" r="5" fill="#3B82F6" />
                <circle cx="300" cy="150" r="5" fill="#8B5CF6" />
                <circle cx="200" cy="200" r="5" fill="#F59E0B" />
                
                {/* Légende */}
                <rect x="10" y="10" width="120" height="80" fill="white" fillOpacity="0.9" rx="5" />
                <text x="20" y="25" className="text-xs font-bold">Zones de {city.name}</text>
                <circle cx="20" cy="40" r="3" fill="#10B981" />
                <text x="30" y="45" className="text-xs">Zone sécurisée</text>
                <circle cx="20" cy="55" r="3" fill="#F59E0B" />
                <text x="30" y="60" className="text-xs">Zone de vigilance</text>
                <circle cx="20" cy="70" r="3" fill="#EF4444" />
                <text x="30" y="75" className="text-xs">Zone à risque</text>
              </svg>
              
              {/* Informations spécifiques à la ville */}
              <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
                <h4 className="font-semibold text-sm mb-2">Points d'Intérêt</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded"></div>
                    <span>Stade {city.stadium}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded"></div>
                    <span>Centre-ville</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded"></div>
                    <span>Zone touristique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-600 rounded"></div>
                    <span>Transport public</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques de sécurité */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Sécurité Générale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {100 - city.criminalite}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Niveau de sécurité
              </div>
              <Badge variant="outline" className="mt-2 text-green-600">
                {city.risk === "Faible" ? "Excellent" : city.risk === "Moyen" ? "Bon" : "Moyen"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Zones Surveillées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {city.slug === "rabat" ? "12" : city.slug === "casablanca" ? "18" : "8"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Points de contrôle
              </div>
              <Badge variant="outline" className="mt-2 text-blue-600">
                Actif 24h/24
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Temps de Réponse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {city.slug === "rabat" ? "3" : city.slug === "casablanca" ? "5" : "4"}min
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Intervention moyenne
              </div>
              <Badge variant="outline" className="mt-2 text-purple-600">
                Très rapide
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zones de risque détaillées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Zones de Risque - {city.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-semibold text-green-800 dark:text-green-200">Zone Sécurisée</span>
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                {city.slug === "casablanca" && (
                  <p>• Centre-ville (Place Mohammed V)<br/>
                  • Corniche Ain Diab<br/>
                  • Zone hôtelière</p>
                )}
                {city.slug === "rabat" && (
                  <p>• Kasbah des Oudayas<br/>
                  • Centre administratif<br/>
                  • Agdal</p>
                )}
                {city.slug === "fes" && (
                  <p>• Nouvelle Ville<br/>
                  • Zone hôtelière<br/>
                  • Centre commercial</p>
                )}
                {city.slug === "agadir" && (
                  <p>• Plage d'Agadir<br/>
                  • Marina<br/>
                  • Centre-ville</p>
                )}
                {city.slug === "marrakech" && (
                  <p>• Gueliz<br/>
                  • Hivernage<br/>
                  • Zone hôtelière</p>
                )}
                {city.slug === "tanger" && (
                  <p>• Centre moderne<br/>
                  • Zone hôtelière<br/>
                  • Malabata</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-semibold text-yellow-800 dark:text-yellow-200">Zone de Vigilance</span>
              </div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                {city.slug === "casablanca" && (
                  <p>• Corniche (nuit)<br/>
                  • Quartiers populaires<br/>
                  • Gares</p>
                )}
                {city.slug === "rabat" && (
                  <p>• Médina (soirée)<br/>
                  • Quartiers résidentiels<br/>
                  • Zones portuaires</p>
                )}
                {city.slug === "fes" && (
                  <p>• Médina (soirée)<br/>
                  • Tanneries<br/>
                  • Quartiers anciens</p>
                )}
                {city.slug === "agadir" && (
                  <p>• Souk El Had<br/>
                  • Quartiers populaires<br/>
                  • Zone portuaire</p>
                )}
                {city.slug === "marrakech" && (
                  <p>• Médina (soirée)<br/>
                  • Souks<br/>
                  • Quartiers populaires</p>
                )}
                {city.slug === "tanger" && (
                  <p>• Médina (soirée)<br/>
                  • Zone portuaire<br/>
                  • Quartiers populaires</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-semibold text-red-800 dark:text-red-200">Zone à Risque</span>
              </div>
              <div className="text-sm text-red-700 dark:text-red-300">
                {city.slug === "casablanca" && (
                  <p>• Médina (nuit)<br/>
                  • Quartiers isolés<br/>
                  • Zones industrielles</p>
                )}
                {city.slug === "rabat" && (
                  <p>• Zones portuaires isolées<br/>
                  • Quartiers marginaux<br/>
                  • Zones industrielles</p>
                )}
                {city.slug === "fes" && (
                  <p>• Médina (nuit isolée)<br/>
                  • Quartiers marginaux<br/>
                  • Zones industrielles</p>
                )}
                {city.slug === "agadir" && (
                  <p>• Quartiers marginaux<br/>
                  • Zones industrielles<br/>
                  • Zones isolées</p>
                )}
                {city.slug === "marrakech" && (
                  <p>• Médina (nuit isolée)<br/>
                  • Quartiers marginaux<br/>
                  • Zones industrielles</p>
                )}
                {city.slug === "tanger" && (
                  <p>• Médina (nuit isolée)<br/>
                  • Quartiers marginaux<br/>
                  • Zones portuaires isolées</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

