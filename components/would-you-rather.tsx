"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, RefreshCw, Share2 } from "lucide-react"
import { wouldYouRatherQuestions } from "@/lib/data"

interface Vote {
  optionA: number
  optionB: number
}

export function WouldYouRather() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [votes, setVotes] = useState<Record<number, Vote>>({})
  const [selected, setSelected] = useState<"A" | "B" | null>(null)

  useEffect(() => {
    // Load votes from localStorage
    const saved = localStorage.getItem("wyr-votes")
    if (saved) {
      setVotes(JSON.parse(saved))
    }
  }, [])

  const question = wouldYouRatherQuestions[currentQuestion]
  const vote = votes[currentQuestion] || { optionA: 0, optionB: 0 }
  const totalVotes = vote.optionA + vote.optionB
  const percentA = totalVotes > 0 ? Math.round((vote.optionA / totalVotes) * 100) : 50
  const percentB = totalVotes > 0 ? Math.round((vote.optionB / totalVotes) * 100) : 50

  const handleVote = (option: "A" | "B") => {
    if (selected) return // Already voted
    
    setSelected(option)
    const newVotes = {
      ...votes,
      [currentQuestion]: {
        optionA: vote.optionA + (option === "A" ? 1 : 0),
        optionB: vote.optionB + (option === "B" ? 1 : 0),
      },
    }
    setVotes(newVotes)
    localStorage.setItem("wyr-votes", JSON.stringify(newVotes))
  }

  const nextQuestion = () => {
    setSelected(null)
    setCurrentQuestion((prev) => 
      prev === wouldYouRatherQuestions.length - 1 ? 0 : prev + 1
    )
  }

  const randomQuestion = () => {
    setSelected(null)
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * wouldYouRatherQuestions.length)
    } while (newIndex === currentQuestion && wouldYouRatherQuestions.length > 1)
    setCurrentQuestion(newIndex)
  }

  const shareQuestion = async () => {
    const text = `Would you rather:\nA) ${question.optionA}\nB) ${question.optionB}`
    
    if (navigator.share) {
      try {
        await navigator.share({ title: "Would You Rather?", text })
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  return (
    <Card className="overflow-hidden border-2 border-accent/20 bg-card/80 backdrop-blur-sm transition-all hover:border-accent/40 hover:shadow-lg">
      <CardHeader className="bg-accent/10">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Scale className="h-6 w-6 text-accent-foreground" />
          Would You Rather
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {wouldYouRatherQuestions.length}
          </div>
          
          <div className="grid gap-3">
            <button
              onClick={() => handleVote("A")}
              disabled={!!selected}
              className={`relative overflow-hidden rounded-lg border-2 p-4 text-left transition-all ${
                selected === "A"
                  ? "border-primary bg-primary/10"
                  : selected
                  ? "border-border opacity-70"
                  : "border-border hover:border-primary hover:bg-primary/5"
              }`}
            >
              {selected && (
                <div
                  className="absolute inset-y-0 left-0 bg-primary/20 transition-all duration-500"
                  style={{ width: `${percentA}%` }}
                />
              )}
              <div className="relative flex items-center justify-between">
                <span className="font-medium">{question.optionA}</span>
                {selected && (
                  <span className="text-sm font-bold text-primary">{percentA}%</span>
                )}
              </div>
            </button>
            
            <div className="text-center font-bold text-muted-foreground">OR</div>
            
            <button
              onClick={() => handleVote("B")}
              disabled={!!selected}
              className={`relative overflow-hidden rounded-lg border-2 p-4 text-left transition-all ${
                selected === "B"
                  ? "border-secondary bg-secondary/10"
                  : selected
                  ? "border-border opacity-70"
                  : "border-border hover:border-secondary hover:bg-secondary/5"
              }`}
            >
              {selected && (
                <div
                  className="absolute inset-y-0 left-0 bg-secondary/20 transition-all duration-500"
                  style={{ width: `${percentB}%` }}
                />
              )}
              <div className="relative flex items-center justify-between">
                <span className="font-medium">{question.optionB}</span>
                {selected && (
                  <span className="text-sm font-bold text-secondary">{percentB}%</span>
                )}
              </div>
            </button>
          </div>

          {selected && totalVotes > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              {totalVotes} total votes
            </p>
          )}

          <div className="flex gap-2">
            <Button onClick={randomQuestion} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Random
            </Button>
            <Button onClick={nextQuestion} variant="secondary" className="flex-1">
              Next
            </Button>
            <Button onClick={shareQuestion} variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
