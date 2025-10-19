import styles from "./Cutoff.module.scss"
import { Athlete } from "../../../../models/athlete.ts"
import CutoffTable from "./components/CutoffTable/CutoffTable.tsx";

interface CutoffProps {
    athletes: Athlete[]
}

const Cutoff = (props: CutoffProps) => {
    const { athletes } = props

    return (
        <div className={styles.cutoff}>
            <CutoffTable athletes={athletes.slice(0, 3)} headerTitle="Первый огневой рубеж" />
            <CutoffTable athletes={athletes.slice(3)} />
            <CutoffTable athletes={athletes.slice(3)} />
        </div>
    )
}

export default Cutoff
