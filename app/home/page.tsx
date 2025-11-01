"use client"

import type React from "react"
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Wallet,
  PieChart,
  CreditCard,
  Plus,
  Search,
  Bell,
  Settings,
  Home,
  BarChart3,
  Target,
  Menu,
  Edit2,
  Trash2,
  GripVertical,
  X,
  DollarSign,
  Filter,
  Download,
  ChevronRight,
  Activity,
  ShoppingBag,
  Coffee,
  Car,
  Film,
  MoreHorizontal,
} from "lucide-react"
import { useState, useEffect } from "react"

type Transaction = {
  id: string
  name: string
  amount: number
  date: string
  category: string
  type: "income" | "expense"
  icon: string
}

type DashboardBlock = {
  id: string
  type: "overview" | "spending" | "transactions" | "budget" | "goals" | "analytics"
  order: number
}

type FinancialGoal = {
  id: string
  name: string
  target: number
  current: number
  deadline: string
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [balance, setBalance] = useState(24582.5)
  const [income, setIncome] = useState(8420.0)
  const [expenses, setExpenses] = useState(3240.8)
  const [monthlyBudget, setMonthlyBudget] = useState(5000.0)
  const [editingBudget, setEditingBudget] = useState(false)
  const [tempBudget, setTempBudget] = useState("")
  const [activeNav, setActiveNav] = useState("dashboard")

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      name: "Grocery Store",
      amount: 85.4,
      date: "Today, 2:30 PM",
      category: "Food & Dining",
      type: "expense",
      icon: "shopping",
    },
    {
      id: "2",
      name: "Salary Deposit",
      amount: 4200.0,
      date: "Yesterday, 9:00 AM",
      category: "Income",
      type: "income",
      icon: "dollar",
    },
    {
      id: "3",
      name: "Coffee Shop",
      amount: 15.99,
      date: "2 days ago",
      category: "Food & Dining",
      type: "expense",
      icon: "coffee",
    },
    {
      id: "4",
      name: "Gas Station",
      amount: 52.3,
      date: "3 days ago",
      category: "Transportation",
      type: "expense",
      icon: "car",
    },
    {
      id: "5",
      name: "Movie Tickets",
      amount: 28.5,
      date: "4 days ago",
      category: "Entertainment",
      type: "expense",
      icon: "film",
    },
  ])

  const [goals, setGoals] = useState<FinancialGoal[]>([
    { id: "1", name: "Emergency Fund", target: 10000, current: 6500, deadline: "Dec 2025" },
    { id: "2", name: "Vacation", target: 3000, current: 1200, deadline: "Jun 2025" },
    { id: "3", name: "New Laptop", target: 2000, current: 1650, deadline: "Mar 2025" },
  ])

  const [newTransaction, setNewTransaction] = useState({
    name: "",
    amount: "",
    category: "",
    type: "expense" as "income" | "expense",
  })

  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
    current: "",
    deadline: "",
  })

  const [blocks, setBlocks] = useState<DashboardBlock[]>([
    { id: "overview", type: "overview", order: 0 },
    { id: "analytics", type: "analytics", order: 1 },
    { id: "spending", type: "spending", order: 2 },
    { id: "transactions", type: "transactions", order: 3 },
    { id: "goals", type: "goals", order: 4 },
    { id: "budget", type: "budget", order: 5 },
  ])

  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddTransaction = () => {
    if (!newTransaction.name || !newTransaction.amount || !newTransaction.category) return

    const iconMap: { [key: string]: string } = {
      "Food & Dining": "coffee",
      Transportation: "car",
      Shopping: "shopping",
      Entertainment: "film",
      Income: "dollar",
      Other: "activity",
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      name: newTransaction.name,
      amount: Number.parseFloat(newTransaction.amount),
      date: "Just now",
      category: newTransaction.category,
      type: newTransaction.type,
      icon: iconMap[newTransaction.category] || "activity",
    }

    setTransactions([transaction, ...transactions])

    if (transaction.type === "expense") {
      setExpenses(expenses + transaction.amount)
      setBalance(balance - transaction.amount)
    } else {
      setIncome(income + transaction.amount)
      setBalance(balance + transaction.amount)
    }

    setNewTransaction({ name: "", amount: "", category: "", type: "expense" })
    setShowAddTransaction(false)
  }

  const handleDeleteTransaction = (id: string) => {
    const transaction = transactions.find((t) => t.id === id)
    if (!transaction) return

    if (transaction.type === "expense") {
      setExpenses(expenses - transaction.amount)
      setBalance(balance + transaction.amount)
    } else {
      setIncome(income - transaction.amount)
      setBalance(balance - transaction.amount)
    }

    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target || !newGoal.current || !newGoal.deadline) return

    const goal: FinancialGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      target: Number.parseFloat(newGoal.target),
      current: Number.parseFloat(newGoal.current),
      deadline: newGoal.deadline,
    }

    setGoals([...goals, goal])
    setNewGoal({ name: "", target: "", current: "", deadline: "" })
    setShowAddGoal(false)
  }

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id))
  }

  const handleDragStart = (blockId: string) => {
    setDraggedBlock(blockId)
  }

  const handleDragOver = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault()
    if (!draggedBlock || draggedBlock === targetBlockId) return

    const newBlocks = [...blocks]
    const draggedIndex = newBlocks.findIndex((b) => b.id === draggedBlock)
    const targetIndex = newBlocks.findIndex((b) => b.id === targetBlockId)

    const [removed] = newBlocks.splice(draggedIndex, 1)
    newBlocks.splice(targetIndex, 0, removed)

    newBlocks.forEach((block, index) => {
      block.order = index
    })

    setBlocks(newBlocks)
  }

  const handleDragEnd = () => {
    setDraggedBlock(null)
  }

  const handleSaveBudget = () => {
    const newBudget = Number.parseFloat(tempBudget)
    if (!isNaN(newBudget) && newBudget > 0) {
      setMonthlyBudget(newBudget)
    }
    setEditingBudget(false)
    setTempBudget("")
  }

  const budgetPercentage = (expenses / monthlyBudget) * 100
  const budgetRemaining = monthlyBudget - expenses

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order)

  const getTransactionIcon = (icon: string) => {
    switch (icon) {
      case "shopping":
        return <ShoppingBag className="h-4 w-4" />
      case "coffee":
        return <Coffee className="h-4 w-4" />
      case "car":
        return <Car className="h-4 w-4" />
      case "film":
        return <Film className="h-4 w-4" />
      case "dollar":
        return <DollarSign className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const renderBlock = (block: DashboardBlock) => {
    switch (block.type) {
      case "overview":
        return (
          <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
            <div
              className="group p-6 space-y-4 bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
              style={{
                animation: mounted ? "fadeInUp 0.6s ease-out" : "none",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Balance</span>
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Wallet className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold tracking-tight">${balance.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-sm text-success">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+12.5% from last month</span>
                </div>
              </div>
            </div>

            <div
              className="group p-6 space-y-4 bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
              style={{
                animation: mounted ? "fadeInUp 0.6s ease-out 0.1s" : "none",
                animationFillMode: "backwards",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Income</span>
                <div className="p-2 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors">
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold tracking-tight">${income.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-sm text-success">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+8.2% from last month</span>
                </div>
              </div>
            </div>

            <div
              className="group p-6 space-y-4 bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
              style={{
                animation: mounted ? "fadeInUp 0.6s ease-out 0.2s" : "none",
                animationFillMode: "backwards",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Expenses</span>
                <div className="p-2 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
                  <CreditCard className="h-4 w-4 text-destructive" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold tracking-tight">${expenses.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-sm text-destructive">
                  <ArrowDownRight className="h-3 w-3" />
                  <span>+5.4% from last month</span>
                </div>
              </div>
            </div>
          </div>
        )

      case "analytics":
        return (
          <div
            className="grid md:grid-cols-2 gap-4 lg:gap-6"
            style={{
              animation: mounted ? "fadeInUp 0.6s ease-out 0.3s" : "none",
              animationFillMode: "backwards",
            }}
          >
            <div className="p-6 space-y-4 bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Spending Trends</h3>
                <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <div className="h-48 flex items-end justify-between gap-2">
                {[65, 45, 80, 55, 70, 60, 85].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-primary/20 rounded-t-lg hover:bg-primary/30 transition-all duration-300 cursor-pointer"
                      style={{
                        height: `${height}%`,
                        animation: mounted ? `growUp 0.8s ease-out ${0.4 + i * 0.08}s` : "none",
                        animationFillMode: "backwards",
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-4 bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Category Distribution</h3>
                <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-center h-48">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {[
                      { percent: 35, color: "var(--primary)", offset: 0 },
                      { percent: 25, color: "var(--success)", offset: 35 },
                      { percent: 20, color: "var(--destructive)", offset: 60 },
                      { percent: 20, color: "var(--muted)", offset: 80 },
                    ].map((segment, i) => {
                      const circumference = 2 * Math.PI * 40
                      const strokeDasharray = `${(segment.percent / 100) * circumference} ${circumference}`
                      const strokeDashoffset = -((segment.offset / 100) * circumference)

                      return (
                        <circle
                          key={i}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={segment.color}
                          strokeWidth="12"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                          style={{
                            animation: mounted ? `drawCircle 1.2s ease-out ${0.5 + i * 0.1}s` : "none",
                            animationFillMode: "backwards",
                          }}
                        />
                      )
                    })}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">100%</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Food", percent: 35, color: "bg-primary" },
                  { label: "Transport", percent: 25, color: "bg-success" },
                  { label: "Shopping", percent: 20, color: "bg-destructive" },
                  { label: "Other", percent: 20, color: "bg-muted" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-muted-foreground">
                      {item.label} {item.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "spending":
        return (
          <div
            className="p-6 space-y-6 bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300"
            style={{
              animation: mounted ? "fadeInUp 0.6s ease-out 0.4s" : "none",
              animationFillMode: "backwards",
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Spending by Category</h2>
              <button className="px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium flex items-center gap-2">
                View All
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-5">
              {[
                { name: "Food & Dining", amount: 840.5, percent: 65, icon: "coffee", color: "bg-primary" },
                { name: "Transportation", amount: 520.3, percent: 45, icon: "car", color: "bg-success" },
                { name: "Shopping", amount: 680.2, percent: 55, icon: "shopping", color: "bg-destructive" },
                { name: "Entertainment", amount: 320.8, percent: 30, icon: "film", color: "bg-muted" },
              ].map((category, i) => (
                <div
                  key={i}
                  className="space-y-3 group"
                  style={{
                    animation: mounted ? `fadeInUp 0.6s ease-out ${0.5 + i * 0.08}s` : "none",
                    animationFillMode: "backwards",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent group-hover:scale-105 transition-transform duration-300">
                        {getTransactionIcon(category.icon)}
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-lg font-semibold">${category.amount.toFixed(2)}</span>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 ${category.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{
                        width: mounted ? `${category.percent}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "transactions":
        return (
          <div
            className="p-6 space-y-6 bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300"
            style={{
              animation: mounted ? "fadeInUp 0.6s ease-out 0.5s" : "none",
              animationFillMode: "backwards",
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Transactions</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                  <Filter className="h-4 w-4" />
                </button>
                <button className="px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium flex items-center gap-2">
                  View All
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction, i) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-accent/50 transition-all duration-300 group cursor-pointer"
                  style={{
                    animation: mounted ? `fadeInUp 0.6s ease-out ${0.6 + i * 0.08}s` : "none",
                    animationFillMode: "backwards",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${
                        transaction.type === "income" ? "bg-success/10" : "bg-primary/10"
                      } flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
                    >
                      {getTransactionIcon(transaction.icon)}
                    </div>
                    <div>
                      <div className="font-medium">{transaction.name}</div>
                      <div className="text-sm text-muted-foreground">{transaction.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`text-lg font-semibold ${
                        transaction.type === "income" ? "text-success" : "text-foreground"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </div>
                    <button
                      className="p-2 rounded-lg hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteTransaction(transaction.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "goals":
        return (
          <div
            className="p-6 space-y-6 bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300"
            style={{
              animation: mounted ? "fadeInUp 0.6s ease-out 0.6s" : "none",
              animationFillMode: "backwards",
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Financial Goals</h2>
              <button
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2"
                onClick={() => setShowAddGoal(true)}
              >
                <Plus className="h-4 w-4" />
                Add Goal
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {goals.map((goal, i) => {
                const progress = (goal.current / goal.target) * 100
                return (
                  <div
                    key={goal.id}
                    className="p-5 space-y-4 bg-accent/50 rounded-xl hover:bg-accent transition-all duration-300 group"
                    style={{
                      animation: mounted ? `fadeInUp 0.6s ease-out ${0.7 + i * 0.08}s` : "none",
                      animationFillMode: "backwards",
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{goal.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">Due {goal.deadline}</p>
                      </div>
                      <button
                        className="p-1.5 rounded-lg hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                        </span>
                        <span className="font-semibold">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: mounted ? `${Math.min(progress, 100)}%` : "0%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case "budget":
        return (
          <div
            className="p-6 space-y-6 bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300"
            style={{
              animation: mounted ? "fadeInUp 0.6s ease-out 0.7s" : "none",
              animationFillMode: "backwards",
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Monthly Budget</h2>
              <button
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                onClick={() => {
                  setEditingBudget(true)
                  setTempBudget(monthlyBudget.toString())
                }}
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
            {editingBudget ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={tempBudget}
                    onChange={(e) => setTempBudget(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Enter budget amount"
                  />
                  <button
                    onClick={handleSaveBudget}
                    className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingBudget(false)
                      setTempBudget("")
                    }}
                    className="px-6 py-3 rounded-xl border border-border hover:bg-accent transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Spent this month</p>
                    <p className="text-3xl font-bold mt-1">${expenses.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="text-3xl font-bold mt-1">${monthlyBudget.toFixed(2)}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{budgetPercentage.toFixed(1)}% used</span>
                    <span className="font-medium">${budgetRemaining.toFixed(2)} remaining</span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${
                        budgetPercentage > 90 ? "bg-destructive" : budgetPercentage > 70 ? "bg-warning" : "bg-success"
                      }`}
                      style={{
                        width: mounted ? `${Math.min(budgetPercentage, 100)}%` : "0%",
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="text-center p-3 rounded-lg bg-accent/50">
                    <p className="text-xs text-muted-foreground">Daily Avg</p>
                    <p className="text-lg font-semibold mt-1">${(expenses / 30).toFixed(2)}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-accent/50">
                    <p className="text-xs text-muted-foreground">Weekly Avg</p>
                    <p className="text-lg font-semibold mt-1">${(expenses / 4).toFixed(2)}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-accent/50">
                    <p className="text-xs text-muted-foreground">Days Left</p>
                    <p className="text-lg font-semibold mt-1">15</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 border-r border-border flex-col bg-background transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${sidebarOpen ? "flex" : "hidden md:flex"}`}
      >
        <div className="p-6 border-b border-border">
          <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            CELENIUM
          </div>
          <p className="text-xs text-muted-foreground mt-1">Financial Management</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "dashboard", icon: Home, label: "Dashboard" },
            { id: "transactions", icon: Wallet, label: "Transactions" },
            { id: "budgets", icon: PieChart, label: "Budgets" },
            { id: "goals", icon: Target, label: "Goals" },
            { id: "analytics", icon: BarChart3, label: "Analytics" },
            { id: "accounts", icon: CreditCard, label: "Accounts" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full justify-start gap-3 px-4 py-3 rounded-xl flex items-center transition-all duration-200 ${
                activeNav === item.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <button className="w-full justify-start gap-3 px-4 py-3 rounded-xl hover:bg-accent hover:text-accent-foreground flex items-center transition-all duration-200">
            <Settings className="h-4 w-4" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 rounded-lg hover:bg-accent" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Welcome back, manage your finances</p>
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
                />
              </div>
              <button className="p-2 rounded-xl hover:bg-accent transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>
              <button className="p-2 rounded-xl hover:bg-accent transition-colors hidden sm:block">
                <Download className="h-5 w-5" />
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-2 font-medium shadow-lg shadow-primary/20"
                onClick={() => setShowAddTransaction(true)}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Transaction</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-6">
          {sortedBlocks.map((block) => (
            <div
              key={block.id}
              draggable
              onDragStart={() => handleDragStart(block.id)}
              onDragOver={(e) => handleDragOver(e, block.id)}
              onDragEnd={handleDragEnd}
              className="cursor-move group relative"
            >
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              {renderBlock(block)}
            </div>
          ))}
        </div>
      </main>

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div
            className="w-full max-w-md p-6 space-y-6 bg-card text-card-foreground rounded-2xl border border-border shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Add Transaction</h2>
              <button
                className="p-2 rounded-xl hover:bg-accent transition-colors"
                onClick={() => setShowAddTransaction(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Transaction Name</label>
                <input
                  type="text"
                  value={newTransaction.name}
                  onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="e.g., Grocery shopping"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="">Select category</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Income">Income</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${
                      newTransaction.type === "expense"
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "border border-border hover:bg-accent"
                    }`}
                    onClick={() => setNewTransaction({ ...newTransaction, type: "expense" })}
                  >
                    Expense
                  </button>
                  <button
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${
                      newTransaction.type === "income"
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "border border-border hover:bg-accent"
                    }`}
                    onClick={() => setNewTransaction({ ...newTransaction, type: "income" })}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddTransaction}
                  className="flex-1 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-medium shadow-lg shadow-primary/20"
                >
                  Add Transaction
                </button>
                <button
                  onClick={() => setShowAddTransaction(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-border hover:bg-accent transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div
            className="w-full max-w-md p-6 space-y-6 bg-card text-card-foreground rounded-2xl border border-border shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Add Financial Goal</h2>
              <button
                className="p-2 rounded-xl hover:bg-accent transition-colors"
                onClick={() => setShowAddGoal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="e.g., Emergency Fund"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Amount</label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="10000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Amount</label>
                  <input
                    type="number"
                    value={newGoal.current}
                    onChange={(e) => setNewGoal({ ...newGoal, current: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Deadline</label>
                <input
                  type="text"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="e.g., Dec 2025"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddGoal}
                  className="flex-1 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-medium shadow-lg shadow-primary/20"
                >
                  Add Goal
                </button>
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-border hover:bg-accent transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


/*"use client"
import Teste from "@/components/teste.tsx"

export default function Home() {
  
  return (
  <>
    <Teste/>
  </>
  )
}*/


