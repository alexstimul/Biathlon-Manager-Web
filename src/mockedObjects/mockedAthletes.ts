import { v4 as uuid } from "uuid"
import { Athlete, ShootingAccuracy, Speed } from "../models/athlete"

export const createAthlete = (
    firstName = "Иван",
    lastName = "Иванов",
    county = "rus",
    speed: Speed = {
        flat: 5,
        uphill: 4,
        downhill: 6
    },
    stamina = 100,
    shootingAccuracy: ShootingAccuracy = {
        prone: 85,
        stand: 85
    }
): Athlete => ({
    id: uuid(),
    firstName,
    lastName,
    county: county.toUpperCase(),
    speed,
    stamina,
    shootingAccuracy
})

export const mockedAthlete = createAthlete()
export const mockedAthletes = [
    createAthlete(),
    createAthlete("Петр", "Петров"),
    createAthlete("Сергей", "Сергеев"),
    createAthlete("Александр", "Стебаокв"),
    createAthlete("Антон", "Шипулин"),
]
