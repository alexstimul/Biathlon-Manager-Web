import { AthleteSkills } from "../../../../../../models/athlete"
import styles from "./AthleteCardContent.module.scss"
import AthleteSkillItem from "../AthleteSkillItem/AthleteSkillItem.tsx";

interface AthleteCardContentProps {
    skills: AthleteSkills
    type: string
}

const AthleteCardContent = ({ skills, type }: AthleteCardContentProps) => (
    <div className={styles.content}>
        <div className={styles.athlete__type}>{type}</div>
        <div className={styles.skills}>
            <AthleteSkillItem name="Выносливость" value={skills.stamina} />
            <AthleteSkillItem name="Точность лежа" value={skills.shootingAccuracy.prone} />
            <AthleteSkillItem name="Точность стоя" value={skills.shootingAccuracy.stand} />
            <AthleteSkillItem name="Скорость на прямой" value={skills.speed.flat} />
            <AthleteSkillItem name="Скорость спуска" value={skills.speed.downhill} />
            <AthleteSkillItem name="Скорость подъема" value={skills.speed.uphill} />
        </div>
    </div>
)

export default AthleteCardContent
