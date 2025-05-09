'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import store from '@/store/store';
// import SessionProviderWrapper from '@/component/page/SessionProviderWrapper';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
}