import { v4 as uuid } from "uuid"
import { Athlete, ShootingAccuracy, Speed } from "../models/athlete"
import {ShootingRangePosition} from "../models/models.ts";

export const createAthlete = (
    firstName = "Иван",
    lastName = "Иванов",
    age = 24,
    raiting = 90,
    type = "Стрелок",
    county = "rus",
    speed: Speed = {
        flat: 5,
        uphill: 4,
        downhill: 6
    },
    stamina = 100,
    shootingAccuracy: ShootingAccuracy = {
        [ShootingRangePosition.Prone]: 85,
        [ShootingRangePosition.Standing]: 85
    }
): Athlete => ({
    id: uuid(),
    firstName,
    lastName,
    age,
    raiting,
    type,
    county: county.toUpperCase(),
    skills: {
        speed,
        stamina,
        shootingAccuracy,
        shootingTime: {
            [ShootingRangePosition.Prone]: 10,
            [ShootingRangePosition.Standing]: 10
        }
    }
})

export const mockedAthlete = createAthlete()
export const mockedAthletes = [
    createAthlete(),
    createAthlete("Петр", "Петров"),
    createAthlete("Сергей", "Сергеев"),
    createAthlete("Александр", "Стебаокв"),
    createAthlete("Антон", "Шипулин"),
]
