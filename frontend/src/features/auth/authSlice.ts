import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
    token: string | null;
    user: {
        id?: number | null;
        name: string | null;
        email?: string | null;
    }
}

const initialState: AuthState = {
    token: null,
    user: {
        id: null,
        name: null,
        email: null
    }
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ token: string; user: AuthState['user'] }>) => {
            state.token = action.payload.token
            state.user = action.payload.user
        },
        logout: (state) => {
            state.token = null
            state.user = { id: null, name: null, email: null }
        }
    }
})

export const setCredentials = authSlice.actions.setCredentials
export const logout = authSlice.actions.logout
export const getCredentialsSelect = (state: { auth: AuthState }) => state.auth
export const isAuthenticated = (state: { auth: AuthState }) => !!state.auth.token
export default authSlice.reducer