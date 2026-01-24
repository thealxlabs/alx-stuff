"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, RefreshCw, CheckCircle2, Flame } from "lucide-react"
import { challenges } from "@/lib/data"

interface ChallengeGeneratorProps {
  onComplete: () => void
}

export function ChallengeGenerator({ onComplete }: ChallengeGeneratorProps) {
  const [currentChallenge, setCurrentChallenge] = useState("")
  const [streak, setStreak] = useState(0)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    const savedStreak = localStorage.getItem("challenge-streak")
    if (savedStreak) setStreak(parseInt(savedStreak))
    newChallenge()
  }, [])

  const newChallenge = () => {
    const randomIndex = Math.floor(Math.random() * challenges.length)
    setCurrentChallenge(challenges[randomIndex])
    setCompleting(false)
  }

  const handleComplete = () => {
    setCompleting(true)
    const newStreak = streak + 1
    setStreak(newStreak)
    localStorage.setItem("challenge-streak", newStreak.toString())
    onComplete()
    
    setTimeout(() => {
      newChallenge()
    }, 1500)
  }

  return (
    <Card className="overflow-hidden border-2 border-primary/20 bg-card/80 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-lg">
      <CardHeader className="bg-primary/10">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Trophy className="h-6 w-6 text-primary" />
          Random Challenges
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-center gap-2 rounded-full bg-accent/20 px-4 py-2">
          <Flame className="h-5 w-5 text-destructive" />
          <span className="font-bold">{streak} Day Streak</span>
        </div>
        
        <div className={`min-h-[100px] rounded-lg bg-muted/50 p-6 text-center transition-all ${
          completing ? "scale-95 opacity-50" : ""
        }`}>
          {completing ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="h-12 w-12 text-chart-3 animate-bounce" />
              <p className="text-lg font-bold text-chart-3">Awesome!</p>
            </div>
          ) : (
            <p className="text-lg font-medium leading-relaxed">{currentChallenge}</p>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button 
            onClick={handleComplete} 
            className="flex-1 bg-chart-3 text-foreground hover:bg-chart-3/80"
            disabled={completing}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            I Did It!
          </Button>
          <Button 
            onClick={newChallenge} 
            variant="outline"
            disabled={completing}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
