import React, { useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../login/login.css';

const initialState = {
  loading: false,
  error: '',
  message: '',
  showOtpField: false,
  registerVerify: false,
  token: ''
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'register_request_success':
      return{
        loading: false,
        showOtpField: true,
        registerVerify: true,
        token: action.payload.token,
        message: action.payload.message
      };
    case 'register_request_error':
      return{
        ...state,
        loading:false,
        error: action.payload.data.message,
      }
    case 'register_verify_success':
      return{
        loading: false,
        showOtpField: false,
        token: undefined,
        registerVerify: false,
        message: action.payload.message
      }
    case 'register_verify_error':
      return{
        ...state,
        loading: false,
        error: action.payload.data.message
      }
    case 'pre_request':
      return{
        ...state,
        loading: false,
        error: undefined
      }
    case 'set_error':
      return{
        ...state,
        error: action.message
      }
    case 'set_loading':
      return{
        ...state,
        loading: action.loading
      }
    default: 
      return state;
  }
}

function Register() {

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [state, dispatch]  = useReducer(reducer, initialState);

  const handleRegisterRequest = (data) => {
    if(state.registerVerify === true) return handleRegisterVerify(data);
    if(data.password.length < 4) return dispatch({type:'set_error', message:'Password too short'});
    dispatch({type:'pre_request'});
    const url = `${process.env.REACT_APP_API_URL}/api/auth/register/request`;
    axios({
      method: 'post', url,
      data: {email: data.email}
    })
    .then(resp => {
      dispatch({type: 'register_request_success', payload: resp.data});
    })
    .catch(err => {
      dispatch({type: 'register_request_error', payload: err.response});
    });
  }

  const handleRegisterVerify = (data) => {
    const otp = data.otp;
    const otpLength = otp.toString().length;
    if(otpLength !== 4){
      dispatch({type:'set_error', message: 'Incorrect OTP'});
    }else{
      if(data.password.length < 4) return dispatch({type:'set_error', message:'Password too short'});
      dispatch({type:'set_error', message: undefined});
      const url = `${process.env.REACT_APP_API_URL}/api/auth/register/verify`;
      axios({
        method: 'post', url,
        data: {password: data.password, token: state.token, otp:Number(otp)}
      })
      .then(resp => {
        dispatch({type: 'register_verify_success', payload: resp.data});
        sessionStorage.setItem('token', resp.data.token);
        reset();
      })
      .catch(err => {
        dispatch({type: 'register_verify_error', payload: err.response});
      });
    }
  }

  return (
    <div className="main">
      <p className="login">Register</p>
      {state.message && <p className="message">{state.message}</p>}
      <form onSubmit={handleSubmit(handleRegisterRequest)} className="form1">
        <input 
          className="form-input" 
          name="email" 
          id="email" 
          type="email" 
          placeholder="Email" 
          autoComplete="none"
          {...register('email', { required: true })}
        />
        <div className="form-errors">{errors.email && <p>Email is required.</p>}</div>
        <input 
          className="form-input" 
          name="password" 
          type="password" 
          placeholder="Password"
          autoComplete="none"
          {...register('password', { required: true })}
        />
        <div className="form-errors">{errors.password && <p>Password is required.</p>}</div>
        {state.showOtpField && 
          <>
            <input 
              className="form-input"
              name="otp" 
              type="number"
              placeholder="OTP"
              {...register('otp')}
            />
            <div className="form-errors">{errors.otp && <p>OTP is required</p>}</div>
          </>
        }
        {state.error && <p className="form-errors">{state.error}</p>}
        {state.loading 
          ? <button disabled className="submit" style={{cursor:'pointer'}}>Registering...</button>
          : <button type="submit" className="submit">Register</button> 
        }
        <p className="register">
          <Link 
            to="/login"
            className="register-btn"
            dangerouslySetInnerHTML={{ __html: 'Login' }}
          />
        </p> 
      </form>
    </div>
  )
}

export default Register
