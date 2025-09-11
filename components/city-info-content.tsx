"use client"

import { Badge } from "@/components/ui/badge"
import { Shield, MapPin, Star, Phone } from "lucide-react"

interface CityInfoContentProps {
  citySlug: string
  cityName: string
}

export default function CityInfoContent({ citySlug, cityName }: CityInfoContentProps) {
  return (
    <div className="space-y-6">
      {/* Attractions et Culture */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Attractions Principales
          </h4>
          {citySlug === "casablanca" && (
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Mosquée Hassan II</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Plus grande mosquée d'Afrique</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Corniche</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Front de mer animé</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Place Mohammed V</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Centre administratif</p>
              </div>
            </div>
          )}
          {citySlug === "rabat" && (
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Kasbah des Oudayas</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Forteresse historique</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Tour Hassan</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Minaret inachevé du 12e siècle</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Mausolée Mohammed V</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Tombeau royal</p>
              </div>
            </div>
          )}
          {citySlug === "fes" && (
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Médina de Fès</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Patrimoine mondial UNESCO</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Université Al Quaraouiyine</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Plus ancienne université du monde</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Tanneries</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Ateliers de cuir traditionnels</p>
              </div>
            </div>
          )}
          {citySlug === "agadir" && (
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Plage d'Agadir</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">9km de sable fin</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Kasbah d'Agadir</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Ruines historiques</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Souk El Had</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Marché traditionnel</p>
              </div>
            </div>
          )}
          {citySlug === "marrakech" && (
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Place Jemaa el-Fnaa</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Cœur de la médina</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Palais Bahia</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Architecture andalouse</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Jardin Majorelle</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Oasis de Yves Saint Laurent</p>
              </div>
            </div>
          )}
          {citySlug === "tanger" && (
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Médina de Tanger</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Quartier historique</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Cap Spartel</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Phare et grottes d'Hercule</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Grottes d'Hercule</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Légende mythologique</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            Spécialités Culinaires
          </h4>
          {citySlug === "casablanca" && (
            <div className="space-y-2">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Tajine aux fruits de mer</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Spécialité côtière</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Pastilla au poulet</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Pâtisserie salée traditionnelle</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Briouates</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Feuilletés aux légumes</p>
              </div>
            </div>
          )}
          {citySlug === "rabat" && (
            <div className="space-y-2">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Tajine aux pruneaux</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Spécialité royale</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Harira traditionnelle</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Soupe du ramadan</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Ghoriba</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Biscuits aux amandes</p>
              </div>
            </div>
          )}
          {citySlug === "fes" && (
            <div className="space-y-2">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Tajine aux olives</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Spécialité fassie</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h5 className="font-medium text-sm">B'stilla fassie</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Pâtisserie aux pigeons</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Makrout</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Pâtisserie aux dattes</p>
              </div>
            </div>
          )}
          {citySlug === "agadir" && (
            <div className="space-y-2">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Tajine aux légumes</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Spécialité berbère</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Couscous aux légumes</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Plat traditionnel</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Amalou</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Pâte d'amandes</p>
              </div>
            </div>
          )}
          {citySlug === "marrakech" && (
            <div className="space-y-2">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Tajine aux citrons</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Spécialité marrakchie</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Tanjia marrakchie</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Plat cuit dans les fours publics</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Chebakia</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Pâtisserie du ramadan</p>
              </div>
            </div>
          )}
          {citySlug === "tanger" && (
            <div className="space-y-2">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Tajine aux poissons</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Spécialité méditerranéenne</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Couscous aux poissons</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Plat de la côte</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h5 className="font-medium text-sm">Kaab el ghzal</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Cornes de gazelle</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sécurité et Contacts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Conseils de Sécurité
          </h4>
          {citySlug === "casablanca" && (
            <div className="space-y-2">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm">• Vigilance recommandée dans les zones touristiques</p>
                <p className="text-sm">• Éviter les quartiers isolés la nuit</p>
                <p className="text-sm">• Garder ses objets de valeur en sécurité</p>
              </div>
            </div>
          )}
          {citySlug === "rabat" && (
            <div className="space-y-2">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm">• Zone sécurisée, circulation libre</p>
                <p className="text-sm">• Présence policière renforcée</p>
                <p className="text-sm">• Accès facilité aux monuments</p>
              </div>
            </div>
          )}
          {citySlug === "fes" && (
            <div className="space-y-2">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm">• Vigilance dans la médina</p>
                <p className="text-sm">• Accompagnement recommandé pour les touristes</p>
                <p className="text-sm">• Respecter les coutumes locales</p>
              </div>
            </div>
          )}
          {citySlug === "agadir" && (
            <div className="space-y-2">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm">• Zone très sécurisée</p>
                <p className="text-sm">• Surveillance renforcée des plages</p>
                <p className="text-sm">• Accès libre aux attractions</p>
              </div>
            </div>
          )}
          {citySlug === "marrakech" && (
            <div className="space-y-2">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm">• Vigilance dans les souks</p>
                <p className="text-sm">• Négociation des prix recommandée</p>
                <p className="text-sm">• Respecter les traditions</p>
              </div>
            </div>
          )}
          {citySlug === "tanger" && (
            <div className="space-y-2">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm">• Vigilance dans la médina</p>
                <p className="text-sm">• Éviter les zones portuaires isolées</p>
                <p className="text-sm">• Accompagnement recommandé</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <Phone className="h-5 w-5 text-red-600" />
            Contacts d'Urgence
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <span className="text-sm">Police</span>
              <span className="font-mono text-red-600 text-sm">19</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <span className="text-sm">Pompiers</span>
              <span className="font-mono text-red-600 text-sm">15</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <span className="text-sm">Samu</span>
              <span className="font-mono text-red-600 text-sm">141</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <span className="text-sm">Gendarmerie</span>
              <span className="font-mono text-red-600 text-sm">177</span>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-900/20 rounded">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Hôpital principal : {cityName} Central Hospital
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

