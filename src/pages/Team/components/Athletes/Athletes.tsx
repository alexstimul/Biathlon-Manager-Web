import { Athlete } from "../../../../models/athlete"
import AthleteCard from "../AthleteCard/AthleteCard"
import styles from "./Athletes.module.scss"

interface AthletesProps {
    athletes: Athlete[]
}

const Athletes = ({ athletes }: AthletesProps) => {
    return (
        <div className={styles.athletes}>
            {athletes.slice(0, 1).map(athlete => <AthleteCard athlete={athlete} />)}
        </div>
    )
}

export default Athletes
