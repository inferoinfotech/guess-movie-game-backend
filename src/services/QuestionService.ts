import Content from '../models/v1/Content'

type GetRandomQuestionOptions = {
    language: string
    types: string[] // ['dialogue', 'frame', 'eyes']
    excludeIds?: string[]
}

export async function getRandomQuestion(options: GetRandomQuestionOptions) {
    const { language, types, excludeIds = [] } = options

    const baseMatch = {
        type: { $in: types },
        isApproved: true,
    }

    const tryGetQuestion = async (match: any) => {
        const count = await Content.countDocuments(match)
        if (count === 0) return null
        const random = Math.floor(Math.random() * count)
        const [question] = await Content.find(match).skip(random).limit(1)
        return question
    }

    // Step 1: Try unique question
    const uniqueMatch = excludeIds.length
        ? { ...baseMatch, _id: { $nin: excludeIds } }
        : baseMatch

    const uniqueQuestion = await tryGetQuestion(uniqueMatch)
    if (uniqueQuestion) return uniqueQuestion

    // Step 2: Fallback — allow repeats
    console.warn(
        '⚠️ No unique questions found. Falling back to repeated questions.',
    )
    const fallbackQuestion = await tryGetQuestion(baseMatch)
    return fallbackQuestion
}
