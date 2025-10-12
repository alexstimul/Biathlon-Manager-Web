import { getPenaltyLap } from "../mockedObjects/mockedTracks"
import { RaceSimulationCallbacks, RaceState, SectorSpecialType, ShootingRangePosition, TerrainType, Track, TrackSector } from "../models/models"
import { createTrackSector } from "../utils/utils"

export class RaceSimulation {
  private state: RaceState
  private track: Track
  private animationFrameId: number | null = null
  private lastUpdateTime: number = 0
  private baseSpeed: number = 6 // базовая скорость м/с
  private currentLapSectors: TrackSector[]

  callbacks: RaceSimulationCallbacks

  constructor(track: Track, callbacks: RaceSimulationCallbacks = {}) {
    this.track = track
    this.callbacks = callbacks
    this.currentLapSectors = [
      // todo вынести формирование трека в отдельную сущность / метод. Сюда передавать массив массивов секторов. И текущий круг будет индексом этого массива
      createTrackSector("Стартовая прямая", 50, TerrainType.Flat, 0, SectorSpecialType.Start),
      ...track.sectors
    ]
    this.state = {
      currentLap: 1,
      currentSectorIndex: 0,
      progressInCurrentSector: 0,
      isRunning: false,
      isShooting: false,
      shootingProgress: 0,
      missedShots: 0,
      pendingPenaltyLoops: 0,
      totalTime: 0,
      speedMultiplier: 1
    }
  }

  start(): void {
    if (this.state.isRunning) return

    this.state.isRunning = true
    this.lastUpdateTime = performance.now()
    this.update()
  }

