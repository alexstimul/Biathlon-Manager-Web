export interface Athlete {
  id: string;
  name: string;
  speed: {
    flat: number; // м/с
    uphill: number;
    downhill: number;
  };
  stamina: number; // 1-100
  shootingAccuracy: number; // 0-1
}
