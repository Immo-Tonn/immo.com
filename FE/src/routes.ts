import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  route(':lang?', 'lang-layout.tsx', [
    index('routes/home.tsx'),
    route('immobilien', 'routes/realestate.tsx'),
    route('immobilien/:id', 'routes/property.tsx'),
    route('wertermittlung', 'routes/valuation.tsx'),
    route('finanzierung', 'routes/finanzierung.tsx'),
    route('kontakt', 'routes/kontakt.tsx'),
    route('legalnotice', 'routes/legalnotice.tsx'),
    route('recht-und-rat', 'routes/recht-und-rat.tsx'),
    route('privacypolicy', 'routes/privacypolicy.tsx'),
    route('kontakt/danke', 'routes/danke.tsx'),
    route('cancellationpolicy', 'routes/cancellationpolicy.tsx'),
    route('objectstyling', 'routes/objectstyling.tsx'),
    route('verkaufssupport', 'routes/verkaufssupport.tsx'),
    route('rechner', 'routes/rechner.tsx'),
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
