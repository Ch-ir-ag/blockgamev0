import { createClient } from '@/lib/supabase/client'
import {
  type MinecraftBlock,
  MAX_ATTEMPTS,
  POINTS_PER_GUESS,
  getRandomBlock,
  MINECRAFT_BLOCKS,
} from './constants'
import { type Database } from '@/types/database'

type GameState = Database['public']['Tables']['games']['Row']

export type GuessFeedback = {
  isCorrect: boolean
  hint: string
}

export class GameService {
  private supabase = createClient()

  async startNewGame(userId: string) {
    const targetBlock = getRandomBlock()
    
    const { data: game, error } = await this.supabase
      .from('games')
      .insert({
        user_id: userId,
        target_block: targetBlock,
        status: 'active',
        attempts_remaining: MAX_ATTEMPTS,
        score: 0,
      })
      .select()
      .single()

    if (error) throw error
    return game
  }

  async submitGuess(
    userId: string,
    gameId: string,
    guessedBlock: string
  ): Promise<{ feedback: GuessFeedback; gameState: GameState }> {
    // Validate the guessed block
    if (!MINECRAFT_BLOCKS.includes(guessedBlock as MinecraftBlock)) {
      throw new Error('Invalid block name')
    }

    // Get the current game
    const { data: game, error: gameError } = await this.supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .eq('user_id', userId)
      .single()

    if (gameError) throw gameError
    if (!game) throw new Error('Game not found')
    if (game.status !== 'active') throw new Error('Game is not active')
    if (game.attempts_remaining <= 0) throw new Error('No attempts remaining')

    // Get previous hints for this game
    const { data: previousGuesses } = await this.supabase
      .from('guesses')
      .select('feedback')
      .eq('game_id', gameId)
      .order('created_at', { ascending: true })

    const previousHints = previousGuesses?.map(g => g.feedback.hint) || []

    // Get hint from our API
    const hintResponse = await fetch('/api/generate-hint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targetBlock: game.target_block,
        guessedBlock,
        previousHints,
      }),
    })

    const { hint } = await hintResponse.json()
    const isCorrect = game.target_block === guessedBlock

    const feedback: GuessFeedback = {
      isCorrect,
      hint,
    }

    // Calculate score for this guess
    let scoreUpdate = 0
    if (isCorrect) {
      scoreUpdate = POINTS_PER_GUESS * game.attempts_remaining
    }

    // Update game state
    const { data: updatedGame, error: updateError } = await this.supabase
      .from('games')
      .update({
        attempts_remaining: game.attempts_remaining - 1,
        status: isCorrect ? 'completed' : game.attempts_remaining <= 1 ? 'completed' : 'active',
        score: game.score + scoreUpdate,
      })
      .eq('id', gameId)
      .select()
      .single()

    if (updateError) throw updateError

    // Record the guess
    const { error: guessError } = await this.supabase.from('guesses').insert({
      game_id: gameId,
      user_id: userId,
      guessed_block: guessedBlock,
      is_correct: isCorrect,
      feedback,
    })

    if (guessError) throw guessError

    // Update leaderboard
    if (isCorrect || game.attempts_remaining <= 1) {
      await this.updateLeaderboard(userId, scoreUpdate)
    }

    return { feedback, gameState: updatedGame }
  }

  private async updateLeaderboard(userId: string, scoreToAdd: number) {
    const { data, error } = await this.supabase
      .from('leaderboard')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw error
    }

    if (data) {
      // Update existing record
      await this.supabase
        .from('leaderboard')
        .update({
          total_score: data.total_score + scoreToAdd,
          games_played: data.games_played + 1,
        })
        .eq('user_id', userId)
    } else {
      // Create new record
      await this.supabase
        .from('leaderboard')
        .insert({
          user_id: userId,
          total_score: scoreToAdd,
          games_played: 1,
          best_streak: 0,
        })
    }
  }

  async getCurrentGame(userId: string) {
    const { data, error } = await this.supabase
      .from('games')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }
} 