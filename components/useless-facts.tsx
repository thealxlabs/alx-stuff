"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, RefreshCw, Sparkles } from "lucide-react"
import { loadingMessages } from "@/lib/data"

export function UselessFacts() {
  const [fact, setFact] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [mindBlownCount, setMindBlownCount] = useState(0)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("mind-blown-count")
    if (saved) setMindBlownCount(parseInt(saved))
    fetchFact()
  }, [])

  const fetchFact = async () => {
    setLoading(true)
    setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)])
    
    try {
      const response = await fetch("https://uselessfacts.jsph.pl/random.json?language=en")
      const data = await response.json()
      setFact(data.text)
    } catch {
      console.log("[v0] Failed to fetch fact")
      setFact("Did you know? Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still perfectly edible!")
    } finally {
      setLoading(false)
    }
  }

  const handleMindBlown = () => {
    const newCount = mindBlownCount + 1
    setMindBlownCount(newCount)
    localStorage.setItem("mind-blown-count", newCount.toString())
    setAnimated(true)
    setTimeout(() => setAnimated(false), 500)
  }

  return (
    <Card className="overflow-hidden border-2 border-chart-3/20 bg-card/80 backdrop-blur-sm transition-all hover:border-chart-3/40 hover:shadow-lg">
      <CardHeader className="bg-chart-3/10">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Brain className="h-6 w-6 text-chart-3" />
          Useless Facts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="min-h-[120px] rounded-lg bg-muted/50 p-4">
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <RefreshCw className="h-8 w-8 animate-spin text-chart-3" />
              <p className="text-sm text-muted-foreground">{loadingMessage}</p>
            </div>
          ) : fact ? (
            <p className="text-lg leading-relaxed">{fact}</p>
          ) : (
            <p className="text-muted-foreground">No fact loaded yet</p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Button
            onClick={handleMindBlown}
            variant="outline"
            className={`transition-transform ${animated ? "scale-110" : ""}`}
          >
            <Sparkles className={`mr-2 h-4 w-4 ${animated ? "animate-pulse text-accent" : ""}`} />
            Mind = Blown ({mindBlownCount})
          </Button>
          
          <Button onClick={fetchFact} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Next Fact
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
