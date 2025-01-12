'use client'

import { useSupabase } from '@/components/providers/supabase-provider'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import AuthForm from '@/components/auth/auth-form'
import GameInterface from '@/components/game/game-interface'
import Leaderboard from '@/components/game/leaderboard'

export default function Home() {
  const { user, isLoading } = useSupabase()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between">
        <h1 className="text-4xl font-bold mb-8 text-center">Block Guesser</h1>
        
        {!user ? (
          <AuthForm />
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-lg">
                Welcome back, {user.email}!
              </p>
              <button
                onClick={async () => {
                  const supabase = createClientComponentClient()
                  await supabase.auth.signOut()
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <GameInterface />
              </div>
              <div>
                <Leaderboard />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
