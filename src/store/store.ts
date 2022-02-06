import { configureStore } from '@reduxjs/toolkit'
import { loadState } from './localstorage';
import reducer from './reducer';

const store = configureStore({
	reducer: reducer,
	preloadedState: loadState()
})

//localstorage persistance if needed
/*store.subscribe(
	throttle( () => saveState(store.getState()), 1000)
);*/

export default store;