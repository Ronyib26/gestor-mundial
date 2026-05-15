import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { TeamsPage } from './pages/TeamsPage';
import { GroupsPage } from './pages/GroupsPage';
import { DistributionsPage } from './pages/DistributionsPage';
import { DistributionDetailPage } from './pages/DistributionDetailPage';
import { FormationPage } from './pages/FormationPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/equipos" element={<TeamsPage />} />
        <Route path="/grupos" element={<GroupsPage />} />
        <Route path="/distribuciones" element={<DistributionsPage />} />
        <Route path="/distribuciones/nueva" element={<FormationPage />} />
        <Route path="/distribuciones/:id" element={<DistributionDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
