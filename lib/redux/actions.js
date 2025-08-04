import axios from 'axios';
import {
  // User actions
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  
  // Profile actions
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAIL,
  USER_PROFILE_UPDATE_REQUEST,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_PROFILE_UPDATE_FAIL,
  
  // User requests actions
  USER_REQUESTS_REQUEST,
  USER_REQUESTS_SUCCESS,
  USER_REQUESTS_FAIL,
  USER_REQUEST_CREATE_REQUEST,
  USER_REQUEST_CREATE_SUCCESS,
  USER_REQUEST_CREATE_FAIL,
  USER_REQUEST_UPDATE_REQUEST,
  USER_REQUEST_UPDATE_SUCCESS,
  USER_REQUEST_UPDATE_FAIL,
  
  // Cart and favorites actions
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_UPDATE_QUANTITY,
  CART_CLEAR,
  FAVORITES_ADD_ITEM,
  FAVORITES_REMOVE_ITEM,
  FAVORITES_CLEAR,
  FAVORITES_SET_ITEMS,
  CART_SET_ITEMS
} from './constants';

// API base URL
const API_BASE_URL = 'http://127.0.0.1:8000';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to set auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Token ${token}` })
  };
};

// User Login Action
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    
    const response = await axios.post(`${API_BASE_URL}/user/token/`, {
      username: email, // Backend expects username
      password
    });
    
    const { key, user } = response.data; // Changed from 'access' to 'key'
    
    // Store token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', key);
    }
    
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: { user, token: key }
    });
    
    return { success: true };
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response?.data?.detail || 'Login failed'
    });
    return { success: false, error: error.response?.data?.detail || 'Login failed' };
  }
};

// Handle Google Login Data Action
export const handleGoogleLoginData = (token, userData) => (dispatch) => {
  // Store token in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
  
  dispatch({
    type: USER_LOGIN_SUCCESS,
    payload: { user: userData, token }
  });
  
  return { success: true };
};

// User Logout Action
export const logoutUser = () => (dispatch) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
  dispatch({ type: USER_LOGOUT });
};

// Get User Profile Action
export const getUserProfile = () => async (dispatch) => {
  try {
    dispatch({ type: USER_PROFILE_REQUEST });
    
    const response = await axios.get(`${API_BASE_URL}/user/profile/`, {
      headers: getAuthHeaders()
    });
    
    dispatch({
      type: USER_PROFILE_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: USER_PROFILE_FAIL,
      payload: error.response?.data?.detail || 'Failed to fetch profile'
    });
  }
};

// Update User Profile Action
export const updateUserProfile = (profileData) => async (dispatch) => {
  try {
    dispatch({ type: USER_PROFILE_UPDATE_REQUEST });
    
    const response = await axios.put(`${API_BASE_URL}/user/profile/update/`, profileData, {
      headers: getAuthHeaders()
    });
    
    dispatch({
      type: USER_PROFILE_UPDATE_SUCCESS,
      payload: response.data
    });
    
    return { success: true };
  } catch (error) {
    dispatch({
      type: USER_PROFILE_UPDATE_FAIL,
      payload: error.response?.data?.detail || 'Failed to update profile'
    });
    return { success: false, error: error.response?.data?.detail || 'Failed to update profile' };
  }
};

// Get User Requests Action - Now fetches from backend endpoint
export const getUserRequests = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_REQUESTS_REQUEST });
    // Get user ID from profile state
    const state = getState();
    const userId = state.profile.profile?.id;
    if (!userId) throw new Error('User ID not found');
    const response = await axios.get(`${API_BASE_URL}/api/design-request-detail/${userId}/`, {
      headers: getAuthHeaders()
    });
    dispatch({
      type: USER_REQUESTS_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: USER_REQUESTS_FAIL,
      payload: error.response?.data?.detail || error.message || 'Failed to fetch requests'
    });
  }
};

// Create User Request Action
export const createUserRequest = (requestData) => async (dispatch) => {
  try {
    dispatch({ type: USER_REQUEST_CREATE_REQUEST });
    
    const response = await axios.post(`${API_BASE_URL}/api/design-request/`, requestData, {
      headers: getAuthHeaders()
    });
    
    dispatch({
      type: USER_REQUEST_CREATE_SUCCESS,
      payload: response.data
    });
    
    return { success: true };
  } catch (error) {
    dispatch({
      type: USER_REQUEST_CREATE_FAIL,
      payload: error.response?.data?.detail || 'Failed to create request'
    });
    return { success: false, error: error.response?.data?.detail || 'Failed to create request' };
  }
};

// Update User Request Action
export const updateUserRequest = (requestId, requestData) => async (dispatch) => {
  try {
    dispatch({ type: USER_REQUEST_UPDATE_REQUEST });
    
    const response = await axios.put(`${API_BASE_URL}/user/requests/${requestId}/`, requestData, {
      headers: getAuthHeaders()
    });
    
    dispatch({
      type: USER_REQUEST_UPDATE_SUCCESS,
      payload: response.data
    });
    
    return { success: true };
  } catch (error) {
    dispatch({
      type: USER_REQUEST_UPDATE_FAIL,
      payload: error.response?.data?.message || 'Failed to update request'
    });
    return { success: false, error: error.response?.data?.message || 'Failed to update request' };
  }
};

// Fetch Cart Items Action
export const fetchCartItems = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/cart/`, {
      headers: getAuthHeaders()
    });

    const cartItems = response.data.map(item => ({
      id: item.id,
      name: item.product.translations?.en?.name || item.product.name,
      price: parseFloat(item.product.price_per_day),
      quantity: item.quantity,
      image: item.product.image
    }));

    // Replace the cart with the backend state
    dispatch({
      type: CART_SET_ITEMS,
      payload: cartItems
    });
  } catch (error) {
    console.error('Failed to fetch cart items:', error);
  }
};

