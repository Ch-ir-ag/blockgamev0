export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          id: string
          created_at: string
          user_id: string
          target_block: string
          status: 'active' | 'completed'
          attempts_remaining: number
          score: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          target_block: string
          status?: 'active' | 'completed'
          attempts_remaining?: number
          score?: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          target_block?: string
          status?: 'active' | 'completed'
          attempts_remaining?: number
          score?: number
        }
      }
      guesses: {
        Row: {
          id: string
          created_at: string
          game_id: string
          user_id: string
          guessed_block: string
          is_correct: boolean
          feedback: Json
        }
        Insert: {
          id?: string
          created_at?: string
          game_id: string
          user_id: string
          guessed_block: string
          is_correct: boolean
          feedback: Json
        }
        Update: {
          id?: string
          created_at?: string
          game_id?: string
          user_id?: string
          guessed_block?: string
          is_correct?: boolean
          feedback?: Json
        }
      }
      leaderboard: {
        Row: {
          id: string
          created_at: string
          user_id: string
          total_score: number
          games_played: number
          best_streak: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          total_score?: number
          games_played?: number
          best_streak?: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          total_score?: number
          games_played?: number
          best_streak?: number
        }
      }
    }
  }
} 