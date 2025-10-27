'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../../store/booking';
import { useRouter } from 'next/navigation';
import ErrorSummary from '../../../components/ErrorSummary';
import BookingSummary from '../../../components/BookingSummary';

const DURATIONS: Record<string, number> = {
  '4d': 4,
  '1w': 7,
  '2w': 14,
  '3w': 21,
  '4w': 28,
};

function parseLocalDate(dateStr: string) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // Month is 0-indexed
  }
  
function getMonthMatrix(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const matrix = [];
  let week = [];
  let d = new Date(firstDay);
  // Start from the Monday before or on the 1st
  const dayOfWeek = d.getDay() === 0 ? 6 : d.getDay() - 1;
  d.setDate(1 - dayOfWeek);
  for (let i = 0; i < 6 * 7; i++) {
    week.push(new Date(d));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
    d.setDate(d.getDate() + 1);
  }
  return matrix;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(day: Date, start: Date, end: Date) {
  return day >= start && day <= end;
}

export default function DateStep() {
  const { arrivalDate, setArrivalDate, selectedPackage, people, duration } = useStore();
  const [error, setError] = useState('');
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  const days = DURATIONS[duration] || 7;
  const checkIn = arrivalDate ? new Date(arrivalDate) : null;
  let checkOut = checkIn ? new Date(checkIn) : null;
  if (checkOut) {
    if (days === 4) {
      checkOut.setDate(checkOut.getDate() + 4);
    } else {
      // For week-based durations, always go to the next Monday
      checkOut.setDate(checkOut.getDate() + days);
      const dayOfWeek = checkOut.getDay();
      if (dayOfWeek !== 1) {
        const diffToMonday = (8 - dayOfWeek) % 7;
        checkOut.setDate(checkOut.getDate() + diffToMonday);
      }
    }
  }
  
  /*if (checkOut) {
    if (days === 4) {
      checkOut.setDate(checkOut.getDate() + 4);
    } else {
      // For week-based durations, always go to the next Monday
      checkOut.setDate(checkOut.getDate() + Math.round(days / 7) * 7);
    }
  }*/

  // Calendar state
  const today = new Date();
  const [monthOffset, setMonthOffset] = useState(0);
  const leftMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const rightMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset + 1, 1);
  const leftMatrix = useMemo(() => getMonthMatrix(leftMonth.getFullYear(), leftMonth.getMonth()), [leftMonth]);
  const rightMatrix = useMemo(() => getMonthMatrix(rightMonth.getFullYear(), rightMonth.getMonth()), [rightMonth]);

  const handleSelect = (day: Date) => {
    if (day.getDay() !== 1) return; // Only Mondays
    setArrivalDate(day.toISOString().split('T')[0]);

    setError('');
  };

  const handleNext = () => {
    if (!arrivalDate) {
      setError('Please select a start date.');
      return;
    }
    router.push('/checkout/3-room');
  };

  const TIMEZONE = 'Africa/Casablanca';

  return (
    <div className="flex flex-col md:flex-row gap-12 min-h-screen max-w-7xl mx-auto px-4">
      <div className="w-full md:w-[70%] py-8">
        <h2 className="text-2xl font-bold mb-6">Select dates</h2>
        {error && <ErrorSummary message={error} />}
        <div className="mb-8">
          {isClient && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-bold">
                  {days === 4 ? '4 days' : days === 7 ? '1 week' : `${days} nights`}<br />
                  {checkIn && checkOut ? `${checkIn.toLocaleDateString('en-GB', { timeZone: TIMEZONE })} - ${checkOut.toLocaleDateString('en-GB', { timeZone: TIMEZONE })}` : ''}
                </div>
              </div>
              {/* Discount banner */}
              <div className="w-full mb-4">
                <div className="rounded-full bg-yellow-300 px-6 py-2 text-lapoint-dark text-[12px]" style={{ fontFamily: 'Nunito, sans-serif', display: 'inline-block', width: '100%', fontWeight: 400 }}>
                  <span className="font-bold">10% discount</span> &bull; For bookings with arrival dates until 11 Aug Including 4 day packages or multiple weeks. &bull; Use code: <span className="font-bold">TAGHAZOUT10</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center justify-between w-full mb-2">
                  <button
                    onClick={() => setMonthOffset(m => m - 1)}
                    aria-label="Previous month"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-lapoint-red text-white text-2xl shadow hover:scale-105 transition"
                    style={{ minWidth: 40, minHeight: 40 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 8L12 16L20 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div className="flex-1 flex justify-between items-center gap-8">
                    {[leftMonth, rightMonth].map((month, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div className="text-center font-bold mb-2 text-xl" style={{ fontFamily: 'Nunito, sans-serif' }}>
                          {month.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: TIMEZONE })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setMonthOffset(m => m + 1)}
                    aria-label="Next month"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-lapoint-red text-white text-2xl shadow hover:scale-105 transition"
                    style={{ minWidth: 40, minHeight: 40 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 8L20 16L12 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div className="flex gap-8 w-full">
                  {[{ matrix: leftMatrix, month: leftMonth }, { matrix: rightMatrix, month: rightMonth }].map(({ matrix, month }, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 border flex-1">
                      <div className="grid grid-cols-7 text-center text-gray-400 mb-1 text-lg font-semibold" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d, i) => <div key={i}>{d}</div>)}
                      </div>
                      {matrix.map((week, wi) => (
                        <div key={wi} className="grid grid-cols-7 text-center">
                          {week.map((day, di) => {
                            const isCurrentMonth = day.getMonth() === month.getMonth();
                            const isMonday = day.getDay() === 1;
                            const isSelected = checkIn && isSameDay(day, checkIn) && isMonday;
                            const isCheckOut = checkOut && isSameDay(day, checkOut) && isMonday;
                            // Range includes check-in Monday through check-out Monday (inclusive)
                            const isInSelectedRange = checkIn && checkOut && day >= checkIn && day <= checkOut;
                            return (
                              <button
                                key={di}
                                type="button"
                                className={`w-9 h-9 rounded-full mx-auto my-1 text-sm font-semibold transition-all
                                  ${isCurrentMonth ? '' : 'opacity-30'}
                                  ${isInSelectedRange ? 'bg-lapoint-yellow text-lapoint-dark' : ''}
                                  ${isSelected ? 'bg-lapoint-red text-white !border-lapoint-red !border-2' : ''}
                                  ${isCheckOut ? 'border-2 border-lapoint-red' : ''}
                                  ${isMonday && isCurrentMonth ? 'border border-lapoint-red' : ''}
                                `}
                                disabled={!isCurrentMonth || !isMonday}
                                onClick={() => handleSelect(day)}
                                aria-label={day.toLocaleDateString('en-GB', { timeZone: TIMEZONE })}
                              >
                                {day.getDate()}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="w-full md:w-[25%] flex-shrink-0 mt-8">
        <BookingSummary buttonLabel="ROOM SELECTION →" onButtonClick={handleNext} />
      </div>
    </div>
  );
} 