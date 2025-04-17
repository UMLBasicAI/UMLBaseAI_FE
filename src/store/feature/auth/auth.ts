import { userData } from '@/data/authData'
import { createSlice } from '@reduxjs/toolkit'
import { authApis } from './authApi'
import webStorageClient from '@/utils/webStorageClient'

export interface IUserInfo {
    id: string
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
    reducers: {
        setUserInfo: (state, action) => {
            state.user = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(authApis.endpoints.signIn.matchFulfilled, (state, action) => {
            webStorageClient.setToken(action.payload.body.accessToken, {maxAge: 60*60*24*30});    
            webStorageClient.setRefreshToken(action.payload.body.refreshToken, {maxAge: 60*60*24*30});
        })
    },
})

export const {setUserInfo} = slice.actions

export default slice.reducer
