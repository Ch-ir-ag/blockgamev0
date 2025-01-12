'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSupabase } from '@/components/providers/supabase-provider'
import { GameService, type GuessFeedback } from '@/lib/game/game-service'
import { MINECRAFT_BLOCKS } from '@/lib/game/constants'
import { type Database } from '@/types/database'

type GameState = Database['public']['Tables']['games']['Row']

const gameService = new GameService()

export default function GameInterface() {
  const { user } = useSupabase()
  const [guess, setGuess] = useState('')
  const [feedback, setFeedback] = useState<GuessFeedback | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentGame, setCurrentGame] = useState<GameState | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadCurrentGame = useCallback(async () => {
    if (!user) return
    try {
      const game = await gameService.getCurrentGame(user.id)
      setCurrentGame(game)
    } catch (error) {
      console.error('Error loading game:', error)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadCurrentGame()
    }
  }, [user, loadCurrentGame])

  const startNewGame = async () => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      const game = await gameService.startNewGame(user.id)
      setCurrentGame(game)
      setFeedback(null)
    } catch (error) {
      console.error('Error starting game:', error)
      setError('Failed to start new game')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitGuess = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !currentGame) return

    setIsLoading(true)
    setError(null)
    try {
      const { feedback: newFeedback, gameState } = await gameService.submitGuess(
        user.id,
        currentGame.id,
        guess.toLowerCase()
      )
      setFeedback(newFeedback)
      setCurrentGame(gameState)
      setGuess('')
    } catch (error) {
      console.error('Error submitting guess:', error)
      setError(error instanceof Error ? error.message : 'Failed to submit guess')
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentGame) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Block Guesser!</h2>
          <button
            onClick={startNewGame}
            disabled={isLoading}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Starting...' : 'Start New Game'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Block Guesser</h2>
          <div className="text-sm">
            Attempts remaining: {currentGame.attempts_remaining}
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Guess the Minecraft block! You have {currentGame.attempts_remaining} attempts remaining.
          </p>
        </div>

        {currentGame.status === 'completed' ? (
          <div className="text-center space-y-4">
            <p className="text-lg">
              Game Over! {feedback?.isCorrect ? 'You won!' : 'Better luck next time!'}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              The block was: {currentGame.target_block}
            </p>
            <p className="text-lg">Score: {currentGame.score}</p>
            <button
              onClick={startNewGame}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Start New Game
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitGuess} className="space-y-4">
            <div>
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Enter your guess..."
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                disabled={isLoading}
                list="minecraft-blocks"
              />
              <datalist id="minecraft-blocks">
                {MINECRAFT_BLOCKS.map((block) => (
                  <option key={block} value={block} />
                ))}
              </datalist>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading || !guess}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : 'Submit Guess'}
            </button>
          </form>
        )}

        {feedback && currentGame.status !== 'completed' && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Hint:</h3>
            <p className="text-gray-600 dark:text-gray-300 italic">
              "{feedback.hint}"
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 