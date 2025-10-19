import styles from "./RaceActions.module.scss"
import {Pause, Play} from "lucide-react";

interface RaceActionsProps {
    isRaceStarted: boolean
    onStartRace: () => void
    onPauseRace: () => void
}

const RaceActions = ({ isRaceStarted, onStartRace, onPauseRace }: RaceActionsProps) => {
    return (
        <button className={styles.action} onClick={isRaceStarted ? onPauseRace : onStartRace}>
            {isRaceStarted
                ? <span className={styles.action__text}><Pause className={styles.action__icon}/> Пауза</span>
                : <span className={styles.action__text}><Play className={styles.action__icon}/> Начать гонку</span>
            }
        </button>
    )
}

export default RaceActions
