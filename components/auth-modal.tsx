"use client"

import { API_URL } from "@/lib/api"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  X, 
  Eye, 
  EyeOff, 
  Shield, 
  MapPin, 
  Globe, 
  AlertTriangle,
  CheckCircle,
  User,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  Trophy,
  Flag,
  ArrowLeft,
  Key,
  RefreshCw
} from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "login" | "register" | "forgot-password" | "reset-password"
  onModeChange: (mode: "login" | "register" | "forgot-password" | "reset-password") => void
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [resetToken, setResetToken] = useState("")

  // États pour le formulaire - correspondant à la structure de la DB
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    first_name: "",
    last_name: ""
  })

  // Charger les données sauvegardées au montage du composant
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail")
    const savedRememberMe = localStorage.getItem("rememberMe")
    
    if (savedEmail && savedRememberMe === "true") {
      setFormData(prev => ({ ...prev, email: savedEmail }))
      setRememberMe(true)
    }
  }, [])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    console.log("🚀 Tentative d'authentification:", mode)
    console.log("📝 Données du formulaire:", formData)

    try {
      if (mode === "forgot-password") {
        await handleForgotPassword()
      } else if (mode === "reset-password") {
        await handleResetPassword()
      } else {
        await handleAuth()
      }
    } catch (error) {
      console.error("💥 Erreur:", error)
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: formData.email })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        // En mode développement, on peut afficher le token pour les tests
        if (data.token) {
          console.log("🔑 Token de réinitialisation:", data.token)
          setResetToken(data.token)
        }
        setTimeout(() => {
          onModeChange("reset-password")
        }, 2000)
      } else {
        setError(data.detail || "Une erreur est survenue")
      }
    } catch (error) {
      console.error("💥 Erreur lors de la demande de réinitialisation:", error)
      setError("Erreur de connexion au serveur. Vérifiez que le backend est démarré.")
    }
  }

  const handleResetPassword = async () => {
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    if (formData.newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          token: resetToken,
          new_password: formData.newPassword 
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Mot de passe réinitialisé avec succès ! Redirection vers la connexion...")
        setTimeout(() => {
          onModeChange("login")
          setFormData({ email: "", password: "", confirmPassword: "", newPassword: "", confirmNewPassword: "", first_name: "", last_name: "" })
          setResetToken("")
        }, 2000)
      } else {
        setError(data.detail || "Une erreur est survenue")
      }
    } catch (error) {
      console.error("💥 Erreur lors de la réinitialisation:", error)
      setError("Erreur de connexion au serveur. Vérifiez que le backend est démarré.")
    }
  }

  const handleAuth = async () => {
    const endpoint = mode === "login" ? "login" : "register"
    const payload = mode === "login" 
      ? { email: formData.email, password: formData.password }
      : { 
          email: formData.email, 
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name
        }

    console.log("📤 Payload envoyé:", payload)

    const response = await fetch(`${API_URL}/auth/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    console.log("📥 Réponse du serveur:", response.status, response.statusText)

    const data = await response.json()
    console.log("📄 Données reçues:", data)

    if (response.ok) {
      if (mode === "login") {
        console.log("✅ Connexion réussie, stockage du token...")
        localStorage.setItem("authToken", data.access_token)
        localStorage.setItem("user", JSON.stringify(data.user))
        
        // Gérer "Se souvenir de moi"
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email)
          localStorage.setItem("rememberMe", "true")
        } else {
          localStorage.removeItem("rememberedEmail")
          localStorage.removeItem("rememberMe")
        }
        
        
        // Redirection immédiate
        setTimeout(() => {
          console.log("🔄 Redirection vers /dashboard...")
          onClose()
          window.location.href = "/dashboard"
        }, 1000)
      } else {
        console.log("✅ Inscription réussie, connexion automatique...")
        
        // Connexion automatique après inscription
        try {
          const loginResponse = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
              email: formData.email, 
              password: formData.password 
            })
          })

          if (loginResponse.ok) {
            const loginData = await loginResponse.json()
            localStorage.setItem("authToken", loginData.access_token)
            localStorage.setItem("user", JSON.stringify(loginData.user))
            
            // Gérer "Se souvenir de moi" pour la connexion automatique
            if (rememberMe) {
              localStorage.setItem("rememberedEmail", formData.email)
              localStorage.setItem("rememberMe", "true")
            }
            
            setSuccess("Compte créé et connexion réussie ! Redirection...")
            
            // Redirection immédiate
            setTimeout(() => {
              console.log("🔄 Redirection vers /dashboard après inscription...")
              onClose()
              window.location.href = "/dashboard"
            }, 1500)
          } else {
            // Si la connexion automatique échoue, afficher un message de succès pour l'inscription
            setSuccess("Compte créé avec succès ! Vous pouvez maintenant vous connecter.")
            setTimeout(() => {
              onModeChange("login")
              setFormData({ email: "", password: "", confirmPassword: "", newPassword: "", confirmNewPassword: "", first_name: "", last_name: "" })
            }, 2000)
          }
        } catch (loginError) {
          console.error("💥 Erreur lors de la connexion automatique:", loginError)
          setSuccess("Compte créé avec succès ! Vous pouvez maintenant vous connecter.")
          setTimeout(() => {
            onModeChange("login")
            setFormData({ email: "", password: "", confirmPassword: "", newPassword: "", confirmNewPassword: "", first_name: "", last_name: "" })
          }, 2000)
        }
      }
    } else {
      console.log("❌ Erreur du serveur:", data)
      // S'assurer que l'erreur est une chaîne de caractères
      const errorMessage = typeof data.detail === 'string' 
        ? data.detail 
        : typeof data.detail === 'object' && data.detail?.msg
        ? data.detail.msg
        : "Une erreur est survenue"
      setError(errorMessage)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Validation simplifiée
  const isFormValid = () => {
    if (mode === "login") {
      return formData.email.trim() !== "" && formData.password.trim() !== ""
    } else if (mode === "register") {
      return formData.email.trim() !== "" && 
             formData.password.trim() !== "" && 
             formData.confirmPassword.trim() !== "" &&
             formData.first_name.trim() !== "" &&
             formData.last_name.trim() !== "" &&
             formData.password === formData.confirmPassword
    } else if (mode === "forgot-password") {
      return formData.email.trim() !== ""
    } else if (mode === "reset-password") {
      return formData.newPassword.trim() !== "" && 
             formData.confirmNewPassword.trim() !== "" &&
             formData.newPassword === formData.confirmNewPassword &&
             formData.newPassword.length >= 6
    }
    return false
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-red-50 to-green-50 dark:from-gray-900 dark:via-red-900/20 dark:to-green-900/20">
          <CardHeader className={`relative ${mode === "register" ? "pb-4" : "pb-6"}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-4 top-4 h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <X className="h-4 w-4 text-red-600" />
            </Button>
            
            <div className={`text-center ${mode === "register" ? "space-y-2" : "space-y-3"}`}>
              {/* Logo avec thème marocain */}
              <div className={`flex justify-center ${mode === "register" ? "mb-3" : "mb-4"}`}>
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-600 via-red-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <Trophy className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                    <Flag className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                Morocco 2030
              </CardTitle>
              
              <CardDescription className="text-gray-600 dark:text-gray-400 text-lg">
                {mode === "login" 
                  ? "Accédez à l'analyse des risques"
                  : "Rejoignez notre plateforme"
                }
              </CardDescription>

              {/* Badge de sécurité */}
              <div className="flex justify-center mt-4">
                <Badge variant="secondary" className="bg-gradient-to-r from-red-100 to-green-100 text-red-800 dark:from-red-900/30 dark:to-green-900/30 dark:text-red-200 border border-red-200 dark:border-red-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Connexion sécurisée
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className={`${mode === "register" ? "space-y-3" : "space-y-6"}`}>
            {/* Messages d'erreur/succès */}
            {error && (
              <div className="flex items-center space-x-2 p-3 text-sm border border-red-200 bg-red-50 text-red-800 rounded-lg">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center space-x-2 p-3 text-sm border border-green-200 bg-green-50 text-green-800 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                <span>{success}</span>
              </div>
            )}

            {/* Navigation entre les modes */}
            {mode !== "forgot-password" && mode !== "reset-password" && (
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => onModeChange("login")}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                    mode === "login"
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Connexion</span>
                </button>
                <button
                  type="button"
                  onClick={() => onModeChange("register")}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                    mode === "register"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Inscription</span>
                </button>
              </div>
            )}

            {/* Bouton retour pour les modes spéciaux */}
            {(mode === "forgot-password" || mode === "reset-password") && (
              <button
                type="button"
                onClick={() => onModeChange("login")}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour à la connexion</span>
              </button>
            )}

            <form onSubmit={handleSubmit} className={`${mode === "register" ? "space-y-3 mt-3" : "space-y-4 mt-6"}`}>
              {/* Mode Connexion */}
              {mode === "login" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="login-email" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <Mail className="h-4 w-4 text-red-600" />
                      <span>Email</span>
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Entrez votre email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="login-password" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <Lock className="h-4 w-4 text-red-600" />
                      <span>Mot de passe</span>
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Entrez votre mot de passe"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Checkbox "Se souvenir de moi" */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                    <Label 
                      htmlFor="remember-me" 
                      className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      Se souvenir de moi
                    </Label>
                  </div>

                  {/* Lien "Mot de passe oublié" */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => onModeChange("forgot-password")}
                      className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                </div>
              )}

              {/* Mode Inscription */}
              {mode === "register" && (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="register-first-name" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                        <User className="h-4 w-4 text-green-600" />
                        <span>Prénom</span>
                      </Label>
                      <Input
                        id="register-first-name"
                        type="text"
                        placeholder="Votre prénom"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange("first_name", e.target.value)}
                        className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="register-last-name" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                        <User className="h-4 w-4 text-green-600" />
                        <span>Nom</span>
                      </Label>
                      <Input
                        id="register-last-name"
                        type="text"
                        placeholder="Votre nom"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange("last_name", e.target.value)}
                        className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="register-email" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <Mail className="h-4 w-4 text-green-600" />
                      <span>Email</span>
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Entrez votre email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="register-password" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <Lock className="h-4 w-4 text-green-600" />
                      <span>Mot de passe</span>
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Créez un mot de passe"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="register-confirm-password" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <Lock className="h-4 w-4 text-green-600" />
                      <span>Confirmer le mot de passe</span>
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="register-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmez votre mot de passe"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Checkbox "Se souvenir de moi" pour l'inscription */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me-register"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <Label 
                      htmlFor="remember-me-register" 
                      className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      Se souvenir de moi
                    </Label>
                  </div>
                </div>
              )}

              {/* Mode Mot de passe oublié */}
              {mode === "forgot-password" && (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto">
                      <Key className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Mot de passe oublié
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Entrez votre email pour recevoir un lien de réinitialisation
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="forgot-email" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <Mail className="h-4 w-4 text-orange-600" />
                      <span>Email</span>
                    </Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="Entrez votre email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Mode Réinitialisation de mot de passe */}
              {mode === "reset-password" && (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                      <RefreshCw className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Nouveau mot de passe
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Créez votre nouveau mot de passe
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="new-password" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <Lock className="h-4 w-4 text-blue-600" />
                      <span>Nouveau mot de passe</span>
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Entrez votre nouveau mot de passe"
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange("newPassword", e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirm-new-password" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <Lock className="h-4 w-4 text-blue-600" />
                      <span>Confirmer le nouveau mot de passe</span>
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="confirm-new-password"
                        type={showConfirmNewPassword ? "text" : "password"}
                        placeholder="Confirmez votre nouveau mot de passe"
                        value={formData.confirmNewPassword}
                        onChange={(e) => handleInputChange("confirmNewPassword", e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      >
                        {showConfirmNewPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className={`w-full font-semibold py-3 transition-all duration-300 ${
                  mode === "login" 
                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                    : mode === "register"
                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                    : mode === "forgot-password"
                    ? "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                }`}
                disabled={isLoading || !isFormValid()}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Chargement...</span>
                  </div>
                ) : (
                  <span>
                    {mode === "login" ? "Se connecter" 
                     : mode === "register" ? "S'inscrire"
                     : mode === "forgot-password" ? "Envoyer le lien"
                     : "Réinitialiser le mot de passe"}
                  </span>
                )}
              </Button>
            </form>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Informations supplémentaires */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-red-600" />
                  <span>Maroc 2030</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4 text-green-600" />
                  <span>Analyse des risques</span>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
