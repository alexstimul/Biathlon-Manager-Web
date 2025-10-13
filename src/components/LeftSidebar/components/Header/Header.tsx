import { Moon } from "lucide-react"
import styles from "./Header.module.scss"

// todo подумать, мб див на button заменить и норм стилизовать

const Header = () => {
    return (
        <div className={styles.header}>
            <span className={styles.header__title}>Биатлон менеджер</span>
            <div className={styles.header__themeChanger}>
                <Moon className={styles.header__themeChanger_icon} />
            </div>
        </div>
    )
}

export default Header
