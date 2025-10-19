import styles from "./RaceInfo.module.scss"
import Card from "../../../../components/Card/Card.tsx";
import RaceType from "./components/RaceType/RaceType.tsx";
import RaceWeather from "./components/RaceWeather/RaceWeather.tsx";
import RaceActions from "./components/RaceActions/RaceActions.tsx";

interface RaceInfoProps {
    raceType: string // todo вынести в enum с типами гонки
    placement: string // todo вынести в enum с городами
    country: string // todo вынести в emum со странами
    date: string
    temperature: number
    wind: number
    condition: string
    isRaceStarted: boolean
    onStartRace: () => void
    onPauseRace: () => void
}

const RaceInfo = (props: RaceInfoProps) => {
    const {
        raceType,
        placement,
        country,
        date,
        temperature,
        wind,
        condition,
        isRaceStarted,
        onStartRace,
        onPauseRace
    } = props

    const raceTypeProps = { raceType, placement, country, date }
    const raceWeatherProps = { temperature, wind, condition }
    const raceActionsProps = { isRaceStarted, onStartRace, onPauseRace }

    return (
        <div className={styles.info}>
            <Card headerText="Информация о гонке" content={<RaceType {...raceTypeProps} />} />
            <Card headerText="Погодные условия" content={<RaceWeather {...raceWeatherProps} />} />
            <Card headerText="Управление" content={<RaceActions {...raceActionsProps} />} />
        </div>
    )
}

export default RaceInfo
