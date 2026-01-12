"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface HeatmapCell {
  day: number
  machineType: string
  status: "available" | "busy" | "releasing" | "risk"
  styleCode?: string
  line?: string
}

interface HeatmapProps {
  data: HeatmapCell[]
  machineTypes: string[]
  days: number[]
}

const statusColors = {
  available: "bg-success/80 hover:bg-success",
  busy: "bg-error/80 hover:bg-error",
  releasing: "bg-warning/80 hover:bg-warning",
  risk: "bg-risk/80 hover:bg-risk",
}

export function Heatmap({ data, machineTypes, days }: HeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false); // New state for client-side mount

  useEffect(() => {
    setMounted(true); // Set to true after component mounts on client
  }, []);

  const getCell = (machineType: string, day: number) => {
    return data.find((d) => d.machineType === machineType && d.day === day)
  }

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Header Row */}
          <div className="flex">
            <div className="w-32 shrink-0" />
            <div className="flex gap-0.5">
              {days.map((day) => (
                <div key={day} className="w-8 text-center text-[10px] font-mono text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Data Rows */}
          {machineTypes.map((machineType, rowIndex) => (
            <motion.div
              key={machineType}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
              className="flex items-center gap-2 mt-0.5"
            >
              <div className="w-32 shrink-0 text-xs font-medium text-muted-foreground truncate pr-2">{machineType}</div>
              <div className="flex gap-0.5">
                {days.map((day, colIndex) => {
                  const cell = getCell(machineType, day)
                  // Render animated motion.div only after component mounts on client
                  if (mounted) {
                    return (
                      <motion.div
                        key={`${machineType}-${day}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.2,
                          delay: rowIndex * 0.03 + colIndex * 0.01,
                        }}
                        className={`w-8 h-6 rounded-sm cursor-pointer transition-all duration-200 ${
                          cell ? statusColors[cell.status] : "bg-muted/30"
                        }`}
                        onMouseEnter={(e) => {
                          if (cell) {
                            setHoveredCell(cell)
                            setMousePosition({ x: e.clientX, y: e.clientY })
                          }
                        }}
                        onMouseLeave={() => setHoveredCell(null)}
                      />
                    )
                  } else {
                    // Render a simple div placeholder during SSR and initial client render before mount
                    return (
                      <div
                        key={`${machineType}-${day}`}
                        className="w-8 h-6 rounded-sm bg-muted/30"
                      />
                    )
                  }
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed z-50 px-3 py-2 rounded-lg bg-popover border border-border shadow-lg text-sm"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y + 10,
          }}
        >
          <p className="font-semibold text-foreground">{hoveredCell.machineType}</p>
          <p className="text-muted-foreground">Day {hoveredCell.day}</p>
          {hoveredCell.styleCode && <p className="font-mono text-xs text-cyan">{hoveredCell.styleCode}</p>}
          <p
            className={`text-xs font-medium capitalize ${
              hoveredCell.status === "available"
                ? "text-success"
                : hoveredCell.status === "busy"
                  ? "text-error"
                  : hoveredCell.status === "releasing"
                    ? "text-warning"
                    : "text-risk"
            }`}
          >
            {hoveredCell.status}
          </p>
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 justify-end">
        {[
          { status: "available", label: "Available" },
          { status: "busy", label: "Busy" },
          { status: "releasing", label: "Releasing Soon" },
          { status: "risk", label: "Risk" },
        ].map((item) => (
          <div key={item.status} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-sm ${statusColors[item.status as keyof typeof statusColors]}`} />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
