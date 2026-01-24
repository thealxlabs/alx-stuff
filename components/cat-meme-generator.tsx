"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cat, Download, RefreshCw, Share2 } from "lucide-react"
import { memeTopTexts, memeBottomTexts, loadingMessages } from "@/lib/data"

export function CatMemeGenerator() {
  const [catImage, setCatImage] = useState<string | null>(null)
  const [topText, setTopText] = useState("")
  const [bottomText, setBottomText] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const fetchCat = async () => {
    setLoading(true)
    setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)])
    
    try {
      const response = await fetch("https://api.thecatapi.com/v1/images/search")
      const data = await response.json()
      setCatImage(data[0]?.url || null)
      shuffleText()
    } catch {
      console.log("[v0] Failed to fetch cat image")
    } finally {
      setLoading(false)
    }
  }

  const shuffleText = () => {
    setTopText(memeTopTexts[Math.floor(Math.random() * memeTopTexts.length)])
    setBottomText(memeBottomTexts[Math.floor(Math.random() * memeBottomTexts.length)])
  }

  const downloadMeme = async () => {
    const canvas = canvasRef.current
    if (!canvas || !catImage) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      const fontSize = Math.max(img.width / 15, 24)
      ctx.font = `bold ${fontSize}px Impact, sans-serif`
      ctx.fillStyle = "white"
      ctx.strokeStyle = "black"
      ctx.lineWidth = fontSize / 15
      ctx.textAlign = "center"
      
      // Top text
      ctx.strokeText(topText, img.width / 2, fontSize + 10)
      ctx.fillText(topText, img.width / 2, fontSize + 10)
      
      // Bottom text
      ctx.strokeText(bottomText, img.width / 2, img.height - 20)
      ctx.fillText(bottomText, img.width / 2, img.height - 20)
      
      const link = document.createElement("a")
      link.download = "cat-meme.png"
      link.href = canvas.toDataURL()
      link.click()
    }
    img.src = catImage
  }

  const shareMeme = async () => {
    if (navigator.share && catImage) {
      try {
        await navigator.share({
          title: "Check out this cat meme!",
          text: `${topText}\n${bottomText}`,
          url: catImage,
        })
      } catch {
        // User cancelled or share failed
      }
    }
  }

  useEffect(() => {
    fetchCat()
  }, [])

  return (
    <Card className="overflow-hidden border-2 border-primary/20 bg-card/80 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-lg">
      <CardHeader className="bg-primary/10">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Cat className="h-6 w-6 text-primary" />
          Cat Meme Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">{loadingMessage}</p>
            </div>
          ) : catImage ? (
            <div className="relative h-full w-full">
              <img
                src={catImage || "/placeholder.svg"}
                alt="Random cat"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-between p-3 text-center">
                <p
                  className="text-lg font-bold text-white md:text-2xl"
                  style={{
                    textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
                    fontFamily: "Impact, sans-serif",
                  }}
                >
                  {topText}
                </p>
                <p
                  className="text-lg font-bold text-white md:text-2xl"
                  style={{
                    textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
                    fontFamily: "Impact, sans-serif",
                  }}
                >
                  {bottomText}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No cat loaded yet</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={fetchCat} disabled={loading} className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" />
            New Cat
          </Button>
          <Button onClick={shuffleText} variant="secondary" className="flex-1">
            Shuffle Text
          </Button>
        </div>
        <div className="mt-2 flex gap-2">
          <Button onClick={downloadMeme} variant="outline" size="sm" className="flex-1 bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button onClick={shareMeme} variant="outline" size="sm" className="flex-1 bg-transparent">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  )
}
