import { Alert, AlertDescription } from '@/components/ui/alert'

interface ErrorAlertProps {
  error: string | null
}

export default function ErrorAlert({ error }: ErrorAlertProps) {
  if (!error) return null

  return (
    <Alert variant="destructive">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
} 