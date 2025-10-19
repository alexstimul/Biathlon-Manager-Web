import styles from "./CutoffTable.module.scss"

interface TableRowProps {
    position: number
    name: string
    country: string
    time: string
}

const TableRow = (props: TableRowProps)=> {
    const { position, name, country, time } = props

    return (
        <div className={styles.row}>
            <div className={styles.row__position}>{position}</div>
            <div className={styles.row__name}>{name}</div>
            <div className={styles.row__country}>{country.toUpperCase()}</div>
            <div className={styles.row__time}>{time}</div>
        </div>
    )
}

export default TableRow
