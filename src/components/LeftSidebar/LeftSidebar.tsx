import Menu from "../Menu/Menu"
import Header from "./components/Header/Header"
import TeamInfo from "./components/TeamInfo/TeamInfo"
import styles from "./LeftSidebar.module.scss"

const LeftSidebar = () => (
    <div className={styles.leftSidebar}>
        <Header />
        <TeamInfo />
        <Menu />
    </div>
)

export default LeftSidebar
