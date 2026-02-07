import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './routes/AppRouter'
import { BrowserRouter } from 'react-router'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store'
import { Provider } from 'react-redux'
import { Toaster } from './components/ui/sonner'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRouter />
        <Toaster richColors closeButton />
      </PersistGate>
    </Provider>
  </BrowserRouter>,
)
