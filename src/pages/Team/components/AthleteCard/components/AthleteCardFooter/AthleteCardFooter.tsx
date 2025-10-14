import styles from "./AthleteCardFooter.module.scss"

interface AthleteCardFooterProps {
    onDetailClick: () => void
}

const AthleteCardFooter = ({ onDetailClick }: AthleteCardFooterProps) => (
    <div className={styles.actions}>
        <button className={styles.actions__details} onClick={onDetailClick}>Детали</button>
    </div>
)

export default AthleteCardFooter
