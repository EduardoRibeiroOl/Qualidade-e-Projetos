"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  Plus,
  Trash2,
  X,
  FileText,
  Code,
  FileUp,
  BarChart3,
  DollarSign,
  Clock,
  CheckCircle,
  GripVertical,
  Settings,
  Home,
  Grid3x3,
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

// Types
interface CardContent {
  type: "text" | "function" | "file" | "chart"
  value: string
  title?: string
}

interface CardItem {
  id: number
  title: string
  description: string
  contents: CardContent[]
  createdAt: number
  type: "card" | "note" | "task" | "goal"
  x?: number
  y?: number
}

interface FinancialEntry {
  id: number
  date: string
  category: string
  amount: number
  type: "income" | "expense"
  description: string
}

interface Task {
  id: number
  title: string
  description: string
  dueDate: string
  priority: "low" | "medium" | "high"
  status: "todo" | "in-progress" | "completed"
  createdAt: number
  x?: number
  y?: number
}

interface Note {
  id: number
  title: string
  content: string
  color: "white" | "yellow" | "pink" | "blue" | "green"
  createdAt: number
  updatedAt: number
  x?: number
  y?: number
}

interface DashboardChart {
  id: number
  title: string
  type: "line" | "area" | "pie" | "bar"
  data: any[]
  dataKey?: string
  x: number
  y: number
  linkedToFinance?: boolean
}

interface DraggableItem {
  id: string
  x: number
  y: number
  type: string
}

// Constants
const STORAGE_KEYS = {
  CARDS: "card-manager-complete-v2",
  FINANCIAL: "financial-manager-complete-v2",
  TASKS: "task-manager-complete-v2",
  NOTES: "notes-manager-complete-v2",
  CHARTS: "dashboard-charts-complete-v2",
  LAYOUT: "dashboard-layout-complete-v2",
}

// UI Components
const Button = ({ onClick, className = "", children, variant = "default", disabled = false }: any) => {
  const baseStyles =
    "px-4 py-2.5 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants: Record<string, string> = {
    default: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md",
    outline: "border border-gray-300 hover:border-gray-400 text-gray-900 hover:bg-gray-50",
    ghost: "text-gray-900 hover:bg-gray-100",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    destructive: "text-red-600 hover:bg-red-50 border border-red-200",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </button>
  )
}

const Input = ({ value, onChange, placeholder, type = "text", className = "" }: any) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 transition-all ${className}`}
  />
)

const TextArea = ({ value, onChange, placeholder, className = "" }: any) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white text-gray-900 placeholder-gray-400 transition-all ${className}`}
  />
)

