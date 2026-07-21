import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      )
    }

    // Appel au backend Python
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
    
    const response = await fetch(`${backendUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: message,
      }),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      response: data.answer,
      source: data.source,
    })

  } catch (error) {
    console.error('Erreur chatbot:', error)
    
    // Fallback en cas d'erreur
    return NextResponse.json({
      response: "Désolé, je rencontre actuellement des difficultés techniques. Veuillez réessayer plus tard.",
      source: "error"
    })
  }
}


