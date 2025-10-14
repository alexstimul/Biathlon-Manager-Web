import { ForwardRefExoticComponent } from "react"
import { Award, Building2, Calendar, Dumbbell, Flag, House, LucideProps, RefreshCw, Settings, Trophy, User, Users, Wallet } from "lucide-react"

export const SHOOTING_RANGE_DISTANCE = 50 // дистанция стрельбы в метрах
export const SHOOTING_RANGE_TARGET_COUNT = 5 // количество целей на огневом рубеже

export const ROUTER_PATHS = {
    INDEX: "/",
    HOME: "/home",
    TEAM: "/team",
    COMPETITIONS: "/competitions",
    RACE: "/race",
    CALENDAR: "/calendar",
    INFRASTRUCTURE: "/infrastructure",
    TRAINING: "/training",
    TRANSFERS: "/transfers",
    FINANCE: "/finance",
    ACHIVMENTS: "/achivments",
    SETTINGS: "/settings",
    ATHLETE: "/athlete"
}

// todo придумать, куда вынести и как переименовать
export interface MenuItemType {
    id: string
    route: string
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref">>
    text: string
}

export const menuItems: MenuItemType[] = [
    {
        id: "home",
        route: ROUTER_PATHS.HOME,
        icon: House,
        text: "Главная"
    },
    {
        id: "team",
        route: ROUTER_PATHS.TEAM,
        icon: User,
        text: "Команда"
    },
    {
        id: "competitions",
        route: ROUTER_PATHS.COMPETITIONS,
        icon: Trophy,
        text: "Соревнования"
    },
    {
        id: "race",
        route: ROUTER_PATHS.RACE,
        icon: Flag,
        text: "Гонка"
    },
    {
        id: "calendar",
        route: ROUTER_PATHS.CALENDAR,
        icon: Calendar,
        text: "Календарь"
    },
    {
        id: "training",
        route: ROUTER_PATHS.TRAINING,
        icon: Dumbbell,
        text: "Тренировки"
    },
    {
        id: "infrastructure",
        route: ROUTER_PATHS.INFRASTRUCTURE,
        icon: Building2,
        text: "Инфраструктура"
    },
    {
        id: "transfers",
        route: ROUTER_PATHS.TRANSFERS,
        icon: RefreshCw,
        text: "Трансферы"
    },
    {
        id: "finance",
        route: ROUTER_PATHS.FINANCE,
        icon: Wallet,
        text: "Финансы"
    },
    {
        id: "achivments",
        route: ROUTER_PATHS.ACHIVMENTS,
        icon: Award,
        text: "Достижения"
    },
    {
        id: "settings",
        route: ROUTER_PATHS.SETTINGS,
        icon: Settings,
        text: "Настройки"
    }
]
