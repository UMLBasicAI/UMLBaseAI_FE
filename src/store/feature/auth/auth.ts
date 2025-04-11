import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IUserInfo {
    email: string
    avatarUrl: string | null
    fullName: string | null
    role: string | null
}
export interface IAuth {
    user: IUserInfo
}
export interface IStorage {
    fileStorage: File | null
    selectedId: string
}
const initialState: IAuth = {
    user: {
        email: '',
        avatarUrl: null,
        fullName: null,
        role: null,
    },
}
const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
})

export const {} = slice.actions

export default slice.reducer
