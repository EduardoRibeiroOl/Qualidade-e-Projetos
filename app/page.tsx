"use client"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Start() {
  const [animationPhase, setAnimationPhase] = useState<"start" | "transition" | "expand" | "complete">("start")
  const [loopCount, setLoopCount] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (showContent) {
      const timer = setTimeout(() => {
        router.push("/home")
      }, 5000) // 5 seconds delay

      return () => clearTimeout(timer)
    }
  }, [showContent, router])

  const handleAnimationComplete = () => {
    if (animationPhase === "start") {
      if (loopCount < 2) {
        setLoopCount(loopCount + 1)
      } else {
        setAnimationPhase("transition")
      }
    } else if (animationPhase === "transition") {
      setAnimationPhase("expand")
    } else if (animationPhase === "expand") {
      setAnimationPhase("complete")
      setShowContent(true)
    }
  }

  if (showContent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to <span className="text-primary">CELENIUM</span>
          </h1>
          <p className="text-muted-foreground text-lg">Your journey begins here</p>
        </div>
      </div>
    )
  }

  const container = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  }

  const box = {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative" as const,
  }

  const variants = {
    start: {
      rotate: [0, 360, 360, 0],
      scaleX: [1, 1, 0.5, 1],
      borderRadius: [5, 5, 50, 5],
      width: 100,
      height: 100,
    },
    transition: {
      rotate: 0,
      scaleX: 1,
      borderRadius: 5,
      width: 100,
      height: 100,
    },
    expand: {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      backgroundColor: "#0a0e27",
      rotate: 0,
    },
  }

  const textVariants = {
    start: {
      opacity: 0,
      scale: 0.8,
    },
    transition: {
      opacity: [0, 1, 1],
      scale: [0.8, 1, 1],
    },
    expand: {
      opacity: 0,
      scale: 0.8,
    },
  }

  return (
    <motion.div
      style={container}
      animate={{
        backgroundColor: ["#000000", "#1a2332", "#1a2332", "#0a0e27"],
      }}
      transition={{ duration: 4 }}
    >
      <motion.div
        key={animationPhase + loopCount}
        style={box}
        variants={variants}
        animate={animationPhase}
        transition={
          animationPhase === "start"
            ? { duration: 2, ease: "easeInOut", times: [0, 0.5, 0.75, 1] }
            : animationPhase === "transition"
              ? { duration: 1, ease: "easeInOut" }
              : { duration: 0.5, ease: "easeOut" }
        }
        onAnimationComplete={handleAnimationComplete}
      >
        {animationPhase === "transition" && (
          <motion.div
            variants={textVariants}
            animate="transition"
            transition={{ duration: 1, ease: "easeInOut", times: [0, 0.4, 1] }}
            style={{
              position: "absolute",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: "#0a0e27",
            }}
          >
            CELENIUM
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
