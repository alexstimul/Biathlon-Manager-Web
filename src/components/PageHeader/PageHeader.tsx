import styles from "./PageHeader.module.scss"

interface PageHeaderProps {
    text: string
    subText: string
}

const PageHeader = ({ text, subText }: PageHeaderProps) => (
    <>
        <h2 className={styles.header}>{text}</h2>
        <p className={styles.subHeader}>{subText}</p>
    </>
)

export default PageHeader
