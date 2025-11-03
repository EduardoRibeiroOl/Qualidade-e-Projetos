"use client"

import { useState } from "react"
import { Menu, X, Home, Info, Mail, Car } from "lucide-react"

import Card from "./cards"


export default function Main() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)

  const menuItems = [
    { icon: Home, label: "Início", href: "#" },
    { icon: Info, label: "Sobre", href: "#" },
    { icon: Mail, label: "Contato", href: "#" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar text-sidebar-foreground shadow-lg transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Cabeçalho com logo e botão fechar */}
        <div className="flex items-center justify-between border-b border-sidebar-border p-6">
          <h1 className="text-2xl font-bold text-sidebar-primary">Menu</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 hover:bg-sidebar-accent transition-colors"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Lista de menu */}
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sidebar-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      <main className={`transition-all duration-300 ${isOpen ? "ml-64" : "ml-0"}`}>

        <header className="flex items-center justify-between border-b border-border bg-card p-6 shadow-sm">
          <h2 className="text-3xl font-bold text-foreground">Meu App</h2>
          <button
            onClick={toggleSidebar}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-all hover:opacity-90"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
            <span className="hidden sm:inline">Menu</span>
          </button>
        </header>
        <Card />
      </main>

    </div>
  )
}
