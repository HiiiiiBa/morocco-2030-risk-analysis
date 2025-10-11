"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Music,
  Camera,
  Calendar,
  Clock,
  Phone,
  Wifi,
  Star,
  Heart,
  MapPin,
  Trophy,
} from "lucide-react"

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

interface CityFanExperienceContentProps {
  city: City
}

export default function CityFanExperienceContent({ city }: CityFanExperienceContentProps) {
  return (
    <div className="space-y-6">
      {/* Fan Zones */}
      <div className="grid md:grid-cols-2 gap-6">
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
              <Music className="h-5 w-5 text-purple-600" />
              Événements & Animations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <span className="font-medium text-sm">Concerts Live</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Artistes internationaux</p>
                </div>
                <Badge variant="outline" className="text-green-600">Quotidien</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <span className="font-medium text-sm">Projections Matchs</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Écrans géants</p>
                </div>
                <Badge variant="outline" className="text-blue-600">En direct</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div>
                  <span className="font-medium text-sm">Activités Culturelles</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Traditions locales</p>
                </div>
                <Badge variant="outline" className="text-purple-600">Weekend</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div>
                  <span className="font-medium text-sm">Food Trucks</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Spécialités locales</p>
                </div>
                <Badge variant="outline" className="text-yellow-600">Toujours</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services & Horaires */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-green-600" />
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
              <Clock className="h-5 w-5 text-purple-600" />
              Horaires Fan Zones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Lundi - Jeudi</span>
                <span className="font-medium">18h00 - 23h00</span>
              </div>
              <div className="flex justify-between">
                <span>Vendredi - Dimanche</span>
                <span className="font-medium">16h00 - 01h00</span>
              </div>
              <div className="flex justify-between">
                <span>Jours de match</span>
                <span className="font-medium text-green-600">12h00 - 02h00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Témoignages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            Témoignages Supporters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="flex space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                "L'ambiance à {city.name} est incroyable ! Les fan zones sont parfaitement organisées et l'accueil des locaux est chaleureux."
              </p>
              <p className="text-xs text-gray-500 mt-2">- Supporters brésiliens</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="flex space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                "Les fan zones sont très bien équipées et l'organisation est au top. Je recommande vivement !"
              </p>
              <p className="text-xs text-gray-500 mt-2">- Supporters français</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

