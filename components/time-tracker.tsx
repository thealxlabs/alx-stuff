"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

export function TimeTracker() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`
    }
    return `${secs}s`
  }

  const getMessage = () => {
    if (seconds < 60) return "Just getting started..."
    if (seconds < 300) return "A few minutes wasted"
    if (seconds < 600) return "Impressive procrastination"
    if (seconds < 1800) return "Expert time waster"
    if (seconds < 3600) return "Professional procrastinator"
    return "You're a legend"
  }

  return (
    <div className="flex items-center gap-2 rounded-full bg-card/80 px-4 py-2 text-sm shadow-sm backdrop-blur-sm">
      <Clock className="h-4 w-4 text-primary" />
      <span className="font-medium">{formatTime(seconds)}</span>
      <span className="hidden text-muted-foreground sm:inline">• {getMessage()}</span>
    </div>
  )
}
