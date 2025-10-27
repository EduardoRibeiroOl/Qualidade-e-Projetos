"use client"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Start() {

  const router = useRouter()
  const [animationPhase, setAnimationPhase] = useState<"initialLoop" | "expand">("initialLoop")
  const [loopCount, setLoopCount] = useState(0)

  // Quando a animação termina, controlamos a lógica de repetição
  const handleAnimationComplete = () => {
    if (animationPhase === "initialLoop") {
      if (loopCount < 2) {
        setLoopCount(loopCount + 1)
      } else {
        setAnimationPhase("expand")
      }
    } else if (animationPhase === "expand") {
      router.push("/")
    }
  }

  const container = {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#000000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }

  const box = {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    margin: "auto",
  }

  const variants = {
    initialLoop: {
      rotate: [0, 360, 360, 0],
      scaleX: [1, 1, 0.5, 1],
      borderRadius: [5, 5, 50, 5],
      width: 100,
      height: 100,
    },
    expand: {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      backgroundColor: "#2e3a59",
      rotate: 0,
    },
  }

  return (
    <motion.div
      style={container}
      animate={{ backgroundColor: ["#000000", "#add8e6", "#add8e6", "#000000"] }}
      transition={{ duration: 4 }}
    >
      <motion.div
        key={animationPhase + loopCount} // força re-render para repetir
        style={box}
        variants={variants}
        animate={animationPhase}
        transition={
          animationPhase === "initialLoop"
            ? { duration: 2, ease: "easeInOut", times: [0, 0.5, 0.75, 1] }
            : { duration: 0.5, ease: "easeOut" }
        }
        onAnimationComplete={handleAnimationComplete}
      />
    </motion.div>
  )
}
