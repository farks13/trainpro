'use client'

import { Check } from 'lucide-react'

const steps = ['Hotel selection', 'Room selection', 'Checkout', 'Confirmation']

interface BookingStepperProps {
  currentStep: number // 1-4
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
  return (
    <div className="flex items-center justify-center px-[60px] py-6 bg-white w-full shrink-0">
      {steps.map((label, i) => {
        const stepNum = i + 1
        const isCompleted = stepNum < currentStep
        const isActive = stepNum === currentStep
        const isUpcoming = stepNum > currentStep

        return (
          <div key={label} className="flex items-center">
            {i > 0 && (
              <div
                className={`w-[60px] h-px shrink-0 ${
                  isCompleted || isActive ? 'bg-hi-blue' : 'bg-[#D9D9D9]'
                }`}
              />
            )}
            <div className="flex items-center gap-2.5">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${
                  isCompleted || isActive
                    ? 'bg-hi-blue'
                    : 'border-[1.5px] border-[#D9D9D9]'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                ) : (
                  <span
                    className={`text-[13px] ${
                      isActive ? 'font-semibold text-white' : 'font-medium text-[#999999]'
                    }`}
                  >
                    {stepNum}
                  </span>
                )}
              </div>
              <span
                className={`text-[13px] ${
                  isCompleted
                    ? 'font-medium text-hi-blue'
                    : isActive
                    ? 'font-semibold text-[#1A1A1A]'
                    : 'font-medium text-[#999999]'
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
