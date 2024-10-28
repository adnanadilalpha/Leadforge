import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './components/Dashboard';  // Import as default
import { LeadGeneratorForm } from './components/LeadGeneration/LeadGeneratorForm';
import { EmailCampaign } from './components/EmailCampaign';
import LandingPage from './components/LandingPage';  // Changed to default import
import { FreelancerSettings } from './components/FreelancerSettings';
import { useStore } from './lib/store';
import { ToastProvider } from './components/ui/toast';
import { Toaster } from './components/ui';
import { LeadsPage } from './components/Leads/LeadsPage';
import { LeadDetailPage } from './components/Leads/LeadDetailPage';  // Changed to named import

function App() {
  const { isAuthenticated, user } = useStore();

  if (!isAuthenticated || !user) {
    return <LandingPage />;
  }

  return (
    <>
      <ToastProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/generate" element={<LeadGeneratorForm />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/leads/:id" element={<LeadDetailPage />} />
              <Route path="/email" element={<EmailCampaign />} />
              <Route path="/settings" element={<FreelancerSettings />} />
            </Routes>
          </Layout>
        </Router>
        <Toaster />
      </ToastProvider>
    </>
  );
}

export default App;
