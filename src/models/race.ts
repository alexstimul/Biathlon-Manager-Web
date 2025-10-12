export interface RaceSegment {
  type: 'flat' | 'uphill' | 'downhill';
  length: number; // в метрах
  difficulty: number; // 1-10
}

export interface RaceState {
  currentLap: number;
  totalLaps: number;
  distanceCovered: number;
  segments: RaceSegment[];
  athletes: AthleteProgress[];
  isFinished: boolean;
}

export interface AthleteProgress {
  athleteId: string;
  position: number;
  currentSegment: number;
  segmentProgress: number; // 0-1
  speed: number;
  stamina: number;
  lapTimes: number[];
}
