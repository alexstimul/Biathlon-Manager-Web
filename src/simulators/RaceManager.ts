import {
    AthleteCallbacks,
    AthleteRaceState,
    CheckpointRecord,
    RaceManagerCallbacks,
    RaceManagerState, RaceRanking, SectorSpecialType,
    Track,
    TrackSector
} from "../models/models.ts";
import {Athlete} from "../models/athlete.ts";
import {BiathleteSimulation} from "./BiathleteSimulation.ts";

export class RaceManager {
    private track: Track
    private athletes: Athlete[]
    private simulations: BiathleteSimulation[]
    private state: RaceManagerState
    private animationFrameId: number | null = null
    private lastUpdateTime: number = 0
    private speedMultiplier: number = 1
    private globalRaceTime: number = 0 // общее время гонки с момента старта первого спортсмена

    public callbacks: RaceManagerCallbacks

    constructor(track: Track, athletes: Athlete[], callbacks: RaceManagerCallbacks = {}, athleteCallbacks: AthleteCallbacks = {}) {
        this.track = track
        this.athletes = athletes
        this.callbacks = callbacks

        // Создаем симуляции с разными задержками старта
        this.simulations = athletes.map((athlete, index) => {
            const startDelay = index * 30000 // 30 секунд между спортсменами
            return new BiathleteSimulation(athlete, track, startDelay, athleteCallbacks)
        })

        this.state = {
            isRunning: false,
            athletesStates: this.simulations.map(sim => sim.state),
            startTime: null,
            currentTime: 0,
            rankings: [],
            checkpoints: []
        }
    }

    start(): void {
        if (this.state.isRunning) return

        this.state.isRunning = true
        this.state.startTime = performance.now()
        this.lastUpdateTime = this.state.startTime
        this.globalRaceTime = 0

        this.callbacks.onRaceStart?.(this.state)
        this.update()
    }

    private update = (): void => {
        if (!this.state.isRunning) return

        this.animationFrameId = requestAnimationFrame(this.update)
        const currentTime = performance.now()
        const deltaTime = (currentTime - this.lastUpdateTime) * this.speedMultiplier
        this.lastUpdateTime = currentTime

        this.globalRaceTime += deltaTime
        this.state.currentTime = this.globalRaceTime

        // Обновляем всех спортсменов с передачей общего времени гонки
        this.simulations.forEach(simulation => {
            simulation.update(deltaTime, this.globalRaceTime, (sector, state) => {
                this.handleCheckpoint(sector, state)
            })
        })

        this.updateRankings()

        if (this.isRaceFinished()) {
            this.finishRace()
        }

        this.callbacks.onStateUpdate?.(this.state)
    }

    private handleCheckpoint(sector: TrackSector, state: AthleteRaceState): void {
        const record: CheckpointRecord = {
            sectorId: sector.id,
            lap: state.currentLap,
            timestamp: state.raceTime,
            netTime: state.netTime
        }

        this.state.checkpoints.push(record)
        this.callbacks.onCheckpoint?.(record, this.state)

        switch (sector.specialType) {
            case SectorSpecialType.ShootingRange:
                this.callbacks.onShootingStart?.(state.athlete, sector.shootingRange!.position, this.state)
                break
            case SectorSpecialType.Finish:
                if (state.currentLap === this.track.lapCount) {
                    const lapTime = state.raceTime - state.lapTimes.reduce((sum, time) => sum + time, 0)
                    this.callbacks.onLapComplete?.(state.athlete, state.currentLap, lapTime, this.state)
                }
                break
        }
    }

    private updateRankings(): void {
        // Сортируем по дистанции, затем по чистому времени
        const sortedStates = [...this.simulations]
            .map(sim => sim.state)
            .sort((a, b) => {
                if (b.distanceCovered !== a.distanceCovered) {
                    return b.distanceCovered - a.distanceCovered
                }
                return a.netTime - b.netTime
            })

        // Обновляем позиции
        sortedStates.forEach((state, index) => {
            const simulation = this.simulations.find(s => s.state.athlete.id === state.athlete.id)
            simulation?.setPosition(index + 1)
        })

        const leader = sortedStates[0]
        const newRankings: RaceRanking[] = sortedStates.map((state, index) => ({
            position: index + 1,
            athlete: state.athlete,
            totalTime: state.raceTime, // используем индивидуальное время гонки
            netTime: state.netTime,    // чистое время движения
            distanceCovered: state.distanceCovered,
            lapsCompleted: state.currentLap - 1,
            currentSectorIndex: state.currentSectorIndex,
            gapToLeader: state === leader ? 0 : state.netTime - leader.netTime // отставание по чистому времени
        }))

        if (this.hasRankingsChanged(newRankings)) {
            this.state.rankings = newRankings
            this.callbacks.onRankingChange?.(newRankings, this.state)
        }
    }

    private calculateGapToLeader(record: CheckpointRecord): number {
        const leaderRecord = this.state.checkpoints
            .filter(r => r.sectorId === record.sectorId && r.lap === record.lap)
            .sort((a, b) => a.netTime - b.netTime)[0]

        return leaderRecord ? record.netTime - leaderRecord.netTime : 0
    }


    // Остальные методы остаются без изменений...
    private hasRankingsChanged(newRankings: RaceRanking[]): boolean {
        if (this.state.rankings.length !== newRankings.length) return true
        for (let i = 0; i < newRankings.length; i++) {
            if (newRankings[i].athlete.id !== this.state.rankings[i]?.athlete.id ||
                newRankings[i].position !== this.state.rankings[i]?.position) {
                return true
            }
        }
        return false
    }

    private isRaceFinished(): boolean {
        return this.simulations.every(simulation => simulation.state.isFinished)
    }

    private finishRace(): void {
        this.state.isRunning = false
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId)
            this.animationFrameId = null
        }
        this.callbacks.onRaceFinish?.(this.state)
    }

    // Геттеры для внешнего использования
    getState(): RaceManagerState { return { ...this.state } }
    getRankings(): RaceRanking[] { return [...this.state.rankings] }
    getCheckpointRecords(sectorId?: string, lap?: number): CheckpointRecord[] {
        let records = [...this.state.checkpoints]
        if (sectorId) records = records.filter(r => r.sectorId.includes(sectorId))
        if (lap !== undefined) records = records.filter(r => r.lap === lap)
        return records.sort((a, b) => a.netTime - b.netTime)
    }
    getAthletePosition(athleteId: string): number {
        return this.state.rankings.find(r => r.athlete.id === athleteId)?.position || 0
    }

    pause(): void {
        this.state.isRunning = false
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId)
            this.animationFrameId = null
        }
    }

    setSpeedMultiplier(multiplier: number): void {
        this.speedMultiplier = Math.max(0.1, Math.min(10, multiplier))
    }

    destroy(): void {
        this.pause()
    }
}