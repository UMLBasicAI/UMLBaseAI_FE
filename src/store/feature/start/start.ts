import { createSlice } from '@reduxjs/toolkit'

export type IStart = {
    start: boolean
}
const initialState: IStart = {
    start: false,
}
const slice = createSlice({
    name: 'start',
    initialState,
    reducers: {
        setStart: (state, action) => {
            state.start = action.payload
        },
    },
})

export const { setStart } = slice.actions
export default slice.reducer