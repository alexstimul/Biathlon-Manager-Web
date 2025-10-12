import React, { useEffect, useState } from 'react'
import type { Athlete } from '../../models/athlete'
import { useRaceSimulation } from '../../hooks/useRaceSimulation'
import { getTestTrack } from '../../mockedObjects/mockedTracks'
import { formatMilliseconds } from '../../utils/formatMilliseconds'
import styles from "./Race.module.scss"
import StartList from './components/StartList/StartList'
import RaceView from './components/RaceView/RaceView'
import CheckpointView from './components/CheckpointView/CheckpointView'

interface RacePage {
  athletes: Athlete[]
  laps: number
}

const Race: React.FC<RacePage> = () => {
  const raceSimulator = useRaceSimulation(
    getTestTrack(),
    {
      onSectorChange: (sector, state) => {
        console.log(`Переход на сектор: ${sector.name}. Время ${formatMilliseconds(state.totalTime)}`)
      },
      onShootingStart: (position, state) => {
        console.log(`Начало стрельбы ${position}`)
      },
      onShootingEnd: (missedShots, state) => {
        console.log(`Стрельба завершена, промахов: ${missedShots}`)
      },
      onLapComplete: (lap, state) => {
        console.log(`Круг ${lap} закончен`, state)
      },
      onFinish: (totalTime, state) => {
        console.log(`Время прохождения трассы: ${formatMilliseconds(totalTime)}`)
      }
    }
  )

  const handleStartRace = () => {
    raceSimulator.setSpeed(10)
    raceSimulator.start()
  }

  const [progress, setProgress] = useState(0)
  const trackPoints: [number, number][] = [
    [0.0, 0.8],
    [0.2, 0.2],
    [0.4, 0.6],
    [0.6, 0.1],
    [0.8, 0.9],
    [1.0, 0.5]
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => (prev >= 1 ? 0 : prev + 0.01));
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.race}>
      <h3 className={styles.race__header}>
        Кубок мира. Сочи. Спринт. Мужчины
      </h3>
      <StartList />
      <RaceView currentDistance={progress} trackPoints={trackPoints} />
      <CheckpointView />
      <div className="race-header">
        <button onClick={handleStartRace}>Старт гонки</button>
      </div>
    </div>
  )
}

export default Race
