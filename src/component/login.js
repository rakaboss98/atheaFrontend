import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, CircularProgress, Box, Paper } from '@mui/material';
import Alert from '@mui/material/Alert';
import axios from 'axios';

export default function Login({setLoggedIn}) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://65.0.163.196/user/authenticate/', { username: loginEmail, password: loginPassword, collections: {} });
      localStorage.setItem('token', res.data.access_token);
      setLoggedIn(true)
    } catch (error) {
      // console.error('Login Error', error);
      setLoginError('Username or password incorrect')
    }
  };

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: '20px', width: '100%'}}>
      <Typography sx={{ mt: 5, mb: 5 }} variant="h4">Login</Typography>
      <TextField label="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
      <TextField label="Password" value={loginPassword} type="password" onChange={e => setLoginPassword(e.target.value)} />
      <Button onClick={handleLogin}>Login</Button>
      {loginError && <Alert severity="error">{loginError}</Alert>}
    </Box>
  );
};
