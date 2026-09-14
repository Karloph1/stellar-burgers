import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import feedsReducer from './slices/feedSlice';
import burgerConstructorReducer from './slices/burgerSlice';
import ordersReducer from './slices/ordersSlice';
import userReducer from './slices/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feeds: feedsReducer,
  burgerConstructor: burgerConstructorReducer,
  orders: ordersReducer,
  user: userReducer
});

export default rootReducer;
