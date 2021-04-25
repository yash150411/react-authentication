import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import './login.css';

function Login() {

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [message, setMessage] = useState();

  const handleLogin = (data) => {
    if(data.password.length < 4) return setError('Incorrect Password');
    setLoading(true);
    setError(undefined);
    const url = `${process.env.REACT_APP_API_URL}/api/auth/login`;
      axios({
        method: 'post', url,
        data: {email: data.email, password: data.password}
      })
      .then(resp => {
        setLoading(false);
        sessionStorage.setItem('token', resp.data.token);
        setMessage(resp.data.message);
        reset();
      })
      .catch(err => {
        setLoading(false);
        setMessage(undefined);
        setError(err.response.data.message);
      })
  }

  return (
    <div className="main">
      <p className="login">Login</p>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit(handleLogin)} className="form1">
        <input className="form-input" type="email" name="email" id="email" placeholder="Email" {...register('email', { required: true })}/>
        <div className="form-errors">{errors.email && <p>Email is required.</p>}</div>
        <input className="form-input" type="password" placeholder="Password" {...register('password', { required: true })}/>
        <div className="form-errors">{errors.email && <p>Email is required.</p>}</div>
        {error && <p className="form-errors">{error}</p>}
        {loading 
          ? <button disabled className="submit" style={{cursor:'pointer'}}>Logging In...</button>
          : <button type="submit" className="submit">Login</button> 
        }
        <p className="register"><Link to="/register" className="register-btn" dangerouslySetInnerHTML={{ __html: 'Register' }}/></p> 
      </form>
    </div>
  )
}

export default Login
