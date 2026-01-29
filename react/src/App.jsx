import { Drawer } from "./layout/Drawer"
import AppRouter from "./routes/AppRouter"

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Drawer />
      <div style={{ marginLeft: '230px', flex: 1, padding: '10px' }}>
        <AppRouter />
      </div>
    </div>
  )
}

export default App
