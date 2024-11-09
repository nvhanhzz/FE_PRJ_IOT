import { combineReducers, createStore } from 'redux';

const rootReducer = combineReducers({
});

const clientStore = createStore(rootReducer);

export type ClientDispatch = typeof clientStore.dispatch;
export default clientStore;