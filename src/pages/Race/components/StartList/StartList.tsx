import { mockedAthletes } from "../../../../mockedObjects/mockedAthletes"
import styles from "./StartList.module.scss"
import { useMemo, useState } from "react"

type AthleteItem = {
    position: number
    country: string
    firstName: string
    lastName: string
}

let currentPosition = 1
const defaultData: AthleteItem[] = mockedAthletes.map(
    athlete => ({ position: currentPosition++, country: athlete.county, firstName: athlete.firstName, lastName: athlete.lastName })
)

const StartList = () => {
    const [athletes, setAthletes] = useState<AthleteItem[]>(defaultData)

    return (
        <div className={styles.wrapper}>
            <table className={styles.startList}>
                <thead>
                    
                </thead>
                <tbody>
                    
                </tbody>
            </table>
        </div>
    )
}

export default StartList
