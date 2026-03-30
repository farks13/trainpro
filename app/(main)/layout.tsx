import { Sidebar } from '@/components/layout/Sidebar'
import { Toaster } from '@/components/ui/toaster'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 min-h-screen md:ml-60 pt-14 md:pt-0">
          {children}
        </main>
      </div>
      <Toaster />
    </>
  )
}
