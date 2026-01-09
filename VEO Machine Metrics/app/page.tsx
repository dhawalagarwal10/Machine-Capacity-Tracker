"use client"

import { motion } from "framer-motion"
import { AppLayout } from "@/components/app-layout"
import { KPICard } from "@/components/kpi-card"
import { Heatmap } from "@/components/heatmap"
import { ChangeoverCard } from "@/components/changeover-card"
import { AlertCircle, Clock, CheckCircle2, AlertTriangle, Filter, CalendarDays } from "lucide-react"

// Mock data for heatmap
const machineTypes = [
  "Single Needle",
  "Double Needle",
  "Overlock 3T",
  "Overlock 5T",
  "Flatlock",
  "Bartack",
  "Button Hole",
  "Button Attach",
  "Snap Button",
  "Elastic Attach",
]

const days = Array.from({ length: 30 }, (_, i) => i + 1)

const generateHeatmapData = () => {
  const statuses = ["available", "busy", "releasing", "risk"] as const
  const data = []
  for (const machineType of machineTypes) {
    for (const day of days) {
      const random = Math.random()
      let status: (typeof statuses)[number]
      if (random < 0.35) status = "busy"
      else if (random < 0.55) status = "available"
      else if (random < 0.75) status = "releasing"
      else status = "risk"

      data.push({
        day,
        machineType,
        status,
        styleCode: status === "busy" ? `ST-${Math.floor(Math.random() * 9000) + 1000}` : undefined,
        line: status === "busy" ? `Line ${Math.floor(Math.random() * 8) + 1}` : undefined,
      })
    }
  }
  return data
}

const heatmapData = generateHeatmapData()

const upcomingChangeovers = [
  { styleCode: "ST-7842", line: "Line 3", date: "2025-01-15", riskLevel: "high" as const, shortage: 3 },
  { styleCode: "ST-6291", line: "Line 5", date: "2025-01-16", riskLevel: "medium" as const, shortage: 1 },
  { styleCode: "ST-8134", line: "Line 1", date: "2025-01-17", riskLevel: "low" as const, shortage: 0 },
  { styleCode: "ST-5523", line: "Line 7", date: "2025-01-18", riskLevel: "high" as const, shortage: 4 },
  { styleCode: "ST-9012", line: "Line 2", date: "2025-01-19", riskLevel: "medium" as const, shortage: 2 },
  { styleCode: "ST-4456", line: "Line 6", date: "2025-01-20", riskLevel: "low" as const, shortage: 0 },
]

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-3xl font-semibold tracking-tight gradient-text">Control Center</h1>
            <p className="text-muted-foreground mt-1">Real-time capacity intelligence</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
              <CalendarDays className="w-4 h-4" />
              Last 30 days
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" />
              All Lines
            </button>
          </motion.div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6">
          <KPICard
            title="Busy Machines"
            value={127}
            change={-5}
            changeLabel="vs last week"
            icon={AlertCircle}
            status="busy"
            progress={78}
            delay={0.1}
          />
          <KPICard
            title="Releasing Soon"
            value={34}
            change={12}
            changeLabel="within 7 days"
            icon={Clock}
            status="warning"
            progress={45}
            delay={0.2}
          />
          <KPICard
            title="Available"
            value={89}
            change={8}
            changeLabel="ready for allocation"
            icon={CheckCircle2}
            status="success"
            progress={62}
            delay={0.3}
          />
          <KPICard
            title="Risky Changeovers"
            value={12}
            change={-15}
            changeLabel="needs attention"
            icon={AlertTriangle}
            status="risk"
            progress={25}
            delay={0.4}
          />
        </div>

        {/* Machine Availability Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="rounded-xl border border-border bg-card/50 backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Machine Availability Heatmap</h2>
              <p className="text-sm text-muted-foreground mt-1">30-day availability forecast by machine type</p>
            </div>
          </div>
          <Heatmap data={heatmapData} machineTypes={machineTypes} days={days} />
        </motion.div>

        {/* Upcoming Changeovers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Upcoming Changeovers</h2>
              <p className="text-sm text-muted-foreground mt-1">Style transitions requiring attention</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {upcomingChangeovers.map((changeover, index) => (
              <ChangeoverCard key={changeover.styleCode} {...changeover} delay={0.7 + index * 0.1} />
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  )
}
