import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ICinema, IMovie, IPermission } from '@/app/types/backend';
import { callFetchCinema, callFetchMovie, callFetchPermission } from '@/app/config/api';

interface IState {
    isFetching: boolean;
    meta: {
      totalItems: number,
      itemCount: number,
      itemsPerPage: number,
      totalPages: number,
      currentPage: number
    },
    result: IMovie[],
    singleMovie: IMovie
}
// First, create the thunk
export const fetchMovie = createAsyncThunk(
    'movie/fetchMovie',
    async ({ query }: { query: string }) => {
        const response = await callFetchMovie(query);
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
    result: [],
    singleMovie: {
        _id: undefined,
        name: '',
        description: "",
        genre: '',
        time:  0,
        director: '',
        cast: '',
        ReleaseDate: null,
        videoURL: '',
        img: '',
    }
};


export const movieSlide = createSlice({
    name: 'movie',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setSingleMovie: (state, action) => {
            state.singleMovie._id = action?.payload?._id;
            state.singleMovie.name = action.payload.name;
            state.singleMovie.description = action.payload.description;
            state.singleMovie.genre = action.payload.genre;
            state.singleMovie.time = action.payload.time;
            state.singleMovie.director = action.payload.director;
            state.singleMovie.cast = action.payload.cast;
            state.singleMovie.ReleaseDate = action.payload.ReleaseDate;
            state.singleMovie.videoURL = action.payload.videoURL;
            state.singleMovie.img = action.payload.img;
            // state.user.role = action?.payload?.role;
            // state.user.permissions = action?.payload?.permissions;
          },

    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchMovie.pending, (state, action) => {
            state.isFetching = true;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchMovie.rejected, (state, action) => {
            state.isFetching = false;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchMovie.fulfilled, (state, action) => {
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

export const { setSingleMovie } = movieSlide.actions;

export default movieSlide.reducer;
