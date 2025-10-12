import { useEffect, useState } from "react"
import { RaceSimulationCallbacks, RaceState, Track } from "../models/models"
import { createRaceSimulation } from "../simulators/RaceSimulation"

export const useRaceSimulation = (track: Track, callbacks: RaceSimulationCallbacks = {}) => {
  const [simulation] = useState(() => createRaceSimulation(track, callbacks))
  const [raceState, setRaceState] = useState<RaceState>(simulation.getState())

  useEffect(() => {
    const handleStateUpdate = (state: RaceState) => {
      setRaceState(state)
    }

    simulation.callbacks.onStateUpdate = handleStateUpdate

    return () => {
      simulation.destroy()
    }
  }, [simulation])

  return {
    raceState,
    start: () => simulation.start(),
    pause: () => simulation.pause(),
    setSpeed: (multiplier: number) => simulation.setSpeedMultiplier(multiplier),
    getProgress: () => simulation.getProgress()
  }
}