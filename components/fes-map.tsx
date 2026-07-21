"use client"

import { API_URL } from "@/lib/api"
import { useEffect, useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  MapPin, 
  Star, 
  Search, 
  X, 
  MessageCircle, 
  Edit, 
  Trash2, 
  Send, 
  ThumbsUp 
} from "lucide-react"

interface FesZone {
  id: string
  name: string
  lat: number
  lng: number
  criminalite: number
  pollution: number
  infrastructure: number
  riskLevel: string
}

const fesZones: FesZone[] = [
  {
    id: "agdal-fes",
    name: "Agdal (Fès)",
    lat: 34.0382,
    lng: -4.9992,
    criminalite: 35.42,
    pollution: 55,
    infrastructure: 3.2,
    riskLevel: "Faible"
  },
  {
    id: "el-mariniyine",
    name: "El Mariniyine",
    lat: 34.0649,
    lng: -5.0003,
    criminalite: 40.44,
    pollution: 55,
    infrastructure: 3.0,
    riskLevel: "Modéré"
  },
  {
    id: "fes-medina",
    name: "Fès-Médina",
    lat: 34.0631,
    lng: -4.9769,
    criminalite: 30.49,
    pollution: 55,
    infrastructure: 3.2,
    riskLevel: "Faible"
  },
  {
    id: "jnan-el-ouard",
    name: "Jnan El Ouard",
    lat: 34.0549,
    lng: -4.9540,
    criminalite: 49.30,
    pollution: 55,
    infrastructure: 3.0,
    riskLevel: "Modéré"
  },
  {
    id: "saiss",
    name: "Saiss",
    lat: 33.9362,
    lng: -4.9715,
    criminalite: 25.40,
    pollution: 55,
    infrastructure: 3.4,
    riskLevel: "Faible"
  },
  {
    id: "zouagha",
    name: "Zouagha",
    lat: 34.0121,
    lng: -5.0375,
    criminalite: 50.49,
    pollution: 55,
    infrastructure: 3.0,
    riskLevel: "Modéré"
  }
]

interface ZoneComment {
  id: string
  zoneId: string
  author: string
  content: string
  timestamp: Date
  likes: number
  userRatings?: {
    criminalite?: number
    pollution?: number
    infrastructure?: number
  }
}

interface UserRating {
  criminalite: number
  pollution: number
  infrastructure: number
}

const getRiskColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case "Faible": return "#10b981"
    case "Modéré": return "#f59e0b"
    case "Élevé": return "#dc2626"
    default: return "#6b7280"
  }
}

const getCriminaliteColor = (indice: number): string => {
  if (indice <= 30) return "#10b981"
  if (indice <= 60) return "#f59e0b"
  return "#ef4444"
}

const getPollutionColor = (indice: number): string => {
  if (indice <= 30) return "#10b981"
  if (indice <= 60) return "#f59e0b"
  return "#ef4444"
}

