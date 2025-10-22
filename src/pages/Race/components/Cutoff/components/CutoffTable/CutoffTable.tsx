import styles from "./CutoffTable.module.scss"
import {Athlete} from "../../../../../../models/athlete.ts";
import TableHeader from "./TableHeader.tsx";
import TableRow from "./TableRow.tsx";

interface CutoffTableProps {
    athletes: Athlete[]
    headerTitle?: string
}

const CutoffTable = (props: CutoffTableProps) => {
    const { athletes, headerTitle } = props

    return (
        <div className={styles.table}>
            {headerTitle && <TableHeader text={headerTitle} />}
            {athletes.map((athlete, position) => (
                <TableRow
                    key={athlete.id}
                    position={position + 1}
                    name={`${athlete.firstName} ${athlete.lastName}`}
                    country={athlete.county}
                    time={new Date().toLocaleTimeString("ru-RU")}
                />
            ))}
        </div>
    )
}

export default CutoffTable
