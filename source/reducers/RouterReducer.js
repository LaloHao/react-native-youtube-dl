import { Router } from '../Router.js';

export default (state, action) => {
  const nextState = Router.router.getStateForAction(action, state);

  return nextState || state;
};
