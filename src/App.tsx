import { Outlet, useLocation } from "react-router-dom"
import styles from "./App.module.scss"
import LeftSidebar from "./components/LeftSidebar/LeftSidebar"
import cn from "classnames"
import { ROUTER_PATHS } from "./constants"

// todo после завершения основных работ навалить адаптив

const App = () => {
    const location = useLocation()
    
    const isRacePage = location.pathname.endsWith(ROUTER_PATHS.RACE)

    return (
        <div className={styles.app}>
            <LeftSidebar />
            <div className={cn(styles.app__content, isRacePage && styles.app__content_withoutMargin)}>
                <Outlet />
            </div>
        </div>
    )
}

export default App
