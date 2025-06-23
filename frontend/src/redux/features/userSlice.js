import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true
}

export const userSlice = createSlice({
    initialState,
    name: "userSlice",
    reducers: {
        // data we send is the payload in our redux and state mean the global state
        setUser(state, action) {
            // action is the response that we get and payload is the data we send
            state.user = action.payload
        },
        setIsAuthenticated(state, action) {
            state.isAuthenticated = action.payload
        },
        setLoading(state, action) {
            state.loading = action.payload
        }
    }
})

export default userSlice.reducer

export const { setIsAuthenticated, setUser, setLoading } = userSlice.actions