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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <div>Ошибка!</div>,
    children: [
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
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
