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

// Initial States
const userInitialState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  loading: false,
  error: null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false
};

const profileInitialState = {
  profile: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null
};

const requestsInitialState = {
  requests: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null
};

const cartInitialState = {
  items: [],
  total: 0
};

const favoritesInitialState = {
  items: []
};

// User Reducer
const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null
      };
    case USER_LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
        token: null,
        isAuthenticated: false
      };
    case USER_LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        error: null
      };
    default:
      return state;
  }
};

// Profile Reducer
const profileReducer = (state = profileInitialState, action) => {
  switch (action.type) {
    case USER_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case USER_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: action.payload,
        error: null
      };
    case USER_PROFILE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case USER_PROFILE_UPDATE_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateError: null
      };
    case USER_PROFILE_UPDATE_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        profile: action.payload,
        updateError: null
      };
    case USER_PROFILE_UPDATE_FAIL:
      return {
        ...state,
        updateLoading: false,
        updateError: action.payload
      };
    default:
      return state;
  }
};

// Requests Reducer
const requestsReducer = (state = requestsInitialState, action) => {
  switch (action.type) {
    case USER_REQUESTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case USER_REQUESTS_SUCCESS:
      return {
        ...state,
        loading: false,
        requests: action.payload,
        error: null
      };
    case USER_REQUESTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case USER_REQUEST_CREATE_REQUEST:
      return {
        ...state,
        createLoading: true,
        createError: null
      };
    case USER_REQUEST_CREATE_SUCCESS:
      return {
        ...state,
        createLoading: false,
        requests: [...state.requests, action.payload],
        createError: null
      };
    case USER_REQUEST_CREATE_FAIL:
      return {
        ...state,
        createLoading: false,
        createError: action.payload
      };
    case USER_REQUEST_UPDATE_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateError: null
      };
    case USER_REQUEST_UPDATE_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        requests: state.requests.map(request => 
          request.id === action.payload.id ? action.payload : request
        ),
        updateError: null
      };
    case USER_REQUEST_UPDATE_FAIL:
      return {
        ...state,
        updateLoading: false,
        updateError: action.payload
      };
    default:
      return state;
  }
};

// Cart Reducer
const cartReducer = (state = cartInitialState, action) => {
  switch (action.type) {
    case CART_SET_ITEMS:
      return {
        ...state,
        items: action.payload,
        total: action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };
    case CART_ADD_ITEM:
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
          total: state.total + action.payload.price
        };
      }
    case CART_REMOVE_ITEM:
      const itemToRemove = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (itemToRemove ? itemToRemove.price * itemToRemove.quantity : 0)
      };
    case CART_UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id === action.payload.itemId) {
            const quantityDiff = action.payload.quantity - item.quantity;
            return {
              ...item,
              quantity: action.payload.quantity
            };
          }
          return item;
        }),
        total: state.items.reduce((total, item) => {
          const quantity = item.id === action.payload.itemId ? action.payload.quantity : item.quantity;
          return total + (item.price * quantity);
        }, 0)
      };
    case CART_CLEAR:
      return {
        ...state,
        items: [],
        total: 0
      };
    default:
      return state;
  }
};

// Favorites Reducer
const favoritesReducer = (state = favoritesInitialState, action) => {
  switch (action.type) {
    case FAVORITES_SET_ITEMS:
      return {
        ...state,
        items: action.payload
      };
    case FAVORITES_ADD_ITEM:
      const itemExists = state.items.find(item => item.id === action.payload.id);
      if (!itemExists) {
        return {
          ...state,
          items: [...state.items, action.payload]
        };
      }
      return state;
    case FAVORITES_REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case FAVORITES_CLEAR:
      return {
        ...state,
        items: []
      };
    default:
      return state;
  }
};

// Root Reducer
const rootReducer = {
  user: userReducer,
  profile: profileReducer,
  requests: requestsReducer,
  cart: cartReducer,
  favorites: favoritesReducer
};

export default rootReducer; 