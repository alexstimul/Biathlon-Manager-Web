import {AthleteCallbacks, RaceManagerCallbacks, RaceManagerState, Track} from "../models/models.ts";
import {Athlete} from "../models/athlete.ts";
import {useEffect, useState} from "react";
import {RaceManager} from "../simulators/RaceManager.ts";

export const useRaceManager = (
    track: Track,
    athletes: Athlete[],
    callbacks: RaceManagerCallbacks = {},
    athleteCallbacks: AthleteCallbacks = {}
) => {
    const [raceManager] = useState(() => new RaceManager(track, athletes, callbacks, athleteCallbacks))
    const [raceState, setRaceState] = useState<RaceManagerState>(raceManager.getState())

    useEffect(() => {
        const handleStateUpdate = (state: RaceManagerState) => {
            setRaceState(state)
        }

        raceManager.callbacks.onStateUpdate = handleStateUpdate

        return () => {
            raceManager.destroy()
        }
    }, [raceManager])

    return {
        raceState,
        start: () => raceManager.start(),
        pause: () => raceManager.pause(),
        setSpeed: (multiplier: number) => raceManager.setSpeedMultiplier(multiplier),
        getRankings: () => raceManager.getRankings(),
        getCheckpointRecords: (sectorId?: string, lap?: number) =>
            raceManager.getCheckpointRecords(sectorId, lap),
        getAthletePosition: (athleteId: string) =>
            raceManager.getAthletePosition(athleteId)
    }
}