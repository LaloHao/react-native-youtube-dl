import {
  SELECT_FOLDER,
} from './types.js';

export const selectFolder = (folder) => {
  return {
    type: SELECT_FOLDER,
    folder
  };
};
