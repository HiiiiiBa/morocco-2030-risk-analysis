"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Send, ThumbsUp, Reply } from "lucide-react"

interface Comment {
  id: string
  author: string
  date: string
  rating: number
  comment: string
  avatar?: string
}

interface CommentSectionProps {
  title?: string
  placeholder?: string
  context?: string
  cityId?: string
  onCommentAdded?: () => void
}

export default function CommentSection({
  title = "Commentaires",
  placeholder = "Partagez votre avis...",
  context = "general",
  cityId = "casablanca",
  onCommentAdded,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Fonction pour charger les commentaires depuis l'API
  const loadComments = async () => {
    if (!cityId) return
    
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/cities/${cityId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commentaires:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Load user data from localStorage
    const user = localStorage.getItem("user")
    if (user) {
      setUserData(JSON.parse(user))
    }

    // Load comments from API
    loadComments()
  }, [cityId])

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !userData || !cityId) return

    setSubmitting(true)
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        alert("Vous devez être connecté pour poster un commentaire")
        return
      }

      // Créer un objet de review pour l'API
      const reviewData = {
        city_id: cityId,
        criminalite: 3, // Valeur par défaut, vous pouvez ajouter des sliders pour ces valeurs
        pollution: 3,
        infrastructure: 3,
        commentaire: newComment
      }

      const response = await fetch(`http://localhost:8000/cities/${cityId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      })

      if (response.ok) {
        console.log("Commentaire ajouté avec succès, rafraîchissement des données...")
        // Recharger les commentaires après ajout
        await loadComments()
        setNewComment("")
        // Attendre un peu pour que le backend recalcule les scores
        setTimeout(() => {
          console.log("Rafraîchissement des données de la ville...")
          // Déclencher le rafraîchissement des données de la ville
          if (onCommentAdded) {
            onCommentAdded()
          }
        }, 800) // Délai de 800ms pour laisser le temps au backend de recalculer
      } else {
        const errorData = await response.json()
        alert(`Erreur: ${errorData.detail || "Impossible d'ajouter le commentaire"}`)
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error)
      alert("Erreur lors de l'ajout du commentaire")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* New comment form */}
        {userData && (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-red-600 text-white text-sm">
                  {userData.first_name?.[0]}
                  {userData.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder={placeholder}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
                className="bg-red-600 hover:bg-red-700"
              >
                <Send className="h-4 w-4 mr-2" />
                {submitting ? "Publication..." : "Publier"}
              </Button>
            </div>
          </div>
        )}

        {/* Comments list */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">
              <p>Chargement des commentaires...</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-600 text-white text-sm">
                      {comment.avatar || comment.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.date}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-xs ${i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{comment.comment}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Aucun commentaire pour le moment.</p>
            <p className="text-sm">Soyez le premier à partager votre avis !</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
