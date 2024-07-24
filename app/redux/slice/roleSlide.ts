import { callFetchRole, callFetchRoleByID } from "@/app/config/api";
import { IRole } from "@/app/types/backend";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IState {
  isFetching: boolean;
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  result: IRole[];
  isFetchSingle: boolean;
  singleRole: IRole;
}
export const fetchRole = createAsyncThunk(
  "fetchRole",
  async ({ query }: { query: string }) => {
    const response = await callFetchRole(query);
    return response;
  }
);

export const fetchRoleById = createAsyncThunk(
  "fetchRoleById",
  async (id: number) => {
    const res = await callFetchRoleByID(id);
    console.log("id", id);
    console.log("res id", res);
    return res;
  }
);

const initialState: IState = {
  isFetching: true,
  isFetchSingle: true,
  meta: {
    totalItems: 0,
    itemCount: 0,
    itemsPerPage: 10,
    totalPages: 0,
    currentPage: 1,
  },
  result: [],
  singleRole: {
    id: undefined,
    name: "",
    description: "",
    active: false,
    permissions: [],
    // createdDate: undefined, 
    // lastModifiedDate: undefined
  },
};

export const roleSlide = createSlice({
  name: "role",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    resetSingleRole: (state, action) => {
      state.singleRole = {
        id: undefined,
        name: "",
        description: "",
        active: false,
        permissions: [],
      };
    },
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchRole.pending, (state, action) => {
      state.isFetching = true;
      // Add user to the state array
      // state.courseOrder = action.payload;
    });

    builder.addCase(fetchRole.rejected, (state, action) => {
      state.isFetching = false;
      // Add user to the state array
      // state.courseOrder = action.payload;
    });

    builder.addCase(fetchRole.fulfilled, (state, action) => {
      if (action.payload && action.payload.data) {
        state.isFetching = false;
        state.meta = action.payload.data.meta;
        state.result = action.payload.data.content;
      }
      // Add user to the state array

      // state.courseOrder = action.payload;
    });

    builder.addCase(fetchRoleById.pending, (state, action) => {
      state.isFetchSingle = true;
      state.singleRole = {
        id: undefined,
        name: "",
        description: "",
        active: false,
        permissions: [],
      };
    });

    builder.addCase(fetchRoleById.rejected, (state, action) => {
      state.isFetchSingle = false;
      state.singleRole = {
        id: undefined,
        name: "",
        description: "",
        active: false,
        permissions: [],
      };
    });

    builder.addCase(fetchRoleById.fulfilled, (state, action) => {
      if (action.payload && action.payload.data) {
        state.isFetchSingle = false;
        state.singleRole = action.payload.data;
      }
    });
  },
});
export const { resetSingleRole } = roleSlide.actions;

export default roleSlide.reducer;
