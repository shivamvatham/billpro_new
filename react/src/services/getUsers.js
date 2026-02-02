import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk('fetchData',
    async () => {
        const res = await fetch('https://jsonplaceholder.typicode.com/users')
        const data = await res.json()
        return data;
    }
)

const initialState = {
    users: [],
    loading: false,
    error: null,
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                console.log('i rub', action)
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default userSlice.reducer;

export const selectUsers = state => state.users.users;
export const selectLoading = state => state.users.loading;
export const selectError = state => state.users.error;