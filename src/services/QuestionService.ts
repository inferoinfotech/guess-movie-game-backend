import Content from '../models/v1/Content' // your content model

type GetRandomQuestionOptions = {
    language: string
    types: string[] // ['dialogue', 'frame', 'eyes']
}

export async function getRandomQuestion(options: GetRandomQuestionOptions) {
    const { language, types } = options

    // Match filter
    const match = {
        type: { $in: types },
        isApproved: true, // if you have a moderation flag
    }

    const count = await Content.countDocuments(match)
    if (count === 0) return null

    const random = Math.floor(Math.random() * count)

    const [question] = await Content.find(match).skip(random).limit(1)

    return question
}
