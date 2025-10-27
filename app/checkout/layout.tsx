'use client';

import React, { ReactNode } from 'react';
import ProgressBar from '../../components/ProgressBar';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '../../store/booking';

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { clearRoomData, clearAddOnData, clearTravellerData, clearDateData } = useStore();
  const showBackArrow = pathname !== '/checkout/1-package';

  const handleBackNavigation = () => {
    // Clear data based on current step when going back
    if (pathname.includes('/checkout/2-dates')) {
      clearDateData();
    } else if (pathname.includes('/checkout/3-room')) {
      clearRoomData();
    } else if (pathname.includes('/checkout/4-add-ons')) {
      clearAddOnData();
    } else if (pathname.includes('/checkout/5-travellers')) {
      clearTravellerData();
    }
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full max-w-7xl mx-auto pt-4 pb-2">
        {showBackArrow && (
          <button
            onClick={handleBackNavigation}
            aria-label="Go back"
            className="p-2 mb-2"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g>
                <path d="M28 20H12" stroke="#FF3B30" strokeWidth="3" strokeLinecap="round"/>
                <path d="M18 14L12 20L18 26" stroke="#FF3B30" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
            </svg>
          </button>
        )}
        <ProgressBar />
      </div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
} 