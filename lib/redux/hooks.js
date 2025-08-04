import { useSelector, useDispatch } from 'react-redux';
import {
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUserRequests,
  createUserRequest,
  updateUserRequest,
  fetchCartItems,
  fetchFavorites,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  addToFavorites,
  removeFromFavorites,
  clearFavorites
} from './actions';

// User hooks
export const useUser = () => {
  const dispatch = useDispatch();
  const userState = useSelector(state => state.user);
  
  return {
    ...userState,
    login: (email, password) => dispatch(loginUser(email, password)),
    logout: () => dispatch(logoutUser())
  };
};

// Profile hooks
export const useProfile = () => {
  const dispatch = useDispatch();
  const profileState = useSelector(state => state.profile);
  
  return {
    ...profileState,
    fetchProfile: () => dispatch(getUserProfile()),
    updateProfile: (profileData) => dispatch(updateUserProfile(profileData))
  };
};

// Requests hooks
export const useRequests = () => {
  const dispatch = useDispatch();
  const requestsState = useSelector(state => state.requests);
  
  return {
    ...requestsState,
    fetchRequests: () => dispatch(getUserRequests()),
    createRequest: (requestData) => dispatch(createUserRequest(requestData)),
    updateRequest: (requestId, requestData) => dispatch(updateUserRequest(requestId, requestData))
  };
};

// Cart hooks
export const useCart = () => {
  const dispatch = useDispatch();
  const cartState = useSelector(state => state.cart);
  
  return {
    ...cartState,
    fetchItems: () => dispatch(fetchCartItems()),
    addItem: (item) => dispatch(addToCart(item)),
    removeItem: (itemId) => dispatch(removeFromCart(itemId)),
    updateQuantity: (itemId, quantity) => dispatch(updateCartQuantity(itemId, quantity)),
    clear: () => dispatch(clearCart())
  };
};

// Favorites hooks
export const useFavorites = () => {
  const dispatch = useDispatch();
  const favoritesState = useSelector(state => state.favorites);
  
  return {
    ...favoritesState,
    fetchItems: () => dispatch(fetchFavorites()),
    addItem: (item) => dispatch(addToFavorites(item)),
    removeItem: (itemId) => dispatch(removeFromFavorites(itemId)),
    clear: () => dispatch(clearFavorites())
  };
};

// Combined hook for profile page
export const useProfilePage = () => {
  const user = useUser();
  const profile = useProfile();
  const requests = useRequests();
  const cart = useCart();
  const favorites = useFavorites();
  
  return {
    user,
    profile,
    requests,
    cart,
    favorites
  };
}; 