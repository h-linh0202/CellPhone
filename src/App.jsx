
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './Layout/MainLayout.jsx'
import HomePage from './Page/HomePage.jsx'
import Login from './Page/Login.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminDashboard from './Page/AdminDashboard.jsx'
import AdminProducts from './Page/AdminProducts.jsx'
import AdminOrders from './Page/AdminOrders.jsx'
import AdminUsers from './Page/AdminUsers.jsx'
import AdminReports from './Page/AdminReports.jsx'



function App() {


  return (
    <>
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>
        </Routes>
      </Layout>
    </Router>

     
    </>
  )
}

export default App


