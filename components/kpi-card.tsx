"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { AnimatedCounter } from "./animated-counter"

interface KPICardProps {
  title: string
  value: number
  change?: number
  changeLabel?: string
  icon: LucideIcon
  status: "busy" | "warning" | "success" | "risk"
  progress?: number
  delay?: number
}

const statusConfig = {
  busy: {
    gradient: "from-error/20 to-error/5 dark:from-error/10 dark:to-error/5",
    border: "border-error/30",
    iconBg: "bg-error/20",
    iconColor: "text-error",
    glow: "group-hover:glow-error",
  },
  warning: {
    gradient: "from-warning/20 to-warning/5 dark:from-warning/10 dark:to-warning/5",
    border: "border-warning/30",
    iconBg: "bg-warning/20",
    iconColor: "text-warning",
    glow: "group-hover:glow-warning",
  },
  success: {
    gradient: "from-success/20 to-success/5 dark:from-success/10 dark:to-success/5",
    border: "border-success/30",
    iconBg: "bg-success/20",
    iconColor: "text-success",
    glow: "group-hover:glow-success",
  },
  risk: {
    gradient: "from-risk/20 to-risk/5 dark:from-risk/10 dark:to-risk/5",
    border: "border-risk/30",
    iconBg: "bg-risk/20",
    iconColor: "text-risk",
    glow: "group-hover:glow-error",
  },
}

export function KPICard({ title, value, change, changeLabel, icon: Icon, status, progress, delay = 0 }: KPICardProps) {
  const config = statusConfig[status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`group relative overflow-hidden rounded-xl border ${config.border} bg-gradient-to-br ${config.gradient} p-6 backdrop-blur-xl transition-shadow duration-300 ${config.glow}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <AnimatedCounter value={value} className="text-3xl text-foreground" />
            {change !== undefined && (
              <span className={`text-sm font-medium ${change >= 0 ? "text-success" : "text-error"}`}>
                {change >= 0 ? "+" : ""}
                {change}%
              </span>
            )}
          </div>
          {changeLabel && <p className="text-xs text-muted-foreground">{changeLabel}</p>}
        </div>
        <div className={`rounded-xl ${config.iconBg} p-3`}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-4">
          <div className="h-1.5 rounded-full bg-background/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: delay + 0.3 }}
              className={`h-full rounded-full ${
                status === "busy"
                  ? "bg-error"
                  : status === "warning"
                    ? "bg-warning"
                    : status === "success"
                      ? "bg-success"
                      : "bg-risk"
              }`}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}
