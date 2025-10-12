import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import styles from "./StartList.module.scss"
import { useMemo, useState } from "react"

type AthleteItem = {
    position: number
    country: string
    first_name: string
    last_name: string
}

const defaultData = [
    {
        position: 1,
        country: "ru",
        first_name: "Иван",
        last_name: "Иванов"
    }
]

const columnHelper = createColumnHelper<AthleteItem>()

const columns = [
    columnHelper.accessor("position", {
        cell: info => <span>{info.getValue()}</span>,
        header: () => "№",
        meta: {
            align: "center" as const
        }
    }),
    columnHelper.accessor(row => row, {
        id: "athlete",
        cell: info => {
            const athlete = info.getValue()
            return <span>{athlete.last_name} {athlete.last_name}</span>
        },
        header: () => <span>Спортсмен</span>,
        meta: {
            align: "left" as const
        }
    }),
    columnHelper.accessor(row => row, {
        id: "country",
        cell: info => {
            const athlete = info.getValue()
            return <span>{athlete.country}</span>
        },
        header: () => <span>Страна</span>,
        meta: {
            align: "center" as const
        }
    })
]

const StartList = () => {
    const [athletes, setAthletes] = useState<AthleteItem[]>(defaultData)

    const table = useReactTable({
        data: athletes,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    return (
        <div className={styles.wrapper}>
            <table className={styles.startList}>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th 
                                key={header.id}
                                style={{ 
                                    textAlign: (header.column.columnDef.meta as Record<string, CanvasTextAlign>)?.align || 'left'
                                }}
                            >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td 
                                key={cell.id}
                                style={{ 
                                    textAlign: (cell.column.columnDef.meta as Record<string, CanvasTextAlign>)?.align || 'left'
                                }}
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default StartList
