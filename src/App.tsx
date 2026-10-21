import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReportProvider } from './context/ReportContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ReportPage } from './pages/ReportPage';
import { MapPage } from './pages/MapPage';
import { ReportsPage } from './pages/ReportsPage';
import { DuplicatesPage } from './pages/DuplicatesPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <ReportProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/duplicates" element={<DuplicatesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ReportProvider>
  );
}

export default App;
