"use client"

import { motion } from "framer-motion"
import { LayoutDashboard, FileInput, Calendar, RefreshCw, Settings2, Sun, Moon, Activity } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "./theme-provider"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/style-input", label: "Style Input", icon: FileInput },
  { href: "/machine-calendar", label: "Machine Calendar", icon: Calendar },
  { href: "/changeover-simulator", label: "Changeover Simulator", icon: RefreshCw },
  { href: "/machine-details", label: "Machine Details", icon: Settings2 },
]

export function Sidebar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 flex flex-col bg-gradient-to-b from-background-secondary to-background-tertiary dark:from-[#12121a] dark:to-[#0d0d12] border-r border-border backdrop-blur-xl">
      {/* Brand Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              className="w-2.5 h-2.5 rounded-full bg-cyan"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-cyan blur-sm" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight gradient-text">MACHINE CAPACITY</h1>
            <p className="text-xs text-muted-foreground font-medium">Intelligence Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan/20 to-violet/20 dark:from-cyan/10 dark:to-violet/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeGlow"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-gradient-to-b from-cyan to-violet"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-4">
        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-sm font-medium text-muted-foreground">Theme</span>
          <motion.div className="relative w-12 h-6 rounded-full bg-background-tertiary dark:bg-background border border-border">
            <motion.div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-gradient-to-r from-cyan to-violet flex items-center justify-center"
              animate={{ left: theme === "dark" ? "2px" : "22px" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {theme === "dark" ? <Moon className="w-3 h-3 text-white" /> : <Sun className="w-3 h-3 text-white" />}
            </motion.div>
          </motion.div>
        </motion.button>

        {/* Factory ID & Status */}
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">SZ-01</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-success"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <span className="text-xs text-muted-foreground">Active</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
