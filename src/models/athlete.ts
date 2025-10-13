export interface Speed {
  flat: number // м/с
  uphill: number
  downhill: number
}

export interface ShootingAccuracy {
  prone: number
  stand: number
}

export interface Athlete {
  id: string
  firstName: string
  lastName: string
  county: string // RUS, FRA, GET, etc.
  speed: Speed
  stamina: number // 1-100
  shootingAccuracy: ShootingAccuracy
}
