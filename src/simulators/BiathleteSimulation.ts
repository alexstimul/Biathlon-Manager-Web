import {
    AthleteCallbacks,
    AthleteRaceState,
    CheckpointRecord,
    SectorSpecialType,
    ShootingRangePosition,
    TerrainType,
    Track,
    TrackSector
} from "../models/models.ts";
import {Athlete} from "../models/athlete.ts";
import {getPenaltyLap} from "../mockedObjects/mockedTracks.ts";

export class BiathleteSimulation {
    public state: AthleteRaceState
    private track: Track
    private readonly athlete: Athlete
    private readonly sectors: TrackSector[]
    private readonly startDelay: number = 0 // задержка старта для этого спортсмена
    private callbacks: AthleteCallbacks

    constructor(athlete: Athlete, track: Track, startDelay: number = 0, callbacks: AthleteCallbacks = {}) {
        this.athlete = athlete
        this.track = track
        this.startDelay = startDelay
        this.sectors = this.buildFullSectorSequence()
        this.state = this.createInitialState()
        this.callbacks = callbacks
    }

    private createInitialState(): AthleteRaceState {
        return {
            athlete: this.athlete,
            currentLap: 1,
            currentSectorIndex: 0,
            progressInCurrentSector: 0,
            isRunning: false,
            isShooting: false,
            isFinished: false,
            shootingProgress: 0,
            missedShots: 0,
            pendingPenaltyLoops: 0,
            raceTime: 0,
            netTime: 0,
            movementTime: 0,
            shootingTime: 0,
            penaltyTime: 0,
            distanceCovered: 0,
            completedCheckpoints: [],
            lapTimes: [],
            sectorTimes: Array(this.track.lapCount).fill(null).map(() => []),
            position: 0,
            speedMultiplier: 1,
            lastSectorChangeTime: 0
        }
    }

    update(deltaTime: number, globalRaceTime: number, onCheckpoint?: (sector: TrackSector, state: AthleteRaceState) => void): void {
        if (!this.state.isRunning) {
            // Проверяем, не пора ли стартовать с учетом задержки
            if (globalRaceTime >= this.startDelay) {
                this.state.isRunning = true
                this.state.lastSectorChangeTime = globalRaceTime - this.startDelay
                this.callbacks.onStart?.(this.state)
            } else {
                return
            }
        }

        // Обновляем общее время гонки для этого спортсмена
        this.state.raceTime = globalRaceTime - this.startDelay

        if (this.state.isShooting) {
            this.updateShooting(deltaTime)
        } else {
            this.updateMovement(deltaTime, onCheckpoint)
        }
    }

    private updateMovement(deltaTime: number, onCheckpoint?: (sector: TrackSector, state: AthleteRaceState) => void): void {
        const currentSector = this.getCurrentSector()

        // Определяем тип движения: обычное или штрафной круг
        const isPenaltyLoop = currentSector.specialType === SectorSpecialType.PenaltyLoop
        const distance = this.calculateDistance(currentSector, deltaTime)

        this.state.progressInCurrentSector += distance
        this.state.distanceCovered += distance
        this.state.netTime += deltaTime
        this.state.movementTime += deltaTime

        if (isPenaltyLoop) {
            this.state.penaltyTime += deltaTime
        }

        this.updateStamina(deltaTime)

        if (this.state.progressInCurrentSector >= currentSector.length) {
            this.completeCurrentSector(onCheckpoint)
        }
    }

    private calculateDistance(sector: TrackSector, deltaTime: number): number {
        const baseSpeed = this.athlete.skills.speed[sector.terrainType]
        const terrainMultiplier = sector.speedMultiplier
        const staminaMultiplier = 0.8 + (0.4 * this.athlete.skills.stamina)
        const effectiveSpeed = baseSpeed * terrainMultiplier * staminaMultiplier * this.state.speedMultiplier

        return (effectiveSpeed * deltaTime) / 1000
    }

