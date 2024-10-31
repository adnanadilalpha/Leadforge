import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './components/Dashboard';  // Import as default
import { LeadGeneratorForm } from './components/LeadGeneration/LeadGeneratorForm';
import { EmailCampaign } from './components/EmailCampaign';
import LandingPage from './components/LandingPage';  // Changed to default import
import { useStore } from './lib/store';
import { ToastProvider } from './components/ui/toast';
import { Toaster } from './components/ui';
import { LeadsPage } from './components/Leads/LeadsPage';
import { LeadDetailPage } from './components/Leads/LeadDetailPage';  // Changed to named import
import Settings from './components/Settings';
import PricingPage from './lib/Pricing/page';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const { isAuthenticated, user } = useStore();

  if (!isAuthenticated || !user) {
    return <ErrorBoundary><LandingPage /></ErrorBoundary>;
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/generate" element={<LeadGeneratorForm />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/leads/:id" element={<LeadDetailPage />} />
              <Route path="/email" element={<EmailCampaign />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/pricing" element={<PricingPage />} />
            </Routes>
          </Layout>
        </Router>
        <Toaster />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
