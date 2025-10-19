import styles from "./AthleteSkillItem.module.scss"
import { Heart } from "lucide-react"
import Progressbar from "../../../../../../components/Progressbar/Progressbar.tsx";

interface AthleteSkillItemProps {
    name: string
    value: number
}

const AthleteSkillItem = ({ name, value }: AthleteSkillItemProps) => {
    const Header = (
        <div className={styles.item__header}>
            <div>
                <Heart className={styles.item__header_icon}/>
                <span>{name}</span>
            </div>
            <span>{value}</span>
        </div>
    )

    return (
        <div className={styles.item}>
            <Progressbar
                value={value}
                withoutHeader={false}
                headerComponent={Header}
            />
        </div>
    )
}

export default AthleteSkillItem
