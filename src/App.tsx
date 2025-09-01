import './App.css'
import { BrowserRouter, Routes } from 'react-router'

import { Route } from 'react-router'
import { useAuthStore } from './features/auth/store'
import { Auth } from './features/auth/ui'
import { Layout } from './widgets/layout'
import { Dashboard } from './features/dashboard'
import { Accounts } from './features/accounts'
import { Trade } from './features/trade'
import { useRefreshTokens } from './features/auth/hooks'
import { TradeHistory } from './features/trageHistory/ui'

function App() {
  const { isAuthenticated } = useAuthStore()

  useRefreshTokens();

  return (
    <BrowserRouter>
    {
      isAuthenticated ? (
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/trade/history/:batchId" element={<TradeHistory />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="*" element={<Auth />} />
        </Routes>
      )
    }
    </BrowserRouter>
  )
}

export default App
