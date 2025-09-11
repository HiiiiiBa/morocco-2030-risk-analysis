"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Trophy, Users, Shield } from "lucide-react"
import Link from "next/link"

interface City {
  name: string
  slug: string
  capacity: string
  risk: "Faible" | "Moyen" | "Élevé"
  x: number
  y: number
  color: string
}

const cities: City[] = [
  {
    name: "Tanger",
    slug: "tanger",
    capacity: "76K",
    risk: "Moyen",
    x: 50,
    y: 15,
    color: "bg-yellow-600"
  },
  {
    name: "Rabat",
    slug: "rabat", 
    capacity: "68K",
    risk: "Faible",
    x: 35,
    y: 25,
    color: "bg-green-600"
  },
  {
    name: "Casablanca",
    slug: "casablanca",
    capacity: "115K", 
    risk: "Moyen",
    x: 30,
    y: 35,
    color: "bg-blue-600"
  },
  {
    name: "Fès",
    slug: "fes",
    capacity: "55K",
    risk: "Faible", 
    x: 55,
    y: 30,
    color: "bg-purple-600"
  },
  {
    name: "Marrakech",
    slug: "marrakech",
    capacity: "45K",
    risk: "Moyen",
    x: 40,
    y: 60,
    color: "bg-orange-600"
  },
  {
    name: "Agadir", 
    slug: "agadir",
    capacity: "46K",
    risk: "Faible",
    x: 25,
    y: 70,
    color: "bg-teal-600"
  }
]

export default function MoroccoMap() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Faible":
        return "text-green-600 border-green-600"
      case "Moyen":
        return "text-yellow-600 border-yellow-600"
      case "Élevé":
        return "text-red-600 border-red-600"
      default:
        return "text-gray-600 border-gray-600"
    }
  }

  return (
    <div className="relative w-full">
      {/* Carte du Maroc avec OpenStreetMap */}
      <div className="relative bg-gradient-to-br from-blue-100 via-yellow-50 to-orange-100 dark:from-blue-900 dark:via-yellow-900 dark:to-orange-900 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 h-96">
        {/* Iframe pour carte OpenStreetMap */}
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=-17.0%2C27.0%2C-1.0%2C36.0&layer=mapnik&marker=32.0,-6.0"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="opacity-80"
        />
        
        {/* Overlay avec les villes */}
        <div className="absolute inset-0 pointer-events-none">
          {cities.map((city) => (
            <div
              key={city.slug}
              className="absolute pointer-events-auto"
              style={{
                left: `${city.x}%`,
                top: `${city.y}%`,
                transform: "translate(-50%, -50%)"
              }}
              onMouseEnter={() => setHoveredCity(city.slug)}
              onMouseLeave={() => setHoveredCity(null)}
            >
              <Link href={`/dashboard/city/${city.slug}`}>
                <div className={`${city.color} hover:scale-110 text-white p-3 rounded-lg shadow-lg cursor-pointer transition-all duration-300 group`}>
                  <MapPin className="h-4 w-4 mx-auto mb-1" />
                  <div className="text-sm font-bold text-center">{city.name}</div>
                  <div className="text-xs text-center opacity-90">{city.capacity} places</div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs mt-1 ${
                      city.risk === "Faible" 
                        ? "text-green-200 border-green-200" 
                        : city.risk === "Moyen"
                        ? "text-yellow-200 border-yellow-200"
                        : "text-red-200 border-red-200"
                    }`}
                  >
                    {city.risk}
                  </Badge>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Légende */}
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
          <h4 className="font-semibold text-sm mb-2">Légende</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span>Risque Faible (3 villes)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-600 rounded"></div>
              <span>Risque Moyen (3 villes)</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-3 w-3 text-red-600" />
              <span>Villes Hôtes 2030</span>
            </div>
          </div>
        </div>

        {/* Informations géographiques */}
        <div className="absolute top-2 left-2 text-xs text-blue-800 dark:text-blue-200 font-medium bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded">
          Détroit de Gibraltar
        </div>
        <div className="absolute top-2 right-2 text-xs text-brown-800 dark:text-brown-200 font-medium bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded">
          Atlas
        </div>
        <div className="absolute bottom-2 right-2 text-xs text-yellow-800 dark:text-yellow-200 font-medium bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded">
          Sahara
        </div>
        <div className="absolute bottom-2 left-2 text-xs text-blue-800 dark:text-blue-200 font-medium bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded">
          Océan Atlantique
        </div>
      </div>

      {/* Tooltip pour ville survolée */}
      {hoveredCity && (
        <div className="absolute z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border">
          {(() => {
            const city = cities.find(c => c.slug === hoveredCity)
            return city ? (
              <div>
                <h4 className="font-semibold text-sm">{city.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Capacité: {city.capacity} places
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Risque: {city.risk}
                </p>
              </div>
            ) : null
          })()}
        </div>
      )}
    </div>
  )
}
