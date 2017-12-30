import {
  SELECT_FOLDER,
} from '../actions/types';

const INITIAL_STATE = {
  folder: '',
};

export default (state = INITIAL_STATE, action) => {
  let folder;

  switch(action.type) {
  case SELECT_FOLDER:

    folder = action.folder;

    return {...state, folder};

  default:
    return state;

  }
};
