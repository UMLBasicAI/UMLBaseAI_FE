import { userData } from '@/data/authData'
import { createSlice } from '@reduxjs/toolkit'

export interface IUserInfo {
    _id: string
    displayName: string
    email: string
    avatarUrl: string
}
export interface IAuth {
    user: IUserInfo
}
export interface IStorage {
    fileStorage: File | null
    selectedId: string
}
const initialState: IAuth = {
    user: userData,
}
const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
})

export const {} = slice.actions

export default slice.reducer
