import { combineReducers } from 'redux';

import FileSystemReducer from './FileSystemReducer.js';
import RouterReducer from './RouterReducer.js';

export default makeRootReducer = (asyncReducers) => {
  return combineReducers({
    router: RouterReducer,
    fs: FileSystemReducer,
    ...asyncReducers,
  });
};
