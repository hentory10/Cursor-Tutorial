'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../../store/booking';
import { useRouter } from 'next/navigation';
import { content } from '../../../content';
import ErrorSummary from '../../../components/ErrorSummary';
import BookingSummary from '../../../components/BookingSummary';

const DURATIONS = [
  { label: '4 days (May to August)', value: '4d' },
  { label: '1 week', value: '1w' },
  { label: '2 weeks', value: '2w' },
  { label: '3 weeks', value: '3w' },
  { label: '4 weeks', value: '4w' },
];

export default function PackageStep() {
  const { packages, setPackage, selectedPackage, people, setPeople, duration, setDuration } = useStore();
  const [error, setError] = useState('');
  const router = useRouter();
  const durationRef = useRef<HTMLDivElement>(null);
  const [summaryTop, setSummaryTop] = useState(32);
  const [openIncluded, setOpenIncluded] = useState<string | null>(null);

  useEffect(() => {
    if (durationRef.current) {
      const rect = durationRef.current.getBoundingClientRect();
      setSummaryTop(rect.top + window.scrollY);
    }
  }, []);

  const handleNext = () => {
    if (!selectedPackage) {
      setError(content.validation.packageRequired);
      return;
    }
    router.push('/checkout/2-dates');
  };

  const includedItems = [
    '7 nights accommodation',
    '7 breakfasts',
    '5 dinners',
    'Surf lessons 5 x 2 hours, L1, L2 or L3',
    '6 days free use of surf equipment subjected to surf conditions',
    'Surf theory',
    '1 video analysis session (level 3 only)',
    'Transport to surf lessons',
  ];

  return (
    <div className="flex flex-col md:flex-row gap-12 min-h-screen max-w-7xl mx-auto px-4">
      <div className="w-full md:w-[70%] py-8">
        <div className="w-full mb-8" ref={durationRef}>
          <div className="mb-6">
            <div className="font-bold text-2xl mb-2">Select duration</div>
            <div className="flex gap-3 flex-wrap">
              {DURATIONS.map(d => (
                <button
                  key={d.value}
                  type="button"
                  className={`px-6 py-2 rounded-lg border font-semibold transition-all ${duration === d.value ? 'bg-lapoint-red text-white border-lapoint-red' : 'bg-white text-lapoint-dark border-lapoint-border hover:bg-lapoint-yellow'}`}
                  onClick={() => setDuration(d.value)}
                  aria-pressed={duration === d.value}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full mb-4">
            <div className="rounded-full bg-yellow-300 px-6 py-2 text-lapoint-dark text-[12px]" style={{ fontFamily: 'Nunito, sans-serif', display: 'inline-block', width: '100%', fontWeight: 400 }}>
              <span className="font-bold">10% discount</span> &bull; For bookings with arrival dates until 11 Aug Including 4 day packages or multiple weeks. &bull; Use code: <span className="font-bold">TAGHAZOUT10</span>
            </div>
          </div>
        </div>
        <form
          aria-labelledby="package-step-title"
          onSubmit={e => {
            e.preventDefault();
            handleNext();
          }}
        >
          <h2 id="package-step-title" className="text-2xl mb-4">Select your package</h2>
          {error && <ErrorSummary message={error} />}
          <div className="space-y-6">
            {packages.map(pkg => (
              <div key={pkg.id} className={`card flex flex-col gap-4 ${selectedPackage?.id === pkg.id ? 'border-lapoint-red border-2' : ''}`}>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                  <div className="flex flex-col min-w-[220px]">
                    <div className="text-lg font-bold mb-1">{pkg.name}</div>
                    <div className="text-sm text-gray-600 mb-2">{pkg.description}</div>
                    <div className="text-lapoint-red font-bold">From EUR {pkg.price}</div>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      className="btn-outline flex items-center gap-2 px-6 py-2 text-base font-semibold border-2 rounded-xl transition-all w-fit"
                      onClick={() => setOpenIncluded(openIncluded === pkg.id ? null : pkg.id)}
                      aria-pressed={openIncluded === pkg.id}
                    >
                      What's included
                      <span className={`transition-transform ${openIncluded === pkg.id ? 'rotate-180' : ''}`}>▾</span>
                    </button>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border border-gray-300 text-gray-400 flex items-center justify-center text-xl disabled:opacity-50"
                      aria-label="Decrease number of people"
                      onClick={() => setPeople(Math.max(1, people - 1))}
                      disabled={selectedPackage?.id !== pkg.id || people <= 1}
                    >
                      –
                    </button>
                    <span className="w-8 text-center font-bold">{selectedPackage?.id === pkg.id ? people : 0}</span>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border border-lapoint-red text-white bg-lapoint-red flex items-center justify-center text-xl"
                      aria-label="Increase number of people"
                      onClick={() => {
                        if (selectedPackage?.id === pkg.id) {
                          setPeople(people + 1);
                        } else {
                          setPackage(pkg.id);
                          setPeople(1);
                        }
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                {openIncluded === pkg.id && (
                  <div className="w-full mt-2 border-t pt-4">
                    <div className="font-semibold mb-2 text-base">Included per week</div>
                    <ul className="space-y-2">
                      {includedItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-base">
                          <svg className="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#111"/><path d="M6 10.5L9 13.5L14 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </form>
      </div>
      <div className="w-full md:w-[25%] flex-shrink-0 mt-8">
        <BookingSummary buttonLabel="DATE SELECTION →" onButtonClick={handleNext} />
      </div>
    </div>
  );
} 