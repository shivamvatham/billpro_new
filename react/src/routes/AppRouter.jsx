import { Suspense } from 'react'
import { Routes, Route } from 'react-router'
import { routes } from './index'

export default function AppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {routes.map((data) => {
          if (data.children && data.element && data.children.length > 0) {
            return (
              <Route key={data.path} path={data.path} element={<data.element />}>
                {data.children.map((child) => (
                  <Route key={child.path} path={child.path} element={<child.element />} />
                ))}
              </Route>
            )
          } else if (data.element && !data.children) {
            return (
              <Route key={data.path} path={data.path} element={<data.element />} />
            )
          } else if(!data.element && data.children) {
            return (
              <Route key={data.path} path={data.path}>
                {
                  data.children.map((child2) => {
                    const ChildComponent = child2.element
                    return (
                      <Route key={child2.path} path={child2.path} element={<ChildComponent />} />
                    )
                  })
                }
              </Route>
            )
          }
        })}
      </Routes>
    </Suspense>
  )
}