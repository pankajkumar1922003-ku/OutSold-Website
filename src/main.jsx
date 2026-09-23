import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PrivacyPolicy from './Pages/PrivacyPolicy.jsx'
import TermsConditions from './Pages/Terms-Cond.jsx'
import Layout from './Layout/Layout.jsx'
import ExploreLayout from './Layout/ExploreLayout.jsx'
import EventsPage from './Components/All Events.jsx'
import LocationOnboarding from './Components/LocationOnboarding.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />
      },
      {
        path:"/explore",
        element:<ExploreLayout/>
      },
      {
        path:"/all-events",
        element:<EventsPage/>
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />
      },
      {
        path: "/terms-conditions",
        element: <TermsConditions />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocationOnboarding/>
    <RouterProvider router={router} />
  </StrictMode>,
)
