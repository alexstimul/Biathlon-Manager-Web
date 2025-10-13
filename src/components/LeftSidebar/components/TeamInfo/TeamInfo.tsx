import styles from "./TeamInfo.module.scss"

// todo подумать, как БЭМ внедрить нормально
const TeamInfo = () => {
    return (
        <div className={styles.container}>
            <p className={styles.name}>Табакьюит</p>
            <div className={styles.teamInfo}>
                <div className={styles.teamInfo__season}>
                    <p className={styles.teamInfo__season_finance}>0 Р</p>
                    <p className={styles.teamInfo__season_currentSeason}>Сезон: 2024-2025</p>
                </div>
                <span className={styles.teamInfo__position}>#1</span>
            </div>
        </div>
    )
}

export default TeamInfo
