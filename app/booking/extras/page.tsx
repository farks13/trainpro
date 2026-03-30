'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookingHeader } from '@/components/booking/BookingHeader'
import { BookingStepper } from '@/components/booking/BookingStepper'
import { BookingSidebar } from '@/components/booking/BookingSidebar'
import { Minus, Plus } from 'lucide-react'

const extras = [
  {
    id: 'buggy',
    name: 'Golf Buggy Hire',
    subtitle: 'The easiest way to explore the island at your own pace',
    description: 'Pick up from your hotel reception. Includes island map and parking pass. Available for guests 21+ with valid licence.',
    price: 85,
    unit: 'per day',
    imageColor: 'bg-[#A3968A]',
  },
  {
    id: 'snorkel',
    name: 'Great Barrier Reef Snorkeling',
    subtitle: 'Half-day guided reef experience with equipment included',
    description: 'Departs daily at 9am from the marina. Includes snorkel gear, wetsuit, and light refreshments. Suitable for all skill levels.',
    price: 210,
    unit: 'per person',
    imageColor: 'bg-[#5A7B8F]',
  },
  {
    id: 'sail',
    name: 'Sunset Sailing Experience',
    subtitle: 'Sail the Whitsundays as the sun sets over the Coral Sea',
    description: '2-hour cruise departing from the marina at 4:30pm. Includes canapés and sparkling wine. Limited to 12 guests per sailing.',
    price: 165,
    unit: 'per person',
    imageColor: 'bg-[#4D6E82]',
  },
]

export default function ExtrasPage() {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    buggy: 0,
    snorkel: 0,
    sail: 0,
  })

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }))
  }

  const extrasTotal = extras.reduce((sum, extra) => sum + extra.price * (quantities[extra.id] || 0), 0)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <BookingHeader backHref="/booking/checkout" />
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
        {/* Left Column */}
        <div className="flex flex-col flex-1 min-w-0 gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="font-serif text-[28px] font-bold text-[#1A1A1A]">2. Extras</h2>
            <p className="text-sm text-[#666666]">Enhance your stay with these add-ons. You can skip this step if you prefer.</p>
          </div>

          {/* Extra Cards */}
          {extras.map((extra) => (
            <div key={extra.id} className="flex p-6 border border-[#E5E5E5] rounded-xl gap-5">
              <div className={`w-[180px] h-[140px] rounded-lg ${extra.imageColor} shrink-0`} />
              <div className="flex flex-col flex-1 gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <span className="text-[17px] font-semibold text-[#1A1A1A]">{extra.name}</span>
                    <span className="text-[13px] text-[#666666]">{extra.subtitle}</span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[17px] font-semibold text-[#1A1A1A]">${extra.price}</span>
                    <span className="text-xs text-[#999999]">{extra.unit}</span>
                  </div>
                </div>
                <p className="text-[13px] text-[#888888] leading-5">{extra.description}</p>
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQty(extra.id, -1)}
                      className="flex items-center justify-center w-8 h-8 rounded-full border-[1.5px] border-[#D9D9D9] text-[#999999] hover:border-[#999999]"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-[15px] font-medium text-[#1A1A1A] w-4 text-center">
                      {quantities[extra.id]}
                    </span>
                    <button
                      onClick={() => updateQty(extra.id, 1)}
                      className="flex items-center justify-center w-8 h-8 rounded-full border-[1.5px] border-hi-blue text-hi-blue hover:bg-[#F0F5FF]"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="text-[13px] font-medium text-hi-blue underline">View details</button>
                </div>
              </div>
            </div>
          ))}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            <Link
              href="/booking/payment"
              className="px-10 py-3.5 text-sm font-medium text-white bg-hi-blue rounded-full hover:opacity-90"
            >
              Continue to payment
            </Link>
            <Link
              href="/booking/payment"
              className="text-sm font-medium text-hi-blue underline"
            >
              Skip extras
            </Link>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <BookingSidebar
          items={
            extrasTotal > 0
              ? [
                  { label: 'The Sundays — Garden View', detail: '2 nights · 2 adults', price: '$1,000' },
                  ...extras
                    .filter((e) => quantities[e.id] > 0)
                    .map((e) => ({
                      label: e.name,
                      detail: `${quantities[e.id]} × $${e.price}`,
                      price: `$${e.price * quantities[e.id]}`,
                    })),
                ]
              : [
                  { label: 'The Sundays — Garden View', detail: '2 nights · 2 adults', price: '$1,000' },
                  { label: 'No extras added yet', price: '$0', color: 'default' as const },
                ]
          }
          total={`$${1000 + extrasTotal}`}
          deposit={{ label: 'Deposit due today', amount: `$${Math.round((1000 + extrasTotal) * 0.2)}` }}
          showBenefits
        />
      </div>
    </div>
  )
}
