import { Outlet } from "react-router-dom"
import styles from "./App.module.scss"
import LeftSidebar from "./components/LeftSidebar/LeftSidebar"

const App = () => (
    <div className={styles.app}>
        <LeftSidebar />
        <div>
            <Outlet />
        </div>
    </div>
)

export default App
