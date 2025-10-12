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
