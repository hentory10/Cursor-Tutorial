'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

const steps = [
  { path: '/checkout/1-package', label: 'Package' },
  { path: '/checkout/2-dates', label: 'Date' },
  { path: '/checkout/3-room', label: 'Room' },
  { path: '/checkout/4-add-ons', label: 'Add ons' },
  { path: '/checkout/5-travellers', label: 'Information' },
  { path: '/checkout/6-payment', label: 'Book & Pay' },
];

export default function ProgressBar() {
  const pathname = usePathname();
  const currentStep = steps.findIndex(step => pathname.startsWith(step.path));

  return (
    <div className="w-full bg-lapoint-yellow pb-0">
      <div className="relative max-w-7xl mx-auto pt-4 sm:pt-8 pb-2 px-2 sm:px-4">
        <div className="flex justify-between items-end gap-1 sm:gap-2 overflow-x-auto scrollbar-hide" style={{ fontSize: 'clamp(10px, 2.5vw, 14px)' }}>
          {steps.map((step, i) => (
            <div key={step.path} className="flex-1 text-center min-w-0">
              <span
                className={`font-semibold whitespace-nowrap ${i <= currentStep ? 'text-lapoint-red' : 'text-gray-400'} ${i === currentStep ? 'font-bold' : ''}`}
                style={{ fontSize: 'clamp(10px, 2.5vw, 14px)' }}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
        {/* Continuous red progress line under all completed/active steps */}
        <div className="absolute left-2 sm:left-4 right-2 sm:right-4" style={{ bottom: 0, height: 2 }}>
          <div
            className="bg-lapoint-red rounded"
            style={{
              width: `calc(${((currentStep + 1) / steps.length) * 100}% )`,
              left: 0,
              position: 'absolute',
              height: 2,
              transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
            }}
          />
        </div>
      </div>
      <div className="max-w-7xl mx-auto bg-yellow-300 text-lapoint-dark text-center font-bold py-2 text-xs sm:text-base border-t border-yellow-200 ml-2 sm:ml-4 mr-2 sm:mr-4">
        Free rebooking up to 14 days prior to arrival.
      </div>
    </div>
  );
} 