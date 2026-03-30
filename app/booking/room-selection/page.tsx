'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { BookingHeader } from '@/components/booking/BookingHeader'
import { BookingStepper } from '@/components/booking/BookingStepper'
import { ChevronDown } from 'lucide-react'

const rooms = [
  {
    id: 1,
    name: 'Garden View Room',
    description: 'Spacious room overlooking lush tropical gardens with private balcony. King bed, ensuite bathroom, and minibar.',
    price: 500,
    memberPrice: 450,
    tags: ['Promotion', 'Hot deal'],
    imageColor: 'bg-[#5A7B8F]',
  },
  {
    id: 2,
    name: 'Ocean View Suite',
    description: 'Premium suite with panoramic Coral Sea views, separate living area, and luxury amenities throughout.',
    price: 720,
    memberPrice: 650,
    tags: [],
    imageColor: 'bg-[#8B7D6B]',
  },
]

export default function RoomSelectionPage() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <BookingHeader backHref="/booking/hotel-selection" />
      <BookingStepper currentStep={2} />

      {/* Search Criteria */}
      <div className="flex items-center justify-center px-[60px] py-4 bg-[#F9F7F2] w-full shrink-0">
        <div ref={dropdownRef} className="flex items-center gap-8 max-w-[1320px] w-full">
          {[
            { label: 'Hotel', value: 'The Sundays', options: ['Beach Club', 'Reef View Hotel', 'Palm Bungalows', 'The Sundays'] },
            { label: 'Dates', value: '28 May — 30 May 2026', options: ['28 May — 30 May 2026', '1 Jun — 3 Jun 2026', '5 Jun — 7 Jun 2026'] },
            { label: 'Guests', value: '2 adults', options: ['1 adult', '2 adults', '2 adults, 1 child', '2 adults, 2 children'] },
            { label: 'Ages', value: '30, 28', options: ['30, 28', '25, 25', '35, 32'] },
          ].map((field) => (
            <div key={field.label} className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === field.label ? null : field.label)}
                className="flex items-center gap-3 hover:opacity-70 transition-opacity"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-medium text-[#999999] uppercase tracking-wider">{field.label}</span>
                  <span className="text-sm font-medium text-[#1A1A1A]">{field.value}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#999999] transition-transform ${openDropdown === field.label ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === field.label && (
                <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-white rounded-lg shadow-lg border border-[#E5E5E5] py-1 z-50">
                  {field.options.map((opt) => (
                    <button
                      key={opt}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#F5F5F5] transition-colors ${
                        opt === field.value ? 'text-hi-blue font-medium' : 'text-[#1A1A1A]'
                      }`}
                      onClick={() => setOpenDropdown(null)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="flex flex-col px-[60px] pt-8 gap-4 w-full">
        <p className="text-sm text-[#666666] max-w-[1320px] mx-auto w-full">
          3 holiday homes match your dates and search criteria
        </p>
        <div className="flex items-center gap-3 max-w-[1320px] mx-auto w-full">
          <button className="px-4 py-2 text-[13px] font-medium text-white bg-hi-blue rounded-full">All rooms</button>
          <button className="px-4 py-2 text-[13px] font-medium text-[#666666] border border-[#E5E5E5] rounded-full">Suites</button>
        </div>
      </div>

      {/* Discount Banner */}
      <div className="flex items-center justify-center px-[60px] py-3 mt-4 w-full">
        <div className="flex items-center gap-2 px-5 py-3 bg-hi-yellow rounded-lg max-w-[1320px] w-full">
          <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8" stroke="#B8860B" strokeWidth="1.5" />
            <path d="M9 5v4M9 11.5v.5" stroke="#B8860B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[13px] text-[#8B6914]">
            Save <strong>10%</strong> on your room when you book directly. Member pricing shown below.
          </span>
        </div>
      </div>

      {/* Room Cards */}
      <div className="flex flex-col px-[60px] gap-4 py-6 pb-12 w-full">
        {rooms.map((room) => (
          <div key={room.id} className="flex gap-5 p-5 border border-[#E5E5E5] rounded-xl max-w-[1320px] mx-auto w-full hover:border-[#BBBBBB] transition-colors">
            <div className={`w-[200px] h-[146px] rounded-lg ${room.imageColor} shrink-0 relative`}>
              {room.tags.map((tag, i) => (
                <span
                  key={tag}
                  className={`absolute ${i === 0 ? 'top-3' : 'top-10'} left-3 px-2.5 py-1 text-[11px] font-semibold rounded-full ${
                    tag === 'Hot deal' ? 'bg-hi-red text-white' : 'bg-hi-blue text-white'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">{room.name}</h3>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#999999] line-through">${room.price}</span>
                    <span className="text-xl font-bold text-[#1A1A1A]">${room.memberPrice}</span>
                  </div>
                  <span className="text-xs text-[#999999]">per night</span>
                  <span className="text-xs font-medium text-hi-green">Member price</span>
                </div>
              </div>
              <p className="text-[13px] text-[#888888] leading-5">{room.description}</p>
              <div className="flex items-center gap-3 mt-auto pt-2">
                <Link
                  href="/booking/checkout"
                  className="px-5 py-2.5 text-[13px] font-medium text-white bg-hi-blue rounded-full hover:opacity-90"
                >
                  Continue
                </Link>
                <button className="text-[13px] font-medium text-hi-blue underline">View room</button>
              </div>
            </div>
          </div>
        ))}

        {/* Package Card */}
        <div className="flex gap-5 p-5 border border-[#E5E5E5] rounded-xl bg-hi-cream max-w-[1320px] mx-auto w-full">
          <div className="w-[200px] h-[146px] rounded-lg bg-[#A3968A] shrink-0" />
          <div className="flex flex-col flex-1 gap-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-medium text-hi-blue uppercase tracking-wider">Package</span>
                <h3 className="text-lg font-semibold text-[#1A1A1A]">Whitsundays Escape Package</h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-bold text-[#1A1A1A]">From $1,200</span>
                <span className="text-xs font-medium text-hi-green">Save up to $350</span>
              </div>
            </div>
            <p className="text-[13px] text-[#888888] leading-5">
              Includes Garden View Room, Great Barrier Reef cruise, and daily breakfast for your entire stay.
            </p>
            <div className="flex items-center gap-3 mt-auto pt-2">
              <button className="px-5 py-2.5 text-[13px] font-medium text-white bg-hi-blue rounded-full hover:opacity-90">
                View package
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
