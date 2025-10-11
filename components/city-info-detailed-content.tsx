"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  TrendingUp,
  Phone,
  AlertTriangle,
  Star,
  MapPin,
  Users,
  Clock,
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

interface CityInfoDetailedContentProps {
  city: City
}

export default function CityInfoDetailedContent({ city }: CityInfoDetailedContentProps) {
  return (
    <div className="space-y-6">
      {/* Indicateurs de sécurité */}
      <div className="grid md:grid-cols-2 gap-6">
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
                  <span className="font-bold text-green-600">Bonne</span>
                  <Badge variant="outline" className="text-green-600">Acceptable</Badge>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "80%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informations culturelles et attractions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-purple-600" />
            Attractions et Culture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Attractions Principales</h4>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {city.slug === "casablanca" && (
                  <ul className="space-y-1">
                    <li>• Mosquée Hassan II : Plus grande mosquée d'Afrique</li>
                    <li>• Corniche : Front de mer animé</li>
                    <li>• Place Mohammed V : Centre administratif</li>
                    <li>• Marché Central : Souk traditionnel</li>
                  </ul>
                )}
                {city.slug === "rabat" && (
                  <ul className="space-y-1">
                    <li>• Kasbah des Oudayas : Forteresse historique</li>
                    <li>• Tour Hassan : Minaret inachevé du 12e siècle</li>
                    <li>• Mausolée Mohammed V : Tombeau royal</li>
                    <li>• Chellah : Site archéologique romain</li>
                  </ul>
                )}
                {city.slug === "fes" && (
                  <ul className="space-y-1">
                    <li>• Médina de Fès : Patrimoine mondial UNESCO</li>
                    <li>• Université Al Quaraouiyine : Plus ancienne université du monde</li>
                    <li>• Tanneries : Ateliers de cuir traditionnels</li>
                    <li>• Palais Royal : Résidence du roi</li>
                  </ul>
                )}
                {city.slug === "agadir" && (
                  <ul className="space-y-1">
                    <li>• Plage d'Agadir : 9km de sable fin</li>
                    <li>• Kasbah d'Agadir : Ruines historiques</li>
                    <li>• Souk El Had : Marché traditionnel</li>
                    <li>• Vallée du Paradis : Oasis naturelle</li>
                  </ul>
                )}
                {city.slug === "marrakech" && (
                  <ul className="space-y-1">
                    <li>• Place Jemaa el-Fnaa : Cœur de la médina</li>
                    <li>• Palais Bahia : Architecture andalouse</li>
                    <li>• Jardin Majorelle : Oasis de Yves Saint Laurent</li>
                    <li>• Souk Semmarine : Marché aux épices</li>
                  </ul>
                )}
                {city.slug === "tanger" && (
                  <ul className="space-y-1">
                    <li>• Médina de Tanger : Quartier historique</li>
                    <li>• Cap Spartel : Phare et grottes d'Hercule</li>
                    <li>• Grottes d'Hercule : Légende mythologique</li>
                    <li>• Place de France : Centre moderne</li>
                  </ul>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Spécialités Culinaires</h4>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {city.slug === "casablanca" && (
                  <ul className="space-y-1">
                    <li>• Tajine aux fruits de mer</li>
                    <li>• Pastilla au poulet</li>
                    <li>• Briouates</li>
                    <li>• Couscous aux légumes</li>
                  </ul>
                )}
                {city.slug === "rabat" && (
                  <ul className="space-y-1">
                    <li>• Tajine aux pruneaux</li>
                    <li>• Harira traditionnelle</li>
                    <li>• Ghoriba</li>
                    <li>• Couscous aux légumes</li>
                  </ul>
                )}
                {city.slug === "fes" && (
                  <ul className="space-y-1">
                    <li>• Tajine aux olives</li>
                    <li>• B'stilla fassie</li>
                    <li>• Makrout</li>
                    <li>• Couscous aux légumes</li>
                  </ul>
                )}
                {city.slug === "agadir" && (
                  <ul className="space-y-1">
                    <li>• Tajine aux légumes</li>
                    <li>• Couscous aux légumes</li>
                    <li>• Amalou</li>
                    <li>• Poisson grillé</li>
                  </ul>
                )}
                {city.slug === "marrakech" && (
                  <ul className="space-y-1">
                    <li>• Tajine aux citrons</li>
                    <li>• Tanjia marrakchie</li>
                    <li>• Chebakia</li>
                    <li>• Couscous aux légumes</li>
                  </ul>
                )}
                {city.slug === "tanger" && (
                  <ul className="space-y-1">
                    <li>• Tajine aux poissons</li>
                    <li>• Couscous aux poissons</li>
                    <li>• Kaab el ghzal</li>
                    <li>• Poisson grillé</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sécurité et contacts d'urgence */}
      <div className="grid md:grid-cols-2 gap-6">
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
                  <ul className="space-y-1">
                    <li>• Vigilance recommandée dans les zones touristiques</li>
                    <li>• Éviter les quartiers isolés la nuit</li>
                    <li>• Garder ses objets de valeur en sécurité</li>
                  </ul>
                )}
                {city.slug === "rabat" && (
                  <ul className="space-y-1">
                    <li>• Zone sécurisée, circulation libre</li>
                    <li>• Présence policière renforcée</li>
                    <li>• Accès facilité aux monuments</li>
                  </ul>
                )}
                {city.slug === "fes" && (
                  <ul className="space-y-1">
                    <li>• Vigilance dans la médina</li>
                    <li>• Accompagnement recommandé pour les touristes</li>
                    <li>• Respecter les coutumes locales</li>
                  </ul>
                )}
                {city.slug === "agadir" && (
                  <ul className="space-y-1">
                    <li>• Zone très sécurisée</li>
                    <li>• Surveillance renforcée des plages</li>
                    <li>• Accès libre aux attractions</li>
                  </ul>
                )}
                {city.slug === "marrakech" && (
                  <ul className="space-y-1">
                    <li>• Vigilance dans les souks</li>
                    <li>• Négociation des prix recommandée</li>
                    <li>• Respecter les traditions</li>
                  </ul>
                )}
                {city.slug === "tanger" && (
                  <ul className="space-y-1">
                    <li>• Vigilance dans la médina</li>
                    <li>• Éviter les zones portuaires isolées</li>
                    <li>• Accompagnement recommandé</li>
                  </ul>
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
              <div className="flex items-center justify-between">
                <span>Gendarmerie</span>
                <span className="font-mono text-red-600">177</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>• Consulat France : +212 5 37 26 07 00</p>
                <p>• Hôpital principal : {city.name} Central Hospital</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Recommandations Générales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Sécurité</h4>
              <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <p>• Évitez les zones isolées la nuit</p>
                <p>• Gardez vos objets de valeur en sécurité</p>
                <p>• Respectez les consignes de sécurité</p>
                <p>• Ayez toujours une pièce d'identité</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Culture</h4>
              <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <p>• Respectez les coutumes locales</p>
                <p>• Habillez-vous de manière appropriée</p>
                <p>• Apprenez quelques mots d'arabe</p>
                <p>• Négociez poliment dans les souks</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

