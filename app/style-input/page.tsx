"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import {
  Upload,
  CheckCircle2,
  FileText,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Hash,
  Target,
  Package,
  X,
  FileSpreadsheet,
} from "lucide-react"

const steps = [
  { id: 1, title: "Style Details", description: "Basic style information" },
  { id: 2, title: "Operation Bulletin", description: "Upload operation file" },
  { id: 3, title: "Validation", description: "Review & validate" },
  { id: 4, title: "Confirmation", description: "Complete setup" },
]

const validationData = [
  { operation: "Collar Attach", machineType: "Single Needle", smv: 1.25, qty: 1 },
  { operation: "Side Seam", machineType: "Overlock 5T", smv: 0.85, qty: 2 },
  { operation: "Hem Bottom", machineType: "Flatlock", smv: 0.65, qty: 1 },
  { operation: "Button Hole", machineType: "Button Hole", smv: 0.45, qty: 4 },
  { operation: "Button Attach", machineType: "Button Attach", smv: 0.55, qty: 4 },
  { operation: "Bartack", machineType: "Bartack", smv: 0.35, qty: 8 },
]

export default function StyleInputPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    styleCode: "",
    orderQuantity: "",
    targetEfficiency: "75",
    plannedStartDate: "",
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) setUploadedFile(file)
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-semibold tracking-tight gradient-text">Style Input</h1>
          <p className="text-muted-foreground mt-1">Configure new style for capacity planning</p>
        </motion.div>

        {/* Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center justify-between"
        >
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center gap-3">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    currentStep > step.id
                      ? "bg-success text-white"
                      : currentStep === step.id
                        ? "bg-gradient-to-r from-cyan to-violet text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                  animate={{
                    scale: currentStep === step.id ? 1.1 : 1,
                  }}
                >
                  {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                </motion.div>
                <div className="hidden sm:block">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-4 transition-colors duration-300 ${
                    currentStep > step.id ? "bg-success" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-border bg-card/50 backdrop-blur-xl p-8"
          >
            {/* Step 1: Style Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Style Details</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Hash className="w-4 h-4 text-cyan" />
                      Style Code
                    </label>
                    <input
                      type="text"
                      value={formData.styleCode}
                      onChange={(e) => setFormData({ ...formData, styleCode: e.target.value })}
                      placeholder="ST-0000"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Package className="w-4 h-4 text-cyan" />
                      Order Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.orderQuantity}
                      onChange={(e) => setFormData({ ...formData, orderQuantity: e.target.value })}
                      placeholder="10000"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Target className="w-4 h-4 text-cyan" />
                      Target Efficiency (%)
                    </label>
                    <input
                      type="number"
                      value={formData.targetEfficiency}
                      onChange={(e) => setFormData({ ...formData, targetEfficiency: e.target.value })}
                      placeholder="75"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Calendar className="w-4 h-4 text-cyan" />
                      Planned Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.plannedStartDate}
                      onChange={(e) => setFormData({ ...formData, plannedStartDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Operation Bulletin Upload */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Operation Bulletin Upload</h2>
                <motion.div
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                    isDragging
                      ? "border-cyan bg-cyan/5"
                      : uploadedFile
                        ? "border-success bg-success/5"
                        : "border-border hover:border-muted-foreground"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  whileHover={{ scale: 1.01 }}
                >
                  {uploadedFile ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-success/20 flex items-center justify-center">
                        <FileSpreadsheet className="w-8 h-8 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadedFile(null)}
                        className="text-muted-foreground"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-foreground font-medium">Drag and drop your operation bulletin</p>
                        <p className="text-sm text-muted-foreground mt-1">or click to browse (.xlsx, .csv)</p>
                      </div>
                      <input
                        type="file"
                        accept=".xlsx,.csv"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) setUploadedFile(file)
                        }}
                      />
                    </div>
                  )}
                </motion.div>
              </div>
            )}

            {/* Step 3: Validation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Validation Results</h2>
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Operation
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Machine Type
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          SMV
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Qty
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {validationData.map((row, index) => (
                        <motion.tr
                          key={row.operation}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-muted/30"
                        >
                          <td className="px-4 py-3 text-sm text-foreground">{row.operation}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-cyan/10 text-cyan">
                              {row.machineType}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-sm text-foreground">
                            {row.smv.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-sm text-foreground">{row.qty}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="text-center space-y-6 py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 mx-auto rounded-full bg-success/20 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Style Created Successfully</h2>
                  <p className="text-muted-foreground mt-2">
                    Your style has been configured and is ready for capacity planning
                  </p>
                </div>
                <div className="flex items-center justify-center gap-8 pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold font-mono text-cyan">{formData.styleCode || "ST-8542"}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Style Code</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold font-mono text-violet">{validationData.length}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Operations</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold font-mono text-success">{formData.orderQuantity || "12,500"}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Order Qty</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1} className="gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              className="gap-2 bg-gradient-to-r from-cyan to-violet hover:opacity-90 text-white"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button className="gap-2 bg-success hover:bg-success/90 text-white">
              <FileText className="w-4 h-4" />
              View in Calendar
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
