import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { favoritesAPI } from '@/lib/utils/api';

export interface FavoriteItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  price: number;
  category: string;
  added_at: string;
}

interface FavoritesState {
  items: FavoriteItem[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await favoritesAPI.getFavorites();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async (itemData: { product_id: number }, { rejectWithValue }) => {
    try {
      const response = await favoritesAPI.addToFavorites(itemData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to favorites');
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (itemId: number, { rejectWithValue }) => {
    try {
      await favoritesAPI.removeFromFavorites(itemId);
      return itemId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item from favorites');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavoritesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch favorites
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add to favorites
    builder
      .addCase(addToFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Remove from favorites
    builder
      .addCase(removeFromFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearFavoritesError } = favoritesSlice.actions;
export default favoritesSlice.reducer; 