// Fetch Favorites Action
export const fetchFavorites = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/favorites/`, {
      headers: getAuthHeaders()
    });
    
    // Transform the data to match our frontend structure
    const favorites = response.data.map(item => ({
      favoriteId: item.id, // Backend favorite ID for deletion
      id: item.product.id, // Product ID
      name: item.product.translations?.en?.name || item.product.name,
      price: parseFloat(item.product.price_per_day),
      category: item.product.category?.translations?.en?.name || 'Product',
      image: item.product.image
    }));
    
    // Replace all favorites with fetched items (instead of clearing and adding one by one)
    dispatch({
      type: FAVORITES_SET_ITEMS,
      payload: favorites
    });
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
  }
};

// Cart Actions
export const addToCart = (item) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/cart/`, {
      product: item.id,
      quantity: 1
    }, {
      headers: getAuthHeaders()
    });
    
    dispatch({
      type: CART_ADD_ITEM,
      payload: { ...item, quantity: 1 }
    });
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
};

export const removeFromCart = (itemId) => async (dispatch) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/cart/${itemId}/`, {
      headers: getAuthHeaders()
    });
    
    dispatch({
      type: CART_REMOVE_ITEM,
      payload: itemId
    });
  } catch (error) {
    console.error('Failed to remove from cart:', error);
  }
};

export const updateCartQuantity = (itemId, quantity) => async (dispatch) => {
  try {
    // Backend doesn't have update quantity endpoint, so we'll handle it client-side
    dispatch({
      type: CART_UPDATE_QUANTITY,
      payload: { itemId, quantity }
    });
  } catch (error) {
    console.error('Failed to update cart quantity:', error);
  }
};

export const clearCart = () => ({
  type: CART_CLEAR
});

// Favorites Actions
export const addToFavorites = (item) => async (dispatch) => {
  try {
    console.log('Adding to favorites:', item);
    console.log('Auth headers:', getAuthHeaders());
    
    const requestData = {
      product_id: item.id
    };
    
    console.log('Request data:', requestData);
    
    const response = await axios.post(`${API_BASE_URL}/api/favorites/`, requestData, {
      headers: getAuthHeaders()
    });
    
    console.log('Favorites response:', response.data);
    
    // Add the favoriteId from the response
    const favoriteItem = {
      ...item,
      favoriteId: response.data.id
    };
    
    dispatch({
      type: FAVORITES_ADD_ITEM,
      payload: favoriteItem
    });
  } catch (error) {
    console.error('Failed to add to favorites:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
  }
};

export const removeFromFavorites = (favoriteId) => async (dispatch) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/favorites/${favoriteId}/`, {
      headers: getAuthHeaders()
    });
    
    dispatch({
      type: FAVORITES_REMOVE_ITEM,
      payload: favoriteId
    });
  } catch (error) {
    console.error('Failed to remove from favorites:', error);
  }
};

export const clearFavorites = () => ({
  type: FAVORITES_CLEAR
}); 