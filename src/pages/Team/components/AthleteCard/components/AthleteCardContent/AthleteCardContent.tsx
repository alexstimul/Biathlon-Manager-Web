import { Heart } from "lucide-react"
import { AthleteSkills } from "../../../../../../models/athlete"
import styles from "./AthleteCardContent.module.scss"

interface AthleteCardContentProps {
    skills: AthleteSkills
    type: string
}

// todo вынести item в отдельный компонент

const AthleteCardContent = ({ skills, type }: AthleteCardContentProps) => (
    <div className={styles.content}>
        <div className={styles.athlete__type}>{type}</div>
        <div className={styles.skills}>
            <div className={styles.skills__item}>
                <div className={styles.skills__item__header}>
                    <div>
                        <Heart className={styles.skills__item__header_icon} />
                        <span>Выносливость</span>
                    </div>
                    <span>{skills.stamina}</span>
                </div>
                <div className={styles.skills__item_progressbar}>
                    <div className={styles.skills__item_value} style={{ width: `${skills.stamina}%` }}></div>
                </div>
            </div>
            <div className={styles.skills__item}>{skills.shootingAccuracy.prone}</div>
            <div className={styles.skills__item}>{skills.shootingAccuracy.stand}</div>
            <div className={styles.skills__item}>{skills.speed.flat}</div>
            <div className={styles.skills__item}>{skills.speed.downhill}</div>
            <div className={styles.skills__item}>{skills.speed.uphill}</div>
        </div>
    </div>
)

export default AthleteCardContent
