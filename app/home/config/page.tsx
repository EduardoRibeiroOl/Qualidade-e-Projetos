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
} from "lucide-react"
import { useState } from "react"

type Transaction = {
  id: string
  name: string
  amount: number
  date: string
  category: string
  type: "income" | "expense"
}

type DashboardBlock = {
  id: string
  type: "overview" | "spending" | "transactions" | "budget"
  order: number
}

export default function HomePage() {
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [editingBalance, setEditingBalance] = useState(false)
  const [balance, setBalance] = useState(24582.5)
  const [income, setIncome] = useState(8420.0)
  const [expenses, setExpenses] = useState(3240.8)
  const [monthlyBudget, setMonthlyBudget] = useState(5000.0)
  const [editingBudget, setEditingBudget] = useState(false)
  const [tempBudget, setTempBudget] = useState("")

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      name: "Grocery Store",
      amount: 85.4,
      date: "Today, 2:30 PM",
      category: "Food & Dining",
      type: "expense",
    },
    { id: "2", name: "Salary Deposit", amount: 4200.0, date: "Yesterday, 9:00 AM", category: "Income", type: "income" },
    {
      id: "3",
      name: "Netflix Subscription",
      amount: 15.99,
      date: "2 days ago",
      category: "Entertainment",
      type: "expense",
    },
    { id: "4", name: "Gas Station", amount: 52.3, date: "3 days ago", category: "Transportation", type: "expense" },
  ])

  const [newTransaction, setNewTransaction] = useState({
    name: "",
    amount: "",
    category: "",
    type: "expense" as "income" | "expense",
  })

  const [blocks, setBlocks] = useState<DashboardBlock[]>([
    { id: "overview", type: "overview", order: 0 },
    { id: "spending", type: "spending", order: 1 },
    { id: "transactions", type: "transactions", order: 2 },
    { id: "budget", type: "budget", order: 3 },
  ])

  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)

  const handleAddTransaction = () => {
    if (!newTransaction.name || !newTransaction.amount || !newTransaction.category) return

    const transaction: Transaction = {
      id: Date.now().toString(),
      name: newTransaction.name,
      amount: Number.parseFloat(newTransaction.amount),
      date: "Just now",
      category: newTransaction.category,
      type: newTransaction.type,
    }

    setTransactions([transaction, ...transactions])

    if (transaction.type === "expense") {
      setExpenses(expenses + transaction.amount)
    } else {
      setIncome(income + transaction.amount)
    }

    setNewTransaction({ name: "", amount: "", category: "", type: "expense" })
    setShowAddTransaction(false)
  }

  const handleDeleteTransaction = (id: string) => {
    const transaction = transactions.find((t) => t.id === id)
    if (!transaction) return

    if (transaction.type === "expense") {
      setExpenses(expenses - transaction.amount)
    } else {
      setIncome(income - transaction.amount)
    }

    setTransactions(transactions.filter((t) => t.id !== id))
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

  const renderBlock = (block: DashboardBlock) => {
    switch (block.type) {
      case "overview":
        return (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 space-y-4 bg-card text-card-foreground rounded-lg border border-border shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Balance</span>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold">${balance.toFixed(2)}</div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+12.5% from last month</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4 bg-card text-card-foreground rounded-lg border border-border shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Income</span>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold">${income.toFixed(2)}</div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+8.2% from last month</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4 bg-card text-card-foreground rounded-lg border border-border shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Expenses</span>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold">${expenses.toFixed(2)}</div>
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <ArrowDownRight className="h-3 w-3" />
                  <span>+5.4% from last month</span>
                </div>
              </div>
            </div>
          </div>
        )

      case "spending":
        return (
          <div className="p-6 space-y-4 bg-card text-card-foreground rounded-lg border border-border shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Spending Overview</h2>
              <button className="px-4 py-2 rounded-lg hover:bg-accent" size="sm">
                View All
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Food & Dining</span>
                  <span className="font-medium">$840.50</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-foreground rounded-full" style={{ width: "65%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Transportation</span>
                  <span className="font-medium">$520.30</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-foreground rounded-full" style={{ width: "45%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shopping</span>
                  <span className="font-medium">$680.20</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-foreground rounded-full" style={{ width: "55%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Entertainment</span>
                  <span className="font-medium">$320.80</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-foreground rounded-full" style={{ width: "30%" }} />
                </div>
              </div>
            </div>
          </div>
        )

      case "transactions":
        return (
          <div className="p-6 space-y-4 bg-card text-card-foreground rounded-lg border border-border shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <button className="px-4 py-2 rounded-lg hover:bg-accent" size="sm">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {transactions.slice(0, 4).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      {transaction.type === "income" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <Wallet className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{transaction.name}</div>
                      <div className="text-xs text-muted-foreground">{transaction.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`text-sm font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                    >
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </div>
                    <button
                      className="p-2 rounded-lg hover:bg-accent"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "budget":
        return (
          <div className="p-6 space-y-4 bg-card text-card-foreground rounded-lg border border-border shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Monthly Budget</h2>
              <button
                className="px-4 py-2 rounded-lg hover:bg-accent"
                size="sm"
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
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    placeholder="Enter budget amount"
                  />
                  <button
                    onClick={handleSaveBudget}
                    size="sm"
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingBudget(false)
                      setTempBudget("")
                    }}
                    className="px-4 py-2 rounded-lg border border-border hover:bg-accent"
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    ${expenses.toFixed(2)} of ${monthlyBudget.toFixed(2)} spent
                  </span>
                  <span className="font-medium">{budgetPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground rounded-full transition-all"
                    style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  You have ${budgetRemaining.toFixed(2)} left to spend this month
                </p>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border flex-col">
        <div className="p-6 border-b border-border">
          <div className="text-2xl font-bold tracking-tight">CELENIUM</div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full justify-start gap-3 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground flex items-center">
            <Home className="h-4 w-4" />
            Dashboard
          </button>
          <button className="w-full justify-start gap-3 px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground flex items-center">
            <Wallet className="h-4 w-4" />
            Transactions
          </button>
          <button className="w-full justify-start gap-3 px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground flex items-center">
            <PieChart className="h-4 w-4" />
            Budgets
          </button>
          <button className="w-full justify-start gap-3 px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground flex items-center">
            <Target className="h-4 w-4" />
            Goals
          </button>
          <button className="w-full justify-start gap-3 px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground flex items-center">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </button>
          <button className="w-full justify-start gap-3 px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground flex items-center">
            <CreditCard className="h-4 w-4" />
            Accounts
          </button>
        </nav>
        <div className="p-4 border-t border-border">
          <button className="w-full justify-start gap-3 px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground flex items-center">
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-border bg-background sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 rounded-lg hover:bg-accent">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, User</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 w-64"
                />
              </div>
              <button className="p-2 rounded-lg hover:bg-accent">
                <Bell className="h-5 w-5" />
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground flex items-center gap-2"
                onClick={() => setShowAddTransaction(true)}
              >
                <Plus className="h-4 w-4" />
                Add Transaction
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {sortedBlocks.map((block) => (
            <div
              key={block.id}
              draggable
              onDragStart={() => handleDragStart(block.id)}
              onDragOver={(e) => handleDragOver(e, block.id)}
              onDragEnd={handleDragEnd}
              className="cursor-move group relative"
            >
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              {renderBlock(block)}
            </div>
          ))}
        </div>
      </main>

      {showAddTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md p-6 space-y-4 bg-card text-card-foreground rounded-lg border border-border shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add Transaction</h2>
              <button className="p-2 rounded-lg hover:bg-accent" onClick={() => setShowAddTransaction(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={newTransaction.name}
                  onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  placeholder="Transaction name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
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
                <div className="flex gap-2">
                  <button
                    className={`flex-1 px-4 py-2 rounded-lg ${
                      newTransaction.type === "expense"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border hover:bg-accent"
                    }`}
                    onClick={() => setNewTransaction({ ...newTransaction, type: "expense" })}
                  >
                    Expense
                  </button>
                  <button
                    className={`flex-1 px-4 py-2 rounded-lg ${
                      newTransaction.type === "income"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border hover:bg-accent"
                    }`}
                    onClick={() => setNewTransaction({ ...newTransaction, type: "income" })}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleAddTransaction}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground"
                >
                  Add Transaction
                </button>
                <button
                  onClick={() => setShowAddTransaction(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-accent"
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
