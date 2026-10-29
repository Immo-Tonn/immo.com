import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  route(':lang?', 'lang-layout.tsx', [
    index('routes/home.tsx'),
    route('immobilien', 'routes/realestate.tsx'),
    route('immobilien/:id', 'routes/property.tsx'),
    route('wertermittlung', 'routes/valuation.tsx'),
    route('finanzierung', 'pages/Financing/Financing.tsx'),
    route('kontakt', 'features/contact/ui/ContactForm.tsx'),
    route('legalnotice', 'pages/LegalNotice/LegalNotice.tsx'),
    route('recht-und-rat', 'pages/LawAndAdvice/LawAndAdvice.tsx'),
    route('privacypolicy', 'pages/PrivacyPolicy/PrivacyPolicy.tsx'),
    route('kontakt/danke', 'pages/DankePage/DankePage.tsx'),
    route('cancellationpolicy', 'pages/CancellationPolicy/CancellationPolicy.tsx'),
    route('objectstyling', 'pages/ObjectStyling/ObjectStyling.tsx'),
    route('verkaufssupport', 'pages/SalesSupport/SalesSupport.tsx'),
    route('rechner', 'features/mortgage/ui/MortgageCalculator.tsx'),
    route('add-property', 'pages/Auth/Login.tsx'),
    route('register', 'pages/Auth/Register.tsx'),
    route('forgot-password', 'pages/Auth/ForgotPassword.tsx'),
    route('change-password', 'routes/change-password.tsx'),
    route('create-object', 'routes/create-object.tsx'),
    route('preview-object/:id', 'routes/preview-object.tsx'),
    route('edit-object/:id', 'routes/edit-object.tsx'),
    route('*', 'routes/not-found.tsx'),
  ]),
] satisfies RouteConfig;
