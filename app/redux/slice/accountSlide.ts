import { callFetchAccount } from "@/app/config/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshToken: boolean;
  errorRefreshToken: string;
  activeMenu: string;
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    // address: string;
    // gender: string;
    role: {
      id: string;
      name: string;
      permissions: {
        id: string;
        name: string;
        apiPath: string;
        method: string;
        module: string;
      }[];
    };
    // bookings: {
    //   _id: string;
    //   ma_GD: string;
    //   total_price: string;
    //   movie: {
    //     name: string;
    //   };
    //   seats: string[];
    //   isPayment: boolean;
    // }[];
  };
}

export const fetchAccount = createAsyncThunk(
  "acount/fetchAcount",
  async ({ accessToken }: { accessToken: String }) => {
    const response = await callFetchAccount(accessToken);
    return response.data;
  }
);

const initialState: IState = {
  isAuthenticated: false,
  isLoading: true,
  isRefreshToken: false,
  errorRefreshToken: "",
  activeMenu: "home",
  user: {
    _id: "",
    email: "",
    firstName: "",
    lastName: "",
    // name: "",
    // address: "",
    // gender: "",
    role: {
      id: "",
      name: "",
      permissions: [],
    },
    // bookings: [
    //   {
    //     _id: "",
    //     ma_GD: "",
    //     total_price: "",
    //     movie: {
    //       name: "",
    //     },
    //     seats: [],
    //     isPayment: false,
    //   },
    // ],
  },
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUserLoginInfo: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user._id = action?.payload?._id;
      state.user.email = action.payload.email;
      state.user.firstName = action.payload.firstName;
      state.user.lastName = action.payload.lastName;
      state.user.role = action?.payload?.role;
      // state.user.permissions = action?.payload?.permissions;
    },
    setLogoutAction: (state, action) => {
      localStorage.removeItem("access_token");
      state.isAuthenticated = false;
      state.user = {
        _id: "",
        email: "",
        firstName: "",
        lastName: "",
        role: {
          id: "",
          name: "",
          permissions: [],
        },
      };
    },
    setRefreshTokenAction: (state, action) => {
      state.isRefreshToken = action.payload?.status ?? false;
      state.errorRefreshToken = action.payload?.message ?? "";
    },
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchAccount.pending, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = false;
        state.isLoading = true;
      }
    });

    builder.addCase(fetchAccount.fulfilled, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.user._id = action?.payload?.id;
        state.user.email = action.payload.email;
        state.user.firstName = action.payload.firstName;
        state.user.lastName = action.payload.lastName;
        // state.user.name = action.payload.name;
        // state.user.address = action.payload.address;
        // state.user.gender = action.payload.gender;
        state.user.role = action?.payload?.role;
        // state.user.bookings = action?.payload?.bookings;
        // state.user.permissions = action?.payload?.user?.permissions;
      }
    });

    builder.addCase(fetchAccount.rejected, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = false;
        state.isLoading = false;
      }
    });
  },
});

export const { setUserLoginInfo, setLogoutAction, setRefreshTokenAction } =
  accountSlice.actions;

export default accountSlice.reducer;
