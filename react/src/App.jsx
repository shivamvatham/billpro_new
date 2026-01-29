import { Drawer } from "./layout/Drawer"
import AppRouter from "./routes/AppRouter"
import AppBar from "./components/AppBar"

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Drawer />
      <AppBar />
      <div style={{ marginLeft: '230px', marginTop: '60px', flex: 1, padding: '20px' }}>
        <AppRouter />
      </div>
    </div>
  )
}

export default App
