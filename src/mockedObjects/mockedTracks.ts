import { v4 as uuidv4 } from "uuid"
import { SectorSpecialType, TerrainType, Track, TrackSector, ShootingRangePosition } from "../models/models"
import { createTrackSector } from "../utils/utils"

export const getTestTrack = (lapCount = 3): Track => {
    return {
        id: uuidv4(),
        name: "Тестовые трек",
        lapLength: 7500,
        lapCount,
        sectors: [
            createTrackSector("Первый круг-1", 1500),
            createTrackSector("Чек-поинт-1", 0, TerrainType.Flat, 0, SectorSpecialType.Checkpoint),
            createTrackSector("Первый круг-2", 1800),
            createTrackSector("Огневой рубеж 1", 0, TerrainType.Flat, 0, SectorSpecialType.ShootingRange, ShootingRangePosition.Prone)
        ]
    }
}

export const getPenaltyLap = (length = 150): TrackSector => createTrackSector("Штрафной круг", length, TerrainType.Flat, 0, SectorSpecialType.PenaltyLoop)