export const PlatformTypesArray = [
    "steam", "ps", "xbox"
]

export type PlayerJson = {
    _id: string,
    mmr: number,
    matches: {
        wins: number,
        losses: number,
        draws: number
    },
    time_created: number,
    streak: number
}