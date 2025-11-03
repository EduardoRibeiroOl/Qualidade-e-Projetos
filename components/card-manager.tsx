"use client"

import { useState, useEffect } from "react"
import CardGrid from "./card-grid"
import CardModal from "./card-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export interface CardContent {
  type: "text" | "function" | "file" | "chart"
  value: string
  title?: string
  metadata?: Record<string, any>
}

export interface CardItem {
  id: number
  title: string
  description: string
  contents: CardContent[]
  createdAt: number
}

const LOCAL_STORAGE_KEY = "card-manager-v2"

export default function CardManager() {
  const [cards, setCards] = useState<CardItem[]>([])
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Load cards from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (stored) {
        setCards(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Error loading cards:", error)
    }
  }, [])

  // Save cards to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cards))
    } catch (error) {
      console.error("Error saving cards:", error)
    }
  }, [cards])

  const handleCreateCard = () => {
    const newCard: CardItem = {
      id: Date.now(),
      title: "Untitled Card",
      description: "Add a description...",
      contents: [],
      createdAt: Date.now(),
    }
    setCards([...cards, newCard])
    setSelectedCard(newCard)
    setIsModalOpen(true)
  }

  const handleUpdateCard = (updatedCard: CardItem) => {
    setCards(cards.map((card) => (card.id === updatedCard.id ? updatedCard : card)))
    setSelectedCard(updatedCard)
  }

  const handleDeleteCard = (cardId: number) => {
    setCards(cards.filter((card) => card.id !== cardId))
    if (selectedCard?.id === cardId) {
      setSelectedCard(null)
      setIsModalOpen(false)
    }
  }

  const handleOpenCard = (card: CardItem) => {
    setSelectedCard(card)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Content Cards</h1>
          <p className="text-slate-600 mb-6">Organize and manage your content with flexibility</p>

          {/* Create Button */}
          <Button
            onClick={handleCreateCard}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Card
          </Button>
        </div>

        {/* Cards Grid */}
        {cards.length > 0 ? (
          <CardGrid cards={cards} onCardClick={handleOpenCard} onDeleteCard={handleDeleteCard} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">No cards yet</h2>
            <p className="text-slate-600 mb-6">Create your first card to get started</p>
            <Button onClick={handleCreateCard} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
              Create Card
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedCard && (
        <CardModal
          isOpen={isModalOpen}
          card={selectedCard}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdateCard}
          onDelete={handleDeleteCard}
        />
      )}
    </div>
  )
}
