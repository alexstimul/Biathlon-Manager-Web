import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"
import Race from "./pages/Race/Race.tsx"
import Team from "./pages/Team/Team.tsx"
import Competitions from "./pages/Competitions/Competitions.tsx"
import Infrastructure from "./pages/Infrastructure/Infrastructure.tsx"
import Training from "./pages/Training/Training.tsx"
import Home from "./pages/Home/Home.tsx"
import Calendar from "./pages/Calendar/Calendar.tsx"
import Finance from "./pages/Finance/Finance.tsx"
import Transfers from "./pages/Transfers/Transfers.tsx"
import Achivments from "./pages/Achivments/Achivments.tsx"
import Settings from "./pages/Settings/Settings.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>Ошибка!</div>,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/home",
        element: <Home />
      },
      {
        path: "/team",
        element: <Team />
      },
      {
        path: "/competitions",
        element: <Competitions />
      },
      {
        path: "/infrastructure",
        element: <Infrastructure />
      },
      {
        path: "/training",
        element: <Training />
      },
      {
        path: "/race",
        element: <Race athletes={[]} laps={3} />
      },
      {
        path: "/calendar",
        element: <Calendar />
      },
      {
        path: "/finance",
        element: <Finance />
      },
      {
        path: "/transfers",
        element: <Transfers />
      },
      {
        path: "/achivments",
        element: <Achivments />
      },
      {
        path: "/settings",
        element: <Settings />
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
