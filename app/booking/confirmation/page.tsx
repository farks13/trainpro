'use client'

import { BookingHeader } from '@/components/booking/BookingHeader'
import { BookingStepper } from '@/components/booking/BookingStepper'
import { BookingSidebar } from '@/components/booking/BookingSidebar'
import { Check, Calendar, Download, Briefcase } from 'lucide-react'

const activities = [
  {
    title: 'Reef Experiences',
    description: 'Snorkel, dive, or sail the Great Barrier Reef',
    cta: 'Explore',
    imageColor: 'bg-[#5A7B8F]',
  },
  {
    title: 'Island Dining',
    description: 'Reserve a table at our award-winning restaurants',
    cta: 'View restaurants',
    imageColor: 'bg-[#8B7D6B]',
  },
  {
    title: 'Getting Here',
    description: 'Flights, ferries, and transfers to the island',
    cta: 'Plan travel',
    imageColor: 'bg-[#4D6E82]',
  },
]

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <BookingHeader showBack={false} />
      <BookingStepper currentStep={5} />

      {/* Success Banner */}
      <div className="flex flex-col items-center px-[60px] py-12 bg-[#F0F7F0] w-full shrink-0 gap-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-hi-green">
          <Check className="w-7 h-7 text-white" strokeWidth={3} />
        </div>
        <h1 className="font-serif text-[32px] font-bold text-[#1A1A1A]">Booking confirmed!</h1>
        <p className="text-[15px] text-[#666666] text-center leading-[22px]">
          Your Hamilton Island escape is booked. Confirmation #HI-20260528-4291 has been sent to john@example.com
        </p>
      </div>

      {/* Main Content */}
      <div className="flex px-[60px] py-10 gap-10 w-full flex-1">
        {/* Left Column */}
        <div className="flex flex-col flex-1 min-w-0 gap-8">
          {/* Booking Details Card */}
          <div className="flex flex-col p-7 border border-[#E5E5E5] rounded-xl gap-5">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Your booking details</h2>
            <div className="flex gap-8">
              <div className="flex flex-col gap-4 flex-1">
                {[
                  { label: 'Hotel', value: 'The Sundays' },
                  { label: 'Check-in', value: 'Thu, 28 May 2026' },
                  { label: 'Guests', value: '2 adults' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-[#999999] uppercase tracking-[0.05em]">{item.label}</span>
                    <span className="text-sm font-medium text-[#1A1A1A]">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4 flex-1">
                {[
                  { label: 'Room', value: 'Garden View Suite' },
                  { label: 'Check-out', value: 'Sat, 30 May 2026' },
                  { label: 'Confirmation', value: 'HI-20260528-4291' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-[#999999] uppercase tracking-[0.05em]">{item.label}</span>
                    <span className="text-sm font-medium text-[#1A1A1A]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-7 py-3 text-[13px] font-medium text-white bg-hi-blue rounded-full hover:opacity-90">
              <Briefcase className="w-4 h-4" />
              View itinerary
            </button>
            <button className="flex items-center gap-2 px-7 py-3 text-[13px] font-medium text-[#1A1A1A] border border-[#D9D9D9] rounded-full hover:border-[#999999]">
              <Calendar className="w-4 h-4" />
              Add to calendar
            </button>
            <button className="flex items-center gap-2 px-7 py-3 text-[13px] font-medium text-[#1A1A1A] border border-[#D9D9D9] rounded-full hover:border-[#999999]">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>

          {/* Plan Your Adventure */}
          <div className="flex flex-col gap-5">
            <h2 className="font-serif text-[22px] font-bold text-[#1A1A1A]">Plan your island adventure</h2>
            <p className="text-sm text-[#666666]">Make the most of your stay with these popular activities and experiences.</p>
          </div>

          {/* Activity Cards */}
          <div className="flex gap-4">
            {activities.map((activity) => (
              <div key={activity.title} className="flex flex-col flex-1 rounded-xl overflow-hidden border border-[#E5E5E5]">
                <div className={`w-full h-[120px] ${activity.imageColor}`} />
                <div className="flex flex-col p-4 gap-2">
                  <span className="text-sm font-semibold text-[#1A1A1A]">{activity.title}</span>
                  <span className="text-xs text-[#888888] leading-[18px]">{activity.description}</span>
                  <button className="text-xs font-medium text-hi-blue pt-1 text-left">{activity.cta}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <BookingSidebar
          title="Payment summary"
          items={[
            { label: 'The Sundays — Garden View', detail: '2 nights · 2 adults', price: '$1,000' },
            { label: 'Great Barrier Reef Snorkeling', detail: '2 guests', price: '$420' },
            { label: 'Package discount', price: '-$120', color: 'green' },
          ]}
          total="$1,300"
          deposit={{ label: 'Deposit paid', amount: '$260' }}
          balance={{ label: 'Balance due by 28 Apr 2026', amount: '$1,040' }}
          assistanceText="Need to make changes? Call us"
        />
      </div>
    </div>
  )
}
