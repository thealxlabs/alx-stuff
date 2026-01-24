"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftRight, RefreshCw } from "lucide-react"
import { thisOrThatPolls } from "@/lib/data"

export function ThisOrThat() {
  const [currentPoll, setCurrentPoll] = useState(0)
  const [votes, setVotes] = useState<Record<number, { a: number; b: number }>>({})
  const [selected, setSelected] = useState<"A" | "B" | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("tot-votes")
    if (saved) {
      setVotes(JSON.parse(saved))
    } else {
      // Initialize with base data
      const initial: Record<number, { a: number; b: number }> = {}
      thisOrThatPolls.forEach((poll, i) => {
        initial[i] = { a: poll.votesA, b: poll.votesB }
      })
      setVotes(initial)
    }
  }, [])

  const poll = thisOrThatPolls[currentPoll]
  const vote = votes[currentPoll] || { a: poll.votesA, b: poll.votesB }
  const totalVotes = vote.a + vote.b
  const percentA = Math.round((vote.a / totalVotes) * 100)
  const percentB = Math.round((vote.b / totalVotes) * 100)

  const handleVote = (option: "A" | "B") => {
    if (selected) return
    
    setSelected(option)
    const newVotes = {
      ...votes,
      [currentPoll]: {
        a: vote.a + (option === "A" ? 1 : 0),
        b: vote.b + (option === "B" ? 1 : 0),
      },
    }
    setVotes(newVotes)
    localStorage.setItem("tot-votes", JSON.stringify(newVotes))
  }

  const nextPoll = () => {
    setSelected(null)
    setCurrentPoll((prev) => (prev + 1) % thisOrThatPolls.length)
  }

  return (
    <Card className="overflow-hidden border-2 border-secondary/20 bg-card/80 backdrop-blur-sm transition-all hover:border-secondary/40 hover:shadow-lg">
      <CardHeader className="bg-secondary/10">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <ArrowLeftRight className="h-6 w-6 text-secondary" />
          This or That
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleVote("A")}
            disabled={!!selected}
            className={`relative overflow-hidden rounded-xl border-2 p-6 text-center transition-all ${
              selected === "A"
                ? "border-primary bg-primary/20"
                : selected
                ? "border-border opacity-60"
                : "border-border hover:border-primary hover:bg-primary/5"
            }`}
          >
            <div className="relative z-10">
              <p className="text-lg font-bold">{poll.optionA}</p>
              {selected && (
                <p className="mt-2 text-2xl font-bold text-primary">{percentA}%</p>
              )}
            </div>
            {selected && (
              <div
                className="absolute inset-x-0 bottom-0 bg-primary/30 transition-all duration-700"
                style={{ height: `${percentA}%` }}
              />
            )}
          </button>

          <button
            onClick={() => handleVote("B")}
            disabled={!!selected}
            className={`relative overflow-hidden rounded-xl border-2 p-6 text-center transition-all ${
              selected === "B"
                ? "border-secondary bg-secondary/20"
                : selected
                ? "border-border opacity-60"
                : "border-border hover:border-secondary hover:bg-secondary/5"
            }`}
          >
            <div className="relative z-10">
              <p className="text-lg font-bold">{poll.optionB}</p>
              {selected && (
                <p className="mt-2 text-2xl font-bold text-secondary">{percentB}%</p>
              )}
            </div>
            {selected && (
              <div
                className="absolute inset-x-0 bottom-0 bg-secondary/30 transition-all duration-700"
                style={{ height: `${percentB}%` }}
              />
            )}
          </button>
        </div>

        {selected && (
          <p className="mt-3 text-center text-sm text-muted-foreground">
            {totalVotes.toLocaleString()} votes
          </p>
        )}

        <Button onClick={nextPoll} className="mt-4 w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Next Poll
        </Button>
      </CardContent>
    </Card>
  )
}
