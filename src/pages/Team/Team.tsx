import { mockedAthletes } from "../../mockedObjects/mockedAthletes"
import Athletes from "./components/Athletes/Athletes"
import styles from "./Team.module.scss"

const Team = () => {
    return (
        <div>
            <h2 className={styles.header}>Моя команда</h2>
            <p className={styles.subHeader}>Упарвляйте спортсменами вашей команды</p>
            <Athletes athletes={mockedAthletes} />
        </div>
    )
}

export default Team