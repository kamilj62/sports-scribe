'use client'

import { Button } from '@nextui-org/react'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <Button 
        color="primary" 
        variant="solid" 
        onPress={reset}
        className="px-6 py-2"
      >
        Try again
      </Button>
    </div>
  )
}
