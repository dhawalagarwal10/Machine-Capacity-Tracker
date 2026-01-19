"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "./sidebar"
import type { ReactNode } from "react"

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="p-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
