import { v4 as uuidv4 } from "uuid"
import { TerrainType, TrackSector, SectorSpecialType, ShootingRangePosition } from "../models/models"
import { SHOOTING_RANGE_TARGET_COUNT, SHOOTING_RANGE_DISTANCE } from "../constants"

const getSpeedMultiplier = (terrainType: TerrainType) => {
    let speedMultiplier = 1

    switch (terrainType) {
        case TerrainType.Uphill:
            speedMultiplier = 0.8
            break
        case TerrainType.Downhill:
            speedMultiplier = 1.2
    }

    return speedMultiplier
}

export const createTrackSector = (
    name: string,
    length: number, 
    terrainType: TerrainType = TerrainType.Flat,
    slopeAngle: number = 0,
    specialType: SectorSpecialType = SectorSpecialType.Regular,
    shootingRangePosition?: ShootingRangePosition
): TrackSector => {
    const speedMultiplier = getSpeedMultiplier(terrainType)

    return {
        id: uuidv4(),
        name,
        length,
        terrainType,
        slopeAngle,
        specialType,
        difficulty: 1,
        speedMultiplier,
        ...(shootingRangePosition && ({ 
            shootingRange: { 
                position: shootingRangePosition, 
                targetCount: SHOOTING_RANGE_TARGET_COUNT, 
                distance: SHOOTING_RANGE_DISTANCE 
            } 
        }))
    }
}