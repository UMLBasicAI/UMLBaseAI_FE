export type HistoriesResponse = {
    appCode: string
    body: {
        histories: History[],
        isHasNextPage: boolean;
        isHasPreviousPage: boolean;
    }
}

export type History = {
    action: string
    plantUMLCode: string
    userId: string
    id: string
    createdAt: string
    updatedAt: string
}