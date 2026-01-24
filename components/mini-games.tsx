"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, Timer, Palette, Brain, RotateCcw } from "lucide-react"

type GameType = "reaction" | "color" | "memory" | null

export function MiniGames() {
  const [selectedGame, setSelectedGame] = useState<GameType>(null)

  return (
    <Card className="overflow-hidden border-2 border-chart-5/20 bg-card/80 backdrop-blur-sm transition-all hover:border-chart-5/40 hover:shadow-lg">
      <CardHeader className="bg-chart-5/10">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Gamepad2 className="h-6 w-6 text-chart-5" />
          Mini Games
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {!selectedGame ? (
          <div className="grid gap-3">
            <Button
              onClick={() => setSelectedGame("reaction")}
              variant="outline"
              className="h-auto justify-start gap-3 p-4"
            >
              <Timer className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold">Reaction Time</div>
                <div className="text-xs text-muted-foreground">Test your reflexes</div>
              </div>
            </Button>
            <Button
              onClick={() => setSelectedGame("color")}
              variant="outline"
              className="h-auto justify-start gap-3 p-4"
            >
              <Palette className="h-5 w-5 text-secondary" />
              <div className="text-left">
                <div className="font-semibold">Color Matcher</div>
                <div className="text-xs text-muted-foreground">Guess the hex code</div>
              </div>
            </Button>
            <Button
              onClick={() => setSelectedGame("memory")}
              variant="outline"
              className="h-auto justify-start gap-3 p-4"
            >
              <Brain className="h-5 w-5 text-accent-foreground" />
              <div className="text-left">
                <div className="font-semibold">Number Memory</div>
                <div className="text-xs text-muted-foreground">Remember the sequence</div>
              </div>
            </Button>
          </div>
        ) : (
          <div>
            <Button
              onClick={() => setSelectedGame(null)}
              variant="ghost"
              size="sm"
              className="mb-3"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
            {selectedGame === "reaction" && <ReactionGame />}
            {selectedGame === "color" && <ColorMatcherGame />}
            {selectedGame === "memory" && <NumberMemoryGame />}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ReactionGame() {
  const [gameState, setGameState] = useState<"waiting" | "ready" | "go" | "result" | "tooEarly">("waiting")
  const [startTime, setStartTime] = useState(0)
  const [reactionTime, setReactionTime] = useState(0)
  const [highScore, setHighScore] = useState<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("reaction-highscore")
    if (saved) setHighScore(parseInt(saved))
  }, [])

  const startGame = () => {
    setGameState("ready")
    const delay = 2000 + Math.random() * 3000
    setTimeout(() => {
      setGameState("go")
      setStartTime(Date.now())
    }, delay)
  }

  const handleClick = () => {
    if (gameState === "ready") {
      setGameState("tooEarly")
    } else if (gameState === "go") {
      const time = Date.now() - startTime
      setReactionTime(time)
      setGameState("result")
      if (!highScore || time < highScore) {
        setHighScore(time)
        localStorage.setItem("reaction-highscore", time.toString())
      }
    } else if (gameState === "waiting" || gameState === "result" || gameState === "tooEarly") {
      startGame()
    }
  }

  const getBgColor = () => {
    switch (gameState) {
      case "ready": return "bg-destructive"
      case "go": return "bg-chart-3"
      case "result": return "bg-primary"
      case "tooEarly": return "bg-accent"
      default: return "bg-secondary"
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleClick}
        className={`w-full rounded-lg p-8 text-center transition-colors ${getBgColor()}`}
      >
        {gameState === "waiting" && (
          <p className="text-lg font-bold text-secondary-foreground">Click to Start</p>
        )}
        {gameState === "ready" && (
          <p className="text-lg font-bold text-destructive-foreground">Wait for green...</p>
        )}
        {gameState === "go" && (
          <p className="text-lg font-bold text-foreground">CLICK NOW!</p>
        )}
        {gameState === "result" && (
          <div className="text-primary-foreground">
            <p className="text-3xl font-bold">{reactionTime}ms</p>
            <p className="text-sm">Click to try again</p>
          </div>
        )}
        {gameState === "tooEarly" && (
          <div className="text-accent-foreground">
            <p className="text-lg font-bold">Too early!</p>
            <p className="text-sm">Click to try again</p>
          </div>
        )}
      </button>
      {highScore && (
        <p className="text-center text-sm text-muted-foreground">
          Best: {highScore}ms
        </p>
      )}
    </div>
  )
}

function ColorMatcherGame() {
  const [color, setColor] = useState("")
  const [options, setOptions] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem("color-highscore")
    if (saved) setHighScore(parseInt(saved))
    newRound()
  }, [])

  const generateColor = () => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  }

  const newRound = useCallback(() => {
    const correct = generateColor()
    setColor(correct)
    const allOptions = [correct]
    while (allOptions.length < 4) {
      const fake = generateColor()
      if (!allOptions.includes(fake)) allOptions.push(fake)
    }
    setOptions(allOptions.sort(() => Math.random() - 0.5))
    setSelected(null)
  }, [])

  const handleSelect = (hex: string) => {
    setSelected(hex)
    if (hex === color) {
      const newScore = score + 1
      setScore(newScore)
      if (newScore > highScore) {
        setHighScore(newScore)
        localStorage.setItem("color-highscore", newScore.toString())
      }
      setTimeout(newRound, 500)
    } else {
      setScore(0)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span>Score: {score}</span>
        <span className="text-muted-foreground">Best: {highScore}</span>
      </div>
      <div
        className="mx-auto h-24 w-24 rounded-lg shadow-inner"
        style={{ backgroundColor: color }}
      />
      <p className="text-center text-sm text-muted-foreground">What&apos;s this color&apos;s hex code?</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((hex) => (
          <Button
            key={hex}
            onClick={() => handleSelect(hex)}
            variant="outline"
            className={`font-mono text-xs ${
              selected === hex
                ? hex === color
                  ? "border-chart-3 bg-chart-3/20"
                  : "border-destructive bg-destructive/20"
                : ""
            }`}
            disabled={!!selected}
          >
            {hex.toUpperCase()}
          </Button>
        ))}
      </div>
      {selected && selected !== color && (
        <Button onClick={newRound} className="w-full">
          Try Again
        </Button>
      )}
    </div>
  )
}

