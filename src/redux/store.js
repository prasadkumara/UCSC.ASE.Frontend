import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import storeReducer from './storeReducer';

/** Persist redux state on refresh */
import { persistStore } from 'redux-persist';

let _compose = applyMiddleware(thunk)
//let _compose = compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export const store = createStore(
    storeReducer,
    _compose
)

export const persistedState = persistStore(store)
export default { store, persistedState };