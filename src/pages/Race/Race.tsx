import React, { useEffect, useState } from 'react'
import type { Athlete } from '../../models/athlete'
import { useRaceSimulation } from '../../hooks/useRaceSimulation'
import { getTestTrack } from '../../mockedObjects/mockedTracks'
import { formatMilliseconds } from '../../utils/formatMilliseconds'
import styles from "./Race.module.scss"
import StartList from './components/StartList/StartList'
import RaceView from './components/RaceView/RaceView'
import CheckpointView from './components/CheckpointView/CheckpointView'
import PageHeader from "../../components/PageHeader/PageHeader.tsx";
import RaceInfo from "./components/RaceInfo/RaceInfo.tsx";
import Cutoff from "./components/Cutoff/Cutoff.tsx";
import {mockedAthletes} from "../../mockedObjects/mockedAthletes.ts";
import {useRaceManager} from "../../hooks/useRaceManager.ts";

interface RaceProps {
  athletes: Athlete[]
  laps: number
}

/*
onRaceStart?: (state: RaceManagerState) => void
onRaceFinish?: (state: RaceManagerState) => void
onCheckpoint?: (record: CheckpointRecord, state: RaceManagerState) => void
onRankingChange?: (rankings: RaceRanking[], state: RaceManagerState) => void
onShootingStart?: (athlete: Athlete, position: ShootingRangePosition, state: RaceManagerState) => void
onShootingEnd?: (athlete: Athlete, missedShots: number, state: RaceManagerState) => void
onLapComplete?: (athlete: Athlete, lap: number, time: number, state: RaceManagerState) => void
onStateUpdate?: (state: RaceManagerState) => void
* */

const Race = ({ athletes, laps }: RaceProps) => {
    const raceManager = useRaceManager(
        getTestTrack(),
        mockedAthletes.slice(0, 1),
        {
            onRaceStart: (state) => {
                console.log(`Гонка началась для ${state.athletesStates.length} спортсменов`)
            },
            onRaceFinish: (state) => {
                console.log(`Гонка завершилась для ${state.athletesStates.length} спортсменов`)
            },
            onRankingChange: (rankings, state) => {
                console.log("Изменилась иерархия", rankings)
            },
        },
        {
            onStart: (state) => {
                console.log(`Выехал ${state.athlete.firstName} ${state.athlete.lastName}`)
            },
            onFinish: (state) => {
                console.log(`Финишировал ${state.athlete.firstName} ${state.athlete.lastName} за ${formatMilliseconds(state.raceTime)}`)
                console.log(state)
            },
            // onLapComplete: (state) => {
            //     console.log(`${state.athlete.firstName} ${state.athlete.lastName} прошел круг`)
            // },
            // onCheckpoint: (sector, state) => {
            //     console.log(`${state.athlete.firstName} ${state.athlete.lastName} прошел какой-то чекпоинт`)
            //     console.log(`Чекпоинт`, sector)
            // },
            onSectorChange: (sector, state) => {
                console.log(`${state.athlete.firstName} ${state.athlete.lastName} -> ${sector.name}`)
            }
        }
    )


    const handleStartRace = () => {
        console.log("Start race")
        raceManager.start()
    }

    const handlePauseRace = () => {
        console.log("Pause race")
        raceManager.pause()
    }

    return (
        <>
            <PageHeader text="Гонка" subText="Симуляция и результаты гонки" />
            <RaceInfo
                raceType="Спринт 10км"
                placement="Сочи"
                country="Россия"
                date={new Date().toLocaleDateString("ru-RU")}
                temperature={-10}
                wind={2}
                condition="Снег"
                isRaceStarted={false}
                onStartRace={handleStartRace}
                onPauseRace={handlePauseRace}
            />
            <RaceView />
            <Cutoff athletes={mockedAthletes} />
        </>
    )
}

// const Race: React.FC<RacePage> = () => {
//   const raceSimulator = useRaceSimulation(
//     getTestTrack(),
//     {
//       onSectorChange: (sector, state) => {
//         console.log(`Переход на сектор: ${sector.name}. Время ${formatMilliseconds(state.totalTime)}`)
//       },
//       onShootingStart: (position, state) => {
//         console.log(`Начало стрельбы ${position}`)
//       },
//       onShootingEnd: (missedShots, state) => {
//         console.log(`Стрельба завершена, промахов: ${missedShots}`)
//       },
//       onLapComplete: (lap, state) => {
//         console.log(`Круг ${lap} закончен`, state)
//       },
//       onFinish: (totalTime, state) => {
//         console.log(`Время прохождения трассы: ${formatMilliseconds(totalTime)}`)
//       }
//     }
//   )
//
//   const handleStartRace = () => {
//     raceSimulator.setSpeed(10)
//     raceSimulator.start()
//   }
//
//   const [progress, setProgress] = useState(0)
//   const trackPoints: [number, number][] = [
//     [0.0, 0.8],
//     [0.2, 0.2],
//     [0.4, 0.6],
//     [0.6, 0.1],
//     [0.8, 0.9],
//     [1.0, 0.5]
//   ];
//
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setProgress(prev => (prev >= 1 ? 0 : prev + 0.01));
//     }, 50);
//
//     return () => clearInterval(timer);
//   }, []);
//
//   return (
//     <div className={styles.race}>
//       <h3 className={styles.race__header}>
//         Кубок мира. Сочи. Спринт. Мужчины
//       </h3>
//       <StartList />
//       <RaceView currentDistance={progress} trackPoints={trackPoints} />
//       <CheckpointView />
//       <div className="race-header">
//         <button onClick={handleStartRace}>Старт гонки</button>
//       </div>
//     </div>
//   )
// }

export default Race
