import { configureStore } from '@reduxjs/toolkit';
import { type PersistConfig, persistReducer, persistStore } from 'redux-persist';
import localStorage from 'redux-persist/lib/storage';
// import sessionStorage from 'redux-persist/lib/storage/session';
import authReducer from '@/features/auth/authSlice';

export interface RootState {
    auth: ReturnType<typeof authReducer>;
    // ui: ReturnType<typeof uiReducer>;
}

export type AppDispatch = typeof store.dispatch;

const authPersistConfig: PersistConfig<ReturnType<typeof authReducer>> = {
    key: 'auth',
    storage: localStorage,
    whitelist: ['token', 'user']
}

// const uiPersistConfig: PersistConfig<ReturnType<typeof authReducer>> = {
//     key: 'ui',
//     storage: sessionStorage,
//     whitelist: []
// }

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
// const persistedUiReducer = persistReducer(uiPersistConfig, authReducer);

const rootReducer = {
    auth: persistedAuthReducer,
    // ui: persistedUiReducer,
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