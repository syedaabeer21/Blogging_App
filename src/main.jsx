import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import ProtectedRoutes from './components/ProtectedRoutes'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import SingleBlogger from './pages/SingleBlogger'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'



const router=createBrowserRouter([
  {
  path:'/',
  element:<Layout/>,
  children:[
    {
      path:'',
      element:<Home/>
    },
    {
      path:'login',
      element:<Login/>
    },
    {
      path:'register',
      element:<Register/>
    },
    {
      path: 'dashboard',
      element: <ProtectedRoutes component={<Dashboard/>}/>
    },
    {
      path: 'profile',
      element: <ProtectedRoutes component={<Profile/>}/>
    },
    {
      path: 'blogger/:uid',
      element: <ProtectedRoutes component={<SingleBlogger/>}/>
    },
    
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}>
  </RouterProvider>
)
