import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
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
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
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
