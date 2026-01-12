"use client"

import { useState, Suspense } from "react"
import { motion } from "framer-motion"
import { AppLayout } from "@/components/app-layout"
import { Search, Activity, Calendar, TrendingUp, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

const machines = [
  { id: "SN-001", type: "Single Needle", status: "busy", line: "Line 1" },
  { id: "SN-002", type: "Single Needle", status: "available", line: "Line 1" },
  { id: "SN-003", type: "Single Needle", status: "busy", line: "Line 2" },
  { id: "DN-001", type: "Double Needle", status: "maintenance", line: "Line 3" },
  { id: "OL-001", type: "Overlock 5T", status: "busy", line: "Line 1" },
  { id: "OL-002", type: "Overlock 5T", status: "releasing", line: "Line 4" },
  { id: "FL-001", type: "Flatlock", status: "available", line: "Line 2" },
  { id: "FL-002", type: "Flatlock", status: "busy", line: "Line 5" },
  { id: "BT-001", type: "Bartack", status: "available", line: "Line 1" },
  { id: "BH-001", type: "Button Hole", status: "busy", line: "Line 3" },
]

const utilizationData = [
  { date: "Jan 1", utilization: 72 },
  { date: "Jan 5", utilization: 85 },
  { date: "Jan 10", utilization: 78 },
  { date: "Jan 15", utilization: 92 },
  { date: "Jan 20", utilization: 68 },
  { date: "Jan 25", utilization: 88 },
  { date: "Jan 30", utilization: 95 },
]

const assignmentTimeline = [
  { style: "ST-7842", line: "Line 1", startDate: "2025-01-01", endDate: "2025-01-15", status: "completed" },
  { style: "ST-6291", line: "Line 1", startDate: "2025-01-16", endDate: "2025-01-28", status: "active" },
  { style: "ST-8134", line: "Line 3", startDate: "2025-01-29", endDate: "2025-02-10", status: "upcoming" },
]

const statusConfig = {
  busy: { color: "bg-error", label: "Busy", icon: AlertCircle },
  available: { color: "bg-success", label: "Available", icon: CheckCircle2 },
  releasing: { color: "bg-warning", label: "Releasing", icon: Clock },
  maintenance: { color: "bg-muted-foreground", label: "Maintenance", icon: Activity },
}

function MachineDetailsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMachine, setSelectedMachine] = useState(machines[0])

  const filteredMachines = machines.filter(
    (m) =>
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const StatusIcon = statusConfig[selectedMachine.status as keyof typeof statusConfig].icon

  return (
    <AppLayout>
      <div className="flex gap-8 h-[calc(100vh-8rem)]">
        {/* Left Panel - Machine List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-80 shrink-0 rounded-xl border border-border bg-card/50 backdrop-blur-xl overflow-hidden flex flex-col"
        >
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search machines..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50"
              />
            </div>
          </div>

          {/* Machine List */}
          <div className="flex-1 overflow-y-auto p-2">
            {filteredMachines.map((machine, index) => {
              const config = statusConfig[machine.status as keyof typeof statusConfig]
              const isSelected = selectedMachine.id === machine.id

              return (
                <motion.button
                  key={machine.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  onClick={() => setSelectedMachine(machine)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan/10 to-violet/10 border border-cyan/20"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-semibold text-foreground">{machine.id}</p>
                    <p className="text-xs text-muted-foreground truncate">{machine.type}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{machine.line}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Right Panel - Machine Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1 rounded-xl border border-border bg-card/50 backdrop-blur-xl overflow-y-auto"
        >
          {/* Machine Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl ${
                    statusConfig[selectedMachine.status as keyof typeof statusConfig].color
                  }/20 flex items-center justify-center`}
                >
                  <StatusIcon
                    className={`w-6 h-6 ${
                      selectedMachine.status === "busy"
                        ? "text-error"
                        : selectedMachine.status === "available"
                          ? "text-success"
                          : selectedMachine.status === "releasing"
                            ? "text-warning"
                            : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold font-mono text-foreground">{selectedMachine.id}</h1>
                  <p className="text-muted-foreground">{selectedMachine.type}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase ${
                  statusConfig[selectedMachine.status as keyof typeof statusConfig].color
                }/20 ${
                  selectedMachine.status === "busy"
                    ? "text-error"
                    : selectedMachine.status === "available"
                      ? "text-success"
                      : selectedMachine.status === "releasing"
                        ? "text-warning"
                        : "text-muted-foreground"
                }`}
              >
                {statusConfig[selectedMachine.status as keyof typeof statusConfig].label}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-6 border-b border-border">
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Current Assignment</span>
              </div>
              <p className="text-xl font-mono font-bold text-foreground">ST-6291</p>
              <p className="text-xs text-muted-foreground mt-1">Line 1</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Release Date</span>
              </div>
              <p className="text-xl font-mono font-bold text-foreground">2025-01-28</p>
              <p className="text-xs text-muted-foreground mt-1">12 days remaining</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Utilization</span>
              </div>
              <p className="text-xl font-mono font-bold text-cyan">87%</p>
              <p className="text-xs text-success mt-1">+5% vs last month</p>
            </div>
          </div>

          {/* Utilization Chart */}
          <div className="p-6 border-b border-border">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Utilization Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={utilizationData}>
                  <defs>
                    <linearGradient id="utilizationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  />
                  <YAxis
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#16161d",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#f8fafc" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="utilization"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fill="url(#utilizationGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Assignment Timeline */}
          <div className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Assignment Timeline
            </h3>
            <div className="space-y-3">
              {assignmentTimeline.map((assignment, index) => (
                <motion.div
                  key={assignment.style}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    assignment.status === "active"
                      ? "bg-cyan/5 border-cyan/20"
                      : assignment.status === "completed"
                        ? "bg-muted/30 border-border"
                        : "bg-violet/5 border-violet/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        assignment.status === "active"
                          ? "bg-cyan"
                          : assignment.status === "completed"
                            ? "bg-muted-foreground"
                            : "bg-violet"
                      }`}
                    />
                    <div>
                      <p className="font-mono font-semibold text-foreground">{assignment.style}</p>
                      <p className="text-xs text-muted-foreground">{assignment.line}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm text-foreground">
                      {assignment.startDate} → {assignment.endDate}
                    </p>
                    <p
                      className={`text-xs capitalize ${
                        assignment.status === "active"
                          ? "text-cyan"
                          : assignment.status === "completed"
                            ? "text-muted-foreground"
                            : "text-violet"
                      }`}
                    >
                      {assignment.status}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  )
}

export default function MachineDetailsPage() {
  return (
    <Suspense fallback={null}>
      <MachineDetailsContent />
    </Suspense>
  )
}
