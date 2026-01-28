import { lazy } from 'react'

const Home = lazy(() => import('../pages/Home'))
const About = lazy(() => import('../pages/About'))
const Contact = lazy(() => import('../pages/Contact'))
const NotFound = lazy(() => import('../pages/NotFound'))

export const routes = [
  { path: '/', element: Home, title: 'Home' },
  { path: '/about', element: About, title: 'About' },
  { path: '/contact', element: Contact, title: 'Contact' },
  { path: '*', element: NotFound, title: 'Not Found' }
]