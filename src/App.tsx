import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './components/Dashboard';
import LeadGenerator from './components/LeadGenerator';
import EmailAutomation from './components/EmailAutomation';
import LandingPage from './components/LandingPage';
import { useStore } from './lib/store';
import { Settings } from './components/Settings';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { isAuthenticated, user } = useStore();

  if (!isAuthenticated || !user) {
    return <LandingPage />;
  }

  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/generate" element={<LeadGenerator />} />
            <Route path="/email" element={<EmailAutomation />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
