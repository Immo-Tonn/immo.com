import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import i18n from '@shared/i18n/i18n';

// Язык берём из URL до гидратации (разметка уже prerender-ена на этом языке)
const first = window.location.pathname.split('/')[1];
i18n.changeLanguage(first === 'en' || first === 'ru' ? first : 'de');

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
