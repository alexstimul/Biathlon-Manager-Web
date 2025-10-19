import styles from "./Menu.module.scss"
import { menuItems } from "../../constants"
import MenuItem from "./components/MenuItem/MenuItem"

const Menu = () => {
    return (
        <nav className={styles.menu}>
            <ul>
                {menuItems.map(menuItem => (
                    <MenuItem key={menuItem.id} item={menuItem} />
                ))}
            </ul>
        </nav>
    )
}

export default Menu
