"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart as RechartsChart,
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

interface CardContent {
  type: "text" | "function" | "file" | "chart"
  value: string
  title?: string
  metadata?: Record<string, any>
}

interface CardItem {
  id: number
  title: string
  description: string
  contents: CardContent[]
  createdAt: number
  type: "card" | "note" | "task" | "goal"
}

interface FinancialEntry {
  id: number
  date: string
  category: string
  amount: number
  type: "income" | "expense"
  description: string
  tags?: string[]
}

interface Task {
  id: number
  title: string
  description: string
  dueDate: string
  priority: "low" | "medium" | "high"
  status: "todo" | "in-progress" | "completed"
  tags?: string[]
  createdAt: number
}

interface Note {
  id: number
  title: string
  content: string
  color: "white" | "yellow" | "pink" | "blue" | "green"
  tags?: string[]
  createdAt: number
  updatedAt: number
}

interface DashboardChart {
  id: number
  title: string
  type: "line" | "area" | "pie" | "bar"
  data: any[]
  dataKey?: string
  x?: number
  y?: number
}

interface DashboardLayout {
  id: string
  x: number
  y: number
  w: number
  h: number
  type: "widget" | "chart" | "stats" | "notes"
}

const STORAGE_KEYS = {
  CARDS: "card-manager-v5",
  FINANCIAL: "financial-manager-v2",
  TASKS: "task-manager-v1",
  NOTES: "notes-manager-v1",
  CHARTS: "dashboard-charts-v2",
  LAYOUT: "dashboard-layout-v1",
}

