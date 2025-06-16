import './App.css'
import { UserProvider } from './context/UserContext'
import { AppRoutes } from './routes/routes'

function App() {

  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  )
}

export default App
