import styles from "./RaceTeamList.module.scss"
import {Athlete} from "../../../../../../models/athlete.ts";
import {Users} from "lucide-react";
import {useState} from "react";
import cn from "classnames";

interface RaceTeamListProps {
    teamName: string
    athletes: Athlete[]
}

const RaceTeamList = ({ teamName, athletes }: RaceTeamListProps) => {
    const [selectedAthleteId, setSelectedAthleteId] = useState("")

    const resetAthelteId = () => {
        setSelectedAthleteId("")
    }

    return (
        <div className={styles.team}>
            <h4 className={styles.team__name}><Users className={styles.team__name_icon} /> {teamName}</h4>
            <div className={styles.team__list}>
                {athletes.map(
                    athlete => (
                        <div
                            key={athlete.id}
                            className={cn(
                                styles.team__list__item,
                                selectedAthleteId === athlete.id && styles.team__list__item_selected
                            )}
                            onClick={() => setSelectedAthleteId(athlete.id)}
                        >
                            <p className={styles.team__list__athleteName}>{athlete.firstName} {athlete.lastName}</p>
                            <span className={styles.team__list__position}>Позиция: 1</span>
                        </div>
                    )
                )}
            </div>
            <button
                className={cn(styles.resetButton, selectedAthleteId && styles.resetButton_show)}
                onClick={resetAthelteId}
            >
                Показать всех
            </button>
        </div>
    )
}

export default RaceTeamList