export default function CardManager() {
  const [cards, setCards] = useState<CardItem[]>([])
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"dashboard" | "cards" | "financial" | "tasks" | "notes">("dashboard")
  const [showContentSelector, setShowContentSelector] = useState(false)
  const [editedCard, setEditedCard] = useState<CardItem | null>(null)

  // Financial state
  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>([])
  const [showFinancialForm, setShowFinancialForm] = useState(false)
  const [newEntry, setNewEntry] = useState<Partial<FinancialEntry>>({
    type: "expense",
    category: "General",
  })

  // Task state
  const [tasks, setTasks] = useState<Task[]>([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    priority: "medium",
    status: "todo",
  })

  // Notes state
  const [notes, setNotes] = useState<Note[]>([])
  const [showNotesForm, setShowNotesForm] = useState(false)
  const [newNote, setNewNote] = useState<Partial<Note>>({
    color: "white",
  })

  // Dashboard charts
  const [dashboardCharts, setDashboardCharts] = useState<DashboardChart[]>([])
  const [showChartForm, setShowChartForm] = useState(false)
  const [editingChart, setEditingChart] = useState<DashboardChart | null>(null)

  // Drag state
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dashboardLayout, setDashboardLayout] = useState<DashboardLayout[]>([])

  // Load all data
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

      const layoutStored = localStorage.getItem(STORAGE_KEYS.LAYOUT)
      if (layoutStored) setDashboardLayout(JSON.parse(layoutStored))
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }, [])

  // Save all data
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards))
      localStorage.setItem(STORAGE_KEYS.FINANCIAL, JSON.stringify(financialEntries))
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes))
      localStorage.setItem(STORAGE_KEYS.CHARTS, JSON.stringify(dashboardCharts))
      localStorage.setItem(STORAGE_KEYS.LAYOUT, JSON.stringify(dashboardLayout))
    } catch (error) {
      console.error("Error saving data:", error)
    }
  }, [cards, financialEntries, tasks, notes, dashboardCharts, dashboardLayout])

  // Card functions
  const handleCreateCard = (type: "card" | "note" | "task" | "goal" = "card") => {
    const newCard: CardItem = {
      id: Date.now(),
      title: "Untitled",
      description: "Add a description...",
      contents: [],
      createdAt: Date.now(),
      type,
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
      metadata: {},
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

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setShowContentSelector(false)
    setEditedCard(null)
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

  // Chart functions with user-defined data
  const handleAddChart = () => {
    const newChart: DashboardChart = {
      id: Date.now(),
      title: "New Chart",
      type: "line",
      data: [
        { name: "Jan", value: 0 },
        { name: "Feb", value: 0 },
        { name: "Mar", value: 0 },
      ],
      dataKey: "value",
    }
    setDashboardCharts([...dashboardCharts, newChart])
    setEditingChart(newChart)
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

  // Drag and drop
  const handleDragStart = (e: React.DragEvent, item: string) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, position: { x: number; y: number }) => {
    e.preventDefault()
    if (!draggedItem) return
    // Store position for dashboard items
    setDraggedItem(null)
  }

  // Calculate stats
  const calculateFinancialStats = () => {
    const totalIncome = financialEntries.filter((e) => e.type === "income").reduce((sum, e) => sum + e.amount, 0)
    const totalExpense = financialEntries.filter((e) => e.type === "expense").reduce((sum, e) => sum + e.amount, 0)
    return { totalIncome, totalExpense, balance: totalIncome - totalExpense }
  }

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    todo: tasks.filter((t) => t.status === "todo").length,
  }

  const stats = calculateFinancialStats()

  const contentTypes = [
    {
      type: "text" as const,
      icon: FileText,
      label: "Text",
      description: "Plain text or markdown",
    },
    {
      type: "function" as const,
      icon: Code,
      label: "Function",
      description: "Code functions or scripts",
    },
    {
      type: "file" as const,
      icon: FileUp,
      label: "File",
      description: "File references",
    },
    {
      type: "chart" as const,
      icon: BarChart3,
      label: "Chart",
      description: "Data visualizations",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
          <div className="flex items-center gap-2 sm:gap-4 py-4 overflow-x-auto">
            {(
              [
                { id: "dashboard", label: "Dashboard" },
                { id: "cards", label: "Cards" },
                { id: "tasks", label: "Tasks" },
                { id: "notes", label: "Notes" },
                { id: "financial", label: "Finance" },
              ] as const
            ).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base whitespace-nowrap ${
                  activeTab === id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-8 md:p-12">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                Drag elements to customize your dashboard
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Balance</p>
                    <p className={`text-2xl font-bold ${stats.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ${stats.balance.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-primary/30" />
                </div>
              </div>

              <div
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: "50ms" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tasks</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {taskStats.completed}/{taskStats.total}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-primary/30" />
                </div>
              </div>

              <div
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: "100ms" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p className="text-2xl font-bold text-purple-600">{notes.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-primary/30" />
                </div>
              </div>

              <div
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: "150ms" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Charts</p>
                    <p className="text-2xl font-bold text-orange-600">{dashboardCharts.length}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-primary/30" />
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            {dashboardCharts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Your Charts</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {dashboardCharts.map((chart) => (
                    <div
                      key={chart.id}
                      className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all animate-in fade-in duration-300 cursor-move group"
                      draggable
                      onDragStart={(e) => handleDragStart(e, `chart-${chart.id}`)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-foreground">{chart.title}</h3>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          <button
                            onClick={() => setEditingChart(chart)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteChart(chart.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="w-full h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          {chart.type === "line" && (
                            <LineChart data={chart.data}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                              <YAxis stroke="hsl(var(--muted-foreground))" />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "hsl(var(--card))",
                                  border: "1px solid hsl(var(--border))",
                                  borderRadius: "0.5rem",
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey={chart.dataKey || "value"}
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                              />
                            </LineChart>
                          )}
                          {chart.type === "area" && (
                            <AreaChart data={chart.data}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                              <YAxis stroke="hsl(var(--muted-foreground))" />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "hsl(var(--card))",
                                  border: "1px solid hsl(var(--border))",
                                  borderRadius: "0.5rem",
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey={chart.dataKey || "value"}
                                fill="hsl(var(--primary))"
                                fillOpacity={0.3}
                              />
                            </AreaChart>
                          )}
                          {chart.type === "bar" && (
                            <BarChart data={chart.data}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                              <YAxis stroke="hsl(var(--muted-foreground))" />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "hsl(var(--card))",
                                  border: "1px solid hsl(var(--border))",
                                  borderRadius: "0.5rem",
                                }}
                              />
                              <Bar dataKey={chart.dataKey || "value"} fill="hsl(var(--primary))" />
                            </BarChart>
                          )}
                          {chart.type === "pie" && (
                            <RechartsChart>
                              <Pie
                                data={chart.data}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey={chart.dataKey || "value"}
                              >
                                {chart.data.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      [
                                        "hsl(var(--primary))",
                                        "hsl(var(--chart-1))",
                                        "hsl(var(--chart-2))",
                                        "hsl(var(--chart-3))",
                                        "hsl(var(--chart-4))",
                                      ][index % 5]
                                    }
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "hsl(var(--card))",
                                  border: "1px solid hsl(var(--border))",
                                  borderRadius: "0.5rem",
                                }}
                              />
                            </RechartsChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Add Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button
                onClick={() => setShowTaskForm(true)}
                className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border border-blue-200 rounded-lg transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Task
              </Button>
              <Button
                onClick={() => setShowNotesForm(true)}
                className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 border border-purple-200 rounded-lg transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Note
              </Button>
              <Button
                onClick={handleAddChart}
                className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 border border-orange-200 rounded-lg transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Chart
              </Button>
              <Button
                onClick={() => setShowFinancialForm(true)}
                className="bg-green-500/10 hover:bg-green-500/20 text-green-600 border border-green-200 rounded-lg transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Entry
              </Button>
            </div>
          </div>
        )}

        {/* Cards Tab */}
        {activeTab === "cards" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2">Content Cards</h1>
              <Button
                onClick={() => handleCreateCard("card")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold px-6 py-2 transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Card
              </Button>
            </div>

            {cards.filter((c) => c.type === "card").length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {cards
                  .filter((c) => c.type === "card")
                  .map((card, idx) => (
                    <div
                      key={card.id}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <button
                        onClick={() => handleOpenCard(card)}
                        className="w-full bg-card border border-border rounded-xl p-5 sm:p-6 text-left transition-all duration-300 hover:shadow-lg hover:border-primary/50 active:scale-95 group h-full flex flex-col"
                      >
                        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 group-hover:text-primary">
                          {card.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-4">{card.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                          <span className="text-xs sm:text-sm text-muted-foreground">{card.contents.length} items</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteCard(card.id)
                            }}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Plus className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No cards yet</p>
              </div>
            )}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2">Tasks & Time</h1>
                <p className="text-sm text-muted-foreground">Manage your tasks and deadlines</p>
              </div>
              <Button
                onClick={() => setShowTaskForm(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold px-6 py-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </div>

            {/* Task Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Total</p>
                <p className="text-2xl font-bold text-foreground">{taskStats.total}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">To Do</p>
                <p className="text-2xl font-bold text-orange-600">{taskStats.todo}</p>
              </div>
            </div>

            {/* Add Task Form */}
            {showTaskForm && (
              <div className="bg-card border border-border rounded-xl p-6 mb-8 animate-in fade-in duration-200">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Task title..."
                    value={newTask.title || ""}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                  />
                  <textarea
                    placeholder="Description..."
                    value={newTask.description || ""}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-20 bg-background text-foreground"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="date"
                      value={newTask.dueDate || ""}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                    />
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <select
                      value={newTask.status}
                      onChange={(e) => setNewTask({ ...newTask, status: e.target.value as any })}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddTask}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                    >
                      Add Task
                    </Button>
                    <Button
                      onClick={() => setShowTaskForm(false)}
                      variant="outline"
                      className="flex-1 border-border text-foreground rounded-lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks List */}
            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks
                  .sort((a, b) => new Date(b.dueDate || 0).getTime() - new Date(a.dueDate || 0).getTime())
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-card border border-border rounded-lg p-4 flex items-start justify-between hover:shadow-md transition-all animate-in fade-in duration-200 group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <button
                            onClick={() =>
                              handleUpdateTask(task.id, {
                                status: task.status === "completed" ? "todo" : "completed",
                              })
                            }
                            className={`w-5 h-5 rounded border-2 transition-all ${
                              task.status === "completed" ? "bg-green-500 border-green-500" : "border-muted-foreground"
                            }`}
                          />
                          <h3
                            className={`font-semibold ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}
                          >
                            {task.title}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
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
                        {task.description && (
                          <p className="text-sm text-muted-foreground ml-8 mb-2">{task.description}</p>
                        )}
                        {task.dueDate && (
                          <p className="text-xs text-muted-foreground ml-8 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Due: {task.dueDate}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tasks yet</p>
              </div>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2">Notes</h1>
                <p className="text-sm text-muted-foreground">Quick notes and ideas</p>
              </div>
              <Button
                onClick={() => setShowNotesForm(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold px-6 py-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </div>

            {/* Add Note Form */}
            {showNotesForm && (
              <div className="bg-card border border-border rounded-xl p-6 mb-8 animate-in fade-in duration-200">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Note title..."
                    value={newNote.title || ""}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground font-semibold"
                  />
                  <textarea
                    placeholder="Write your note..."
                    value={newNote.content || ""}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-32 bg-background text-foreground"
                  />
                  <div className="flex gap-2">
                    {(["white", "yellow", "pink", "blue", "green"] as const).map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewNote({ ...newNote, color })}
                        className={`w-8 h-8 rounded-full transition-all ${
                          newNote.color === color ? "ring-2 ring-offset-2 ring-primary" : ""
                        } ${
                          color === "white"
                            ? "bg-white border border-gray-200"
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
                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddNote}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                    >
                      Add Note
                    </Button>
                    <Button
                      onClick={() => setShowNotesForm(false)}
                      variant="outline"
                      className="flex-1 border-border text-foreground rounded-lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Notes Grid */}
            {notes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

                  return (
                    <div
                      key={note.id}
                      className={`${bgColor} border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 group`}
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
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/50">
                        <span className="text-xs text-gray-400">{new Date(note.updatedAt).toLocaleDateString()}</span>
                        <button
                          onClick={() => handleUpdateNote(note.id, { content: note.content })}
                          className="text-xs text-primary hover:text-primary/80 font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No notes yet</p>
              </div>
            )}
          </div>
        )}

        {/* Financial Tab */}
        {activeTab === "financial" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2">Financial Management</h1>
              <p className="text-sm text-muted-foreground mb-4">Track your income and expenses</p>
              <Button
                onClick={() => setShowFinancialForm(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold px-6 py-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-card border border-border rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-sm text-muted-foreground mb-1">Total Income</p>
                <p className="text-3xl font-bold text-green-600">${stats.totalIncome.toFixed(2)}</p>
              </div>
              <div
                className="bg-card border border-border rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: "50ms" }}
              >
                <p className="text-sm text-muted-foreground mb-1">Total Expense</p>
                <p className="text-3xl font-bold text-red-600">${stats.totalExpense.toFixed(2)}</p>
              </div>
              <div
                className="bg-card border border-border rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: "100ms" }}
              >
                <p className="text-sm text-muted-foreground mb-1">Balance</p>
                <p className={`text-3xl font-bold ${stats.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${stats.balance.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Add Entry Form */}
            {showFinancialForm && (
              <div className="bg-card border border-border rounded-xl p-6 mb-8 animate-in fade-in duration-200">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={newEntry.date || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                    />
                    <select
                      value={newEntry.type}
                      onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as any })}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      value={newEntry.amount || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, amount: Number.parseFloat(e.target.value) })}
                      placeholder="Amount"
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                    />
                    <input
                      type="text"
                      value={newEntry.category || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                      placeholder="Category"
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                    />
                  </div>
                  <textarea
                    value={newEntry.description || ""}
                    onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                    placeholder="Description (optional)"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-20 bg-background text-foreground"
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddFinancialEntry}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                    >
                      Add Entry
                    </Button>
                    <Button
                      onClick={() => setShowFinancialForm(false)}
                      variant="outline"
                      className="flex-1 border-border text-foreground rounded-lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Entries List */}
            {financialEntries.length > 0 ? (
              <div className="space-y-3">
                {[...financialEntries].reverse().map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-all animate-in fade-in duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{entry.category}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            entry.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {entry.type}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{entry.date}</p>
                      {entry.description && <p className="text-xs text-muted-foreground mt-1">{entry.description}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-lg font-bold ${entry.type === "income" ? "text-green-600" : "text-red-600"}`}
                      >
                        {entry.type === "income" ? "+" : "-"}${entry.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleDeleteFinancialEntry(entry.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No entries yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Modal */}
      {isModalOpen && editedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-300">
          <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-foreground px-6 py-6 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-background">Edit Card</h2>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-background hover:bg-foreground/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-6 bg-background">
              <div className="space-y-4">
                <input
                  type="text"
                  value={editedCard.title}
                  onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground font-semibold"
                  placeholder="Card title"
                />
                <textarea
                  value={editedCard.description}
                  onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-24 bg-background text-foreground"
                  placeholder="Description"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Contents</h3>
                </div>

                {editedCard.contents.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {editedCard.contents.map((content, index) => (
                      <div
                        key={index}
                        className="border border-border rounded-lg p-4 bg-muted/30 animate-in fade-in duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <input
                            type="text"
                            value={content.title || ""}
                            onChange={(e) => handleUpdateContent(index, { ...content, title: e.target.value })}
                            className="text-sm font-semibold text-foreground bg-transparent border-b border-muted focus:outline-none focus:border-primary flex-1 pb-1"
                            placeholder="Content title"
                          />
                          <div className="flex items-center gap-2 ml-3">
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary">
                              {content.type}
                            </span>
                            <button
                              onClick={() => handleRemoveContent(index)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {content.type === "text" && (
                          <textarea
                            value={content.value}
                            onChange={(e) => handleUpdateContent(index, { ...content, value: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-20 text-foreground"
                            placeholder="Enter text..."
                          />
                        )}

                        {content.type === "function" && (
                          <textarea
                            value={content.value}
                            onChange={(e) => handleUpdateContent(index, { ...content, value: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-28 text-foreground"
                            placeholder="Enter code..."
                          />
                        )}

                        {content.type === "file" && (
                          <input
                            type="text"
                            value={content.value}
                            onChange={(e) => handleUpdateContent(index, { ...content, value: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                            placeholder="File name or path..."
                          />
                        )}

                        {content.type === "chart" && (
                          <input
                            type="text"
                            value={content.value}
                            onChange={(e) => handleUpdateContent(index, { ...content, value: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                            placeholder="Chart config..."
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted/30 rounded-lg p-6 text-center mb-4 border border-border">
                    <p className="text-sm text-muted-foreground">No content yet</p>
                  </div>
                )}

                {showContentSelector ? (
                  <div className="bg-muted/30 rounded-lg p-4 border border-border animate-in fade-in duration-200">
                    <p className="text-sm font-semibold text-foreground mb-4">Choose content type:</p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {contentTypes.map(({ type, icon: Icon, label }) => (
                        <button
                          key={type}
                          onClick={() => handleAddContent(type)}
                          className="p-3 rounded-lg border border-border bg-background text-foreground hover:border-primary transition-all"
                        >
                          <Icon className="w-4 h-4 mb-2" />
                          <p className="font-semibold text-xs">{label}</p>
                        </button>
                      ))}
                    </div>
                    <Button
                      onClick={() => setShowContentSelector(false)}
                      className="w-full bg-background text-foreground border border-border hover:bg-muted rounded-lg"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowContentSelector(true)}
                    className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content
                  </Button>
                )}
              </div>
            </div>

            <div className="bg-muted/30 border-t border-border px-6 py-4 flex items-center justify-between gap-3">
              <Button
                onClick={() => {
                  handleDeleteCard(editedCard.id)
                  handleCloseModal()
                }}
                className="text-destructive hover:bg-destructive/10 border border-destructive/30 rounded-lg"
                variant="outline"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <div className="flex gap-3">
                <Button
                  onClick={handleCloseModal}
                  variant="outline"
                  className="bg-background text-foreground border border-border hover:bg-muted rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Editor Modal */}
      {editingChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-300">
          <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-foreground px-6 py-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-background">Edit Chart</h2>
              <button
                onClick={() => setEditingChart(null)}
                className="p-1.5 rounded-lg text-background hover:bg-foreground/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-6 bg-background">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Chart Title</label>
                  <input
                    type="text"
                    value={editingChart.title}
                    onChange={(e) => handleUpdateChart(editingChart.id, { title: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Chart Type</label>
                  <select
                    value={editingChart.type}
                    onChange={(e) => handleUpdateChart(editingChart.id, { type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                  >
                    <option value="line">Line</option>
                    <option value="area">Area</option>
                    <option value="bar">Bar</option>
                    <option value="pie">Pie</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Data Key</label>
                  <input
                    type="text"
                    value={editingChart.dataKey || "value"}
                    onChange={(e) => handleUpdateChart(editingChart.id, { dataKey: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Chart Data (JSON)</label>
                  <textarea
                    value={JSON.stringify(editingChart.data, null, 2)}
                    onChange={(e) => {
                      try {
                        const data = JSON.parse(e.target.value)
                        handleUpdateChart(editingChart.id, { data })
                      } catch {
                        // Invalid JSON, ignore
                      }
                    }}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-32 bg-background text-foreground font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="bg-muted/30 border-t border-border px-6 py-4 flex items-center justify-between gap-3">
              <div className="flex gap-3">
                <Button
                  onClick={() => setEditingChart(null)}
                  variant="outline"
                  className="bg-background text-foreground border border-border hover:bg-muted rounded-lg"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
