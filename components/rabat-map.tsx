"use client"

import { useEffect, useState } from "react"

export default function RabatMap() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement de la carte de Rabat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border relative">
      {/* Carte Google Maps de Rabat - Vue centrée sur la ville */}
      <iframe
        src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Rabat,%20Morocco&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=&amp;output=embed"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Carte de Rabat - Vue de la ville"
        className="w-full h-full"
      />
      
    </div>
  )
}
