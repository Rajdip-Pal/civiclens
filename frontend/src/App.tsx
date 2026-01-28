import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SubmitReport from './pages/SubmitReport';
import Reports from './pages/Reports';
import ReportDetail from './pages/ReportDetail';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />

        <Route
          path='submit'
          element={
            <PrivateRoute>
              <SubmitReport />
            </PrivateRoute>
          }
        />
        <Route path='reports' element={<Reports />} />
        <Route path='reports/:id' element={<ReportDetail />} />
        <Route
          path='dashboard'
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route path='*' element={<Navigate to='/' replace />} />
      </Route>
    </Routes>
  );
}

export default App;
