'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface BookingHeaderProps {
  showBack?: boolean
  backHref?: string
}

export function BookingHeader({ showBack = true, backHref = '/booking/hotel-selection' }: BookingHeaderProps) {
  return (
    <header className="flex items-center justify-between px-[60px] py-4 bg-white border-b border-[#E5E5E5] w-full shrink-0">
      <div className="flex items-center gap-2 w-[120px]">
        {showBack && (
          <Link href={backHref} className="flex items-center gap-2 text-hi-blue hover:opacity-80">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>
        )}
      </div>
      <span className="font-serif text-xl font-bold text-[#1A1A1A]">Hamilton Island</span>
      <div className="flex items-center justify-end w-[120px]">
        <span className="text-[13px] text-[#666666]">Need help? 1300 863 686</span>
      </div>
    </header>
  )
}
