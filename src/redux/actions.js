import { USER } from './constants';

export const setUser = user => dispatch => {
    dispatch({
      type: USER,
      payload: user
    })
}