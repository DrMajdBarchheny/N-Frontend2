import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface DesignRequest {
  id: number;
  name: string;
  company?: string;
  contact: string;
  eventType: string;
  eventDate: string;
  details: string;
  uploadedFile?: {
    name: string;
    size: string;
    uploadDate: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'in_progress';
  createdAt: string;
  updatedAt: string;
}

interface DesignRequestsState {
  requests: DesignRequest[];
  currentRequest: DesignRequest | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DesignRequestsState = {
  requests: [],
  currentRequest: null,
  isLoading: false,
  error: null,
};

// Async thunks for API calls
export const fetchDesignRequests = createAsyncThunk(
  'designRequests/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch('http://localhost:8000/api/design-requests/user/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch design requests');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch design requests');
    }
  }
);

export const createDesignRequest = createAsyncThunk(
  'designRequests/create',
  async (requestData: Omit<DesignRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch('http://localhost:8000/api/design-requests/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create design request');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create design request');
    }
  }
);

export const updateDesignRequest = createAsyncThunk(
  'designRequests/update',
  async ({ id, data }: { id: number; data: Partial<DesignRequest> }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`http://localhost:8000/api/design-requests/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update design request');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update design request');
    }
  }
);

export const deleteDesignRequest = createAsyncThunk(
  'designRequests/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`http://localhost:8000/api/design-requests/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete design request');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete design request');
    }
  }
);

const designRequestsSlice = createSlice({
  name: 'designRequests',
  initialState,
  reducers: {
    setCurrentRequest: (state, action: PayloadAction<DesignRequest | null>) => {
      state.currentRequest = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // Local state updates
    addRequestLocal: (state, action: PayloadAction<DesignRequest>) => {
      state.requests.unshift(action.payload);
    },
    
    updateRequestLocal: (state, action: PayloadAction<DesignRequest>) => {
      const index = state.requests.findIndex(req => req.id === action.payload.id);
      if (index !== -1) {
        state.requests[index] = action.payload;
      }
      if (state.currentRequest?.id === action.payload.id) {
        state.currentRequest = action.payload;
      }
    },
    
    removeRequestLocal: (state, action: PayloadAction<number>) => {
      state.requests = state.requests.filter(req => req.id !== action.payload);
      if (state.currentRequest?.id === action.payload) {
        state.currentRequest = null;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch all requests
    builder
      .addCase(fetchDesignRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDesignRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload;
      })
      .addCase(fetchDesignRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create request
      .addCase(createDesignRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDesignRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests.unshift(action.payload);
        state.currentRequest = action.payload;
      })
      .addCase(createDesignRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update request
      .addCase(updateDesignRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDesignRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.requests.findIndex(req => req.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.currentRequest?.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
      })
      .addCase(updateDesignRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete request
      .addCase(deleteDesignRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDesignRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = state.requests.filter(req => req.id !== action.payload);
        if (state.currentRequest?.id === action.payload) {
          state.currentRequest = null;
        }
      })
      .addCase(deleteDesignRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentRequest,
  clearError,
  addRequestLocal,
  updateRequestLocal,
  removeRequestLocal,
} = designRequestsSlice.actions;

// Selectors
export const selectDesignRequests = (state: RootState) => state.designRequests.requests;
export const selectCurrentRequest = (state: RootState) => state.designRequests.currentRequest;
export const selectDesignRequestsIsLoading = (state: RootState) => state.designRequests.isLoading;
export const selectDesignRequestsError = (state: RootState) => state.designRequests.error;
export const selectPendingRequests = (state: RootState) => 
  state.designRequests.requests.filter(req => req.status === 'pending');
export const selectApprovedRequests = (state: RootState) => 
  state.designRequests.requests.filter(req => req.status === 'approved');

export default designRequestsSlice.reducer; 