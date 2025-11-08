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
  const { people, summary, setTraveller } = useStore();
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
  // Validation functions
  const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return false;
    // Remove spaces, dashes, and parentheses
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    // Check if it contains only digits and has reasonable length (7-15 digits)
    return /^\d{7,15}$/.test(cleaned);
  };

  const validateName = (name: string): boolean => {
    if (!name) return false;
    // Name should contain at least one letter and be at least 2 characters
    const trimmed = name.trim();
    return trimmed.length >= 2 && /[a-zA-Z]/.test(trimmed);
  };

  const validateDate = (year: string, month: string, day: string): boolean => {
    if (!year || !month || !day) return false;
    const yearNum = parseInt(year);
    const monthNum = months.indexOf(month) + 1;
    const dayNum = parseInt(day);
    
    // Check if date is valid
    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (date.getFullYear() !== yearNum || date.getMonth() !== monthNum - 1 || date.getDate() !== dayNum) {
      return false; // Invalid date (e.g., Feb 30)
    }
    
    // Check if date is not in the future
    const today = new Date();
    if (date > today) return false;
    
    // Check if age is reasonable (between 1 and 120 years)
    const age = today.getFullYear() - yearNum;
    if (age < 1 || age > 120) return false;
    
    return true;
  };

  // Get validation errors for a traveller
  const getTravellerErrors = (t: typeof travellers[0]) => {
    const errors: Record<string, string> = {};
    
    if (!validateName(t.firstName)) {
      errors.firstName = 'First name must be at least 2 characters and contain letters';
    }
    if (!validateName(t.lastName)) {
      errors.lastName = 'Last name must be at least 2 characters and contain letters';
    }
    if (!validateEmail(t.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!validatePhone(t.mobile)) {
      errors.mobile = 'Please enter a valid phone number (7-15 digits)';
    }
    if (!validateDate(t.year, t.month, t.day)) {
      errors.dateOfBirth = 'Please enter a valid date of birth (not in the future, age 1-120)';
    }
    if (!t.country) {
      errors.country = 'Please select a country';
    }
    if (!t.surfLevel) {
      errors.surfLevel = 'Please select a surf level';
    }
    if (!t.gender) {
      errors.gender = 'Please select a gender';
    }
    
    return errors;
  };

  // Validation state
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});

  // Validate all travellers
  const validateAllTravellers = (): boolean => {
    const newErrors: Record<number, Record<string, string>> = {};
    let isValid = true;

    travellers.forEach((t, idx) => {
      const travellerErrors = getTravellerErrors(t);
      if (Object.keys(travellerErrors).length > 0) {
        newErrors[idx] = travellerErrors;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Check if all required fields are filled (basic check)
  const allFieldsFilled = travellers.every(t =>
    t.firstName && t.lastName && t.email && t.year && t.month && t.day && t.country && t.mobile && t.surfLevel && t.gender
  );

  // Check if there are any validation errors
  const hasValidationErrors = Object.keys(errors).length > 0;

  // Form is complete only if all fields are filled AND there are no validation errors
  const formComplete = allFieldsFilled && !hasValidationErrors;

  // Handlers
  const handleTravellerChange = (idx: number, field: string, value: string) => {
    setTravellers(prev => prev.map((t, i) => i === idx ? { ...t, [field]: value } : t));
    // Clear error for this field when user starts typing
    if (errors[idx] && errors[idx][field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors[idx]) {
          const { [field]: _, ...rest } = newErrors[idx];
          newErrors[idx] = rest;
          if (Object.keys(newErrors[idx]).length === 0) {
            delete newErrors[idx];
          }
        }
        return newErrors;
      });
    }
  };

  const handlePaymentNavigation = () => {
    // Validate all fields before navigating
    if (!validateAllTravellers()) {
      // Scroll to first error
      const firstErrorIndex = Object.keys(errors)[0];
      if (firstErrorIndex) {
        const element = document.getElementById(`traveller-${firstErrorIndex}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Save all traveller data to store before navigating
    travellers.forEach((t, idx) => {
      const fullName = `${t.firstName} ${t.lastName}`.trim();
      setTraveller(idx, {
        name: fullName || 'Guest',
        firstName: t.firstName,
        lastName: t.lastName,
        email: t.email,
        year: t.year,
        month: t.month,
        day: t.day,
        country: t.country,
        mobile: t.mobile,
        phone: t.mobile,
        surfLevel: t.surfLevel,
        gender: t.gender,
      });
    });
    router.push('/checkout/6-payment');
  };
  return (
    <div className="flex flex-col md:flex-row gap-12 min-h-screen max-w-7xl mx-auto px-4">
      <div className="w-full md:w-[70%] py-8">
        {travellers.map((t, idx) => (
          <div key={idx} id={`traveller-${idx}`} className="bg-white rounded-2xl border border-gray-300 p-8 mb-8">
            <h2 className="text-xl font-bold mb-6">Traveller # {idx + 1} <span className="font-normal">Information</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <input 
                  type="text"
                  className={`border rounded-lg px-4 py-3 w-full ${errors[idx]?.firstName ? 'border-red-500' : ''}`} 
                  placeholder="First name" 
                  value={t.firstName} 
                  onChange={e => handleTravellerChange(idx, 'firstName', e.target.value)}
                  onBlur={() => {
                    if (t.firstName) {
                      const travellerErrors = getTravellerErrors(t);
                      if (travellerErrors.firstName) {
                        setErrors(prev => ({ ...prev, [idx]: { ...prev[idx], firstName: travellerErrors.firstName } }));
                      }
                    }
                  }}
                />
                {errors[idx]?.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors[idx].firstName}</p>
                )}
              </div>
              <div>
                <input 
                  type="text"
                  className={`border rounded-lg px-4 py-3 w-full ${errors[idx]?.lastName ? 'border-red-500' : ''}`} 
                  placeholder="Last name" 
                  value={t.lastName} 
                  onChange={e => handleTravellerChange(idx, 'lastName', e.target.value)}
                  onBlur={() => {
                    if (t.lastName) {
                      const travellerErrors = getTravellerErrors(t);
                      if (travellerErrors.lastName) {
                        setErrors(prev => ({ ...prev, [idx]: { ...prev[idx], lastName: travellerErrors.lastName } }));
                      }
                    }
                  }}
                />
                {errors[idx]?.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors[idx].lastName}</p>
                )}
              </div>
              <div>
                <input 
                  type="email"
                  className={`border rounded-lg px-4 py-3 w-full ${errors[idx]?.email ? 'border-red-500' : ''}`} 
                  placeholder="E-mail" 
                  value={t.email} 
                  onChange={e => handleTravellerChange(idx, 'email', e.target.value)}
                  onBlur={() => {
                    if (t.email) {
                      const travellerErrors = getTravellerErrors(t);
                      if (travellerErrors.email) {
                        setErrors(prev => ({ ...prev, [idx]: { ...prev[idx], email: travellerErrors.email } }));
                      }
                    }
                  }}
                />
                {errors[idx]?.email && (
                  <p className="text-red-500 text-sm mt-1">{errors[idx].email}</p>
                )}
              </div>
              <div>
                <div className="flex gap-2">
                  <select 
                    className={`border rounded-lg px-2 py-3 w-1/3 ${errors[idx]?.dateOfBirth ? 'border-red-500' : ''}`} 
                    value={t.year} 
                    onChange={e => {
                      handleTravellerChange(idx, 'year', e.target.value);
                      // Validate date when all parts are filled
                      if (e.target.value && t.month && t.day) {
                        const updatedTraveller = { ...t, year: e.target.value };
                        const travellerErrors = getTravellerErrors(updatedTraveller);
                        if (travellerErrors.dateOfBirth) {
                          setErrors(prev => ({ ...prev, [idx]: { ...prev[idx], dateOfBirth: travellerErrors.dateOfBirth } }));
                        } else if (errors[idx]?.dateOfBirth) {
                          setErrors(prev => {
                            const newErrors = { ...prev };
                            if (newErrors[idx]) {
                              const { dateOfBirth: _, ...rest } = newErrors[idx];
                              newErrors[idx] = rest;
                              if (Object.keys(newErrors[idx]).length === 0) {
                                delete newErrors[idx];
                              }
                            }
                            return newErrors;
                          });
                        }
                      }
                    }}
                  >
                    <option value="">Year</option>
                    {years.map(y => <option key={y}>{y}</option>)}
                  </select>
                  <select 
                    className={`border rounded-lg px-2 py-3 w-1/3 ${errors[idx]?.dateOfBirth ? 'border-red-500' : ''}`} 
                    value={t.month} 
                    onChange={e => {
                      handleTravellerChange(idx, 'month', e.target.value);
                      // Validate date when all parts are filled
                      if (t.year && e.target.value && t.day) {
                        const updatedTraveller = { ...t, month: e.target.value };
                        const travellerErrors = getTravellerErrors(updatedTraveller);
                        if (travellerErrors.dateOfBirth) {
                          setErrors(prev => ({ ...prev, [idx]: { ...prev[idx], dateOfBirth: travellerErrors.dateOfBirth } }));
                        } else if (errors[idx]?.dateOfBirth) {
                          setErrors(prev => {
                            const newErrors = { ...prev };
                            if (newErrors[idx]) {
                              const { dateOfBirth: _, ...rest } = newErrors[idx];
                              newErrors[idx] = rest;
                              if (Object.keys(newErrors[idx]).length === 0) {
                                delete newErrors[idx];
                              }
                            }
                            return newErrors;
                          });
                        }
                      }
                    }}
                  >
                    <option value="">Month</option>
                    {months.map((m, i) => <option key={i}>{m}</option>)}
                  </select>
                  <select 
                    className={`border rounded-lg px-2 py-3 w-1/3 ${errors[idx]?.dateOfBirth ? 'border-red-500' : ''}`} 
                    value={t.day} 
                    onChange={e => {
                      handleTravellerChange(idx, 'day', e.target.value);
                      // Validate date when all parts are filled
                      if (t.year && t.month && e.target.value) {
                        const updatedTraveller = { ...t, day: e.target.value };
                        const travellerErrors = getTravellerErrors(updatedTraveller);
                        if (travellerErrors.dateOfBirth) {
                          setErrors(prev => ({ ...prev, [idx]: { ...prev[idx], dateOfBirth: travellerErrors.dateOfBirth } }));
                        } else if (errors[idx]?.dateOfBirth) {
                          setErrors(prev => {
                            const newErrors = { ...prev };
                            if (newErrors[idx]) {
                              const { dateOfBirth: _, ...rest } = newErrors[idx];
                              newErrors[idx] = rest;
                              if (Object.keys(newErrors[idx]).length === 0) {
                                delete newErrors[idx];
                              }
                            }
                            return newErrors;
                          });
                        }
                      }
                    }}
                  >
                    <option value="">Day</option>
                    {days.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                {errors[idx]?.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">{errors[idx].dateOfBirth}</p>
                )}
              </div>
              <div>
                <select 
                  className={`border rounded-lg px-4 py-3 w-full ${errors[idx]?.country ? 'border-red-500' : ''}`} 
                  value={t.country} 
                  onChange={e => handleTravellerChange(idx, 'country', e.target.value)}
                >
                  <option value="">Country</option>
                  {countries.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors[idx]?.country && (
                  <p className="text-red-500 text-sm mt-1">{errors[idx].country}</p>
                )}
              </div>
              <div>
                <input 
                  type="tel"
                  className={`border rounded-lg px-4 py-3 w-full ${errors[idx]?.mobile ? 'border-red-500' : ''}`} 
                  placeholder="Mobile phone" 
                  value={t.mobile} 
                  onChange={e => handleTravellerChange(idx, 'mobile', e.target.value)}
                  onBlur={() => {
                    if (t.mobile) {
                      const travellerErrors = getTravellerErrors(t);
                      if (travellerErrors.mobile) {
                        setErrors(prev => ({ ...prev, [idx]: { ...prev[idx], mobile: travellerErrors.mobile } }));
                      }
                    }
                  }}
                />
                {errors[idx]?.mobile && (
                  <p className="text-red-500 text-sm mt-1">{errors[idx].mobile}</p>
                )}
              </div>
            </div>
            <div className="mb-4">
              <div className="font-bold mb-2">Packages & Surf level</div>
              <div className="text-gray-600 text-sm mb-2">We ask for surf level to be able to accommodate you in suitable courses (not for Essential package/Surf Guiding). This can always be changed during your stay.</div>
              <select 
                className={`border rounded-lg px-4 py-3 w-full ${errors[idx]?.surfLevel ? 'border-red-500' : ''}`} 
                value={t.surfLevel} 
                onChange={e => handleTravellerChange(idx, 'surfLevel', e.target.value)}
              >
                <option value="">Select level</option>
                {surfLevels.map(l => <option key={l}>{l}</option>)}
              </select>
              {errors[idx]?.surfLevel && (
                <p className="text-red-500 text-sm mt-1">{errors[idx].surfLevel}</p>
              )}
            </div>
            <div className="mb-2">
              <div className="font-bold mb-2">Gender</div>
              <div className="text-gray-600 text-sm mb-2">We request gender information to help us organize room arrangements with care and consideration for all guests to feel welcomed.</div>
              <select 
                className={`border rounded-lg px-4 py-3 w-full ${errors[idx]?.gender ? 'border-red-500' : ''}`} 
                value={t.gender} 
                onChange={e => handleTravellerChange(idx, 'gender', e.target.value)}
              >
                <option value="">Gender</option>
                {genders.map(g => <option key={g}>{g}</option>)}
              </select>
              {errors[idx]?.gender && (
                <p className="text-red-500 text-sm mt-1">{errors[idx].gender}</p>
              )}
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
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm font-semibold">Please fix the errors above before proceeding</p>
            </div>
          )}
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