import { RefactoredStepByStepWorkflow } from '@/components/fast-gen'
import AuthGuard from '@/components/auth-guard'
import NavigationHeader from '@/components/navigation-header'

export default function CreatePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <main className="py-8">
          <RefactoredStepByStepWorkflow />
        </main>
      </div>
    </AuthGuard>
  )
} 