import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IPermission } from '@/app/types/backend';
import { callFetchPermission } from '@/app/config/api';

interface IState {
    isFetching: boolean;
    meta: {
      totalItems: number,
      itemCount: number,
      itemsPerPage: number,
      totalPages: number,
      currentPage: number
    },
    result: IPermission[]
}
// First, create the thunk
export const fetchPermission = createAsyncThunk(
    'permission/fetchPermission',
    async ({ query }: { query: string }) => {
        const response = await callFetchPermission(query);
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


export const permissionSlide = createSlice({
    name: 'permission',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {


    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchPermission.pending, (state, action) => {
            state.isFetching = true;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchPermission.rejected, (state, action) => {
            state.isFetching = false;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchPermission.fulfilled, (state, action) => {
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

} = permissionSlide.actions;

export default permissionSlide.reducer;
