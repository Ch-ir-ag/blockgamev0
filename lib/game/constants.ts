// List of Minecraft blocks that can be used in the game
export const MINECRAFT_BLOCKS = [
  'stone',
  'grass_block',
  'dirt',
  'cobblestone',
  'oak_planks',
  'spruce_planks',
  'birch_planks',
  'jungle_planks',
  'acacia_planks',
  'dark_oak_planks',
  'bedrock',
  'sand',
  'gravel',
  'oak_log',
  'spruce_log',
  'birch_log',
  'jungle_log',
  'acacia_log',
  'dark_oak_log',
  'glass',
] as const

export type MinecraftBlock = typeof MINECRAFT_BLOCKS[number]

export const MAX_ATTEMPTS = 6
export const POINTS_PER_GUESS = 100 // Base points for correct guess
export const TIME_BONUS_POINTS = 50 // Bonus points for quick guesses

// Feedback types for guesses
export type GuessFeedback = {
  isCorrect: boolean
  similarities: {
    material?: boolean    // e.g., both wood-based
    type?: boolean        // e.g., both are planks
    variant?: boolean     // e.g., both are oak
  }
  message: string
}

// Helper function to get a random block
export const getRandomBlock = (): MinecraftBlock => {
  const randomIndex = Math.floor(Math.random() * MINECRAFT_BLOCKS.length)
  return MINECRAFT_BLOCKS[randomIndex]
}

// Helper function to calculate block similarities
export const calculateSimilarities = (target: MinecraftBlock, guess: MinecraftBlock) => {
  const similarities = {
    material: false,
    type: false,
    variant: false,
  }

  // Check material (wood, stone, etc.)
  const materials = ['oak', 'spruce', 'birch', 'jungle', 'acacia', 'dark_oak', 'stone']
  materials.forEach(material => {
    if (target.includes(material) && guess.includes(material)) {
      similarities.material = true
    }
  })

  // Check type (planks, log, etc.)
  const types = ['planks', 'log', 'block']
  types.forEach(type => {
    if (target.includes(type) && guess.includes(type)) {
      similarities.type = true
    }
  })

  // Check variant (specific type of wood, etc.)
  if (target.split('_')[0] === guess.split('_')[0]) {
    similarities.variant = true
  }

  return similarities
}

// Helper function to generate feedback message
export const generateFeedbackMessage = (similarities: GuessFeedback['similarities']): string => {
  if (similarities.variant && similarities.type) {
    return "Very close! You've got the right variant and type!"
  } else if (similarities.material && similarities.type) {
    return "Close! You've got the right material and type!"
  } else if (similarities.material) {
    return "You're on the right track with the material!"
  } else if (similarities.type) {
    return "Right type of block, wrong material!"
  } else {
    return "Try something completely different!"
  }
} 