import { useNavigate } from "react-router-dom"
import { Athlete } from "../../../../models/athlete"
import styles from "./AthleteCard.module.scss"
import AthleteCardContent from "./components/AthleteCardContent/AthleteCardContent"
import AthleteCardFooter from "./components/AthleteCardFooter/AthleteCardFooter"
import AthleteCardHeader from "./components/AthleteCardHeader/AthleteCardHeader"
import { ROUTER_PATHS } from "../../../../constants"

interface AthleteCardProps {
    athlete: Athlete
}

const AthleteCard = ({ athlete }: AthleteCardProps) => {
    const navigate = useNavigate()

    const handleDetail = () => {
        console.log("On Detaile Click")
    }

    const handleNameClick = () => {
        navigate(ROUTER_PATHS.ATHLETE + `/${athlete.id}`)
    }

    // todo наверно я криво стили распихал, надо получше подумать, как это сделать
    return (
        <div className={styles.card}>
            <div className={styles.card__header}>
                <AthleteCardHeader
                    firstName={athlete.firstName}
                    lastName={athlete.lastName} 
                    age={athlete.age} 
                    raiting={athlete.raiting} 
                    country={athlete.county}
                    onClick={handleNameClick}
                />
            </div>
            <div>
                <AthleteCardContent skills={athlete.skills} type={athlete.type} />
            </div>
            <div className={styles.card__footer}>
                <AthleteCardFooter onDetailClick={handleDetail} />
            </div>
        </div>
    )
}

export default AthleteCard
