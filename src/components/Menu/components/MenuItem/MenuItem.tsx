import { NavLink } from "react-router-dom"
import styles from "./MenuItem.module.scss"
import cn from "classnames"
import { MenuItemType } from "../../../../constants"

export interface MenuItemProps {
    item: MenuItemType
}

const MenuItem = ({ item }: MenuItemProps) => {
    const { id, route, icon: Icon, text } = item

    return (
        <li>
            <NavLink key={id} to={route} className={({ isActive }) => cn(styles.item, isActive && styles.item_active)}>
                <Icon className={styles.item__icon} />
                <span className={styles.item__text}>{text}</span>
            </NavLink>
        </li>
    )
}

export default MenuItem
