import { Eye } from "lucide-react"
import styles from "./AthleteCardHeader.module.scss"

interface AthleteCardHeaderProps {
    firstName: string
    lastName: string
    age: number
    country: string
    raiting: number
    onClick: () => void
}

const AthleteCardHeader = ({firstName, lastName, age, country, raiting, onClick}: AthleteCardHeaderProps) => (
    <div className={styles.header}>
        <div className={styles.athlete__info}>
            <div className={styles.athlete__picture}>{firstName[0].toUpperCase()}</div>
            <div>
                <div className={styles.athlete__name} onClick={onClick}>
                    <span>{firstName} {lastName}</span>
                    <Eye className={styles.athlete__name_eye} />
                </div>
                <div className={styles.athlete__ageCountry}>
                    <div className={styles.athlete__age}>{age} лет</div>
                    <span className={styles.separator}>•</span>
                    <div className={styles.athlete__country}>{country}</div>
                </div>
            </div>
        </div>
        <div className={styles.athlete__raiting}>{raiting}</div>
    </div>
)

export default AthleteCardHeader