  pause(): void {
    this.state.isRunning = false
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  setSpeedMultiplier(multiplier: number): void {
    this.state.speedMultiplier = Math.max(0.1, Math.min(10, multiplier))
  }

  getState(): RaceState {
    return { ...this.state }
  }

  private update = (): void => {
    if (!this.state.isRunning) return

    this.animationFrameId = requestAnimationFrame(this.update)
    const currentTime = performance.now()
    const deltaTime = (currentTime - this.lastUpdateTime) * this.state.speedMultiplier
    this.lastUpdateTime = currentTime

    this.updateRaceState(deltaTime)
    this.callbacks.onStateUpdate?.(this.getState())
  }

  private updateRaceState(deltaTime: number): void {
    this.state.totalTime += deltaTime

    if (this.state.isShooting) {
      this.updateShooting(deltaTime)
      return
    }

    this.updateMovement(deltaTime)
  }

  private updateMovement(deltaTime: number): void {
    const currentSector = this.getCurrentSector()
    const distance = this.calculateDistance(currentSector, deltaTime)

    this.state.progressInCurrentSector += distance

    // Проверяем, завершен ли текущий сектор
    if (this.state.progressInCurrentSector >= currentSector.length) {
      this.completeCurrentSector()
    }
  }

  private calculateDistance(sector: TrackSector, deltaTime: number): number {
    // Базовую скорость корректируем множителем сектора
    const effectiveSpeed = this.baseSpeed * sector.speedMultiplier
    // Переводим миллисекунды в секунды и вычисляем расстояние
    return (effectiveSpeed * deltaTime) / 1000
  }

  private completeCurrentSector(): void {
    const currentSector = this.getCurrentSector()
    const remainingDistance = this.state.progressInCurrentSector - currentSector.length

    // Обрабатываем специальные типы секторов
    this.handleSpecialSector(currentSector)

    if (currentSector.specialType === SectorSpecialType.ShootingRange) {
      return
    }

    // Переходим к следующему сектору
    this.state.currentSectorIndex++
    this.state.progressInCurrentSector = 0

    // Если есть оставшееся расстояние, переносим его на следующий сектор
    if (remainingDistance > 0 && this.state.currentSectorIndex < this.getTotalSectors().length) {
      this.state.progressInCurrentSector = remainingDistance
    }

    // Проверяем завершение круга
    if (this.state.currentSectorIndex >= this.currentLapSectors.length) {
      this.state.currentSectorIndex = 0
      this.state.currentLap++
      this.currentLapSectors = [...this.track.sectors]
      this.callbacks.onLapComplete?.(this.state.currentLap - 1, this.getState())

      if (this.state.currentLap === this.track.lapCount) {
        this.currentLapSectors.push(
          createTrackSector("Финишная прямая", 50, TerrainType.Flat, 0, SectorSpecialType.Finish)
        )
      }
    }

    // Проверяем завершение гонки
    if (this.state.currentLap > this.track.lapCount && this.state.currentSectorIndex === 0) {
      this.finishRace()
      return
    }

    const newSector = this.getCurrentSector()
    this.callbacks.onSectorChange?.(newSector, this.getState())

    // Если есть штрафные круги и мы на регулярном секторе, добавляем их
    if (this.state.pendingPenaltyLoops > 0 && newSector.specialType === SectorSpecialType.Regular) {
      this.addPenaltyLoops()
    }
  }

  private handleSpecialSector(sector: TrackSector): void {
    switch (sector.specialType) {
      case SectorSpecialType.ShootingRange:
        this.startShooting(sector.shootingRange!.position)
        break
      case SectorSpecialType.PenaltyLoop:
        this.state.pendingPenaltyLoops = Math.max(0, this.state.pendingPenaltyLoops - 1)
        break
    }
  }

  private startShooting(position: ShootingRangePosition): void {
    this.state.isShooting = true
    this.state.shootingProgress = 0
    this.callbacks.onShootingStart?.(position, this.getState())
  }

  private updateShooting(deltaTime: number): void {
    const position = this.getCurrentSector().shootingRange!.position
    const shootingTime = position === ShootingRangePosition.Prone ? 25000 : 30000 // 25с лежа, 30с стоя
    this.state.shootingProgress += deltaTime / shootingTime

    if (this.state.shootingProgress >= 1) {
      this.completeShooting()
    }
  }

  private completeShooting(): void {
    const maxMissedShots = 3 // Максимальное количество промахов для демонстрации
    const missedShots = Math.floor(Math.random() * (maxMissedShots + 1))

    this.state.missedShots += missedShots
    this.state.pendingPenaltyLoops += missedShots
    this.state.isShooting = false
    this.state.shootingProgress = 0

    this.state.currentSectorIndex++
    this.state.progressInCurrentSector = 0

    this.callbacks.onShootingEnd?.(missedShots, this.getState())

    if (missedShots > 0) {
      this.callbacks.onPenaltyLoopAdded?.(missedShots, this.getState())
    }
  }

  private addPenaltyLoops(): void {
    const penaltySector = getPenaltyLap()
    const sectors = this.getTotalSectors()

    // Вставляем штрафные круги после текущего сектора
    const insertIndex = this.state.currentSectorIndex + 1
    for (let i = 0; i < this.state.pendingPenaltyLoops; i++) {
      sectors.splice(insertIndex + i, 0, { ...penaltySector })
    }

    this.state.pendingPenaltyLoops = 0
  }

  private finishRace(): void {
    this.state.isRunning = false
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    this.callbacks.onFinish?.(this.state.totalTime, this.getState())
  }

  private getCurrentSector(): TrackSector {
    return this.getTotalSectors()[this.state.currentSectorIndex]
  }

  private getTotalSectors(): TrackSector[] {
    // Для упрощения считаем, что все круги одинаковые
    // В реальной реализации нужно учитывать динамически добавляемые секторы (штрафные круги)
    const sectors: TrackSector[] = []
    for (let i = 0; i < this.track.lapCount; i++) {
      sectors.push(...this.currentLapSectors.map(sector => ({ ...sector })))
    }
    return sectors
  }

  // Метод для получения прогресса гонки в процентах
  getProgress(): number {
    const totalSectors = this.getTotalSectors()
    const totalLength = totalSectors.reduce((sum, sector) => sum + sector.length, 0)
    const completedLength = this.calculateCompletedLength()

    return (completedLength / totalLength) * 100
  }

  private calculateCompletedLength(): number {
    const sectors = this.getTotalSectors()
    let length = 0

    for (let i = 0; i < this.state.currentSectorIndex; i++) {
      length += sectors[i].length
    }

    length += this.state.progressInCurrentSector
    return length
  }

  destroy(): void {
    this.pause()
  }
}

export const createRaceSimulation = (
  track: Track, 
  callbacks: RaceSimulationCallbacks = {}
): RaceSimulation => {
  return new RaceSimulation(track, callbacks)
}