    private completeCurrentSector(onCheckpoint?: (sector: TrackSector, state: AthleteRaceState) => void): void {
        const currentSector = this.getCurrentSector()
        const remainingDistance = this.state.progressInCurrentSector - currentSector.length

        // Фиксируем время прохождения сектора
        const sectorTime = this.state.raceTime - this.state.lastSectorChangeTime
        if (this.state.currentLap <= this.track.lapCount) {
            this.state.sectorTimes[this.state.currentLap - 1].push(sectorTime)
        }

        // Создаем запись чекпоинта для специальных секторов
        if (currentSector.specialType !== SectorSpecialType.Regular) {
            const checkpoint: CheckpointRecord = {
                sectorId: currentSector.id,
                lap: this.state.currentLap,
                timestamp: this.state.raceTime,
                netTime: this.state.netTime
            }
            this.state.completedCheckpoints.push(checkpoint)
            onCheckpoint?.(currentSector, this.state)
            this.callbacks.onCheckpoint?.(this.state)
        }

        // Обрабатываем специальные секторы
        this.handleSpecialSector(currentSector)

        // Переход к следующему сектору
        this.state.currentSectorIndex++
        this.state.progressInCurrentSector = 0
        this.state.lastSectorChangeTime = this.state.raceTime

        // Перенос оставшегося расстояния
        if (remainingDistance > 0 && this.state.currentSectorIndex < this.sectors.length) {
            this.state.progressInCurrentSector = remainingDistance
        }

        // Проверяем завершение круга
        const sectorsPerLap = this.track.sectors.length
        if (this.state.currentSectorIndex > 0 &&
            this.state.currentSectorIndex % sectorsPerLap === 0) {
            this.completeLap()
        }

        // Проверяем завершение гонки
        if (this.state.currentSectorIndex >= this.sectors.length) {
            this.state.isRunning = false
            this.state.isFinished = true
            this.callbacks.onFinish?.(this.state)
        }
    }

    private completeLap(): void {
        const lapNumber = Math.floor(this.state.currentSectorIndex / this.track.sectors.length)
        if (lapNumber > 0 && lapNumber <= this.track.lapCount) {
            const lapTime = this.state.raceTime - this.state.lapTimes.reduce((sum, time) => sum + time, 0)
            this.state.lapTimes.push(lapTime)
        }

        this.callbacks.onLapComplete?.(this.state)
    }

    private updateShooting(deltaTime: number): void {
        this.state.shootingTime += deltaTime
        this.state.shootingProgress += deltaTime / this.getShootingTime()

        if (this.state.shootingProgress >= 1) {
            this.completeShooting()
        }
    }

    private getShootingTime(): number {
        const position = this.getCurrentSector().shootingRange?.position || ShootingRangePosition.Prone
        return this.athlete.skills.shootingTime[position]
    }

    private completeShooting(): void {
        const missedShots = this.simulateShooting()
        this.state.missedShots += missedShots
        this.state.pendingPenaltyLoops += missedShots
        this.state.isShooting = false
        this.state.shootingProgress = 0

        if (missedShots > 0) {
            this.addPenaltyLoops(missedShots)
        }
    }

    // Остальные методы остаются без изменений...
    private simulateShooting(): number {
        let missed = 0
        // todo разобраться, почему shootingRange undefined
        const targetCount = this.getCurrentSector().shootingRange?.targetCount || 5
        const position = this.getCurrentSector().shootingRange?.position || ShootingRangePosition.Prone

        for (let i = 0; i < targetCount; i++) {
            if (Math.random() > this.athlete.skills.shootingAccuracy[position]) {
                missed++
            }
        }
        return missed
    }

    private addPenaltyLoops(count: number): void {
        const penaltySector = getPenaltyLap()
        const insertIndex = this.state.currentSectorIndex + 1

        for (let i = 0; i < count; i++) {
            this.sectors.splice(insertIndex + i, 0, {
                ...penaltySector,
                id: `${penaltySector.id}-${this.athlete.id}-${Date.now()}-${i}`
            })
        }
    }

    getCurrentSector(): TrackSector {
        return this.state.currentSectorIndex < this.sectors.length
            ? this.sectors[this.state.currentSectorIndex]
            : this.sectors[this.sectors.length - 1]
    }

    getProgress(): number {
        const totalDistance = this.track.lapLength * this.track.lapCount
        return (this.state.distanceCovered / totalDistance) * 100
    }

    setPosition(position: number): void {
        this.state.position = position
    }

    private buildFullSectorSequence(): TrackSector[] {
        const sectors: TrackSector[] = []
        for (let lap = 1; lap <= this.track.lapCount; lap++) {
            this.track.sectors.forEach(sector => {
                sectors.push({
                    ...sector,
                    id: `${sector.id}-lap-${lap}`,
                    name: `${sector.name} (круг ${lap})`
                })
            })
        }
        return sectors
    }

    private updateStamina(deltaTime: number): void {
        const currentSector = this.getCurrentSector()
        const fatigueRate = currentSector.terrainType === TerrainType.Uphill ? 0.0002 : 0.0001
        this.athlete.skills.stamina = Math.max(0.3, this.athlete.skills.stamina - (fatigueRate * deltaTime))
    }

    private handleSpecialSector(sector: TrackSector): void {
        switch (sector.specialType) {
            case SectorSpecialType.ShootingRange:
                this.startShooting()
                break
            case SectorSpecialType.PenaltyLoop:
                this.state.pendingPenaltyLoops = Math.max(0, this.state.pendingPenaltyLoops - 1)
                break
        }
    }

    private startShooting(): void {
        this.state.isShooting = true
        this.state.shootingProgress = 0
    }
}