"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const colorPresets = [
  { name: "Blue", primary: "oklch(0.45 0.15 250)", accent: "oklch(0.55 0.18 250)" },
  { name: "Purple", primary: "oklch(0.45 0.15 290)", accent: "oklch(0.55 0.18 290)" },
  { name: "Green", primary: "oklch(0.45 0.15 150)", accent: "oklch(0.55 0.18 150)" },
  { name: "Orange", primary: "oklch(0.50 0.15 50)", accent: "oklch(0.60 0.18 50)" },
  { name: "Pink", primary: "oklch(0.50 0.15 350)", accent: "oklch(0.60 0.18 350)" },
  { name: "Teal", primary: "oklch(0.45 0.15 200)", accent: "oklch(0.55 0.18 200)" },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("appearance")
  const [selectedColor, setSelectedColor] = useState(colorPresets[0])
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    desktop: false,
  })
  const [language, setLanguage] = useState("en")
  const [fontSize, setFontSize] = useState("medium")

  const tabs = [
    { id: "appearance", label: "Appearance", icon: "🎨" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "account", label: "Account", icon: "👤" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
  ]

  const applyColorTheme = (preset: (typeof colorPresets)[0]) => {
    setSelectedColor(preset)
    document.documentElement.style.setProperty("--primary", preset.primary)
    document.documentElement.style.setProperty("--sidebar-primary", preset.accent)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-slate-800 dark:text-white mb-2"
          >
            Settings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 dark:text-slate-400"
          >
            Customize your workspace and preferences
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-64 flex-shrink-0"
          >
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-2 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
              {/* Appearance Tab */}
              {activeTab === "appearance" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Appearance</h2>

                    {/* Dark Mode Toggle */}
                    <div className="mb-8">
                      <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🌙</span>
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-white">Dark Mode</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              Switch between light and dark themes
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={toggleDarkMode}
                          className={`relative w-14 h-8 rounded-full transition-colors ${
                            darkMode ? "bg-blue-500" : "bg-slate-300"
                          }`}
                        >
                          <motion.div
                            animate={{ x: darkMode ? 24 : 2 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                          />
                        </button>
                      </label>
                    </div>

                    {/* Color Theme */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Color Theme</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {colorPresets.map((preset, index) => (
                          <motion.button
                            key={preset.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.05 * index }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => applyColorTheme(preset)}
                            className={`p-4 rounded-2xl border-2 transition-all ${
                              selectedColor.name === preset.name
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl shadow-md" style={{ background: preset.primary }} />
                              <span className="font-medium text-slate-800 dark:text-white">{preset.name}</span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Font Size */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Font Size</h3>
                      <div className="flex gap-3">
                        {["small", "medium", "large"].map((size) => (
                          <button
                            key={size}
                            onClick={() => setFontSize(size)}
                            className={`flex-1 py-3 px-4 rounded-2xl font-medium transition-all ${
                              fontSize === size
                                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                            }`}
                          >
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Notifications</h2>

                  {Object.entries(notifications).map(([key, value], index) => (
                    <motion.label
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{key === "email" ? "📧" : key === "push" ? "📱" : "💻"}</span>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-white capitalize">
                            {key} Notifications
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Receive notifications via {key}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [key]: !value })}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          value ? "bg-blue-500" : "bg-slate-300"
                        }`}
                      >
                        <motion.div
                          animate={{ x: value ? 24 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                        />
                      </button>
                    </motion.label>
                  ))}
                </motion.div>
              )}

              {/* Account Tab */}
              {activeTab === "account" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Account</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Eduardo Silva"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="eduardo@example.com"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        defaultValue="••••••••"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Preferences</h2>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                    >
                      <option value="en">English</option>
                      <option value="pt">Português</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Timezone
                    </label>
                    <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white">
                      <option>UTC-3 (Brasília)</option>
                      <option>UTC-5 (New York)</option>
                      <option>UTC+0 (London)</option>
                      <option>UTC+1 (Paris)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Date Format
                    </label>
                    <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
