"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("dark-mode")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = saved ? saved === "true" : prefersDark
    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle("dark", shouldBeDark)
  }, [])

  const toggleDark = () => {
    const newValue = !isDark
    setIsDark(newValue)
    document.documentElement.classList.toggle("dark", newValue)
    localStorage.setItem("dark-mode", newValue.toString())
  }

  return (
    <Button
      onClick={toggleDark}
      variant="outline"
      size="icon"
      className="rounded-full bg-transparent"
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle dark mode</span>
    </Button>
  )
}
