"use client"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Start() {
  const [animationPhase, setAnimationPhase] = useState<"start" | "transition" | "expand">("start")
  const [loopCount, setLoopCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (animationPhase === "expand") {
      const timer = setTimeout(() => {
        router.push("/home")
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [animationPhase, router])

  const handleAnimationComplete = () => {
    if (animationPhase === "start") {
      if (loopCount < 2) {
        setLoopCount(loopCount + 1)
      } else {
        setAnimationPhase("transition")
      }
    } else if (animationPhase === "transition") {
      setAnimationPhase("expand")
    }
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
      scale: [0.95, 1, 1],
    },
    expand: {
      opacity: 0,
      scale: 0.95,
    },
  }

  return (
    <motion.div
      style={container}
      animate={{
        backgroundColor: ["#000000", "#1a2332", "#1a2332", "#0a0e27"],
      }}
      transition={{ duration: 5, ease: "easeInOut" }}
    >
      <motion.div
        key={animationPhase + loopCount}
        style={box}
        variants={variants}
        animate={animationPhase}
        transition={
          animationPhase === "start"
            ? // Smoother easing for rotation
              { duration: 2.5, ease: [0.22, 1, 0.36, 1], times: [0, 0.5, 0.75, 1] }
            : animationPhase === "transition"
              ? { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
        onAnimationComplete={handleAnimationComplete}
      >
        {animationPhase === "transition" && (
          <motion.div
            variants={textVariants}
            animate="transition"
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], times: [0, 0.5, 1] }}
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
