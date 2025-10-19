import styles from "./RaceWeather.module.scss"
import { Cloud, Thermometer, Wind } from "lucide-react"

interface RaceWeatherProps {
    temperature: number
    wind: number
    condition: string
}

const RaceWeather = (props: RaceWeatherProps) => {
    const { temperature, wind, condition } = props

    // todo мб обобщить в item
    return (
        <>
            <div className={styles.item}>
                <div className={styles.item_wrapper}>
                    <Thermometer className={styles.item__icon} />
                    <span>Температура</span>
                </div>
                <span>{temperature}°C</span>
            </div>
            <div className={styles.item}>
                <div className={styles.item_wrapper}>
                    <Wind className={styles.item__icon} />
                    <span>Ветер</span>
                </div>
                <span>{wind} м/с</span>
            </div>
            <div className={styles.item}>
                <div className={styles.item_wrapper}>
                    <Cloud className={styles.item__icon} />
                    <span>Условия</span>
                </div>
                <span>{condition}</span>
            </div>
        </>
    )
}

export default RaceWeather
