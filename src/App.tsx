import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ChartOfAccounts from './pages/Organization/ChartOfAccounts';
import BusinessInfo from './pages/Organization/BusinessInfo';
import Employees from './pages/Organization/Employees';
import Suppliers from './pages/Organization/Suppliers';
import Customers from './pages/Organization/Customers';
import Banks from './pages/Organization/Banks';
import VoucherList from './pages/Vouchers/VoucherList';
import VoucherForm from './pages/Vouchers/VoucherForm';
import GeneralJournal from './pages/Reports/GeneralJournal';
import TrialBalance from './pages/Reports/TrialBalance';
import IncomeStatement from './pages/Reports/IncomeStatement';
import BalanceSheet from './pages/Reports/BalanceSheet';
import { useAuthStore } from './store/authStore';
import { SyncService } from './lib/sync';
import { supabase } from './lib/supabase';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  const { user, login, logout } = useAuthStore();
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        login({
          id: session.user.id,
          fullName: session.user.email?.split('@')[0] || 'Sinh viên',
          class: 'Sinh viên FTU',
        });
      }
      setLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        login({
          id: session.user.id,
          fullName: session.user.email?.split('@')[0] || 'Sinh viên',
          class: 'Sinh viên FTU',
        });
      } else {
        logout();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      SyncService.startAutoSync();
    }
  }, [user]);

  if (loadingSession) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Đang tải...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/organization/info" replace />} />
          <Route path="organization">
            <Route path="info" element={<BusinessInfo />} />
            <Route path="employees" element={<Employees />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="customers" element={<Customers />} />
            <Route path="banks" element={<Banks />} />
            <Route path="accounts" element={<ChartOfAccounts />} />
            <Route index element={<Navigate to="info" replace />} />
          </Route>
          <Route path="vouchers">
            <Route index element={<VoucherList />} />
            <Route path="form/:type/:id?" element={<VoucherForm />} />
          </Route>
          <Route path="reports">
            <Route path="general-journal" element={<GeneralJournal />} />
            <Route path="trial-balance" element={<TrialBalance />} />
            <Route path="income-statement" element={<IncomeStatement />} />
            <Route path="balance-sheet" element={<BalanceSheet />} />
          </Route>
          {/* Default fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
