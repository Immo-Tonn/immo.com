import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Layout from '@widgets/Layout/Layout';
import 'leaflet/dist/leaflet.css';
import ScrollToTop from '@shared/ui/ScrollToTop/ScrollToTop';
import Home from '@pages/Home/Home';
import NotFound from '@pages/NotFound/NotFound';
import Valuation from '@pages/Valuation/Valuation';
import RealEstate from '@pages/RealEstate/RealEstate';
import Financing from '@pages/Financing/Financing';
import ContactForm from '@features/contact/ui/ContactForm';
import LegalNotice from '@pages/LegalNotice/LegalNotice';
import LawAndAdvice from '@pages/LawAndAdvice/LawAndAdvice';
import CancellationPolicy from '@pages/CancellationPolicy/CancellationPolicy';
import PrivacyPolicy from '@pages/PrivacyPolicy/PrivacyPolicy';
import DankePage from '@pages/DankePage/DankePage';
import ObjectStyling from '@pages/ObjectStyling/ObjectStyling';
import '@shared/styles/global.css';
import PropertyPage from '@pages/PropertyPage/PropertyPage';
import SalesSupport from '@pages/SalesSupport/SalesSupport';
import MortgageCalculator from '@features/mortgage/ui/MortgageCalculator';
import ObjectPreview from '@pages/AdminObject/ObjectPrewiew/ObjectPrewiew';
import Login from '@pages/Auth/Login';
import Register from '@pages/Auth/Register';
import ForgotPassword from '@pages/Auth/ForgotPassword';
import ProtectedRoute from '@features/utils/ProtectedRoute';
import ChangePassword from '@pages/Auth/ChangePassword';
import CreateObject from '@pages/AdminObject/CreateObject/CreateObject';


const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wertermittlung" element={<Valuation />} />
          <Route path="/immobilien" element={<RealEstate />} />
          <Route path="/immobilien/:id" element={<PropertyPage />} />
          <Route path="/objectstyling" element={<ObjectStyling />} />
          <Route path="/finanzierung" element={<Financing />} />
          <Route path="/kontakt" element={<ContactForm />} />
          <Route path="/legalnotice" element={<LegalNotice />} />
          <Route path="/recht-und-rat" element={<LawAndAdvice />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/kontakt/danke" element={<DankePage />} />
          <Route path="/cancellationpolicy" element={<CancellationPolicy />} />
          <Route path="/verkaufssupport" element={<SalesSupport />} />
          <Route path="/rechner" element={<MortgageCalculator />} />
          <Route path="*" element={<NotFound />} />

                    {/* Authentication pages */}
          <Route path="/add-property" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/change-password"
            element={<ProtectedRoute>{<ChangePassword />}</ProtectedRoute>}
          />

                    {/* Protected routes for admin */}
          <Route
            path="/create-object"
            element={
              <ProtectedRoute>
                <CreateObject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/preview-object/:id"
            element={
              <ProtectedRoute>
                <ObjectPreview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-object/:id"
            element={
              <ProtectedRoute>
                <CreateObject />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
      <Analytics />
    </Router>
  );
};

export default App;
