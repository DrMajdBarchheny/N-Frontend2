import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userAPI } from '@/lib/utils/api';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  profile_picture?: string;
  date_joined: string;
  last_login: string;
}

export interface DesignRequest {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  budget?: number;
  deadline?: string;
  attachments?: string[];
}

interface UserState {
  user: User | null;
  designRequests: DesignRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  designRequests: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateProfile(userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user profile');
    }
  }
);

export const fetchDesignRequests = createAsyncThunk(
  'user/fetchDesignRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getDesignRequests();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch design requests');
    }
  }
);

export const createDesignRequest = createAsyncThunk(
  'user/createDesignRequest',
  async (requestData: Partial<DesignRequest>, { rejectWithValue }) => {
    try {
      const response = await userAPI.createDesignRequest(requestData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create design request');
    }
  }
);

export const updateDesignRequest = createAsyncThunk(
  'user/updateDesignRequest',
  async ({ id, data }: { id: number; data: Partial<DesignRequest> }, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateDesignRequest(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update design request');
    }
  }
);

export const deleteDesignRequest = createAsyncThunk(
  'user/deleteDesignRequest',
  async (id: number, { rejectWithValue }) => {
    try {
      await userAPI.deleteDesignRequest(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete design request');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.designRequests = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update user profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch design requests
    builder
      .addCase(fetchDesignRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.designRequests = action.payload;
      })
      .addCase(fetchDesignRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create design request
    builder
      .addCase(createDesignRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDesignRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.designRequests.push(action.payload);
      })
      .addCase(createDesignRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update design request
    builder
      .addCase(updateDesignRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDesignRequest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.designRequests.findIndex(req => req.id === action.payload.id);
        if (index !== -1) {
          state.designRequests[index] = action.payload;
        }
      })
      .addCase(updateDesignRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete design request
    builder
      .addCase(deleteDesignRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDesignRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.designRequests = state.designRequests.filter(req => req.id !== action.payload);
      })
      .addCase(deleteDesignRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUser, clearError } = userSlice.actions;
export default userSlice.reducer; 