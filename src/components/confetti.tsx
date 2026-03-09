import { useCallback } from 'react'
import confetti from 'canvas-confetti'

export function useConfetti() {
  return useCallback(() => {
    const colors = ['#b09455', '#69c5d1']
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors })
    setTimeout(() => {
      confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 }, colors })
      confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 }, colors })
    }, 250)
  }, [])
}
