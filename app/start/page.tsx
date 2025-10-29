"use client"

import { useState } from "react"

export default function HomePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNav, setActiveNav] = useState("templates")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const templates = [
    {
      id: 1,
      title: "Product Roadmap",
      description: "Plan and track your product development timeline",
      icon: "🗺️",
      category: "Planning",
      color: "#007aff",
    },
    {
      id: 2,
      title: "Sprint Planning",
      description: "Organize your agile sprints and track progress",
      icon: "⚡",
      category: "Agile",
      color: "#ff9500",
    },
    {
      id: 3,
      title: "Meeting Notes",
      description: "Document meetings with action items and decisions",
      icon: "📝",
      category: "Documentation",
      color: "#34c759",
    },
    {
      id: 4,
      title: "Project Brief",
      description: "Define project scope, goals, and requirements",
      icon: "📋",
      category: "Planning",
      color: "#5856d6",
    },
    {
      id: 5,
      title: "Task Board",
      description: "Kanban-style board for task management",
      icon: "📊",
      category: "Workflow",
      color: "#ff2d55",
    },
    {
      id: 6,
      title: "Design System",
      description: "Document your design components and guidelines",
      icon: "🎨",
      category: "Design",
      color: "#af52de",
    },
    {
      id: 7,
      title: "Bug Tracker",
      description: "Track and manage bugs efficiently",
      icon: "🐛",
      category: "Development",
      color: "#ff3b30",
    },
    {
      id: 8,
      title: "Team Wiki",
      description: "Centralized knowledge base for your team",
      icon: "📚",
      category: "Documentation",
      color: "#00c7be",
    },
  ]

  const recentProjects = [
    { id: 1, name: "Mobile App Redesign", icon: "📱", updated: "2 hours ago", progress: 75 },
    { id: 2, name: "Q1 Marketing Campaign", icon: "📢", updated: "5 hours ago", progress: 45 },
    { id: 3, name: "API Documentation", icon: "📖", updated: "1 day ago", progress: 90 },
  ]

  const quickStats = [
    { label: "Active Projects", value: "12", icon: "📁", color: "#007aff" },
    { label: "Tasks Today", value: "8", icon: "✓", color: "#34c759" },
    { label: "Team Members", value: "24", icon: "👥", color: "#ff9500" },
  ]

  const categories = ["All", "Planning", "Agile", "Documentation", "Workflow", "Design", "Development"]

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#f5f5f7] to-[#e8e8ed] font-sans">
      {/* Sidebar */}
      <aside
        className={`${sidebarCollapsed ? "w-20" : "w-72"} bg-white/80 backdrop-blur-xl border-r border-[#d1d1d6]/50 flex flex-col transition-all duration-300 shadow-sm`}
      >
        {/* Workspace */}
        <div className="p-4 border-b border-[#d1d1d6]/50">
          {!sidebarCollapsed && (
            <button className="w-full bg-gradient-to-br from-white to-[#f9f9fb] rounded-2xl border border-[#d1d1d6]/50 px-4 py-3 flex items-center justify-between hover:shadow-md hover:border-[#007aff]/30 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#007aff] to-[#0051d5] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                  PM
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-[#1d1d1f]">My Workspace</div>
                  <div className="text-xs text-[#86868b]">Personal</div>
                </div>
              </div>
              <span className="text-[#86868b] text-xs">▼</span>
            </button>
          )}
          {sidebarCollapsed && (
            <button className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#007aff] to-[#0051d5] text-white flex items-center justify-center text-sm font-bold mx-auto shadow-md">
              PM
            </button>
          )}
        </div>

        {/* Quick Stats - Only show when expanded */}
        {!sidebarCollapsed && (
          <div className="p-4 space-y-2">
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-gradient-to-br from-white to-[#f9f9fb] rounded-xl p-3 border border-[#d1d1d6]/30 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-xs text-[#86868b]">{stat.label}</div>
                      <div className="text-lg font-bold text-[#1d1d1f]">{stat.value}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {!sidebarCollapsed && (
            <div className="space-y-1">
              <div className="text-xs font-semibold text-[#86868b] px-3 py-2">NAVIGATION</div>
              <button
                onClick={() => setActiveNav("recents")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-3 ${
                  activeNav === "recents"
                    ? "bg-gradient-to-r from-[#007aff] to-[#0051d5] text-white shadow-md"
                    : "text-[#1d1d1f] hover:bg-[#f5f5f7]"
                }`}
              >
                <span className="text-base">🕐</span>
                <span className="font-medium">Recents</span>
              </button>
              <button
                onClick={() => setActiveNav("favorites")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-3 ${
                  activeNav === "favorites"
                    ? "bg-gradient-to-r from-[#007aff] to-[#0051d5] text-white shadow-md"
                    : "text-[#1d1d1f] hover:bg-[#f5f5f7]"
                }`}
              >
                <span className="text-base">⭐</span>
                <span className="font-medium">Favorites</span>
              </button>
              <button
                onClick={() => setActiveNav("templates")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-3 ${
                  activeNav === "templates"
                    ? "bg-gradient-to-r from-[#007aff] to-[#0051d5] text-white shadow-md"
                    : "text-[#1d1d1f] hover:bg-[#f5f5f7]"
                }`}
              >
                <span className="text-base">📄</span>
                <span className="font-medium">Templates</span>
              </button>
              <button
                onClick={() => setActiveNav("projects")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-3 ${
                  activeNav === "projects"
                    ? "bg-gradient-to-r from-[#007aff] to-[#0051d5] text-white shadow-md"
                    : "text-[#1d1d1f] hover:bg-[#f5f5f7]"
                }`}
              >
                <span className="text-base">📁</span>
                <span className="font-medium">Projects</span>
              </button>

              {/* Recent Projects Section */}
              <div className="pt-4">
                <div className="text-xs font-semibold text-[#86868b] px-3 py-2">RECENT PROJECTS</div>
                {recentProjects.map((project) => (
                  <button
                    key={project.id}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 hover:bg-[#f5f5f7] group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{project.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[#1d1d1f] truncate">{project.name}</div>
                        <div className="text-xs text-[#86868b]">{project.updated}</div>
                      </div>
                    </div>
                    <div className="mt-2 bg-[#e5e5ea] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#007aff] to-[#0051d5] h-full rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Toggle Button */}
        <div className="p-4 border-t border-[#d1d1d6]/50">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full bg-gradient-to-br from-white to-[#f9f9fb] rounded-2xl border border-[#d1d1d6]/50 px-4 py-2.5 text-sm hover:shadow-md hover:border-[#007aff]/30 transition-all duration-200 font-medium text-[#1d1d1f]"
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-[#d1d1d6]/50 flex items-center justify-between px-8 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-[#1d1d1f]">Templates</h1>
            <p className="text-sm text-[#86868b]">Choose a template to get started quickly</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-2xl hover:bg-[#f5f5f7] transition-all duration-200 flex items-center justify-center relative">
              🔔<span className="absolute top-1 right-1 w-2 h-2 bg-[#ff3b30] rounded-full"></span>
            </button>
            <button className="w-10 h-10 rounded-2xl hover:bg-[#f5f5f7] transition-all duration-200 flex items-center justify-center">
              ⚙️
            </button>
            <button className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#007aff] to-[#0051d5] text-white flex items-center justify-center text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200">
              U
            </button>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="bg-white/60 backdrop-blur-xl border-b border-[#d1d1d6]/50 px-8 py-4">
          <div className="flex items-center gap-4 max-w-7xl">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white rounded-2xl border border-[#d1d1d6]/50 px-5 py-3 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#007aff]/30 focus:border-[#007aff] transition-all duration-200 shadow-sm"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
            </div>

            {/* New Template Button */}
            <button className="bg-gradient-to-r from-[#007aff] to-[#0051d5] text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:shadow-lg transition-all duration-200 flex items-center gap-2">
              <span className="text-lg">+</span>
              New Template
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#007aff] to-[#0051d5] text-white shadow-md"
                    : "bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] border border-[#d1d1d6]/50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-3xl border border-[#d1d1d6]/50 p-6 hover:shadow-2xl hover:border-[#007aff]/30 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
                    style={{ backgroundColor: `${template.color}15` }}
                  >
                    {template.icon}
                  </div>
                  <button className="w-9 h-9 rounded-xl hover:bg-[#f5f5f7] opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                    ⋯
                  </button>
                </div>

                <h3 className="text-base font-bold text-[#1d1d1f] mb-2">{template.title}</h3>
                <p className="text-sm text-[#86868b] mb-5 leading-relaxed">{template.description}</p>

                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl"
                    style={{ backgroundColor: `${template.color}15`, color: template.color }}
                  >
                    {template.category}
                  </span>
                  <button
                    className="text-white px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${template.color}, ${template.color}dd)` }}
                  >
                    Use →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-[#1d1d1f] mb-2">No templates found</h3>
              <p className="text-sm text-[#86868b]">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}