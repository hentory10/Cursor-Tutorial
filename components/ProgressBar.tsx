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
      <div className="relative max-w-7xl mx-auto pt-8 pb-2 px-4">
        <div className="flex justify-between items-end" style={{ fontFamily: 'Nunito, sans-serif', fontSize: 14 }}>
          {steps.map((step, i) => (
            <div key={step.path} className="flex-1 text-center">
              <span
                className={`font-semibold ${i <= currentStep ? 'text-lapoint-red' : 'text-gray-400'} ${i === currentStep ? 'font-bold' : ''}`}
                style={{ fontFamily: 'Nunito, sans-serif', fontSize: 14 }}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
        {/* Continuous red progress line under all completed/active steps */}
        <div className="absolute left-0 right-0" style={{ bottom: 0, height: 2 }}>
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
      <div className="w-full max-w-7xl mx-auto bg-yellow-300 text-lapoint-dark text-center font-bold py-2 text-base border-t border-yellow-200 px-4">
        Free rebooking up to 14 days prior to arrival.
      </div>
    </div>
  );
} 