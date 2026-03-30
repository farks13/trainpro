'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { BookingHeader } from '@/components/booking/BookingHeader'
import { BookingStepper } from '@/components/booking/BookingStepper'
import { ChevronDown } from 'lucide-react'

const hotels = [
  {
    id: 1,
    name: 'Beach Club',
    category: 'Luxury Resort',
    description: 'Boutique luxury on Catseye Beach with stunning Coral Sea views, infinity pool, and direct beach access.',
    price: 450,
    tag: 'Hot deal',
    tagColor: 'bg-hi-red',
    imageColor: 'bg-[#5A7B8F]',
  },
  {
    id: 2,
    name: 'Reef View Hotel',
    category: 'Premium Resort',
    description: 'Panoramic views of the Whitsundays from every room. Centrally located with pools, restaurants, and spa.',
    price: 320,
    imageColor: 'bg-[#8B7D6B]',
  },
  {
    id: 3,
    name: 'Palm Bungalows',
    category: 'Island Living',
    description: 'Freestanding Polynesian-style bungalows nestled in tropical gardens. Perfect for a relaxed island stay.',
    price: 280,
    imageColor: 'bg-[#4D6E82]',
  },
]

const packageDeal = {
  name: 'Whitsundays Package',
  description: 'Stay 3 nights at any hotel and receive a complimentary Great Barrier Reef cruise, sunset sailing experience, and daily breakfast.',
  price: 'From $1,200',
  saving: 'Save up to $350',
}

export default function HotelSelectionPage() {
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null)
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
      <BookingHeader backHref="/" />
      <BookingStepper currentStep={1} />

      {/* Search Criteria */}
      <div className="flex items-center justify-center px-[60px] py-4 bg-[#F9F7F2] w-full shrink-0">
        <div ref={dropdownRef} className="flex items-center gap-8 max-w-[1320px] w-full">
          {[
            { label: 'Hotel', value: 'All hotels', options: ['All hotels', 'Beach Club', 'Reef View Hotel', 'Palm Bungalows', 'The Sundays'] },
            { label: 'Dates', value: '28 May — 30 May 2026', options: ['28 May — 30 May 2026', '1 Jun — 3 Jun 2026', '5 Jun — 7 Jun 2026'] },
            { label: 'Guests', value: '2 adults', options: ['1 adult', '2 adults', '2 adults, 1 child', '2 adults, 2 children'] },
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

      {/* Results Bar */}
      <div className="flex flex-col px-[60px] pt-8 pb-4 gap-4 w-full">
        <p className="text-sm text-[#666666] max-w-[1320px] mx-auto w-full">
          4 available hotels and 7 holiday homes match your dates and search criteria
        </p>
        <div className="flex items-center gap-3 max-w-[1320px] mx-auto w-full">
          <button className="px-4 py-2 text-[13px] font-medium text-white bg-hi-blue rounded-full">All properties</button>
          <button className="px-4 py-2 text-[13px] font-medium text-[#666666] border border-[#E5E5E5] rounded-full hover:border-hi-blue hover:text-hi-blue">Hotels</button>
        </div>
      </div>

      {/* Hotel Cards */}
      <div className="flex flex-col px-[60px] gap-4 pb-12 w-full">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className={`flex gap-5 p-5 border rounded-xl max-w-[1320px] mx-auto w-full cursor-pointer transition-colors ${
              selectedHotel === hotel.id ? 'border-hi-blue bg-[#F0F5FF]' : 'border-[#E5E5E5] hover:border-[#BBBBBB]'
            }`}
            onClick={() => setSelectedHotel(hotel.id)}
          >
            <div className={`w-[200px] h-[146px] rounded-lg ${hotel.imageColor} shrink-0 relative`}>
              {hotel.tag && (
                <span className={`absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold text-white ${hotel.tagColor} rounded-full`}>
                  {hotel.tag}
                </span>
              )}
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-medium text-[#999999] uppercase tracking-wider">{hotel.category}</span>
                  <h3 className="text-lg font-semibold text-[#1A1A1A]">{hotel.name}</h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-bold text-[#1A1A1A]">${hotel.price}</span>
                  <span className="text-xs text-[#999999]">per night</span>
                </div>
              </div>
              <p className="text-[13px] text-[#888888] leading-5">{hotel.description}</p>
              <div className="flex items-center gap-3 mt-auto pt-2">
                <Link
                  href="/booking/room-selection"
                  className="px-5 py-2.5 text-[13px] font-medium text-white bg-hi-blue rounded-full hover:opacity-90"
                  onClick={(e) => e.stopPropagation()}
                >
                  Continue
                </Link>
                <button className="text-[13px] font-medium text-hi-blue underline">View hotel</button>
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
                <h3 className="text-lg font-semibold text-[#1A1A1A]">{packageDeal.name}</h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-bold text-[#1A1A1A]">{packageDeal.price}</span>
                <span className="text-xs font-medium text-hi-green">{packageDeal.saving}</span>
              </div>
            </div>
            <p className="text-[13px] text-[#888888] leading-5">{packageDeal.description}</p>
            <div className="flex items-center gap-3 mt-auto pt-2">
              <Link
                href="/booking/room-selection"
                className="px-5 py-2.5 text-[13px] font-medium text-white bg-hi-blue rounded-full hover:opacity-90"
              >
                View package
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
