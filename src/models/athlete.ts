import {ShootingRangePosition} from "./models.ts";

export interface Speed {
  flat: number // м/с
  uphill: number
  downhill: number
}

export interface ShootingAccuracy {
  [ShootingRangePosition.Prone]: number
  [ShootingRangePosition.Standing]: number
}

export interface AthleteSkills {
  speed: Speed
  stamina: number // 1-100
  shootingAccuracy: ShootingAccuracy
  shootingTime: ShootingAccuracy
}

export interface Athlete {
  id: string
  firstName: string
  lastName: string
  county: string // RUS, FRA, GET, etc.
  age: number
  raiting: number
  type: string
  skills: AthleteSkills
}
