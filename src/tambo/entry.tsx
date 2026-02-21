import React from 'react';
import { createRoot } from 'react-dom/client';
import { TamboAppProvider } from './provider';
import { AIPanel } from './components/AIPanel';

function mount() {
  const container = document.getElementById('tambo-root');
  if (!container) return;

  container.removeAttribute('aria-hidden');

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <TamboAppProvider>
        <AIPanel />
      </TamboAppProvider>
    </React.StrictMode>
  );

  // Bridge: listen for hero input events from static JS
  window.addEventListener('tambo:open', ((event: CustomEvent<{ query: string }>) => {
    window.dispatchEvent(
      new CustomEvent('tambo:submit-query', { detail: event.detail })
    );
  }) as EventListener);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
