'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type LeaderboardEntry = {
  user_id: string
  total_score: number
  games_played: number
  best_streak: number
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('leaderboard')
          .select('*')
          .order('total_score', { ascending: false })
          .limit(10)

        if (error) throw error
        setEntries(data || [])
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [supabase])

  if (isLoading) {
    return (
      <div className="text-center p-4">
        Loading leaderboard...
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Top Players</h2>
      {entries.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No scores yet. Be the first to play!
        </p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <div
              key={entry.user_id}
              className="flex justify-between items-center p-2 rounded bg-gray-50 dark:bg-gray-700"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold">{index + 1}.</span>
                <span className="text-gray-600 dark:text-gray-300">
                  Player {entry.user_id.slice(0, 6)}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  {entry.total_score} pts
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {entry.games_played} games
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 