"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Send, ThumbsUp, Reply } from "lucide-react"

interface Comment {
  id: number
  author: string
  content: string
  timestamp: string
  likes: number
  replies?: Comment[]
}

interface CommentSectionProps {
  title?: string
  placeholder?: string
  context?: string
}

export default function CommentSection({
  title = "Commentaires",
  placeholder = "Partagez votre avis...",
  context = "general",
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    // Load user data from localStorage
    const user = localStorage.getItem("user")
    if (user) {
      setUserData(JSON.parse(user))
    }

    // Load mock comments based on context
    const mockComments: Comment[] = [
      {
        id: 1,
        author: "Marie Dubois",
        content: "Excellente analyse des risques. Les données sur Casablanca sont particulièrement préoccupantes.",
        timestamp: "Il y a 2 heures",
        likes: 5,
        replies: [
          {
            id: 2,
            author: "Ahmed Benali",
            content: "Je suis d'accord, il faudrait renforcer la surveillance dans cette zone.",
            timestamp: "Il y a 1 heure",
            likes: 2,
          },
        ],
      },
      {
        id: 3,
        author: "Jean Martin",
        content: "Les infrastructures de Rabat semblent bien développées. Un bon exemple à suivre.",
        timestamp: "Il y a 4 heures",
        likes: 8,
      },
    ]
    setComments(mockComments)
  }, [context])

  const handleSubmitComment = () => {
    if (!newComment.trim() || !userData) return

    const comment: Comment = {
      id: Date.now(),
      author: `${userData.first_name} ${userData.last_name}`,
      content: newComment,
      timestamp: "À l'instant",
      likes: 0,
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  const handleLike = (commentId: number) => {
    setComments(
      comments.map((comment) => (comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment)),
    )
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
                disabled={!newComment.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Publier
              </Button>
            </div>
          </div>
        )}

        {/* Comments list */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-600 text-white text-sm">
                    {comment.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{comment.author}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(comment.id)}
                      className="text-xs h-auto p-1"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {comment.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs h-auto p-1">
                      <Reply className="h-3 w-3 mr-1" />
                      Répondre
                    </Button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-8 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-green-600 text-white text-xs">
                          {reply.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs">{reply.author}</span>
                          <span className="text-xs text-gray-500">{reply.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300">{reply.content}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(reply.id)}
                          className="text-xs h-auto p-1"
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {reply.likes}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {comments.length === 0 && (
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
