import { Suspense } from 'react'
import { Routes, Route } from 'react-router'
import { routes } from './index'

export default function AppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {routes.map((data) => (
          <Route key={data.path} path={data.path} element={<data.element />}>
            {data.nested?.map((nestedRoute) => (
              <Route 
                key={nestedRoute.path} 
                path={nestedRoute.path} 
                element={<nestedRoute.element />} 
              />
            ))}
          </Route>
        ))}
      </Routes>
    </Suspense>
  )
}