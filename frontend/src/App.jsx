import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DenunciaForm from './pages/DenunciaForm';
import DenunciaList from './pages/DenunciaList';
import DenunciaDetail from './pages/DenunciaDetail';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

// Componente para redireccionar según el rol
const RoleBasedRedirect = () => {
  const { user } = useAuth();
  
  if (user?.rol === 'admin' || user?.rol === 'operador911') {
    return <Navigate to="/admin" replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rutas protegidas */}
          <Route element={<Layout />}>
            <Route path="/" element={<RoleBasedRedirect />} />
            
            <Route element={<PrivateRoute allowedRoles={['ciudadano']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/denuncias/nueva" element={<DenunciaForm />} />
              <Route path="/denuncias" element={<DenunciaList />} />
              <Route path="/denuncias/:id" element={<DenunciaDetail />} />
            </Route>
            
            <Route element={<PrivateRoute allowedRoles={['operador911', 'admin']} />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Route>
          
          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 