import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { callFetchUser } from '@/app/config/api';
import { IUser } from '@/app/types/backend';

interface IState {
    isFetching: boolean;
    meta: {
      totalItems: number,
      itemCount: number,
      itemsPerPage: number,
      totalPages: number,
      currentPage: number
  },
    result: IUser[]
}
// First, create the thunk
export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async ({ query }: { query: string }) => {
        const response = await callFetchUser(query);
        return response;
    }
)


const initialState: IState = {
    isFetching: true,
    meta: {
      totalItems: 0,
      itemCount: 0,
      itemsPerPage: 10,
      totalPages: 0,
      currentPage: 1
    },
    result: []
};


export const userSlide = createSlice({
    name: 'user',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setActiveMenu: (state, action) => {
            // state.activeMenu = action.payload;
        },


    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchUser.pending, (state, action) => {
            state.isFetching = true;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchUser.rejected, (state, action) => {
            state.isFetching = false;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchUser.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.items;
            }
            // Add user to the state array

            // state.courseOrder = action.payload;
        })
    },

});

export const {
    setActiveMenu,
} = userSlide.actions;

export default userSlide.reducer;
