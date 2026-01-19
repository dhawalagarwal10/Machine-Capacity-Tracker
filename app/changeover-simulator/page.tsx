"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import {
  Play,
  Calendar,
  Layers,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

const machineRequirements = [
  { type: "Single Needle", required: 12, available: 10, surplus: -2 },
  { type: "Double Needle", required: 4, available: 6, surplus: 2 },
  { type: "Overlock 5T", required: 8, available: 8, surplus: 0 },
  { type: "Flatlock", required: 6, available: 4, surplus: -2 },
  { type: "Bartack", required: 2, available: 3, surplus: 1 },
  { type: "Button Hole", required: 2, available: 2, surplus: 0 },
  { type: "Button Attach", required: 2, available: 1, surplus: -1 },
]

const lines = ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5", "Line 6", "Line 7", "Line 8"]
const styles = ["ST-8542", "ST-7291", "ST-6103", "ST-9847", "ST-5516"]

export default function ChangeoverSimulatorPage() {
  const [selectedLine, setSelectedLine] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("")
  const [tentativeDate, setTentativeDate] = useState("")
  const [isSimulating, setIsSimulating] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const runSimulation = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
      setShowResults(true)
    }, 1500)
  }

  const totalShortage = machineRequirements
    .filter((m) => m.surplus < 0)
    .reduce((sum, m) => sum + Math.abs(m.surplus), 0)

  const totalSurplus = machineRequirements.filter((m) => m.surplus > 0).reduce((sum, m) => sum + m.surplus, 0)

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-semibold tracking-tight gradient-text">Changeover Simulator</h1>
          <p className="text-muted-foreground mt-1">Analyze machine availability for style changeovers</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Panel - Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-xl border border-border bg-card/50 backdrop-blur-xl p-6 space-y-6"
          >
            <h2 className="text-lg font-semibold text-foreground">Simulation Parameters</h2>

            {/* Current Line */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Layers className="w-4 h-4 text-cyan" />
                Current Line
              </label>
              <select
                value={selectedLine}
                onChange={(e) => setSelectedLine(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50"
              >
                <option value="">Select line...</option>
                {lines.map((line) => (
                  <option key={line} value={line}>
                    {line}
                  </option>
                ))}
              </select>
            </div>

            {/* New Style */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <FileText className="w-4 h-4 text-cyan" />
                New Style
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50"
              >
                <option value="">Select style...</option>
                {styles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            {/* Tentative Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Calendar className="w-4 h-4 text-cyan" />
                Tentative Changeover Date
              </label>
              <input
                type="date"
                value={tentativeDate}
                onChange={(e) => setTentativeDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50"
              />
            </div>

            {/* Run Simulation Button */}
            <Button
              onClick={runSimulation}
              disabled={!selectedLine || !selectedStyle || !tentativeDate || isSimulating}
              className="w-full gap-2 bg-gradient-to-r from-cyan to-violet hover:opacity-90 text-white py-6"
            >
              {isSimulating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ) : (
                <Play className="w-5 h-5" />
              )}
              {isSimulating ? "Running Simulation..." : "Run Simulation"}
            </Button>
          </motion.div>

          {/* Right Panel - Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-xl border border-border bg-card/50 backdrop-blur-xl p-6"
          >
            <AnimatePresence mode="wait">
              {!showResults ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex items-center justify-center"
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">Configure parameters and run simulation to see results</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Risk Summary */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        totalShortage > 3
                          ? "bg-error/20 text-error"
                          : totalShortage > 0
                            ? "bg-warning/20 text-warning"
                            : "bg-success/20 text-success"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {totalShortage > 3 ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : totalShortage > 0 ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5" />
                        )}
                        <span className="font-semibold">
                          {totalShortage > 3 ? "High Risk" : totalShortage > 0 ? "Medium Risk" : "Low Risk"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-error">
                        <TrendingDown className="w-4 h-4" />
                        {totalShortage} shortage
                      </span>
                      <span className="flex items-center gap-1 text-success">
                        <TrendingUp className="w-4 h-4" />
                        {totalSurplus} surplus
                      </span>
                    </div>
                  </div>

                  {/* Machine Requirements */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Machine Requirements
                    </h3>
                    <div className="space-y-2">
                      {machineRequirements.map((machine, index) => (
                        <motion.div
                          key={machine.type}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border"
                        >
                          <span className="text-sm text-foreground">{machine.type}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground">
                              Req: <span className="font-mono font-bold text-foreground">{machine.required}</span>
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Avail: <span className="font-mono font-bold text-foreground">{machine.available}</span>
                            </span>
                            <span
                              className={`font-mono font-bold text-sm min-w-[3rem] text-right ${
                                machine.surplus > 0
                                  ? "text-success"
                                  : machine.surplus < 0
                                    ? "text-error"
                                    : "text-muted-foreground"
                              }`}
                            >
                              {machine.surplus > 0 ? "+" : ""}
                              {machine.surplus}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Optimal Date */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="p-4 rounded-xl bg-gradient-to-r from-cyan/10 to-violet/10 border border-cyan/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            Suggested Optimal Date
                          </p>
                          <p className="font-mono font-bold text-lg text-foreground">2025-01-22</p>
                        </div>
                      </div>
                      <Button size="sm" className="gap-2 bg-success hover:bg-success/90 text-white">
                        Apply
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Export Report
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-cyan to-violet hover:opacity-90 text-white"
                      onClick={() => setShowResults(false)}
                    >
                      New Simulation
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  )
}
