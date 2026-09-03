import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie'; // функции для работы с cookie
import { TUser } from '../../utils/types';

type TUserState = {
  isAuthChecked: boolean;
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  isAuthChecked: false,
  user: null,
  isLoading: false,
  error: null
};

const saveTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getUser = createAsyncThunk<TUser, void>(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      if (!response.success) {
        return rejectWithValue('Ошибка загрузки пользователя');
      }
      return response.user;
    } catch (error) {
      clearTokens();
      return rejectWithValue(error);
    }
  }
);

export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(loginData);
      if (!response.success) {
        return rejectWithValue('Не удалось войти');
      }
      saveTokens(response.accessToken, response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (registerData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(registerData);
      if (!response.success) {
        return rejectWithValue('Не удалось зарегистрироваться');
      }
      saveTokens(response.accessToken, response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/update',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(userData);
      if (!response.success) {
        return rejectWithValue('Не удалось обновить данные');
      }
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logoutUser = createAsyncThunk<void, void>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();
      if (!response.success) {
        return rejectWithValue('Не удалось выйти');
      }
      clearTokens();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const checkUserAuth = createAsyncThunk<void, void>(
  'user/checkAuth',
  async (_, { dispatch, getState }) => {
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      try {
        await dispatch(getUser()).unwrap();
      } catch {
        clearTokens();
      }
    } else {
      clearTokens();
    }
    dispatch(authChecked());
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.error = null;
      clearTokens();
    },
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error =
          (action.payload as string) || 'Ошибка загрузки пользователя';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = (action.payload as string) || 'Ошибка входа';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.isLoading = false;
          state.user = action.payload;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = (action.payload as string) || 'Ошибка регистрации';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка обновления';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка выхода';
      });
  }
});

export const { authChecked, clearUser, resetError } = userSlice.actions;
export default userSlice.reducer;
