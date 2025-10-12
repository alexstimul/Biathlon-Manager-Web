import styles from "./Header.module.scss"
import { NavLink } from "react-router-dom"

const Header = () => {
    return (
        <nav className={styles.menu}>
            <ul>
                <li className={styles.menu__item}>
                    <NavLink to="/" className={({ isActive }) => isActive ? styles.menu__item_active : undefined}>Главная</NavLink>
                </li>
                <li className={styles.menu__item}>
                    <NavLink to="/race" className={({ isActive }) => isActive ? styles.menu__item_active : undefined}>Гонка</NavLink>
                </li>
                <li className={styles.menu__item}>
                    <NavLink to="/team" className={({ isActive }) => isActive ? styles.menu__item_active : undefined}>Команда</NavLink>
                </li>
                <li className={styles.menu__item}>
                    <NavLink to="/training" className={({ isActive }) => isActive ? styles.menu__item_active : undefined}>Тренировки</NavLink>
                </li>
                <li className={styles.menu__item}>
                    <NavLink to="/infrastructure" className={({ isActive }) => isActive ? styles.menu__item_active : undefined}>Инфраструктура</NavLink>
                </li>
                <li className={styles.menu__item}>
                    <NavLink to="/competitions" className={({ isActive }) => isActive ? styles.menu__item_active : undefined}>Кубок мира</NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Header