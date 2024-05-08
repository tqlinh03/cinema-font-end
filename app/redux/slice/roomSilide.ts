import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ICinema, IPermission, IRoom } from '@/app/types/backend';
import { callFetchCinema, callFetchPermission, callFetchRoom } from '@/app/config/api';

interface IState {
    isFetching: boolean;
    meta: {
      totalItems: number,
      itemCount: number,
      itemsPerPage: number,
      totalPages: number,
      currentPage: number
    },
    seats: string []
    result: IRoom[]
}
// First, create the thunk
export const fetchRoom = createAsyncThunk(
    'room/fetchRoom',
    async ({ query }: { query: string }) => {
        const response = await callFetchRoom(query);
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
    seats: [],
    result: []
};


export const roomSlide = createSlice({
    name: 'room',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setSeats: (state, action) => {
          state.seats = action.payload;
        },
      },
    
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchRoom.pending, (state, action) => {
            state.isFetching = true;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchRoom.rejected, (state, action) => {
            state.isFetching = false;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchRoom.fulfilled, (state, action) => {
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

export const {setSeats} = roomSlide.actions;

export default roomSlide.reducer;
