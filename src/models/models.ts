import {Athlete} from "./athlete.ts";

export enum TerrainType {
    Flat = "flat",
    Uphill = "uphill",
    Downhill = "downhill"
}

export enum SectorSpecialType {
    Regular = "regular",
    Start = "start",
    Finish = "finish",
    ShootingRange = "shooting-range",
    PenaltyLoop = "penalty-loop",
    Checkpoint = "checkpoint"
}

export enum ShootingRangePosition {
    Prone = "prone",
    Standing = "standing"
}

export interface TrackSector {
  id: string
  name: string
  length: number // в метрах
  terrainType: TerrainType
  slopeAngle: number // угол наклона в градусах (- для спуска, + для подъема)
  specialType: SectorSpecialType
  difficulty: number // коэффициент сложности от 0.1 до 2.0
  speedMultiplier: number // множитель скорости на этом участке

  // Для огневого рубежа
  shootingRange?: {
    position: ShootingRangePosition
    targetCount: number
    distance: number // дистанция стрельбы
  }
}

export interface Track {
  id: string
  name: string
  sectors: TrackSector[]
  lapLength: number // длина круга
  lapCount: number // количество кругов
}

export interface RaceState {
  currentLap: number
  currentSectorIndex: number
  progressInCurrentSector: number // в метрах
  isRunning: boolean
  isShooting: boolean
  shootingProgress: number // прогресс в стрельбе (0-1)
  missedShots: number // количество промахов
  pendingPenaltyLoops: number // количество оставшихся штрафных кругов
  totalTime: number // общее время гонки в миллисекундах
  speedMultiplier: number // множитель скорости симуляции
}

export interface RaceSimulationCallbacks {
  onSectorChange?: (sector: TrackSector, state: RaceState) => void
  onShootingStart?: (position: ShootingRangePosition, state: RaceState) => void
  onShootingEnd?: (missedShots: number, state: RaceState) => void
  onPenaltyLoopAdded?: (count: number, state: RaceState) => void
  onLapComplete?: (lap: number, state: RaceState) => void
  onFinish?: (totalTime: number, state: RaceState) => void
  onStateUpdate?: (state: RaceState) => void
}

// -------------------------- NEW SIM -----------------------------------------------

export interface AthleteRaceState {
    athlete: Athlete
    currentLap: number
    currentSectorIndex: number
    progressInCurrentSector: number
    isRunning: boolean
    isShooting: boolean
    isFinished: boolean
    shootingProgress: number
    missedShots: number
    pendingPenaltyLoops: number
    raceTime: number // время с начала гонки для этого спортсмена (учитывает стартовый интервал)
    netTime: number // чистое время движения (без учета стартовой задержки и штрафов)
    movementTime: number // время только в движении
    shootingTime: number // время только на стрельбе
    penaltyTime: number // время на штрафных кругах
    realTime: number // симуляционное небо (м/с)
    distanceCovered: number
    completedCheckpoints: CheckpointRecord[]
    lapTimes: number[]
    sectorTimes: number[][]
    position: number
    speedMultiplier: number
    lastSectorChangeTime: number // время последней смены сектора
}

export interface AthleteCallbacks {
    onStart?: (state: AthleteRaceState) => void
    onFinish?: (state: AthleteRaceState) => void
    onCheckpoint?: (sector: TrackSector,state: AthleteRaceState) => void
    onLapComplete?: (state: AthleteRaceState) => void
    onSectorChange?: (sector: TrackSector, state: AthleteRaceState) => void
}

export interface CheckpointRecord {
    sectorId: string
    lap: number
    timestamp: number // raceTime на момент прохождения
    netTime: number // netTime на момент прохождения
}

export interface RaceManagerState {
    isRunning: boolean
    athletesStates: AthleteRaceState[]
    startTime: number | null
    currentTime: number
    rankings: RaceRanking[]
    checkpoints: CheckpointRecord[]
}

export interface RaceRanking {
    position: number
    athlete: Athlete
    totalTime: number
    distanceCovered: number
    lapsCompleted: number
    currentSectorIndex: number
    gapToLeader: number // отставание от лидера в мс
}

export interface RaceManagerCallbacks {
    onRaceStart?: (state: RaceManagerState) => void
    onRaceFinish?: (state: RaceManagerState) => void
    onCheckpoint?: (record: CheckpointRecord, state: RaceManagerState) => void
    onRankingChange?: (rankings: RaceRanking[], state: RaceManagerState) => void
    onShootingStart?: (athlete: Athlete, position: ShootingRangePosition, state: RaceManagerState) => void
    onShootingEnd?: (athlete: Athlete, missedShots: number, state: RaceManagerState) => void
    onLapComplete?: (athlete: Athlete, lap: number, time: number, state: RaceManagerState) => void
    onStateUpdate?: (state: RaceManagerState) => void
}

// Новые интерфейсы для анализа
export interface CheckpointAnalysis {
    athlete: Athlete
    record: CheckpointRecord
    position: number
    gapToLeader: number
}

export interface AthleteProgress {
    athlete: Athlete
    overallProgress: OverallProgress
    lapProgress: LapProgress
    sectorProgress: SectorProgress
    timeAnalysis: TimeAnalysis
}

export interface OverallProgress {
    percentComplete: number
    distanceCovered: number
    totalDistance: number
    estimatedTimeRemaining: number
}

export interface LapProgress {
    currentLap: number
    lapPercentComplete: number
    lapTime: number
    estimatedLapTime: number
}

export interface SectorProgress {
    currentSector: TrackSector
    sectorPercentComplete: number
    sectorTime: number
    estimatedSectorTime: number
}

export interface TimeAnalysis {
    totalRaceTime: number
    netTime: number
    movementTime: number
    shootingTime: number
    penaltyTime: number
    efficiency: number // эффективность (движение / общее время)
}