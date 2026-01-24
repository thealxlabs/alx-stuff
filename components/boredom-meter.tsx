"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gauge, Sparkles } from "lucide-react"
import { boredomMessages } from "@/lib/data"

interface BoredomMeterProps {
  onSuggestion: (section: string) => void
}

export function BoredomMeter({ onSuggestion }: BoredomMeterProps) {
  const [level, setLevel] = useState(5)

  const currentMessage = boredomMessages[level] || boredomMessages[5]

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLevel(parseInt(e.target.value))
  }

  const handleSuggestion = () => {
    onSuggestion(currentMessage.suggestion)
  }

  return (
    <Card className="overflow-hidden border-2 border-accent/20 bg-card/80 backdrop-blur-sm transition-all hover:border-accent/40 hover:shadow-lg">
      <CardHeader className="bg-accent/10">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Gauge className="h-6 w-6 text-accent-foreground" />
          Boredom Meter
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            How bored are you right now?
          </p>

          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="10"
              value={level}
              onChange={handleSliderChange}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Not at all</span>
              <span>Extremely</span>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 text-center">
            <div className="mb-2 text-4xl font-bold text-primary">{level}/10</div>
            <p className="text-sm">{currentMessage.message}</p>
          </div>

          <Button onClick={handleSuggestion} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            Suggest Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
