"use client";

import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useStore } from "../../../store/booking";
import ProgressBar from "../../../components/ProgressBar";
import Image from "next/image";

export default function PaymentStep() {
  const [method, setMethod] = useState("card");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [saveDetails, setSaveDetails] = useState(false);
  const [paypalSuccess, setPaypalSuccess] = useState(false);
  const { summary } = useStore();
  const total = summary?.total || 1144;
  const campName = "Lapoint Canggu";

  return (
    <PayPalScriptProvider options={{ clientId: "sb", currency: "EUR" }}>
      <div className="min-h-screen bg-[#FFF9E8]">
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-16">
          {/* Removed ProgressBar and camp name to avoid duplication */}
          <div className="bg-white rounded-2xl border border-gray-300 p-6 mb-8 max-w-md mx-auto">
            {/* Payment method selection */}
            <div className="flex flex-col gap-0">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="relative">
                    <input type="radio" checked={method === 'card'} onChange={() => setMethod('card')} className="peer appearance-none w-6 h-6 rounded-full border-2 border-blue-500 checked:bg-blue-500 checked:border-blue-500 focus:outline-none" />
                    <span className="absolute left-0 top-0 w-6 h-6 flex items-center justify-center pointer-events-none">
                      {method === 'card' && <span className="block w-3 h-3 rounded-full bg-white border-2 border-blue-500" />}
                    </span>
                  </span>
                  <span className="font-bold text-lg">Pay by card</span>
                </label>
                <div className="flex items-center gap-2">
                  <Image src="/images/visa.svg" alt="Visa" width={32} height={20} />
                  <Image src="/images/mastercard.svg" alt="Mastercard" width={32} height={20} />
                </div>
              </div>
              {/* Card input fields */}
              {method === 'card' && (
                <div className="bg-[#FAFAFA] border border-gray-200 rounded-xl mt-4 mb-2 px-4 py-3 flex flex-col gap-2">
                  <input className="border-0 bg-transparent px-0 py-2 text-base placeholder-gray-400 focus:ring-0 focus:outline-none" placeholder="Card number" />
                  <div className="flex gap-2">
                    <input className="border-0 bg-transparent px-0 py-2 text-base placeholder-gray-400 focus:ring-0 focus:outline-none w-1/2" placeholder="Expiry (mm/yy)" />
                    <input className="border-0 bg-transparent px-0 py-2 text-base placeholder-gray-400 focus:ring-0 focus:outline-none w-1/2" placeholder="CVC" />
                    <button className="ml-2 text-gray-400 text-xl" tabIndex={-1}>?</button>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between pt-4">
                <label className="flex items-center gap-3 cursor-pointer w-full">
                  <span className="relative">
                    <input type="radio" checked={method === 'paypal'} onChange={() => setMethod('paypal')} className="peer appearance-none w-6 h-6 rounded-full border-2 border-gray-400 checked:bg-blue-500 checked:border-blue-500 focus:outline-none" />
                    <span className="absolute left-0 top-0 w-6 h-6 flex items-center justify-center pointer-events-none">
                      {method === 'paypal' && <span className="block w-3 h-3 rounded-full bg-white border-2 border-blue-500" />}
                    </span>
                  </span>
                  <span className="font-bold text-lg">PayPal</span>
                </label>
                <Image src="/images/paypal.svg" alt="PayPal" width={60} height={24} />
              </div>
              {method === 'paypal' && (
                <div className="mt-4">
                  <PayPalButtons
                    style={{ layout: "vertical", color: "blue", shape: "rect", label: "paypal" }}
                    forceReRender={[total]}
                    createOrder={(_data: Record<string, unknown>, actions: any) => {
                      return actions.order.create({
                        purchase_units: [{ amount: { value: total.toString() } }],
                      });
                    }}
                    onApprove={async (_data: Record<string, unknown>, actions: any) => {
                      await actions.order.capture();
                      setPaypalSuccess(true);
                    }}
                  />
                  {paypalSuccess && (
                    <div className="text-green-600 font-bold mt-4">Payment successful! Thank you for your booking.</div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Checkboxes and button */}
          <div className="flex flex-col gap-4 max-w-md mx-auto">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} className="appearance-none w-6 h-6 rounded bg-blue-600 checked:bg-blue-600 border-2 border-blue-600 flex-shrink-0 mt-1 relative" style={{boxShadow: '0 0 0 2px #fff'}} />
              <span className="font-bold text-base leading-tight">I accept the <a href="#" className="underline">Terms & Conditions</a> for sale for Lapoint Travels AS.</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={saveDetails} onChange={e => setSaveDetails(e.target.checked)} className="appearance-none w-6 h-6 rounded bg-blue-600 checked:bg-blue-600 border-2 border-blue-600 flex-shrink-0 mt-1 relative" style={{boxShadow: '0 0 0 2px #fff'}} />
              <span className="font-bold text-base leading-tight">Save my details<br /><span className="font-normal text-sm">I consent to Nets Denmark A/S ("Nets") saving my payment and delivery information and my device ID for the purpose of auto-filling in my details for future purchases in web shops using Nets' online payment solution (as further described in our <a href="#" className="underline">Terms of Use</a>). I can <a href="#" className="underline">withdraw my consent</a> at any time. Read more about how Nets handles personal data in Nets' <a href="#" className="underline">Privacy Notice</a>.</span></span>
            </label>
            <button className="w-full bg-[#0082C9] text-white font-bold text-2xl py-5 rounded-full mt-2 mb-6 flex items-center justify-center gap-2 transition-colors disabled:opacity-50" style={{letterSpacing: 1}} disabled={!acceptTerms}>
              Pay {total} EUR
            </button>
          </div>
          <div className="flex justify-center items-center gap-6 border border-gray-300 rounded-xl py-3 mb-8 bg-white">
            <Image src="/images/mastercard.svg" alt="Mastercard" width={40} height={24} />
            <Image src="/images/visa.svg" alt="Visa" width={40} height={24} />
            <Image src="/images/paypal.svg" alt="PayPal" width={40} height={24} />
          </div>
          <div className="text-center text-gray-500 text-sm max-w-2xl mx-auto">
            If you would like to make it easier when shopping online, Nets can securely store your delivery and payment preferences. We care for your privacy – and we’ll never sell your data. View more in Nets’ <a href="#" className="underline">Privacy Notice</a>. For accessibility updates and feedback, see Nets’ <a href="#" className="underline">Accessibility Statement</a>.
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
} 