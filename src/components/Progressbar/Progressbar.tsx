import styles from "./Progressbar.module.scss"
import { JSX } from "react"
import cn from "classnames";

interface ProgressbarProps {
    value: number
    valueClassName?: string
    withoutHeader?: boolean
    headerComponent?: JSX.Element
}

// todo задавать как-то верхнюю границу, чтобы высчитывать проценты

const Progressbar = (props: ProgressbarProps) => {
    const { value, valueClassName, withoutHeader = true, headerComponent } = props

    return (
        <>
            {!withoutHeader && headerComponent}
            <div className={styles.progressbar}>
                <div className={cn(styles.progressbar__value, valueClassName)} style={{width: `${value}%`}} />
            </div>
        </>
    )
}

export default Progressbar
