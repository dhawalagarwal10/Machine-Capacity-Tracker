"use client"

import { motion } from "framer-motion"
import { AppLayout } from "@/components/app-layout"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useRef } from "react"

const lines = ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5", "Line 6", "Line 7", "Line 8"]
const machineTypes = [
  "Single Needle",
  "Double Needle",
  "Overlock 3T",
  "Overlock 5T",
  "Flatlock",
  "Bartack",
  "Button Hole",
  "Button Attach",
]

const generateDays = () => {
  const days = []
  const today = new Date()
  for (let i = 0; i < 45; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    days.push({
      day: date.getDate(),
      month: date.toLocaleString("default", { month: "short" }),
      weekday: date.toLocaleString("default", { weekday: "short" }),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    })
  }
  return days
}

const days = generateDays()

type Status = "available" | "busy" | "releasing" | "maintenance"

const generateCalendarData = () => {
  const data: Record<string, Record<string, Record<number, { status: Status; styleCode?: string }>>> = {}

  for (const line of lines) {
    data[line] = {}
    for (const machine of machineTypes) {
      data[line][machine] = {}
      for (let i = 0; i < 45; i++) {
        const random = Math.random()
        let status: Status
        if (random < 0.4) status = "busy"
        else if (random < 0.6) status = "available"
        else if (random < 0.8) status = "releasing"
        else status = "maintenance"

        data[line][machine][i] = {
          status,
          styleCode: status === "busy" ? `ST-${Math.floor(Math.random() * 9000) + 1000}` : undefined,
        }
      }
    }
  }
  return data
}

const calendarData = generateCalendarData()

const statusColors: Record<Status, string> = {
  available: "bg-success/70 hover:bg-success",
  busy: "bg-error/70 hover:bg-error",
  releasing: "bg-warning/70 hover:bg-warning",
  maintenance: "bg-muted-foreground/30 hover:bg-muted-foreground/50",
}

export default function MachineCalendarPage() {
  const [expandedLine, setExpandedLine] = useState<string | null>("Line 1")
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-start justify-between"
        >
          <div>
            <h1 className="text-3xl font-semibold tracking-tight gradient-text">Machine Availability Calendar</h1>
            <p className="text-muted-foreground mt-1">45-day capacity forecast across all production lines</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-6"
        >
          {[
            { status: "available", label: "Available" },
            { status: "busy", label: "Busy" },
            { status: "releasing", label: "Releasing" },
            { status: "maintenance", label: "Maintenance" },
          ].map((item) => (
            <div key={item.status} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${statusColors[item.status as Status]}`} />
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Calendar */}
        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-xl overflow-hidden">
          {lines.map((line, lineIndex) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: lineIndex * 0.05 }}
              className="border-b border-border last:border-b-0"
            >
              {/* Line Header */}
              <button
                onClick={() => setExpandedLine(expandedLine === line ? null : line)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
              >
                <span className="text-sm font-semibold text-foreground">{line}</span>
                <motion.div animate={{ rotate: expandedLine === line ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronLeft className="w-5 h-5 text-muted-foreground -rotate-90" />
                </motion.div>
              </button>

              {/* Line Content */}
              <motion.div
                initial={false}
                animate={{
                  height: expandedLine === line ? "auto" : 0,
                  opacity: expandedLine === line ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div ref={lineIndex === 0 ? scrollRef : undefined} className="overflow-x-auto pb-4">
                  <div className="min-w-max px-6">
                    {/* Date Headers */}
                    <div className="flex mb-2">
                      <div className="w-32 shrink-0" />
                      <div className="flex">
                        {days.map((day, i) => (
                          <div key={i} className={`w-10 text-center ${day.isWeekend ? "opacity-50" : ""}`}>
                            <p className="text-[10px] text-muted-foreground">{day.weekday}</p>
                            <p className="text-xs font-mono font-medium text-foreground">{day.day}</p>
                            <p className="text-[10px] text-muted-foreground">{day.month}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Machine Rows */}
                    {machineTypes.map((machine, machineIndex) => (
                      <motion.div
                        key={machine}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: machineIndex * 0.03 }}
                        className="flex items-center mb-1"
                      >
                        <div className="w-32 shrink-0 pr-4">
                          <span className="text-xs text-muted-foreground truncate block">{machine}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {days.map((day, dayIndex) => {
                            const cellData = calendarData[line]?.[machine]?.[dayIndex]
                            return (
                              <motion.div
                                key={dayIndex}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  duration: 0.15,
                                  delay: machineIndex * 0.02 + dayIndex * 0.005,
                                }}
                                className={`w-10 h-6 rounded-sm cursor-pointer transition-all ${
                                  statusColors[cellData?.status || "available"]
                                } ${day.isWeekend ? "opacity-60" : ""}`}
                                title={cellData?.styleCode || cellData?.status}
                              />
                            )
                          })}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
