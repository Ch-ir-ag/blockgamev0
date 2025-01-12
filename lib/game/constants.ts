// List of Minecraft blocks that can be used in the game
export const MINECRAFT_BLOCKS = [
  // Building Blocks
  'stone',
  'granite',
  'diorite',
  'andesite',
  'deepslate',
  'cobblestone',
  'mossy_cobblestone',
  'smooth_stone',
  'sandstone',
  'red_sandstone',
  'obsidian',
  'bedrock',
  
  // Wood Types
  'oak_planks',
  'spruce_planks',
  'birch_planks',
  'jungle_planks',
  'acacia_planks',
  'dark_oak_planks',
  'mangrove_planks',
  'cherry_planks',
  'bamboo_planks',
  'oak_log',
  'spruce_log',
  'birch_log',
  'jungle_log',
  'acacia_log',
  'dark_oak_log',
  'mangrove_log',
  'cherry_log',
  
  // Nature
  'grass_block',
  'dirt',
  'coarse_dirt',
  'podzol',
  'rooted_dirt',
  'mud',
  'clay',
  'moss_block',
  
  // Ores and Minerals
  'coal_ore',
  'iron_ore',
  'gold_ore',
  'diamond_ore',
  'emerald_ore',
  'lapis_ore',
  'redstone_ore',
  'copper_ore',
  
  // Decorative
  'glass',
  'tinted_glass',
  'bookshelf',
  'crafting_table',
  'furnace',
  'jukebox',
  'note_block',
  'tnt',
  
  // Nether
  'netherrack',
  'soul_sand',
  'soul_soil',
  'glowstone',
  'nether_bricks',
  'crimson_stem',
  'warped_stem',
  
  // End
  'end_stone',
  'purpur_block',
  'end_stone_bricks',
  
  // Colored Blocks
  'white_wool',
  'orange_wool',
  'magenta_wool',
  'light_blue_wool',
  'yellow_wool',
  'lime_wool',
  'pink_wool',
  'gray_wool',
  'light_gray_wool',
  'cyan_wool',
  'purple_wool',
  'blue_wool',
  'brown_wool',
  'green_wool',
  'red_wool',
  'black_wool',
  
  // Concrete
  'white_concrete',
  'orange_concrete',
  'magenta_concrete',
  'light_blue_concrete',
  'yellow_concrete',
  'lime_concrete',
  'pink_concrete',
  'gray_concrete',
  'light_gray_concrete',
  'cyan_concrete',
  'purple_concrete',
  'blue_concrete',
  'brown_concrete',
  'green_concrete',
  'red_concrete',
  'black_concrete'
] as const

export type MinecraftBlock = typeof MINECRAFT_BLOCKS[number]

export const MAX_ATTEMPTS = 6
export const POINTS_PER_GUESS = 100

// Categories for better hints
export const BLOCK_CATEGORIES = {
  building: ['stone', 'granite', 'diorite', 'andesite', 'deepslate', 'cobblestone', 'sandstone'],
  wood: ['oak_planks', 'spruce_planks', 'birch_planks', 'jungle_planks', 'acacia_planks', 'dark_oak_planks'],
  nature: ['grass_block', 'dirt', 'coarse_dirt', 'podzol', 'mud', 'clay', 'moss_block'],
  ores: ['coal_ore', 'iron_ore', 'gold_ore', 'diamond_ore', 'emerald_ore', 'lapis_ore', 'redstone_ore'],
  decorative: ['glass', 'tinted_glass', 'bookshelf', 'crafting_table', 'furnace', 'jukebox'],
  nether: ['netherrack', 'soul_sand', 'soul_soil', 'glowstone', 'nether_bricks'],
  end: ['end_stone', 'purpur_block', 'end_stone_bricks'],
  colored: [
    'white_wool', 'orange_wool', 'magenta_wool', 'yellow_wool',
    'white_concrete', 'orange_concrete', 'magenta_concrete', 'yellow_concrete'
  ]
} as const

// Helper function to get block category
export const getBlockCategory = (block: MinecraftBlock): string => {
  for (const [category, blocks] of Object.entries(BLOCK_CATEGORIES)) {
    if ((blocks as readonly string[]).includes(block)) {
      return category
    }
  }
  return 'other'
}

// Helper function to get a random block
export const getRandomBlock = (): MinecraftBlock => {
  const randomIndex = Math.floor(Math.random() * MINECRAFT_BLOCKS.length)
  return MINECRAFT_BLOCKS[randomIndex]
} 