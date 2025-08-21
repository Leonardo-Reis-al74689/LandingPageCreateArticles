"use client"

import { useEffect, useState } from 'react';
import { setupMocks } from '@/hooks/mockData';

interface MockProviderProps {
  children: React.ReactNode;
}

export function MockProvider({ children }: MockProviderProps) {
  const [mockSetup, setMockSetup] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Configurar mocks apenas no cliente
    if (isClient && !mockSetup) {
      try {
        setupMocks();
        setMockSetup(true);
      } catch (error) {
        setMockSetup(true);
      }
    }
  }, [isClient, mockSetup]);

  if (!isClient || !mockSetup) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">A configurar APIs...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
