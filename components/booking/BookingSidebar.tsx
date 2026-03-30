'use client'

import { Info } from 'lucide-react'

interface LineItem {
  label: string
  detail?: string
  price: string
  color?: 'default' | 'green'
}

interface BookingSidebarProps {
  title?: string
  items: LineItem[]
  total: string
  deposit?: { label: string; amount: string }
  balance?: { label: string; amount: string }
  showBenefits?: boolean
  assistanceText?: string
}

export function BookingSidebar({
  title = 'Booking summary',
  items,
  total,
  deposit,
  balance,
  showBenefits = false,
  assistanceText = 'Need assistance? Call us',
}: BookingSidebarProps) {
  return (
    <div className="flex flex-col w-[380px] shrink-0 gap-5">
      {/* Summary Card */}
      <div className="flex flex-col p-6 border border-[#E5E5E5] rounded-xl gap-4">
        <span className="text-base font-semibold text-[#1A1A1A]">{title}</span>
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-0.5">
                <span className={`text-[13px] font-medium ${item.color === 'green' ? 'text-hi-green' : 'text-[#1A1A1A]'}`}>
                  {item.label}
                </span>
                {item.detail && (
                  <span className="text-xs text-[#999999]">{item.detail}</span>
                )}
              </div>
              <span className={`text-sm font-medium ${item.color === 'green' ? 'text-hi-green' : 'text-[#1A1A1A]'}`}>
                {item.price}
              </span>
            </div>
            {i < items.length - 1 && <div className="w-full h-px bg-[#F0F0F0] mt-4" />}
          </div>
        ))}
        <div className="w-full h-px bg-[#F0F0F0]" />
        <div className="flex justify-between items-center">
          <span className="text-[15px] font-semibold text-[#1A1A1A]">Total</span>
          <span className="text-lg font-bold text-[#1A1A1A]">{total}</span>
        </div>
        {deposit && (
          <div className="flex justify-between items-center px-4 py-3 bg-[#FFF5F5] rounded-lg">
            <span className="text-[13px] font-medium text-hi-red">{deposit.label}</span>
            <span className="text-sm font-semibold text-hi-red">{deposit.amount}</span>
          </div>
        )}
        {balance && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#999999]">{balance.label}</span>
            <span className="text-[13px] font-medium text-[#999999]">{balance.amount}</span>
          </div>
        )}
      </div>

      {/* Assistance */}
      <div className="flex items-center gap-2.5 p-4 border border-[#E5E5E5] rounded-xl">
        <Info className="w-5 h-5 text-[#666666] shrink-0" />
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] text-[#666666]">{assistanceText}</span>
          <span className="text-sm font-semibold text-[#1A1A1A]">1300 863 686</span>
        </div>
      </div>

      {/* Benefits */}
      {showBenefits && (
        <div className="flex flex-col p-5 bg-hi-yellow rounded-xl gap-3.5">
          <span className="text-sm font-semibold text-[#1A1A1A]">Why book direct?</span>
          {['Best price guarantee', 'Flexible cancellation', 'Exclusive member perks', 'Pay only 20% deposit today'].map((benefit) => (
            <div key={benefit} className="flex items-start gap-2.5">
              <svg className="w-[18px] h-[18px] shrink-0 mt-px" viewBox="0 0 18 18" fill="none">
                <path d="M4 9l3 3 7-7" stroke="#0047D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[13px] text-[#555555] leading-[18px]">{benefit}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
