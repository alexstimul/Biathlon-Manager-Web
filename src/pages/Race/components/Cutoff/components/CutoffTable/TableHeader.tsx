import styles from "./CutoffTable.module.scss"

interface TableHeaderProps {
    text: string
}

const TableHeader = ({ text }: TableHeaderProps) => (
    <div className={styles.header}>{text}</div>
)

export default TableHeader
