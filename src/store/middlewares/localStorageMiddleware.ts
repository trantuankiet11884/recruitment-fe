import { Middleware } from '@reduxjs/toolkit';
import { IUser } from '~/types/Auth/index';

// Tạo các interface state cho mỗi block state muốn lưu
export interface AuthState {
  loading: boolean;
  currentUser: IUser;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface RootState {
  auth: AuthState;
}

// Các state được lưu
export interface PersistedState {
  auth: Pick<AuthState, 'accessToken' | 'refreshToken' | 'currentUser'>;
}

// Lưu các state của redux vào local
export const localStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState() as RootState;

    const persistedState: PersistedState = {
      auth: {
        accessToken: state.auth.accessToken,
        refreshToken: state.auth.refreshToken,
        currentUser: state.auth.currentUser,
      },
    };

    localStorage.setItem('persistedState', JSON.stringify(persistedState));

    return result;
  };

// Tải state được lưu từ local
export const loadState = (): Partial<RootState> | undefined => {
  try {
    const serializedState = localStorage.getItem('persistedState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState) as Partial<RootState>;
  } catch (err) {
    return undefined;
  }
};