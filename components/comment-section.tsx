"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send, ThumbsUp, Clock } from "lucide-react"

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  likes: number
  isLiked: boolean
}

interface CommentSectionProps {
  title?: string
  placeholder?: string
  context?: string // "dashboard" | "city" | "morocco"
  cityName?: string
}

export default function CommentSection({
  title = "Commentaires de la communauté",
  placeholder = "Partagez votre avis, vos observations ou vos suggestions...",
  context = "dashboard",
  cityName,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Ahmed Benali",
      content: "Excellente initiative ! Les données sur la sécurité sont très utiles pour planifier nos déplacements.",
      timestamp: "Il y a 2 heures",
      likes: 12,
      isLiked: false,
    },
    {
      id: "2",
      author: "Fatima Zahra",
      content:
        "J'aimerais voir plus d'informations sur les transports en commun, surtout pour les horaires en temps réel.",
      timestamp: "Il y a 5 heures",
      likes: 8,
      isLiked: true,
    },
    {
      id: "3",
      author: "Youssef Alami",
      content: cityName
        ? `Les informations sur ${cityName} sont très précises. Merci pour ce travail !`
        : "Interface très intuitive, félicitations à l'équipe !",
      timestamp: "Il y a 1 jour",
      likes: 15,
      isLiked: false,
    },
  ])

  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)

    // Simuler l'ajout d'un commentaire
    const comment: Comment = {
      id: Date.now().toString(),
      author: "Mohammed Alami", // Utilisateur connecté
      content: newComment,
      timestamp: "À l'instant",
      likes: 0,
      isLiked: false,
    }

    setComments([comment, ...comments])
    setNewComment("")
    setIsSubmitting(false)
  }

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              isLiked: !comment.isLiked,
            }
          : comment,
      ),
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {cityName
            ? `Partagez vos expériences et observations sur ${cityName}`
            : "Partagez vos retours sur la plateforme Morocco 2030"}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Zone de saisie nouveau commentaire */}
        <div className="space-y-3">
          <Textarea
            placeholder={placeholder}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">{newComment.length}/500 caractères</p>
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Publication..." : "Publier"}
            </Button>
          </div>
        </div>

        {/* Liste des commentaires */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {comments.length} commentaire{comments.length > 1 ? "s" : ""}
            </h4>
          </div>

          {comments.map((comment) => (
            <div key={comment.id} className="border-l-2 border-blue-100 dark:border-blue-900 pl-4 py-3">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                    {comment.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">{comment.author}</span>
                    <span className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {comment.timestamp}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>

                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikeComment(comment.id)}
                      className={`text-xs ${comment.isLiked ? "text-blue-600" : "text-gray-500"}`}
                    >
                      <ThumbsUp className={`h-3 w-3 mr-1 ${comment.isLiked ? "fill-current" : ""}`} />
                      {comment.likes}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
