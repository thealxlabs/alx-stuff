"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Shuffle, Sparkles, Volume2, VolumeX, Cat, Laugh, Scale, Brain, Gamepad2, Trophy, ArrowLeftRight, Gauge } from "lucide-react"
import { CatMemeGenerator } from "@/components/cat-meme-generator"
import { JokeMachine } from "@/components/joke-machine"
import { WouldYouRather } from "@/components/would-you-rather"
import { UselessFacts } from "@/components/useless-facts"
import { MiniGames } from "@/components/mini-games"
import { ChallengeGenerator } from "@/components/challenge-generator"
import { ThisOrThat } from "@/components/this-or-that"
import { BoredomMeter } from "@/components/boredom-meter"
import { TimeTracker } from "@/components/time-tracker"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { Confetti } from "@/components/confetti"

const sections = [
  { id: "cat-meme", label: "Cat Memes", icon: Cat, color: "text-foreground" },
  { id: "jokes", label: "Jokes", icon: Laugh, color: "text-foreground" },
  { id: "would-you-rather", label: "Would You Rather", icon: Scale, color: "text-foreground" },
  { id: "useless-facts", label: "Useless Facts", icon: Brain, color: "text-foreground" },
  { id: "mini-games", label: "Mini Games", icon: Gamepad2, color: "text-foreground" },
  { id: "challenges", label: "Challenges", icon: Trophy, color: "text-foreground" },
  { id: "this-or-that", label: "This or That", icon: ArrowLeftRight, color: "text-foreground" },
  { id: "boredom-meter", label: "Boredom Meter", icon: Gauge, color: "text-foreground" },
]

// Konami code sequence
const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]

export default function AlxStuff() {
  const [confettiTrigger, setConfettiTrigger] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [konamiIndex, setKonamiIndex] = useState(0)
  const [konamiActivated, setKonamiActivated] = useState(false)
  const [achievements, setAchievements] = useState<string[]>([])
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Load achievements from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("achievements")
    if (saved) setAchievements(JSON.parse(saved))
  }, [])

  // Konami code listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        const newIndex = konamiIndex + 1
        setKonamiIndex(newIndex)
        if (newIndex === konamiCode.length) {
          setKonamiActivated(true)
          setConfettiTrigger((prev) => prev + 1)
          if (!achievements.includes("konami")) {
            const newAchievements = [...achievements, "konami"]
            setAchievements(newAchievements)
            localStorage.setItem("achievements", JSON.stringify(newAchievements))
          }
          setKonamiIndex(0)
        }
      } else {
        setKonamiIndex(0)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [konamiIndex, achievements])

  const scrollToSection = useCallback((sectionId: string) => {
    const element = sectionRefs.current[sectionId]
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
      element.classList.add("animate-pulse")
      setTimeout(() => element.classList.remove("animate-pulse"), 1000)
    }
  }, [])

  const handleSurpriseMe = () => {
    const randomSection = sections[Math.floor(Math.random() * sections.length)]
    scrollToSection(randomSection.id)
    setConfettiTrigger((prev) => prev + 1)
  }

  const handleSuggestion = (section: string) => {
    if (section === "surprise") {
      handleSurpriseMe()
    } else {
      scrollToSection(section)
    }
  }

  const handleChallengeComplete = () => {
    setConfettiTrigger((prev) => prev + 1)
    if (!achievements.includes("first-challenge")) {
      const newAchievements = [...achievements, "first-challenge"]
      setAchievements(newAchievements)
      localStorage.setItem("achievements", JSON.stringify(newAchievements))
    }
  }

  return (
    <div className="relative min-h-screen bg-background">
      <Confetti trigger={confettiTrigger} />
      
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-float absolute -left-20 top-20 h-64 w-64 rounded-full bg-foreground/5 blur-3xl" />
        <div className="animate-float-delayed absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-foreground/5 blur-3xl" />
        <div className="animate-float absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-foreground/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-2xl">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AlxStuff</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Boredom Killers & More
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TimeTracker />
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-transparent"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
            </Button>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Navigation Pills */}
      <nav className="sticky top-[73px] z-30 overflow-x-auto border-b border-border/50 bg-background/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl gap-2 px-4 py-3">
          <Button
            onClick={handleSurpriseMe}
            className="shrink-0 gap-2 bg-primary text-primary-foreground"
          >
            <Shuffle className="h-4 w-4" />
            Surprise Me!
          </Button>
          {sections.map((section) => (
            <Button
              key={section.id}
              variant="outline"
              size="sm"
              className="shrink-0 gap-2 bg-transparent"
              onClick={() => scrollToSection(section.id)}
            >
              <section.icon className={`h-4 w-4 ${section.color}`} />
              <span className="hidden sm:inline">{section.label}</span>
            </Button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-4 py-8">
        {/* Konami Easter Egg Banner */}
        {konamiActivated && (
          <div className="mb-6 animate-bounce rounded-xl bg-primary p-4 text-center text-primary-foreground">
            <p className="text-lg font-bold">
              Konami Code Activated! You found the secret!
            </p>
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground">Achievements:</span>
            {achievements.includes("konami") && (
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                Secret Finder
              </span>
            )}
            {achievements.includes("first-challenge") && (
              <span className="rounded-full bg-chart-3/20 px-3 py-1 text-xs font-medium text-foreground">
                Challenge Accepted
              </span>
            )}
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            ref={(el) => { sectionRefs.current["cat-meme"] = el }}
            className="transition-all"
          >
            <CatMemeGenerator />
          </div>
          
          <div
            ref={(el) => { sectionRefs.current["jokes"] = el }}
            className="transition-all"
          >
            <JokeMachine />
          </div>
          
          <div
            ref={(el) => { sectionRefs.current["would-you-rather"] = el }}
            className="transition-all"
          >
            <WouldYouRather />
          </div>
          
          <div
            ref={(el) => { sectionRefs.current["useless-facts"] = el }}
            className="transition-all"
          >
            <UselessFacts />
          </div>
          
          <div
            ref={(el) => { sectionRefs.current["mini-games"] = el }}
            className="transition-all"
          >
            <MiniGames />
          </div>
          
          <div
            ref={(el) => { sectionRefs.current["challenges"] = el }}
            className="transition-all"
          >
            <ChallengeGenerator onComplete={handleChallengeComplete} />
          </div>
          
          <div
            ref={(el) => { sectionRefs.current["this-or-that"] = el }}
            className="transition-all"
          >
            <ThisOrThat />
          </div>
          
          <div
            ref={(el) => { sectionRefs.current["boredom-meter"] = el }}
            className="transition-all"
          >
            <BoredomMeter onSuggestion={handleSuggestion} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Made with ❤️ in Toronto, Canada 🇨🇦 by Alexander Wondwossen{" "}
            <a
              href="https://github.com/thealxlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-primary"
            >
              @thealxlabs
            </a>
          </p>
          <p className="mt-1 text-xs">
            Tip: Try the Konami code for a surprise!
          </p>
        </footer>
      </main>
    </div>
  )
}
