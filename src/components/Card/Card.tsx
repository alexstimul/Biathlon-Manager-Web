import styles from "./Card.module.scss"
import { JSX } from "react";

interface CardProps {
    headerText: string
    content: JSX.Element
}

const Card = ({ headerText, content }: CardProps) => (
    <div className={styles.card}>
        <div className={styles.card__header}>{headerText}</div>
        <div className={styles.card__content}>{content}</div>
    </div>
)

export default Card
