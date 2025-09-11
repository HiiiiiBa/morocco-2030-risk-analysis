"use client"

import { Badge } from "@/components/ui/badge"
import { Bus, Train, Plane } from "lucide-react"

interface CityTransportContentProps {
  citySlug: string
}

export default function CityTransportContent({ citySlug }: CityTransportContentProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Transport public */}
      <div className="space-y-3">
        <h4 className="font-semibold text-lg flex items-center gap-2">
          <Bus className="h-5 w-5 text-blue-600" />
          Transport Public
        </h4>
        {citySlug === "casablanca" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <span className="text-sm">Bus urbain</span>
              <Badge variant="outline" className="text-green-600 text-xs">50+ lignes</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <span className="text-sm">Tramway</span>
              <Badge variant="outline" className="text-green-600 text-xs">2 lignes</Badge>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>• Fréquence : 5-10 min</p>
              <p>• Prix : 3-8 MAD</p>
            </div>
          </div>
        )}
        {citySlug === "rabat" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <span className="text-sm">Réseau Al Bidaoui</span>
              <Badge variant="outline" className="text-green-600 text-xs">20+ lignes</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <span className="text-sm">Tramway</span>
              <Badge variant="outline" className="text-green-600 text-xs">1 ligne</Badge>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>• Prix : 3-5 MAD</p>
              <p>• Horaires : 5h30-23h30</p>
            </div>
          </div>
        )}
        {citySlug === "fes" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <span className="text-sm">Bus urbain</span>
              <Badge variant="outline" className="text-yellow-600 text-xs">15 lignes</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <span className="text-sm">Tramway</span>
              <Badge variant="outline" className="text-yellow-600 text-xs">En projet</Badge>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>• Prix : 4-6 MAD</p>
              <p>• Horaires : 6h-22h</p>
            </div>
          </div>
        )}
        {citySlug === "agadir" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <span className="text-sm">Bus urbain</span>
              <Badge variant="outline" className="text-green-600 text-xs">10 lignes</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <span className="text-sm">Tramway</span>
              <Badge variant="outline" className="text-yellow-600 text-xs">En projet</Badge>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>• Prix : 3 MAD</p>
              <p>• Horaires : 6h-23h</p>
            </div>
          </div>
        )}
        {citySlug === "marrakech" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <span className="text-sm">Bus urbain</span>
              <Badge variant="outline" className="text-yellow-600 text-xs">15 lignes</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <span className="text-sm">Tramway</span>
              <Badge variant="outline" className="text-yellow-600 text-xs">En projet</Badge>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>• Prix : 4 MAD</p>
              <p>• Horaires : 6h-22h</p>
            </div>
          </div>
        )}
        {citySlug === "tanger" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <span className="text-sm">Bus urbain</span>
              <Badge variant="outline" className="text-green-600 text-xs">12 lignes</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <span className="text-sm">Tramway</span>
              <Badge variant="outline" className="text-yellow-600 text-xs">En projet</Badge>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>• Prix : 3 MAD</p>
              <p>• Horaires : 6h-23h</p>
            </div>
          </div>
        )}
      </div>

      {/* Transport ferroviaire */}
      <div className="space-y-3">
        <h4 className="font-semibold text-lg flex items-center gap-2">
          <Train className="h-5 w-5 text-green-600" />
          Transport Ferroviaire
        </h4>
        {citySlug === "casablanca" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <span className="text-sm">Gares</span>
              <Badge variant="outline" className="text-green-600 text-xs">Casa-Port & Casa-Voyageurs</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <span className="text-sm">Al Boraq</span>
              <Badge variant="outline" className="text-green-600 text-xs">Vers Tanger</Badge>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>• Prix : 25-180 MAD</p>
              <p>• Temps : 30min-3h</p>
            </div>
          </div>
        )}
        {citySlug === "rabat" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <span className="text-sm">Gare</span>
              <Badge variant="outline" className="text-green-600 text-xs">Rabat-Ville</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <span className="text-sm">Connexions</span>
              <Badge variant="outline" className="text-green-600 text-xs">Toutes les villes</Badge>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>• Prix : 15-120 MAD</p>
              <p>• Temps : 1-4h</p>
            </div>
          </div>
        )}
        {citySlug === "fes" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <span className="text-sm">Gare</span>
              <Badge variant="outline" className="text-green-600 text-xs">Fès-Ville</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <span className="text-sm">Connexions</span>
              <Badge variant="outline" className="text-green-600 text-xs">ONCF</Badge>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>• Prix : 20-100 MAD</p>
              <p>• Temps : 1-3h</p>
            </div>
          </div>
        )}
        {citySlug === "agadir" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <span className="text-sm">Gare</span>
              <Badge variant="outline" className="text-yellow-600 text-xs">Pas de gare</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <span className="text-sm">Alternative</span>
              <Badge variant="outline" className="text-yellow-600 text-xs">Bus inter-villes</Badge>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>• Prix : 30-80 MAD</p>
              <p>• Temps : 2-5h</p>
            </div>
          </div>
        )}
        {citySlug === "marrakech" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <span className="text-sm">Gare</span>
              <Badge variant="outline" className="text-green-600 text-xs">Marrakech</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <span className="text-sm">Connexions</span>
              <Badge variant="outline" className="text-green-600 text-xs">ONCF</Badge>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>• Prix : 25-110 MAD</p>
              <p>• Temps : 1-4h</p>
            </div>
          </div>
        )}
        {citySlug === "tanger" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <span className="text-sm">Gare</span>
              <Badge variant="outline" className="text-green-600 text-xs">Tanger-Ville</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <span className="text-sm">Al Boraq</span>
              <Badge variant="outline" className="text-green-600 text-xs">Vers Casablanca</Badge>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>• Prix : 30-200 MAD</p>
              <p>• Temps : 30min-3h</p>
            </div>
          </div>
        )}
      </div>

      {/* Transport aérien */}
      <div className="space-y-3">
        <h4 className="font-semibold text-lg flex items-center gap-2">
          <Plane className="h-5 w-5 text-purple-600" />
          Transport Aérien
        </h4>
        {citySlug === "casablanca" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <span className="text-sm">Aéroport</span>
              <Badge variant="outline" className="text-purple-600 text-xs">Mohammed V</Badge>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>• 2e plus grand d'Afrique</p>
              <p>• Vols internationaux</p>
              <p>• Navette : 30 min</p>
            </div>
          </div>
        )}
        {citySlug === "rabat" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <span className="text-sm">Aéroport</span>
              <Badge variant="outline" className="text-purple-600 text-xs">Rabat-Salé</Badge>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>• Vols domestiques & internationaux</p>
              <p>• Connexions européennes</p>
              <p>• Navette : 20 min</p>
            </div>
          </div>
        )}
        {citySlug === "fes" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <span className="text-sm">Aéroport</span>
              <Badge variant="outline" className="text-purple-600 text-xs">Fès-Saïss</Badge>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>• Vols domestiques</p>
              <p>• Connexions limitées</p>
              <p>• Navette : 25 min</p>
            </div>
          </div>
        )}
        {citySlug === "agadir" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <span className="text-sm">Aéroport</span>
              <Badge variant="outline" className="text-purple-600 text-xs">Agadir-Al Massira</Badge>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>• 2e aéroport du Maroc</p>
              <p>• Vols internationaux</p>
              <p>• Navette : 15 min</p>
            </div>
          </div>
        )}
        {citySlug === "marrakech" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <span className="text-sm">Aéroport</span>
              <Badge variant="outline" className="text-purple-600 text-xs">Marrakech-Ménara</Badge>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>• Vols internationaux</p>
              <p>• Destination touristique</p>
              <p>• Navette : 20 min</p>
            </div>
          </div>
        )}
        {citySlug === "tanger" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <span className="text-sm">Aéroport</span>
              <Badge variant="outline" className="text-purple-600 text-xs">Tanger-Ibn Battouta</Badge>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>• Vols internationaux</p>
              <p>• Connexions européennes</p>
              <p>• Navette : 25 min</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

