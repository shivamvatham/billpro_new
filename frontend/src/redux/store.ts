import { configureStore } from '@reduxjs/toolkit';
import { type PersistConfig, persistReducer, persistStore } from 'redux-persist';
import localStorage from 'redux-persist/lib/storage';
import authReducer from '@/features/auth/authSlice';
import themeReducer from './themeSlice';

export interface RootState {
    auth: ReturnType<typeof authReducer>;
    theme: ReturnType<typeof themeReducer>;
}

export type AppDispatch = typeof store.dispatch;

const authPersistConfig: PersistConfig<ReturnType<typeof authReducer>> = {
    key: 'auth',
    storage: localStorage,
    whitelist: ['token', 'user']
}

const themePersistConfig: PersistConfig<ReturnType<typeof themeReducer>> = {
    key: 'theme',
    storage: localStorage,
    whitelist: ['theme']
}

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer);

const rootReducer = {
    auth: persistedAuthReducer,
    theme: persistedThemeReducer,
}

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
            },
        }),
    devTools: import.meta.env.MODE  !== 'production',
})


export const persistor = persistStore(store);