const Select = ({ value, onChange, options, className = "" }: any) => (
  <select
    value={value}
    onChange={onChange}
    className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 transition-all ${className}`}
  >
    {options.map((opt: any) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
)

export default function ProductivitySuite() {
  // State
  const [cards, setCards] = useState<CardItem[]>([])
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"canvas" | "dashboard" | "cards" | "financial" | "tasks" | "notes">(
    "canvas",
  )
  const [showContentSelector, setShowContentSelector] = useState(false)
  const [editedCard, setEditedCard] = useState<CardItem | null>(null)

  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>([])
  const [showFinancialForm, setShowFinancialForm] = useState(false)
  const [newEntry, setNewEntry] = useState<Partial<FinancialEntry>>({ type: "expense", category: "General" })

  const [tasks, setTasks] = useState<Task[]>([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [newTask, setNewTask] = useState<Partial<Task>>({ priority: "medium", status: "todo" })

  const [notes, setNotes] = useState<Note[]>([])
  const [showNotesForm, setShowNotesForm] = useState(false)
  const [newNote, setNewNote] = useState<Partial<Note>>({ color: "white" })

  const [dashboardCharts, setDashboardCharts] = useState<DashboardChart[]>([])
  const [editingChart, setEditingChart] = useState<DashboardChart | null>(null)

  const [draggedItem, setDraggedItem] = useState<{ id: string; type: string; offsetX: number; offsetY: number } | null>(
    null,
  )
  const canvasRef = useRef<HTMLDivElement>(null)

  // Load data
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CARDS)
      if (stored) setCards(JSON.parse(stored))

      const financialStored = localStorage.getItem(STORAGE_KEYS.FINANCIAL)
      if (financialStored) setFinancialEntries(JSON.parse(financialStored))

      const tasksStored = localStorage.getItem(STORAGE_KEYS.TASKS)
      if (tasksStored) setTasks(JSON.parse(tasksStored))

      const notesStored = localStorage.getItem(STORAGE_KEYS.NOTES)
      if (notesStored) setNotes(JSON.parse(notesStored))

      const chartsStored = localStorage.getItem(STORAGE_KEYS.CHARTS)
      if (chartsStored) setDashboardCharts(JSON.parse(chartsStored))
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }, [])

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards))
  }, [cards])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FINANCIAL, JSON.stringify(financialEntries))
  }, [financialEntries])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHARTS, JSON.stringify(dashboardCharts))
  }, [dashboardCharts])

  const handleMouseDown = (e: React.MouseEvent, itemId: string, itemType: string) => {
    const element = (e.target as HTMLElement).closest("[data-draggable]")
    if (!element) return

    const rect = element.getBoundingClientRect()

    setDraggedItem({
      id: itemId,
      type: itemType,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedItem || !canvasRef.current) return

    const canvasRect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - canvasRect.left - draggedItem.offsetX
    const y = e.clientY - canvasRect.top - draggedItem.offsetY

    const constrainedX = Math.max(0, x)
    const constrainedY = Math.max(0, y)

    if (draggedItem.type === "chart") {
      setDashboardCharts(
        dashboardCharts.map((chart) =>
          chart.id.toString() === draggedItem.id ? { ...chart, x: constrainedX, y: constrainedY } : chart,
        ),
      )
    } else if (draggedItem.type === "card") {
      setCards(
        cards.map((card) =>
          card.id.toString() === draggedItem.id ? { ...card, x: constrainedX, y: constrainedY } : card,
        ),
      )
    } else if (draggedItem.type === "task") {
      setTasks(
        tasks.map((task) =>
          task.id.toString() === draggedItem.id ? { ...task, x: constrainedX, y: constrainedY } : task,
        ),
      )
    } else if (draggedItem.type === "note") {
      setNotes(
        notes.map((note) =>
          note.id.toString() === draggedItem.id ? { ...note, x: constrainedX, y: constrainedY } : note,
        ),
      )
    }
  }

  const handleMouseUp = () => {
    setDraggedItem(null)
  }

  const generateFinancialChartData = () => {
    const byCategory = financialEntries.reduce((acc, entry) => {
      const existing = acc.find((e: any) => e.name === entry.category)
      if (existing) {
        existing.income += entry.type === "income" ? entry.amount : 0
        existing.expense += entry.type === "expense" ? entry.amount : 0
      } else {
        acc.push({
          name: entry.category,
          income: entry.type === "income" ? entry.amount : 0,
          expense: entry.type === "expense" ? entry.amount : 0,
        })
      }
      return acc
    }, [] as any[])
    return byCategory
  }

  const generateIncomeExpensePie = () => {
    const totalIncome = financialEntries.filter((e) => e.type === "income").reduce((sum, e) => sum + e.amount, 0)
    const totalExpense = financialEntries.filter((e) => e.type === "expense").reduce((sum, e) => sum + e.amount, 0)
    return [
      { name: "Income", value: totalIncome },
      { name: "Expense", value: totalExpense },
    ]
  }

  // Card functions
  const handleCreateCard = () => {
    const newCard: CardItem = {
      id: Date.now(),
      title: "Untitled Card",
      description: "Add a description...",
      contents: [],
      createdAt: Date.now(),
      type: "card",
      x: 0,
      y: 0,
    }
    setCards([...cards, newCard])
    setSelectedCard(newCard)
    setEditedCard(newCard)
    setIsModalOpen(true)
  }

  const handleOpenCard = (card: CardItem) => {
    setSelectedCard(card)
    setEditedCard(JSON.parse(JSON.stringify(card)))
    setIsModalOpen(true)
  }

  const handleUpdateCard = (updatedCard: CardItem) => {
    setCards(cards.map((card) => (card.id === updatedCard.id ? updatedCard : card)))
    setSelectedCard(updatedCard)
    setEditedCard(updatedCard)
  }

  const handleDeleteCard = (cardId: number) => {
    setCards(cards.filter((card) => card.id !== cardId))
    if (selectedCard?.id === cardId) {
      setSelectedCard(null)
      setIsModalOpen(false)
    }
  }

  const handleAddContent = (type: "text" | "function" | "file" | "chart") => {
    if (!editedCard) return
    const newContent: CardContent = {
      type,
      value: "",
      title: `New ${type}`,
    }
    const updated = {
      ...editedCard,
      contents: [...editedCard.contents, newContent],
    }
    setEditedCard(updated)
    setShowContentSelector(false)
  }

  const handleUpdateContent = (index: number, content: CardContent) => {
    if (!editedCard) return
    const newContents = [...editedCard.contents]
    newContents[index] = content
    setEditedCard({ ...editedCard, contents: newContents })
  }

  const handleRemoveContent = (index: number) => {
    if (!editedCard) return
    setEditedCard({
      ...editedCard,
      contents: editedCard.contents.filter((_, i) => i !== index),
    })
  }

  const handleSave = () => {
    if (!editedCard) return
    handleUpdateCard(editedCard)
    setIsModalOpen(false)
  }

  // Task functions
  const handleAddTask = () => {
    if (!newTask.title) return
    const task: Task = {
      id: Date.now(),
      title: newTask.title || "",
      description: newTask.description || "",
      dueDate: newTask.dueDate || "",
      priority: newTask.priority || "medium",
      status: "todo",
      createdAt: Date.now(),
      x: 0,
      y: 0,
    }
    setTasks([...tasks, task])
    setNewTask({ priority: "medium", status: "todo" })
    setShowTaskForm(false)
  }

  const handleUpdateTask = (taskId: number, updates: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)))
  }

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter((t) => t.id !== taskId))
  }

  // Notes functions
  const handleAddNote = () => {
    if (!newNote.title || !newNote.content) return
    const note: Note = {
      id: Date.now(),
      title: newNote.title || "",
      content: newNote.content || "",
      color: newNote.color || "white",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      x: 0,
      y: 0,
    }
    setNotes([...notes, note])
    setNewNote({ color: "white" })
    setShowNotesForm(false)
  }

  const handleUpdateNote = (noteId: number, updates: Partial<Note>) => {
    setNotes(notes.map((n) => (n.id === noteId ? { ...n, ...updates, updatedAt: Date.now() } : n)))
  }

  const handleDeleteNote = (noteId: number) => {
    setNotes(notes.filter((n) => n.id !== noteId))
  }

  // Financial functions
  const handleAddFinancialEntry = () => {
    if (!newEntry.date || !newEntry.amount) return
    const entry: FinancialEntry = {
      id: Date.now(),
      date: newEntry.date || "",
      category: newEntry.category || "General",
      amount: newEntry.amount || 0,
      type: newEntry.type || "expense",
      description: newEntry.description || "",
    }
    setFinancialEntries([...financialEntries, entry])
    setNewEntry({ type: "expense", category: "General" })
    setShowFinancialForm(false)
  }

  const handleDeleteFinancialEntry = (id: number) => {
    setFinancialEntries(financialEntries.filter((entry) => entry.id !== id))
  }

  // Chart functions
  const handleAddChart = (linkedToFinance = false) => {
    const newChart: DashboardChart = {
      id: Date.now(),
      title: linkedToFinance ? "Financial Overview" : "New Chart",
      type: linkedToFinance ? "bar" : "line",
      data: linkedToFinance
        ? generateFinancialChartData()
        : [
            { name: "Jan", value: 100 },
            { name: "Feb", value: 200 },
            { name: "Mar", value: 150 },
          ],
      dataKey: linkedToFinance ? "income" : "value",
      x: Math.random() * 200,
      y: Math.random() * 200,
      linkedToFinance,
    }
    setDashboardCharts([...dashboardCharts, newChart])
  }

  const handleUpdateChart = (chartId: number, updates: Partial<DashboardChart>) => {
    setDashboardCharts(dashboardCharts.map((c) => (c.id === chartId ? { ...c, ...updates } : c)))
    if (editingChart?.id === chartId) {
      setEditingChart({ ...editingChart, ...updates })
    }
  }

  const handleDeleteChart = (id: number) => {
    setDashboardCharts(dashboardCharts.filter((chart) => chart.id !== id))
    if (editingChart?.id === id) setEditingChart(null)
  }

  // Calculations
  const calculateFinancialStats = () => {
    const totalIncome = financialEntries.filter((e) => e.type === "income").reduce((sum, e) => sum + e.amount, 0)
    const totalExpense = financialEntries.filter((e) => e.type === "expense").reduce((sum, e) => sum + e.amount, 0)
    return { totalIncome, totalExpense, balance: totalIncome - totalExpense }
  }

  const stats = calculateFinancialStats()
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    todo: tasks.filter((t) => t.status === "todo").length,
  }

  const contentTypes = [
    { type: "text" as const, icon: FileText, label: "Text" },
    { type: "function" as const, icon: Code, label: "Function" },
    { type: "file" as const, icon: FileUp, label: "File" },
    { type: "chart" as const, icon: BarChart3, label: "Chart" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Workflow</h1>
            </div>

            <div className="hidden lg:flex items-center gap-1 overflow-x-auto">
              {(
                [
                  { id: "canvas", label: "Canvas", icon: Grid3x3 },
                  { id: "dashboard", label: "Dashboard", icon: Home },
                  { id: "cards", label: "Cards", icon: FileText },
                  { id: "tasks", label: "Tasks", icon: CheckCircle },
                  { id: "notes", label: "Notes", icon: FileText },
                  { id: "financial", label: "Finance", icon: DollarSign },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4 inline mr-2" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {activeTab === "canvas" && (
        <div
          ref={canvasRef}
          className="relative h-[calc(100vh-73px)] bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Background Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent),
                               linear-gradient(90deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent)`,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Add Elements Button */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <Button
              onClick={() => handleAddChart(false)}
              className="bg-black hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-md rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Chart
            </Button>
            <Button
              onClick={() => handleAddChart(true)}
              className="bg-black hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-md rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Finance Chart
            </Button>
            <Button
              onClick={handleCreateCard}
              className="bg-black hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-md rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Card
            </Button>
          </div>

          {/* Draggable Charts */}
          {dashboardCharts.map((chart, idx) => {
            const data = chart.linkedToFinance ? generateFinancialChartData() : chart.data
            return (
              <div
                key={chart.id}
                data-draggable
                onMouseDown={(e) => handleMouseDown(e, chart.id.toString(), "chart")}
                className="absolute bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-400 transition-all cursor-move group"
                style={{
                  left: `${chart.x}px`,
                  top: `${chart.y}px`,
                  width: "500px",
                  opacity: draggedItem?.id === chart.id.toString() ? 0.8 : 1,
                  animation: `slideIn 0.3s ease-out ${idx * 30}ms both`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{chart.title}</h3>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingChart(chart)}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteChart(chart.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <GripVertical className="w-4 h-4 text-gray-300 cursor-move" />
                  </div>
                </div>

                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    {chart.type === "line" && (
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey={chart.dataKey}
                          stroke="#2563eb"
                          strokeWidth={2}
                          dot={{ fill: "#2563eb" }}
                        />
                      </LineChart>
                    )}
                    {chart.type === "area" && (
                      <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey={chart.dataKey}
                          fill="#2563eb"
                          fillOpacity={0.2}
                          stroke="#2563eb"
                        />
                      </AreaChart>
                    )}
                    {chart.type === "bar" && (
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip />
                        <Bar dataKey={chart.dataKey} fill="#2563eb" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    )}
                    {chart.type === "pie" && (
                      <PieChart>
                        <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey={chart.dataKey} label>
                          {data.map((entry: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a"][index % 5]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            )
          })}

          {/* Draggable Cards */}
          {cards.slice(0, 3).map((card, idx) => (
            <div
              key={card.id}
              data-draggable
              onMouseDown={(e) => handleMouseDown(e, card.id.toString(), "card")}
              className="absolute bg-white border border-gray-200 rounded-xl p-5 hover:shadow-xl hover:border-blue-400 transition-all cursor-move group"
              style={{
                left: `${card.x || 50}px`,
                top: `${card.y || 100 + idx * 320}px`,
                width: "350px",
                opacity: draggedItem?.id === card.id.toString() ? 0.8 : 1,
                animation: `slideIn 0.3s ease-out ${idx * 30}ms both`,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex-1">{card.title}</h3>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenCard(card)}
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <GripVertical className="w-4 h-4 text-gray-300 cursor-move" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{card.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-600">{card.contents.length} items</span>
              </div>
            </div>
          ))}

          {/* Draggable Notes */}
          {notes.slice(0, 5).map((note, idx) => {
            const bgColor =
              note.color === "yellow"
                ? "bg-yellow-50"
                : note.color === "pink"
                  ? "bg-pink-50"
                  : note.color === "blue"
                    ? "bg-blue-50"
                    : note.color === "green"
                      ? "bg-green-50"
                      : "bg-white"
            const borderColor =
              note.color === "yellow"
                ? "border-yellow-200"
                : note.color === "pink"
                  ? "border-pink-200"
                  : note.color === "blue"
                    ? "border-blue-200"
                    : note.color === "green"
                      ? "border-green-200"
                      : "border-gray-200"

            return (
              <div
                key={note.id}
                data-draggable
                onMouseDown={(e) => handleMouseDown(e, note.id.toString(), "note")}
                className={`absolute ${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-xl transition-all cursor-move group`}
                style={{
                  left: `${note.x || 900}px`,
                  top: `${note.y || 100 + idx * 220}px`,
                  width: "280px",
                  opacity: draggedItem?.id === note.id.toString() ? 0.8 : 1,
                  animation: `slideIn 0.3s ease-out ${idx * 30}ms both`,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{note.title}</h3>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-gray-700 line-clamp-3">{note.content}</p>
              </div>
            )
          })}

          {dashboardCharts.length === 0 && cards.length === 0 && notes.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <BarChart3 className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">Click "Add Chart", "Card", or "Note" to get started</p>
            </div>
          )}

          <style>{`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}

      {/* Main content - rest of tabs remain the same as before */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Check your overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Balance",
                  value: `$${stats.balance.toFixed(2)}`,
                  icon: DollarSign,
                  color: stats.balance >= 0 ? "text-green-600" : "text-red-600",
                },
                {
                  label: "Tasks",
                  value: `${taskStats.completed}/${taskStats.total}`,
                  icon: CheckCircle,
                  color: "text-blue-600",
                },
                { label: "Notes", value: notes.length.toString(), icon: FileText, color: "text-purple-600" },
                {
                  label: "Charts",
                  value: dashboardCharts.length.toString(),
                  icon: BarChart3,
                  color: "text-orange-600",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all hover:border-gray-300 animate-in fade-in slide-in-from-top-4 duration-500"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                      <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <stat.icon className="w-8 h-8 text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial Tab */}
        {activeTab === "financial" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Financial Management</h1>
                <p className="text-gray-600 mt-2">Track your income and expenses</p>
              </div>
              <Button
                onClick={() => setShowFinancialForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Total Income", value: `$${stats.totalIncome.toFixed(2)}`, color: "text-green-600" },
                { label: "Total Expense", value: `$${stats.totalExpense.toFixed(2)}`, color: "text-red-600" },
                {
                  label: "Balance",
                  value: `$${stats.balance.toFixed(2)}`,
                  color: stats.balance >= 0 ? "text-green-600" : "text-red-600",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all hover:border-gray-300 animate-in fade-in slide-in-from-top-4 duration-500"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {financialEntries.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Financial Analytics</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Income vs Expense Pie Chart */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expense</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={generateIncomeExpensePie()} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                          <Cell fill="#10b981" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Category Breakdown Bar Chart */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">By Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={generateFinancialChartData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip />
                        <Bar dataKey="income" fill="#2563eb" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="expense" fill="#dc2626" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Add Entry Form */}
            {showFinancialForm && (
              <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="text-lg font-semibold text-gray-900">Add Financial Entry</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="date"
                      value={newEntry.date || ""}
                      onChange={(e: any) => setNewEntry({ ...newEntry, date: e.target.value })}
                    />
                    <Select
                      value={newEntry.type || "expense"}
                      onChange={(e: any) => setNewEntry({ ...newEntry, type: e.target.value })}
                      options={[
                        { value: "income", label: "Income" },
                        { value: "expense", label: "Expense" },
                      ]}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      value={newEntry.amount || ""}
                      onChange={(e: any) =>
                        setNewEntry({ ...newEntry, amount: Number.parseFloat(e.target.value) || 0 })
                      }
                      placeholder="Amount"
                    />
                    <Input
                      type="text"
                      value={newEntry.category || ""}
                      onChange={(e: any) => setNewEntry({ ...newEntry, category: e.target.value })}
                      placeholder="Category"
                    />
                  </div>
                  <TextArea
                    value={newEntry.description || ""}
                    onChange={(e: any) => setNewEntry({ ...newEntry, description: e.target.value })}
                    placeholder="Description (optional)"
                    className="h-20"
                  />
                  <div className="flex gap-3 justify-end pt-2">
                    <Button onClick={() => setShowFinancialForm(false)} variant="secondary" className="rounded-lg">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddFinancialEntry}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Add Entry
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Entries List */}
            {financialEntries.length > 0 ? (
              <div className="space-y-3">
                {[...financialEntries].reverse().map((entry, idx) => (
                  <div
                    key={entry.id}
                    className="bg-white rounded-xl p-5 flex items-center justify-between hover:shadow-md transition-all border border-gray-200 group animate-in fade-in slide-in-from-bottom-4 duration-300"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-gray-900">{entry.category}</p>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            entry.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {entry.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{entry.date}</p>
                      {entry.description && <p className="text-xs text-gray-600 mt-1">{entry.description}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-lg font-bold ${entry.type === "income" ? "text-green-600" : "text-red-600"}`}
                      >
                        {entry.type === "income" ? "+" : "-"}${entry.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleDeleteFinancialEntry(entry.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-gray-200 rounded-xl bg-white">
                <DollarSign className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">No entries yet. Create one to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* Cards, Tasks, Notes tabs remain the same as before */}
        {/* Cards Tab */}
        {activeTab === "cards" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Content Cards</h1>
                <p className="text-gray-600 mt-2">Organize your content with flexible cards</p>
              </div>
              <Button onClick={handleCreateCard} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                <Plus className="w-4 h-4 mr-2" />
                New Card
              </Button>
            </div>

            {cards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card, idx) => (
                  <button
                    key={card.id}
                    onClick={() => handleOpenCard(card)}
                    className="bg-white rounded-xl p-6 text-left transition-all hover:shadow-lg hover:border-blue-500 border border-gray-200 active:scale-95 group h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">{card.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">{card.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
                      <span className="text-xs font-medium text-gray-600">{card.contents.length} items</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteCard(card.id)
                        }}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-gray-200 rounded-xl bg-white">
                <FileText className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">No cards yet. Create one to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Tasks & Time</h1>
                <p className="text-gray-600 mt-2">Manage your tasks and deadlines effectively</p>
              </div>
              <Button
                onClick={() => setShowTaskForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </div>

            {/* Task Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total", value: taskStats.total, color: "text-gray-900" },
                { label: "Completed", value: taskStats.completed, color: "text-green-600" },
                { label: "In Progress", value: taskStats.inProgress, color: "text-blue-600" },
                { label: "To Do", value: taskStats.todo, color: "text-orange-600" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all hover:border-gray-300 animate-in fade-in slide-in-from-top-4 duration-500"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <p className="text-xs font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Add Task Form */}
            {showTaskForm && (
              <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
                <div className="space-y-4">
                  <Input
                    placeholder="Task title..."
                    value={newTask.title || ""}
                    onChange={(e: any) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                  <TextArea
                    placeholder="Description..."
                    value={newTask.description || ""}
                    onChange={(e: any) => setNewTask({ ...newTask, description: e.target.value })}
                    className="h-24"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      type="date"
                      value={newTask.dueDate || ""}
                      onChange={(e: any) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                    <Select
                      value={newTask.priority || "medium"}
                      onChange={(e: any) => setNewTask({ ...newTask, priority: e.target.value })}
                      options={[
                        { value: "low", label: "Low" },
                        { value: "medium", label: "Medium" },
                        { value: "high", label: "High" },
                      ]}
                    />
                    <Select
                      value={newTask.status || "todo"}
                      onChange={(e: any) => setNewTask({ ...newTask, status: e.target.value })}
                      options={[
                        { value: "todo", label: "To Do" },
                        { value: "in-progress", label: "In Progress" },
                        { value: "completed", label: "Completed" },
                      ]}
                    />
                  </div>
                  <div className="flex gap-3 justify-end pt-2">
                    <Button onClick={() => setShowTaskForm(false)} variant="secondary" className="rounded-lg">
                      Cancel
                    </Button>
                    <Button onClick={handleAddTask} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      Add Task
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks List */}
            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task, idx) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-xl p-5 flex items-start justify-between hover:shadow-md transition-all border border-gray-200 group animate-in fade-in slide-in-from-bottom-4 duration-300"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <div className="flex-1 flex items-start gap-4">
                      <button
                        onClick={() =>
                          handleUpdateTask(task.id, {
                            status: task.status === "completed" ? "todo" : "completed",
                          })
                        }
                        className={`w-5 h-5 rounded border-2 transition-all flex-shrink-0 mt-0.5 ${
                          task.status === "completed"
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      />
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${
                            task.status === "completed" ? "line-through text-gray-400" : "text-gray-900"
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                        <div className="flex items-center gap-3 mt-2">
                          {task.dueDate && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {task.dueDate}
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              task.priority === "high"
                                ? "bg-red-100 text-red-700"
                                : task.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-gray-200 rounded-xl bg-white">
                <CheckCircle className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">No tasks yet. Create one to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Notes</h1>
                <p className="text-gray-600 mt-2">Quick notes and creative ideas</p>
              </div>
              <Button
                onClick={() => setShowNotesForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </div>

            {/* Add Note Form */}
            {showNotesForm && (
              <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="text-lg font-semibold text-gray-900">Create New Note</h3>
                <div className="space-y-4">
                  <Input
                    placeholder="Note title..."
                    value={newNote.title || ""}
                    onChange={(e: any) => setNewNote({ ...newNote, title: e.target.value })}
                  />
                  <TextArea
                    placeholder="Write your note..."
                    value={newNote.content || ""}
                    onChange={(e: any) => setNewNote({ ...newNote, content: e.target.value })}
                    className="h-32"
                  />
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-900">Color</p>
                    <div className="flex gap-3">
                      {(["white", "yellow", "pink", "blue", "green"] as const).map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewNote({ ...newNote, color })}
                          className={`w-8 h-8 rounded-full transition-all ring-offset-2 ${
                            newNote.color === color ? "ring-2 ring-blue-500" : ""
                          } ${
                            color === "white"
                              ? "bg-white border-2 border-gray-300"
                              : color === "yellow"
                                ? "bg-yellow-100"
                                : color === "pink"
                                  ? "bg-pink-100"
                                  : color === "blue"
                                    ? "bg-blue-100"
                                    : "bg-green-100"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end pt-2">
                    <Button onClick={() => setShowNotesForm(false)} variant="secondary" className="rounded-lg">
                      Cancel
                    </Button>
                    <Button onClick={handleAddNote} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      Add Note
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Notes Grid */}
            {notes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {notes.map((note, idx) => {
                  const bgColor =
                    note.color === "yellow"
                      ? "bg-yellow-50"
                      : note.color === "pink"
                        ? "bg-pink-50"
                        : note.color === "blue"
                          ? "bg-blue-50"
                          : note.color === "green"
                            ? "bg-green-50"
                            : "bg-white"
                  const borderColor =
                    note.color === "yellow"
                      ? "border-yellow-200"
                      : note.color === "pink"
                        ? "border-pink-200"
                        : note.color === "blue"
                          ? "border-blue-200"
                          : note.color === "green"
                            ? "border-green-200"
                            : "border-gray-200"

                  return (
                    <div
                      key={note.id}
                      className={`${bgColor} rounded-xl p-5 shadow-sm hover:shadow-md transition-all group border ${borderColor} animate-in fade-in slide-in-from-bottom-4 duration-300`}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 flex-1">{note.title}</h3>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-4">{note.content}</p>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-300 border-opacity-50">
                        <span className="text-xs text-gray-500">{new Date(note.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-gray-200 rounded-xl bg-white">
                <FileText className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">No notes yet. Create one to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Modal */}
      {isModalOpen && editedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Edit Card</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-white hover:bg-blue-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-6 bg-gray-50">
              <div className="space-y-4">
                <Input
                  value={editedCard.title}
                  onChange={(e: any) => setEditedCard({ ...editedCard, title: e.target.value })}
                  placeholder="Card title"
                  className="font-semibold text-lg"
                />
                <TextArea
                  value={editedCard.description}
                  onChange={(e: any) => setEditedCard({ ...editedCard, description: e.target.value })}
                  placeholder="Description"
                  className="h-24"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contents</h3>
                </div>

                {editedCard.contents.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {editedCard.contents.map((content, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 bg-white hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Input
                            value={content.title || ""}
                            onChange={(e: any) => handleUpdateContent(index, { ...content, title: e.target.value })}
                            placeholder="Content title"
                            className="text-sm font-semibold flex-1"
                          />
                          <div className="flex items-center gap-2 ml-3">
                            <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700">
                              {content.type}
                            </span>
                            <button
                              onClick={() => handleRemoveContent(index)}
                              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {content.type === "text" && (
                          <TextArea
                            value={content.value}
                            onChange={(e: any) => handleUpdateContent(index, { ...content, value: e.target.value })}
                            placeholder="Enter text..."
                            className="min-h-20"
                          />
                        )}

                        {content.type === "function" && (
                          <TextArea
                            value={content.value}
                            onChange={(e: any) => handleUpdateContent(index, { ...content, value: e.target.value })}
                            placeholder="Enter code..."
                            className="min-h-28 font-mono text-xs"
                          />
                        )}

                        {content.type === "file" && (
                          <Input
                            value={content.value}
                            onChange={(e: any) => handleUpdateContent(index, { ...content, value: e.target.value })}
                            placeholder="File name or path..."
                          />
                        )}

                        {content.type === "chart" && (
                          <Input
                            value={content.value}
                            onChange={(e: any) => handleUpdateContent(index, { ...content, value: e.target.value })}
                            placeholder="Chart config..."
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-6 text-center mb-4 border border-gray-200">
                    <p className="text-sm text-gray-600">No content yet</p>
                  </div>
                )}

                {showContentSelector ? (
                  <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
                    <p className="text-sm font-semibold text-gray-900">Choose content type:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {contentTypes.map(({ type, icon: Icon, label }) => (
                        <button
                          key={type}
                          onClick={() => handleAddContent(type)}
                          className="p-4 rounded-lg border border-gray-200 bg-white text-gray-900 hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-sm flex flex-col items-center gap-2"
                        >
                          <Icon className="w-5 h-5" />
                          {label}
                        </button>
                      ))}
                    </div>
                    <Button
                      onClick={() => setShowContentSelector(false)}
                      variant="secondary"
                      className="w-full rounded-lg"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowContentSelector(true)}
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content
                  </Button>
                )}
              </div>
            </div>

            <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between gap-3">
              <Button
                onClick={() => {
                  handleDeleteCard(editedCard.id)
                  setIsModalOpen(false)
                }}
                variant="destructive"
                className="rounded-lg"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <div className="flex gap-3">
                <Button onClick={() => setIsModalOpen(false)} variant="secondary" className="rounded-lg">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Editor Modal */}
      {editingChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Edit Chart</h2>
              <button
                onClick={() => setEditingChart(null)}
                className="p-2 rounded-lg text-white hover:bg-blue-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-6 bg-gray-50">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Chart Title</label>
                  <Input
                    value={editingChart.title}
                    onChange={(e: any) => handleUpdateChart(editingChart.id, { title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Chart Type</label>
                  <Select
                    value={editingChart.type}
                    onChange={(e: any) => handleUpdateChart(editingChart.id, { type: e.target.value })}
                    options={[
                      { value: "line", label: "Line" },
                      { value: "area", label: "Area" },
                      { value: "bar", label: "Bar" },
                      { value: "pie", label: "Pie" },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Data Key</label>
                  <Input
                    value={editingChart.dataKey || "value"}
                    onChange={(e: any) => handleUpdateChart(editingChart.id, { dataKey: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Chart Data (JSON)</label>
                  <TextArea
                    value={JSON.stringify(editingChart.data, null, 2)}
                    onChange={(e: any) => {
                      try {
                        const data = JSON.parse(e.target.value)
                        handleUpdateChart(editingChart.id, { data })
                      } catch {
                        // Invalid JSON
                      }
                    }}
                    className="h-32 font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border-t border-gray-200 px-6 py-4">
              <Button onClick={() => setEditingChart(null)} variant="secondary" className="w-full rounded-lg">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
