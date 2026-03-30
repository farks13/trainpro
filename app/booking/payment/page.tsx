'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookingHeader } from '@/components/booking/BookingHeader'
import { BookingStepper } from '@/components/booking/BookingStepper'
import { BookingSidebar } from '@/components/booking/BookingSidebar'
import { ChevronDown, Lock } from 'lucide-react'

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreeMarketing, setAgreeMarketing] = useState(false)

  const methods = [
    { id: 'credit-card', label: 'Credit Card' },
    { id: 'paypal', label: 'PayPal' },
    { id: 'afterpay', label: 'Afterpay' },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <BookingHeader backHref="/booking/extras" />
      <BookingStepper currentStep={3} />

      {/* Main Content */}
      <div className="flex px-[60px] py-10 gap-10 w-full flex-1">
        {/* Left Column - Payment Form */}
        <div className="flex flex-col flex-1 min-w-0 gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="font-serif text-[28px] font-bold text-[#1A1A1A]">3. Payment</h2>
            <p className="text-sm text-[#666666]">Enter your payment details to complete your booking.</p>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-[#1A1A1A]">Payment method</h3>
            <div className="flex gap-3">
              {methods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`px-5 py-2.5 text-[13px] font-medium rounded-lg border-2 transition-colors ${
                    paymentMethod === m.id
                      ? 'border-hi-blue bg-[#F0F5FF] text-hi-blue font-semibold'
                      : 'border-[#E5E5E5] text-[#666666] hover:border-[#BBBBBB]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Card Details */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold text-[#1A1A1A]">Card details</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#444444]">Card number</label>
              <div className="flex items-center px-4 py-3 border border-[#D9D9D9] rounded-lg gap-2.5">
                <input type="text" placeholder="1234 5678 9012 3456" className="flex-1 text-sm text-[#1A1A1A] placeholder:text-[#BBBBBB] outline-none bg-transparent" />
                <div className="flex gap-1.5 ml-auto">
                  <div className="flex items-center justify-center w-9 h-6 bg-[#1A1F71] rounded text-[9px] font-bold text-white">VISA</div>
                  <div className="flex items-center justify-center w-9 h-6 bg-[#EB001B] rounded text-[8px] font-bold text-white">MC</div>
                  <div className="flex items-center justify-center w-9 h-6 bg-[#006FCF] rounded text-[7px] font-bold text-white">AMEX</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#444444]">Name on card</label>
              <input type="text" placeholder="Full name as shown on card" className="px-4 py-3 border border-[#D9D9D9] rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#BBBBBB] outline-none focus:border-hi-blue" />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[13px] font-medium text-[#444444]">Expiry date</label>
                <input type="text" placeholder="MM / YY" className="px-4 py-3 border border-[#D9D9D9] rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#BBBBBB] outline-none focus:border-hi-blue" />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[13px] font-medium text-[#444444]">CVV</label>
                <input type="text" placeholder="123" className="px-4 py-3 border border-[#D9D9D9] rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#BBBBBB] outline-none focus:border-hi-blue" />
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold text-[#1A1A1A]">Billing address</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#444444]">Country</label>
              <div className="flex items-center justify-between px-4 py-3 border border-[#D9D9D9] rounded-lg cursor-pointer">
                <span className="text-sm text-[#1A1A1A]">Australia</span>
                <ChevronDown className="w-4 h-4 text-[#999999]" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#444444]">Street address</label>
              <input type="text" placeholder="123 Example Street" className="px-4 py-3 border border-[#D9D9D9] rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#BBBBBB] outline-none focus:border-hi-blue" />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-[2]">
                <label className="text-[13px] font-medium text-[#444444]">City</label>
                <input type="text" placeholder="Sydney" className="px-4 py-3 border border-[#D9D9D9] rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#BBBBBB] outline-none focus:border-hi-blue" />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[13px] font-medium text-[#444444]">State</label>
                <div className="flex items-center justify-between px-4 py-3 border border-[#D9D9D9] rounded-lg cursor-pointer">
                  <span className="text-sm text-[#BBBBBB]">NSW</span>
                  <ChevronDown className="w-4 h-4 text-[#999999]" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[13px] font-medium text-[#444444]">Postcode</label>
                <input type="text" placeholder="2000" className="px-4 py-3 border border-[#D9D9D9] rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#BBBBBB] outline-none focus:border-hi-blue" />
              </div>
            </div>
          </div>

          {/* Terms & Pay */}
          <div className="flex flex-col gap-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-[#D9D9D9] accent-hi-blue shrink-0"
              />
              <span className="text-[13px] text-[#666666] leading-5">
                I agree to the{' '}
                <button className="text-hi-blue underline">Terms & Conditions</button>,{' '}
                <button className="text-hi-blue underline">Privacy Policy</button>, and{' '}
                <button className="text-hi-blue underline">Cancellation Policy</button>.
                I understand that a 20% deposit is due today with the remaining balance due 30 days prior to arrival.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeMarketing}
                onChange={(e) => setAgreeMarketing(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-[#D9D9D9] accent-hi-blue shrink-0"
              />
              <span className="text-[13px] text-[#666666] leading-5">
                Subscribe to Hamilton Island emails for exclusive offers and travel inspiration.
              </span>
            </label>

            {agreeTerms ? (
              <Link
                href="/booking/confirmation"
                className="block w-full py-4 text-[15px] font-medium text-white bg-hi-blue rounded-full hover:opacity-90 text-center"
              >
                Pay $260 deposit now
              </Link>
            ) : (
              <div className="w-full py-4 text-[15px] font-medium text-white bg-hi-blue rounded-full opacity-50 text-center cursor-not-allowed">
                Pay $260 deposit now
              </div>
            )}

            <div className="flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-[#999999]" />
              <span className="text-xs text-[#999999]">Secured with 256-bit SSL encryption</span>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <BookingSidebar
          items={[
            { label: 'The Sundays — Garden View', detail: '2 nights · 2 adults', price: '$1,000' },
            { label: 'Great Barrier Reef Snorkeling', detail: '2 guests', price: '$420' },
            { label: 'Package discount', price: '-$120', color: 'green' },
          ]}
          total="$1,300"
          deposit={{ label: 'Deposit due today', amount: '$260' }}
          balance={{ label: 'Remaining balance due by 28 Apr 2026', amount: '$1,040' }}
        />
      </div>
    </div>
  )
}