export default function FesMap() {
  const [isClient, setIsClient] = useState(false)
  const [selectedZone, setSelectedZone] = useState<FesZone | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchError, setSearchError] = useState<string | null>(null)
  const [zoneComments, setZoneComments] = useState<{ [zoneId: string]: ZoneComment[] }>({})
  const [newComment, setNewComment] = useState("")
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [userData, setUserData] = useState<any>(null)
  const [userRating, setUserRating] = useState<UserRating>({
    criminalite: 0,
    pollution: 0,
    infrastructure: 0,
  })
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersAddedRef = useRef(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Load user data from localStorage
    const user = localStorage.getItem("user")
    if (user) {
      setUserData(JSON.parse(user))
    }
  }, [])

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchError("Veuillez entrer un nom de zone")
      return
    }

    const foundZone = fesZones.find((zone) => 
      zone.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (foundZone) {
      setSelectedZone(foundZone)
      setSearchError(null)
      loadZoneComments(foundZone.id)
      
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([foundZone.lat, foundZone.lng], 14)
      }
    } else {
      setSearchError("Zone non trouvée")
    }
  }

  // Fonction pour charger les commentaires depuis l'API
  const loadZoneComments = async (zoneId: string) => {
    try {
      const response = await fetch(`${API_URL}/cities/fes/districts/${zoneId}/comments`)
      if (response.ok) {
        const data = await response.json()
        const comments = data.comments || []
        
        // Convertir les commentaires de l'API au format local
        const formattedComments: ZoneComment[] = comments.map((comment: any) => ({
          id: comment.id,
          zoneId: zoneId,
          author: comment.author,
          content: comment.comment,
          timestamp: new Date(comment.date),
          likes: 0, // L'API ne retourne pas les likes pour l'instant
          userRatings: {
            criminalite: 0,
            pollution: 0,
            infrastructure: 0
          }
        }))
        
        setZoneComments(prev => ({
          ...prev,
          [zoneId]: formattedComments
        }))
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commentaires:", error)
    }
  }

  const addComment = async () => {
    if (!selectedZone || !newComment.trim() || !userData) return

    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        alert("Vous devez être connecté pour poster un commentaire")
        return
      }

      // Créer un objet de review pour l'API
      const reviewData = {
        city_id: "fes",
        district_id: selectedZone.id,
        criminalite: userRating.criminalite || 3,
        pollution: userRating.pollution || 3,
        infrastructure: userRating.infrastructure || 3,
        commentaire: newComment
      }

      const response = await fetch(`${API_URL}/cities/fes/districts/${selectedZone.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      })

      if (response.ok) {
        // Recharger les commentaires après ajout
        await loadZoneComments(selectedZone.id)
        setNewComment("")
        setUserRating({ criminalite: 0, pollution: 0, infrastructure: 0 })
      } else {
        const errorData = await response.json()
        alert(`Erreur: ${errorData.detail || "Impossible d'ajouter le commentaire"}`)
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error)
      alert("Erreur lors de l'ajout du commentaire")
    }
  }

  const deleteComment = (commentId: string) => {
    if (!selectedZone) return
    setZoneComments((prev) => ({
      ...prev,
      [selectedZone.id]: prev[selectedZone.id]?.filter((c) => c.id !== commentId) || [],
    }))
  }

  const startEditComment = (comment: ZoneComment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
  }

  const saveEditComment = () => {
    if (!selectedZone || !editingComment) return
    setZoneComments((prev) => ({
      ...prev,
      [selectedZone.id]:
        prev[selectedZone.id]?.map((c) => (c.id === editingComment ? { ...c, content: editContent } : c)) || [],
    }))
    setEditingComment(null)
    setEditContent("")
  }

  const likeComment = (commentId: string) => {
    if (!selectedZone) return
    setZoneComments((prev) => ({
      ...prev,
      [selectedZone.id]:
        prev[selectedZone.id]?.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c)) || [],
    }))
  }

  const renderStarRating = (rating: number, onRate: (rating: number) => void, label: string) => (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium w-24">{label}:</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 cursor-pointer ${star <= rating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
            onClick={() => onRate(star)}
          />
        ))}
      </div>
    </div>
  )

  const renderSliderRating = (rating: number, onRate: (rating: number) => void, label: string) => {
    const isRiskFactor = label === "Criminalité" || label === "Pollution"
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{label}:</span>
          <span className="text-sm font-bold text-blue-600">{rating}/100</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={rating}
          onChange={(e) => onRate(Number.parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: isRiskFactor 
              ? `linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)`
              : `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-500">
          {isRiskFactor ? (
            <>
              <span>Très faible</span>
              <span>Moyen</span>
              <span>Très élevé</span>
            </>
          ) : (
            <>
              <span>Très mauvais</span>
              <span>Moyen</span>
              <span>Excellent</span>
            </>
          )}
        </div>
      </div>
    )
  }

  const addZoneMarkers = useCallback(() => {
    console.log("addZoneMarkers called", {
      markersAdded: markersAddedRef.current,
      mapInstance: !!mapInstanceRef.current,
      leaflet: !!(window as any).L
    })
    
    if (markersAddedRef.current || !mapInstanceRef.current || !(window as any).L) {
      console.log("Skipping marker addition")
      return
    }

    const L = (window as any).L
    console.log("Starting to add markers for", fesZones.length, "zones")

    // Nettoyer les marqueurs existants
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current.removeLayer(layer)
      }
    })

    fesZones.forEach((zone) => {
      const color = getRiskColor(zone.riskLevel)

      const customIcon = L.divIcon({
        className: "custom-zone-marker",
        html: `<div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          transition: all 0.2s ease;
          pointer-events: auto;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background-color: white;
            border-radius: 50%;
            opacity: 0.95;
            pointer-events: none;
          "></div>
        </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })

      const marker = L.marker([zone.lat, zone.lng], { 
        icon: customIcon,
        bubblingMouseEvents: false
      })
        .addTo(mapInstanceRef.current)
        .on("click", (e: any) => {
          console.log("Marker clicked for zone:", zone.name)
          e.originalEvent.stopPropagation()
          setSelectedZone(zone)
          loadZoneComments(zone.id)
          // Centrer la carte sur la zone sélectionnée
          mapInstanceRef.current.setView([zone.lat, zone.lng], 14)
        })

      marker.bindPopup(`
        <div style="padding: 12px; min-width: 200px; text-align: center;">
          <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #333;">${zone.name}</h3>
          <div style="margin-bottom: 8px;">
            <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; background-color: ${color}; color: white; font-weight: 600;">
              ${zone.riskLevel}
            </span>
          </div>
          <div style="font-size: 11px; color: #666; text-align: left;">
            <div style="margin-bottom: 4px;"><strong>Criminalité:</strong> ${zone.criminalite}</div>
            <div style="margin-bottom: 4px;"><strong>Pollution:</strong> ${zone.pollution}</div>
            <div><strong>Infrastructure:</strong> ${zone.infrastructure}/5</div>
          </div>
        </div>
      `)
    })

    markersAddedRef.current = true
    console.log("Successfully added", fesZones.length, "markers to the map")
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && !mapInstanceRef.current && isClient) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)

      const style = document.createElement("style")
      style.textContent = `
        .custom-zone-marker {
          pointer-events: auto !important;
          cursor: pointer !important;
        }
        .custom-zone-marker * {
          pointer-events: none !important;
        }
        .leaflet-marker-icon {
          cursor: pointer !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        .leaflet-popup-tip {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        }
      `
      document.head.appendChild(style)

      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = () => {
        const L = (window as any).L

        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        })

        const mapInstance = L.map(mapRef.current, {
          center: [34.0382, -4.9992], // Centré sur Agdal (Fès)
          zoom: 12,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true,
        })

        L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 18,
        }).addTo(mapInstance)

        mapInstanceRef.current = mapInstance

        setTimeout(() => {
          mapInstance.invalidateSize()
          setTimeout(() => {
            console.log("Adding zone markers...")
            addZoneMarkers()
            console.log("Zone markers added successfully")
          }, 500)
        }, 300)
      }
      document.head.appendChild(script)
    }
  }, [isClient, addZoneMarkers])

  if (!isClient) {
    return (
      <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement de la carte de Fès...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar avec légende et détails */}
        <div className="lg:col-span-1 space-y-4">
          {/* Recherche */}
          <Card>
            <CardHeader>
              <CardTitle>Rechercher une zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Nom de la zone..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setSearchError(null)
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {searchError && (
                <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <X className="h-4 w-4" />
                  <span>{searchError}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Légende */}
          <Card>
            <CardHeader>
              <CardTitle>Légende des zones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm">Faible</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Modéré</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm">Élevé</span>
              </div>
            </CardContent>
          </Card>

          {/* Détails de la zone sélectionnée */}
          {selectedZone && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {selectedZone.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="text-center p-3 rounded-lg border"
                    style={{
                      backgroundColor: `${getCriminaliteColor(selectedZone.criminalite)}20`,
                      borderColor: getCriminaliteColor(selectedZone.criminalite),
                    }}
                  >
                    <div
                      className="text-2xl font-bold"
                      style={{
                        color: getCriminaliteColor(selectedZone.criminalite),
                      }}
                    >
                      {selectedZone.criminalite}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Criminalité</div>
                  </div>
                  <div
                    className="text-center p-3 rounded-lg border"
                    style={{
                      backgroundColor: `${getPollutionColor(selectedZone.pollution)}20`,
                      borderColor: getPollutionColor(selectedZone.pollution),
                    }}
                  >
                    <div
                      className="text-2xl font-bold"
                      style={{
                        color: getPollutionColor(selectedZone.pollution),
                      }}
                    >
                      {selectedZone.pollution}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Pollution</div>
                  </div>
                </div>

                <div className="text-center p-3 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < selectedZone.infrastructure ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Infrastructure ({selectedZone.infrastructure}/5)
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-r from-red-100 to-green-100 dark:from-red-900 dark:to-green-900 rounded-lg">
                  <Badge
                    className="text-lg px-4 py-2"
                    style={{
                      backgroundColor: getRiskColor(selectedZone.riskLevel),
                      color: "white",
                    }}
                  >
                    Risque {selectedZone.riskLevel}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Carte principale */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] overflow-hidden">
            <CardContent className="p-4 h-full">
              <div ref={mapRef} className="w-full h-full rounded-lg" style={{ minHeight: "500px" }} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section Commentaires et Évaluations */}
      {selectedZone && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Commentaires et Évaluations - {selectedZone.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left column: Add comment form */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Ajouter un commentaire</h3>
                <Textarea
                  placeholder="Partagez votre expérience sur cette zone..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />

                {/* Rating form always visible */}
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-medium">Évaluer la zone</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Votre évaluation sera publiée avec votre commentaire
                  </p>
                  {renderSliderRating(
                    userRating.criminalite,
                    (rating) => setUserRating((prev) => ({ ...prev, criminalite: rating })),
                    "Criminalité",
                  )}
                  {renderSliderRating(
                    userRating.pollution,
                    (rating) => setUserRating((prev) => ({ ...prev, pollution: rating })),
                    "Pollution",
                  )}
                  {renderStarRating(
                    userRating.infrastructure,
                    (rating) => setUserRating((prev) => ({ ...prev, infrastructure: rating })),
                    "Infrastructure",
                  )}
                </div>

                <Button onClick={addComment} className="w-full" disabled={!newComment.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Publier le commentaire
                </Button>
              </div>

              {/* Right column: Comments list */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Commentaires ({zoneComments[selectedZone.id]?.length || 0})</h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {zoneComments[selectedZone.id]?.length > 0 ? (
                    zoneComments[selectedZone.id].map((comment) => (
                      <div key={comment.id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="font-medium text-sm">{comment.author}</span>
                            <span className="text-xs text-gray-500 ml-2">{comment.timestamp.toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => startEditComment(comment)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {editingComment === comment.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="min-h-[60px]"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={saveEditComment}>
                                Sauvegarder
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setEditingComment(null)}>
                                Annuler
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm mb-3">{comment.content}</p>

                            {/* User ratings display */}
                            {comment.userRatings && (
                              <div className="space-y-1 mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                                <div className="font-medium mb-2">Évaluations de l'utilisateur:</div>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="text-center">
                                    <div className="font-semibold text-blue-600">
                                      {comment.userRatings.criminalite}/100
                                    </div>
                                    <div className="text-gray-600">Criminalité</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-green-600">
                                      {comment.userRatings.pollution}/100
                                    </div>
                                    <div className="text-gray-600">Pollution</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-yellow-600">
                                      {comment.userRatings.infrastructure}/5
                                    </div>
                                    <div className="text-gray-600">Infrastructure</div>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => likeComment(comment.id)}
                                className="text-xs"
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                {comment.likes}
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">
                        Aucun commentaire pour cette zone.
                        <br />
                        Soyez le premier à partager votre expérience !
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
