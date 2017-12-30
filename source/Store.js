import { applyMiddleware, compose, createStore } from 'redux';
import makeRootReducer from './reducers';

import devTools, { composeWithDevTools } from 'remote-redux-devtools';

import { autoRehydrate } from 'redux-persist';

export default (initialState = {  }) => {
  const middleware = [];

  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      autoRehydrate(),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
      // devTools({
      //   realtime: true,
      //   suppressConnectErrors: false,
      //   name: 'YT',
      //   hostname: 'localhost',
      //   port: 8000,
      // })
    )
  );

  return store;
};
