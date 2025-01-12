'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type SupabaseContext = {
  user: User | null
  isLoading: boolean
}

const Context = createContext<SupabaseContext>({
  user: null,
  isLoading: true,
})

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) {
          if (error.message === 'Auth session missing!') {
            // This is an expected state when user is not logged in
            setUser(null)
          } else {
            console.error('Error fetching user:', error.message)
            setUser(null)
          }
        } else {
          setUser(user)
        }
      } catch (error) {
        console.error('Error in getUser:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  return (
    <Context.Provider value={{ user, isLoading }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => useContext(Context) 