"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../../store/booking";
import BookingSummary from "../../../components/BookingSummary";

const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];
const surfLevels = ["Beginner", "Intermediate", "Advanced"];
const genders = ["Male", "Female", "Other"];

export default function TravellersStep() {
  const { people, summary } = useStore();
  const router = useRouter();
  const [showDiscount, setShowDiscount] = useState(false);
  const [showGiftcard, setShowGiftcard] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [giftcard, setGiftcard] = useState("");
  // State for all travellers
  const [travellers, setTravellers] = useState(() => Array.from({ length: people }, () => ({
    firstName: '',
    lastName: '',
    email: '',
    year: '',
    month: '',
    day: '',
    country: '',
    mobile: '',
    surfLevel: '',
    gender: '',
  })));
  // Update state if people count changes
  React.useEffect(() => {
    setTravellers(prev => {
      if (prev.length === people) return prev;
      if (prev.length < people) {
        return [...prev, ...Array.from({ length: people - prev.length }, () => ({
          firstName: '', lastName: '', email: '', year: '', month: '', day: '', country: '', mobile: '', surfLevel: '', gender: ''
        }))];
      }
      return prev.slice(0, people);
    });
  }, [people]);
  // Validation
  const formComplete = travellers.every(t =>
    t.firstName && t.lastName && t.email && t.year && t.month && t.day && t.country && t.mobile && t.surfLevel && t.gender
  );
  // Handlers
  const handleTravellerChange = (idx: number, field: string, value: string) => {
    setTravellers(prev => prev.map((t, i) => i === idx ? { ...t, [field]: value } : t));
  };
  const handlePaymentNavigation = () => {
    router.push('/checkout/6-payment');
  };
  return (
    <div className="flex flex-col md:flex-row gap-12 min-h-screen max-w-7xl mx-auto px-4">
      <div className="w-full md:w-[70%] py-8">
        {travellers.map((t, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-300 p-8 mb-8">
            <h2 className="text-xl font-bold mb-6">Traveller # {idx + 1} <span className="font-normal">Information</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input className="border rounded-lg px-4 py-3" placeholder="First name" value={t.firstName} onChange={e => handleTravellerChange(idx, 'firstName', e.target.value)} />
              <input className="border rounded-lg px-4 py-3" placeholder="Last name" value={t.lastName} onChange={e => handleTravellerChange(idx, 'lastName', e.target.value)} />
              <input className="border rounded-lg px-4 py-3" placeholder="E-mail" value={t.email} onChange={e => handleTravellerChange(idx, 'email', e.target.value)} />
              <div className="flex gap-2">
                <select className="border rounded-lg px-2 py-3 w-1/3" value={t.year} onChange={e => handleTravellerChange(idx, 'year', e.target.value)}>
                  <option value="">Year</option>
                  {years.map(y => <option key={y}>{y}</option>)}
                </select>
                <select className="border rounded-lg px-2 py-3 w-1/3" value={t.month} onChange={e => handleTravellerChange(idx, 'month', e.target.value)}>
                  <option value="">Month</option>
                  {months.map((m, i) => <option key={i}>{m}</option>)}
                </select>
                <select className="border rounded-lg px-2 py-3 w-1/3" value={t.day} onChange={e => handleTravellerChange(idx, 'day', e.target.value)}>
                  <option value="">Day</option>
                  {days.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <select className="border rounded-lg px-4 py-3" value={t.country} onChange={e => handleTravellerChange(idx, 'country', e.target.value)}>
                <option value="">Country</option>
                {countries.map(c => <option key={c}>{c}</option>)}
              </select>
              <input className="border rounded-lg px-4 py-3" placeholder="Mobile phone" value={t.mobile} onChange={e => handleTravellerChange(idx, 'mobile', e.target.value)} />
            </div>
            <div className="mb-4">
              <div className="font-bold mb-2">Packages & Surf level</div>
              <div className="text-gray-600 text-sm mb-2">We ask for surf level to be able to accommodate you in suitable courses (not for Essential package/Surf Guiding). This can always be changed during your stay.</div>
              <select className="border rounded-lg px-4 py-3 w-full" value={t.surfLevel} onChange={e => handleTravellerChange(idx, 'surfLevel', e.target.value)}>
                <option value="">Select level</option>
                {surfLevels.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="mb-2">
              <div className="font-bold mb-2">Gender</div>
              <div className="text-gray-600 text-sm mb-2">We request gender information to help us organize room arrangements with care and consideration for all guests to feel welcomed.</div>
              <select className="border rounded-lg px-4 py-3 w-full" value={t.gender} onChange={e => handleTravellerChange(idx, 'gender', e.target.value)}>
                <option value="">Gender</option>
                {genders.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full md:w-[25%] flex-shrink-0 mt-8">
        <BookingSummary />
        {/* Total amount to pay section below add giftcard */}
        <div className="flex justify-between items-center mb-6 mt-4">
          <span className="text-base font-medium">Total amount to pay</span>
          <span className="text-lg font-bold">EUR {summary.total}</span>
        </div>
        {/* Discount code toggle */}
        <div className="mb-4">
          <div className={`transition-all ${showDiscount ? 'rounded-2xl border border-lapoint-border bg-[#FFFCF5]' : 'rounded-2xl border border-lapoint-border bg-[#FFFCF5]'}`}>
            <button
              className="w-full flex items-center justify-between px-6 py-4 font-semibold text-lg focus:outline-none rounded-2xl"
              style={{ fontFamily: 'Nunito, sans-serif' }}
              onClick={() => setShowDiscount(v => !v)}
            >
              Add discount code
              <span className="text-base text-gray-500">{showDiscount ? '▲' : '▼'}</span>
            </button>
            {showDiscount && (
              <div className="px-4 pb-4">
                <input
                  className="border border-lapoint-border rounded-xl px-4 py-3 w-full mb-4 bg-[#FFFCF5] mt-4"
                  placeholder="Enter discount code"
                  value={discountCode}
                  onChange={e => setDiscountCode(e.target.value)}
                />
                <button className="w-full bg-lapoint-red text-white font-bold text-base py-3 rounded-full flex items-center justify-center gap-2">
                  ADD CODE <span className="text-2xl leading-none">+</span>
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Giftcard toggle */}
        <div className="mb-4">
          <div className={`transition-all ${showGiftcard ? 'rounded-2xl border border-lapoint-border bg-[#FFFCF5]' : 'rounded-2xl border border-lapoint-border bg-[#FFFCF5]'}`}>
            <button
              className="w-full flex items-center justify-between px-6 py-4 font-semibold text-lg focus:outline-none rounded-2xl"
              style={{ fontFamily: 'Nunito, sans-serif' }}
              onClick={() => setShowGiftcard(v => !v)}
            >
              Add giftcard
              <span className="text-base text-gray-500">{showGiftcard ? '▲' : '▼'}</span>
            </button>
            {showGiftcard && (
              <div className="px-4 pb-4">
                <input
                  className="border border-lapoint-border rounded-xl px-4 py-3 w-full mb-4 bg-[#FFFCF5] mt-4"
                  placeholder="Enter giftcard code"
                  value={giftcard}
                  onChange={e => setGiftcard(e.target.value)}
                />
                <button className="w-full bg-lapoint-red text-white font-bold text-base py-3 rounded-full flex items-center justify-center gap-2">
                  ADD GIFTCARD <span className="text-2xl leading-none">+</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2 mt-4">
          <input type="checkbox" className="form-checkbox h-5 w-5" />
          <span className="text-sm">I hereby accept <a href="#" className="underline text-lapoint-red">Lapoints terms & conditions</a> and <a href="#" className="underline text-lapoint-red">privacy policy</a>.</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <input type="checkbox" className="form-checkbox h-5 w-5" />
          <span className="text-sm">I want to join the <a href="#" className="underline text-lapoint-red">Lapoint Membership community</a> (it's free!) and receive specialized discounts and benefits via email. You can unsubscribe at any time.</span>
        </div>
        {/* Payment buttons and info */}
        <div className="mb-4">
          <button className="w-full font-bold text-base py-3 rounded-xl mb-4 flex items-center justify-center gap-2 transition-colors bg-white text-lapoint-red border border-lapoint-red disabled:opacity-50 disabled:cursor-not-allowed" type="button" disabled={!formComplete} onClick={handlePaymentNavigation}>
            PAY DEPOSIT EUR 300 <span className="text-2xl">→</span>
          </button>
          <button className="w-full font-bold text-base py-3 rounded-xl mb-4 flex items-center justify-center gap-2 transition-colors bg-lapoint-red text-white disabled:opacity-50 disabled:cursor-not-allowed" type="button" disabled={!formComplete} onClick={handlePaymentNavigation}>
            PAY IN FULL EUR {summary.total} <span className="text-2xl">→</span>
          </button>
          <div className="text-base text-lapoint-dark mb-6">
            If you choose to pay the deposit you will have to pay the remaining EUR 844 no later than Aug 4, 2025.
          </div>
          <hr className="my-4 border-gray-200" />
          <div className="flex gap-6 justify-center items-center mb-2">
            <img src="/images/paypal.svg" alt="PayPal" className="h-10" />
            <img src="/images/mastercard.svg" alt="Mastercard" className="h-10" />
            <img src="/images/visa.svg" alt="Visa" className="h-10" />
          </div>
          <hr className="my-4 border-gray-200" />
        </div>
      </div>
    </div>
  );
} 