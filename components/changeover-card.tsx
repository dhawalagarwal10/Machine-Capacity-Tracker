"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Calendar, Layers } from "lucide-react"

interface ChangeoverCardProps {
  styleCode: string
  line: string
  date: string
  riskLevel: "low" | "medium" | "high"
  shortage: number
  delay?: number
}

const riskConfig = {
  low: {
    bg: "bg-success/10 border-success/30",
    badge: "bg-success/20 text-success",
    label: "Low Risk",
  },
  medium: {
    bg: "bg-warning/10 border-warning/30",
    badge: "bg-warning/20 text-warning",
    label: "Medium Risk",
  },
  high: {
    bg: "bg-error/10 border-error/30",
    badge: "bg-error/20 text-error",
    label: "High Risk",
  },
}

export function ChangeoverCard({ styleCode, line, date, riskLevel, shortage, delay = 0 }: ChangeoverCardProps) {
  const config = riskConfig[riskLevel]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`relative overflow-hidden rounded-xl border ${config.bg} p-4 backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="font-mono text-sm font-semibold text-foreground">{styleCode}</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${config.badge}`}>
          {config.label}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Layers className="w-4 h-4" />
          <span>{line}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span className="font-mono">{date}</span>
        </div>
        {shortage > 0 && (
          <div className="flex items-center gap-2 text-sm text-error">
            <AlertTriangle className="w-4 h-4" />
            <span>{shortage} machine shortage</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
