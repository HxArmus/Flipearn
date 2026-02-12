import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from '../../configs/axios';

//get all public listings
export const getAllPublicListing = createAsyncThunk(
  "listing/getAllPublicListing",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/listing/public");
      return {
        listings: data?.listings ?? data?.listing ?? [],
      };
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch public listings"
      );
    }
  }
);
// get all user listings
export const getAllUserListing = createAsyncThunk(
  "listing/getAllUserListing",
  async ({ getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();
      if (!token) {
        return rejectWithValue("Not authenticated");
      }
      const { data } = await api.get("/api/listing/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        listings: data?.listing ?? data?.listings ?? [],
        balance: data?.balance ?? {
          earned: 0,
          withdrawn: 0,
          avaliable: 0,
        },
      };
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user listings"
      );
    }
  }
);

const listingSlice = createSlice({
    name:"listing",
    initialState:{
        listings: [],
        userListings:[],
        balance:{
            earned:0,
            withdrawn:0,
            avaliable: 0
        }
    },
    reducers:{
        setListings: (state, action)=>{
            state.listings = action.payload
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(getAllPublicListing.fulfilled,(state,action)=>{
            state.listings = action.payload?.listings ?? [];

        })
        builder.addCase(getAllUserListing.fulfilled,(state,action)=>{
            state.userListings = action.payload?.listings ?? [];
            state.balance = action.payload?.balance ?? state.balance;
        });
        builder.addCase(getAllUserListing.rejected,(state)=>{
            state.userListings = [];
        });


    }
})

export const {setListings} = listingSlice.actions;
export default listingSlice.reducer

