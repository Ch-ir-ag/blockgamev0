import { NextResponse } from 'next/server'
import { getBlockCategory } from '@/lib/game/constants'
import { validateEnv } from '../validate-env'

export async function POST(request: Request) {
  let requestData;
  try {
    // Validate environment variables first
    const env = validateEnv()
    
    requestData = await request.json()
    const { targetBlock, guessedBlock, previousHints } = requestData
    console.log('Received request:', { targetBlock, guessedBlock, previousHints })
    console.log('API Key length:', env.HUGGING_FACE_API_KEY.length)

    const targetCategory = getBlockCategory(targetBlock)
    const guessCategory = getBlockCategory(guessedBlock)
    console.log('Categories:', { targetCategory, guessCategory })

    // Create themed hints based on categories
    const categoryHints = {
      ores: [
        "Deep in the caves, this valuable treasure awaits!",
        "Miners dream of finding this precious block!",
        "You'll need an iron pickaxe or better to mine this one!",
        "This block sparkles with fortune beneath the surface!"
      ],
      wood: [
        "Not wooden planks, but something more natural!",
        "This block grows tall in the forest!",
        "You're barking up the wrong tree with that guess!",
        "Nature's bounty, but not from the forest!"
      ],
      building: [
        "A solid foundation for any build!",
        "This block is more fundamental than that!",
        "Many crafters use this as their base material!",
        "A classic building block, but not what you guessed!"
      ],
      nature: [
        "Mother nature's touch in block form!",
        "You'll find this in the great outdoors!",
        "Natural beauty in cubic form!",
        "The wilderness holds this block's secret!"
      ],
      decorative: [
        "This block adds function and style!",
        "More practical than purely decorative!",
        "Useful and beautiful in its own way!",
        "This block serves a special purpose!"
      ],
      nether: [
        "This block brings hellish vibes!",
        "You'll need to venture into the Nether for this one!",
        "Hot and dangerous surroundings spawn this block!",
        "The Nether's secrets include this block!"
      ],
      end: [
        "Found in the realm of the Ender Dragon!",
        "This block comes from the void dimension!",
        "Journey to The End to find this one!",
        "Mysterious and alien in nature!"
      ],
      colored: [
        "This block comes in many shades!",
        "Color isn't its main feature!",
        "You're thinking too decorative!",
        "Function over fashion with this block!"
      ],
      other: [
        "Think outside the box!",
        "Not quite what you're imagining!",
        "You're on the wrong track!",
        "Try a different category entirely!"
      ]
    }

    // Get hints for the target category
    const categoryHintPool = categoryHints[targetCategory as keyof typeof categoryHints] || categoryHints.other
    const previousHintsSet = new Set(previousHints)
    const availableHints = categoryHintPool.filter(hint => !previousHintsSet.has(hint))
    
    // If we have unused hints, use one of them
    if (availableHints.length > 0) {
      const hint = availableHints[Math.floor(Math.random() * availableHints.length)]
      console.log('Selected themed hint:', hint)
      return NextResponse.json({ hint })
    }

    // If all themed hints are used, fall back to category comparison
    const fallbackHints = [
      `Think ${targetCategory} instead of ${guessCategory}!`,
      `You might find this block in ${targetCategory} areas.`,
      `This block belongs to the ${targetCategory} family.`,
      `Look for something in the ${targetCategory} category!`
    ]

    const finalHint = fallbackHints[Math.floor(Math.random() * fallbackHints.length)]
    console.log('Fallback hint:', finalHint)
    return NextResponse.json({ hint: finalHint })

  } catch (error) {
    console.error('Error generating hint:', error)
    // Use the already parsed request data if available
    const targetCategory = requestData ? getBlockCategory(requestData.targetBlock) : 'unknown'
    return NextResponse.json({ 
      hint: `Look for something in the ${targetCategory} category!`
    })
  }
} 