function NumberMemoryGame() {
  const [sequence, setSequence] = useState("")
  const [userInput, setUserInput] = useState("")
  const [phase, setPhase] = useState<"show" | "input" | "result">("show")
  const [level, setLevel] = useState(1)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem("memory-highscore")
    if (saved) setHighScore(parseInt(saved))
    startLevel(1)
  }, [])

  const startLevel = (lvl: number) => {
    const newSequence = Array.from({ length: lvl + 2 }, () => Math.floor(Math.random() * 10)).join("")
    setSequence(newSequence)
    setPhase("show")
    setUserInput("")
    
    setTimeout(() => {
      setPhase("input")
    }, 1000 + lvl * 500)
  }

  const handleSubmit = () => {
    setPhase("result")
    if (userInput === sequence) {
      const newLevel = level + 1
      setLevel(newLevel)
      if (newLevel > highScore) {
        setHighScore(newLevel)
        localStorage.setItem("memory-highscore", newLevel.toString())
      }
    }
  }

  const nextRound = () => {
    if (userInput === sequence) {
      startLevel(level)
    } else {
      setLevel(1)
      startLevel(1)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span>Level: {level}</span>
        <span className="text-muted-foreground">Best: {highScore}</span>
      </div>
      
      {phase === "show" && (
        <div className="rounded-lg bg-primary/10 p-6 text-center">
          <p className="mb-2 text-sm text-muted-foreground">Remember this number:</p>
          <p className="font-mono text-3xl font-bold tracking-wider text-primary">{sequence}</p>
        </div>
      )}
      
      {phase === "input" && (
        <div className="space-y-3">
          <p className="text-center text-sm text-muted-foreground">What was the number?</p>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.replace(/\D/g, ""))}
            className="w-full rounded-lg border-2 border-input bg-background p-3 text-center font-mono text-2xl tracking-wider focus:border-primary focus:outline-none"
            autoFocus
            maxLength={sequence.length}
          />
          <Button onClick={handleSubmit} className="w-full" disabled={!userInput}>
            Submit
          </Button>
        </div>
      )}
      
      {phase === "result" && (
        <div className="space-y-3 text-center">
          {userInput === sequence ? (
            <div className="rounded-lg bg-chart-3/20 p-4">
              <p className="text-lg font-bold text-chart-3">Correct!</p>
              <p className="text-sm text-muted-foreground">Level {level} complete</p>
            </div>
          ) : (
            <div className="rounded-lg bg-destructive/20 p-4">
              <p className="text-lg font-bold text-destructive">Wrong!</p>
              <p className="font-mono text-sm">Correct: {sequence}</p>
              <p className="font-mono text-sm text-muted-foreground">You entered: {userInput}</p>
            </div>
          )}
          <Button onClick={nextRound} className="w-full">
            {userInput === sequence ? "Next Level" : "Try Again"}
          </Button>
        </div>
      )}
    </div>
  )
}
