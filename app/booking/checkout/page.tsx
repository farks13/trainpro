'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookingHeader } from '@/components/booking/BookingHeader'
import { BookingStepper } from '@/components/booking/BookingStepper'
import { BookingSidebar } from '@/components/booking/BookingSidebar'

export default function CheckoutDetailsPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <BookingHeader backHref="/booking/room-selection" />
      <BookingStepper currentStep={3} />

      {/* Login Bar */}
      <div className="flex items-center justify-center px-[60px] py-3.5 bg-[#F2F2F2] w-full shrink-0 gap-1.5">
        <span className="text-[13px] text-[#666666]">Already a member?</span>
        <button className="text-[13px] font-medium text-hi-blue underline">Log in</button>
        <span className="text-[13px] text-[#666666]">for a faster checkout experience</span>
      </div>

      {/* Savings Callout */}
      <div className="flex items-center justify-center px-[60px] py-3.5 bg-hi-yellow w-full shrink-0 gap-2">
        <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="8" stroke="#B8860B" strokeWidth="1.5" />
          <path d="M9 5v4M9 11.5v.5" stroke="#B8860B" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-[13px] text-[#8B6914]">
          You&apos;re saving <strong>$120</strong> with your current selection. Complete checkout to lock in this price.
        </span>
      </div>

      {/* Main Content */}
      <div className="flex px-[60px] py-10 gap-10 w-full flex-1">
        {/* Left Column - Form */}
        <div className="flex flex-col flex-1 min-w-0 gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="font-serif text-[28px] font-bold text-[#1A1A1A]">1. Details</h2>
            <p className="text-sm text-[#666666]">Tell us who&apos;s travelling so we can personalise your stay.</p>
          </div>

          {/* Guest Details */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold text-[#1A1A1A]">Guest details</h3>
            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[13px] font-medium text-[#444444]">First name</label>
                <input
                  type="text"
                  placeholder="John"
                  value={form.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  className="px-4 py-3 border border-[#D9D9D9] rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#BBBBBB] outline-none focus:border-hi-blue"
                />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[13px] font-medium text-[#444444]">Last name</label>
                <input
                  type="text"
                  placeholder="Smith"
                  value={form.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  className="px-4 py-3 border border-[#D9D9D9] rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#BBBBBB] outline-none focus:border-hi-blue"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#444444]">Email address</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="px-4 py-3 border border-[#D9D9D9] rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#BBBBBB] outline-none focus:border-hi-blue"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#444444]">Phone number</label>
              <input
                type="tel"
                placeholder="+61 412 345 678"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="px-4 py-3 border border-[#D9D9D9] rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#BBBBBB] outline-none focus:border-hi-blue"
              />
            </div>
          </div>

          <Link
            href="/booking/extras"
            className="self-start px-10 py-3.5 text-sm font-medium text-white bg-hi-blue rounded-full hover:opacity-90"
          >
            Continue to extras
          </Link>
        </div>

        {/* Right Column - Sidebar */}
        <BookingSidebar
          items={[
            { label: 'The Sundays — Garden View', detail: '2 nights · 2 adults', price: '$1,000' },
            { label: 'Snorkeling', detail: '2 guests', price: '$210' },
          ]}
          total="$1,210"
          deposit={{ label: 'Deposit due today', amount: '$242' }}
          showBenefits
        />
      </div>
    </div>
  )
}
