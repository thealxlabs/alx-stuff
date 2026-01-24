"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Laugh, RefreshCw, Share2 } from "lucide-react"
import { loadingMessages } from "@/lib/data"

interface Joke {
  type: "single" | "twopart"
  joke?: string
  setup?: string
  delivery?: string
  category: string
}

const categories = ["Programming", "Misc", "Pun", "Spooky", "Christmas"]

export function JokeMachine() {
  const [joke, setJoke] = useState<Joke | null>(null)
  const [showPunchline, setShowPunchline] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Any")

  const fetchJoke = async () => {
    setLoading(true)
    setShowPunchline(false)
    setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)])
    
    try {
      const categoryParam = selectedCategory === "Any" ? "Any" : selectedCategory
      const response = await fetch(
        `https://v2.jokeapi.dev/joke/${categoryParam}?blacklistFlags=nsfw,religious,political,racist,sexist`
      )
      const data = await response.json()
      setJoke(data)
    } catch {
      console.log("[v0] Failed to fetch joke")
    } finally {
      setLoading(false)
    }
  }

  const shareJoke = async () => {
    if (!joke) return
    const text = joke.type === "single" 
      ? joke.joke 
      : `${joke.setup}\n\n${joke.delivery}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this joke!",
          text: text,
        })
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(text || "")
    }
  }

  useEffect(() => {
    fetchJoke()
  }, [])

  return (
    <Card className="overflow-hidden border-2 border-secondary/20 bg-card/80 backdrop-blur-sm transition-all hover:border-secondary/40 hover:shadow-lg">
      <CardHeader className="bg-secondary/10">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Laugh className="h-6 w-6 text-secondary" />
          Joke Machine
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4 flex flex-wrap gap-1">
          {["Any", ...categories].map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              className="text-xs"
            >
              {cat}
            </Button>
          ))}
        </div>
        
        <div className="min-h-[150px] rounded-lg bg-muted/50 p-4">
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <RefreshCw className="h-8 w-8 animate-spin text-secondary" />
              <p className="text-sm text-muted-foreground">{loadingMessage}</p>
            </div>
          ) : joke ? (
            <div className="space-y-3">
              <span className="inline-block rounded-full bg-secondary/20 px-2 py-1 text-xs font-medium text-secondary-foreground">
                {joke.category}
              </span>
              {joke.type === "single" ? (
                <p className="text-lg leading-relaxed">{joke.joke}</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-lg font-medium">{joke.setup}</p>
                  {showPunchline ? (
                    <p className="text-lg text-primary">{joke.delivery}</p>
                  ) : (
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => setShowPunchline(true)}
                    >
                      Reveal Punchline
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No joke loaded yet</p>
          )}
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button onClick={fetchJoke} disabled={loading} className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80">
            <RefreshCw className="mr-2 h-4 w-4" />
            Another One
          </Button>
          <Button onClick={shareJoke} variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
