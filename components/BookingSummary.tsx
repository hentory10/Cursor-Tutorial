'use client';

import React from 'react';
import { useStore } from '../store/booking';
import { content } from '../content';
import { usePathname } from 'next/navigation';

export default function BookingSummary({ buttonLabel = 'ROOM SELECTION →', onButtonClick }: { buttonLabel?: string; onButtonClick?: () => void }) {
  const { summary, selectedPackage, arrivalDate, selectedRoom, people, selectedAddOns, addOns, rooms, roomAssignments, addOnCounts, duration } = useStore();
  const pathname = usePathname();
  const [buttonEnabled, setButtonEnabled] = React.useState(false);

  // Duration mapping (same as 2-dates page)
  const DURATIONS: Record<string, number> = {
    '4d': 4,
    '1w': 7,
    '2w': 14,
    '3w': 21,
    '4w': 28,
  };

  // Format dates for display (using same logic as 2-dates page)
  let dateLabel = '-';
  if (arrivalDate && selectedPackage) {
    const days = DURATIONS[duration] || 7;
    
    // Parse the date string directly to avoid any timezone issues
    const [checkInYear, checkInMonth, checkInDay] = arrivalDate.split('-').map(Number);
    
    // Calculate checkout date by working with the date string directly
    let checkOutYear = checkInYear;
    let checkOutMonth = checkInMonth;
    let checkOutDay = checkInDay;
    
    if (days === 4) {
      // Add 4 days
      checkOutDay += 4;
      // Handle month overflow
      const daysInMonth = new Date(checkOutYear, checkOutMonth, 0).getDate();
      if (checkOutDay > daysInMonth) {
        checkOutDay -= daysInMonth;
        checkOutMonth += 1;
        if (checkOutMonth > 12) {
          checkOutMonth = 1;
          checkOutYear += 1;
        }
      }
    } else {
      // For week-based durations, add days then snap to next Monday
      checkOutDay += days;
      // Handle month overflow
      let tempDate = new Date(checkOutYear, checkOutMonth - 1, checkOutDay);
      // Snap to next Monday if needed
      const dayOfWeek = tempDate.getDay();
      if (dayOfWeek !== 1) {
        const diffToMonday = (8 - dayOfWeek) % 7;
        tempDate.setDate(tempDate.getDate() + diffToMonday);
      }
      checkOutYear = tempDate.getFullYear();
      checkOutMonth = tempDate.getMonth() + 1;
      checkOutDay = tempDate.getDate();
    }

    // Format duration label
    const durationLabel = days === 4 ? '4 days' : days === 7 ? '1 week' : `${days} nights`;
    
    // Format dates directly from the date components (no Date object conversion)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const checkInFormatted = `${checkInDay} ${months[checkInMonth - 1]}`;
    const checkOutFormatted = `${checkOutDay} ${months[checkOutMonth - 1]} ${checkOutYear}`;
    
    dateLabel = `${durationLabel}, ${checkInFormatted} - ${checkOutFormatted}`;
  }

  // Dynamic button enabling based on current step
  const getButtonEnabled = () => {
    if (pathname.includes('/checkout/1-package')) {
      return !!selectedPackage;
    } else if (pathname.includes('/checkout/2-dates')) {
      return !!arrivalDate;
    } else if (pathname.includes('/checkout/3-room')) {
      return Object.values(roomAssignments).some(n => n > 0);
    } else if (pathname.includes('/checkout/4-add-ons')) {
      return selectedAddOns.length > 0 || Object.values(addOnCounts).some(n => n > 0);
    }
    return false;
  };

  React.useEffect(() => {
    setButtonEnabled(getButtonEnabled());
  }, [pathname, selectedPackage, arrivalDate, roomAssignments, selectedAddOns, addOnCounts]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Trip summary</h2>
      <div className="bg-white border border-gray-300 rounded-2xl p-6 mb-8">
        <div className="font-bold text-lg mb-4">Your selections</div>
        <div className="mb-4">
          <div className="font-semibold text-base mb-1">Travellers & courses</div>
          <div>
            <span>{selectedPackage ? `${people} x ${selectedPackage.name}` : '-'}</span>
          </div>
        </div>
        <hr className="my-2" />
        <div className="mb-4">
          <div className="font-semibold text-base mb-1">Dates</div>
          <span>{dateLabel}</span>
        </div>
        <hr className="my-2" />
        <div className="mb-4">
          <div className="font-semibold text-base mb-1">Rooms</div>
          <span>
            {roomAssignments && Object.values(roomAssignments).some(n => n > 0)
              ? Object.entries(roomAssignments)
                  .filter(([_, n]) => n > 0)
                  .map(([roomId, n]) => {
                    const room = rooms.find(r => r.id === roomId);
                    return room ? `${n} x ${room.name}` : null;
                  })
                  .filter(Boolean)
                  .join(', ')
              : '-'}
          </span>
        </div>
        <hr className="my-2" />
        <div>
          <div className="font-semibold text-base mb-1">Add-on selection</div>
          {selectedAddOns.length > 0 ? (
            <div className="space-y-1">
              {selectedAddOns.map(id => {
                const addOn = addOns.find(a => a.id === id);
                if (!addOn) return null;
                if (addOn.type === 'per-person') {
                  const count = addOnCounts[id] || 0;
                  if (count === 0) return null;
                  return (
                    <div key={id}>
                      <span>{count} x {addOn.name}</span>
                    </div>
                  );
                } else if (addOn.type === 'per-booking') {
                  return (
                    <div key={id}>
                      <span>{addOn.name}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ) : (
            <span>-</span>
          )}
        </div>
      </div>
      {/* Hide total and button on step 5 (travellers page) */}
      {!pathname.includes('/checkout/5-travellers') && (
        <>
          <div className="flex justify-between items-center mb-6">
            <span className="text-base font-medium">Total amount to pay</span>
            <span className="text-lg font-bold">EUR {summary.total}</span>
          </div>
          <button
            className={`w-full font-bold text-base py-3 rounded-xl mb-6 flex items-center justify-center gap-2 transition-colors ${buttonEnabled ? 'bg-lapoint-red text-white' : 'bg-gray-300 text-gray-400 cursor-not-allowed'}`}
            onClick={onButtonClick}
            disabled={!buttonEnabled}
          >
            {buttonLabel}
          </button>
        </>
      )}
      {!pathname.includes('/checkout/5-travellers') && (
        <>
          <hr className="mb-4" />
          <div className="flex gap-6 justify-center items-center mb-2">
            <img src="/images/paypal.svg" alt="PayPal" className="h-10" />
            <img src="/images/mastercard.svg" alt="Mastercard" className="h-10" />
            <img src="/images/visa.svg" alt="Visa" className="h-10" />
          </div>
        </>
      )}
    </div>
  );
} 