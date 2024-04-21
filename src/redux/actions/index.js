import { LOGIN, SET_PROFILE,LOG_OUT } from "../actionTypes";
import apiService from "../../services/apiService";

export const Logout = ()=>{
  return {
      type:LOG_OUT,
    }
}

export const Login = (data) => {
  return async (dispatch) => {
    try {
      const response = await apiService.login(data);
      console.log("res", response)
      if (response?.status === 200) {
        dispatch({
          type: LOGIN.SUCCESS,
          payload: response,
        });
      } else {

        dispatch({
          type: LOGIN.ERROR,
          payload: response?.message,
        });
      }
    } catch (err) {
      dispatch({
        type: LOGIN.ERROR,
        payload: err?.message,
      });
    }
  };
};
export const RequestLogin = () => {
  return {
    type: LOGIN.REQUEST,
  };
};

export const ResetAuthError = () => {
  return {
    type: LOGIN.RESET,
  };
};

export const SetProfile = (profile) => {
  return {
    type: SET_PROFILE,
    payload: profile,
  };
};
