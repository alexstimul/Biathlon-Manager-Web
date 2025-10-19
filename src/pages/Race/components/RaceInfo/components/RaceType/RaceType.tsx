import styles from "./RaceType.module.scss"

interface RaceTypeProps {
    raceType: string
    placement: string
    country: string
    date: string
}

const RaceType = (props: RaceTypeProps)=> {
    const { raceType, placement, country, date } = props

    return (
        <>
            <div className={styles.item}>
                <span>Тип</span>
                <span className={styles.item__raceType}>{raceType}</span>
            </div>
            <div className={styles.item}>
                <span>Место</span>
                <span>{placement}</span>
            </div>
            <div className={styles.item}>
                <span>Страна</span>
                <span>{country}</span>
            </div>
            <div className={styles.item}>
                <span>Дата</span>
                <span>{date}</span>
            </div>
        </>
    )
}

export default RaceType
