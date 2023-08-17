import React, { useState } from 'react';
import { TextField, Button, Typography, LinearProgress, Box } from '@mui/material';
import Alert from '@mui/material/Alert';
import axios from 'axios';

export default function Login({ setLoggedIn }) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);  // State to handle loading status

  const handleLogin = async () => {
    setLoading(true); // Start loading before API call

    try {
      // Secure API endpoints with HTTPS
      const res = await axios.post('https://athena-fhmx.onrender.com/user/authenticate/', { username: loginEmail, password: loginPassword, collections: {} });

      localStorage.setItem('token', res.data.access_token);
      setLoggedIn(true);
    } catch (error) {
      // In case of an error, display it to the user
      setLoginError('Username or password incorrect');
    } finally {
      setLoading(false); // Stop loading after API call, regardless of success or failure
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      <Typography sx={{ mt: 5, mb: 5 }} variant="h4">Login</Typography>

      <TextField label="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />

      <TextField label="Password" value={loginPassword} type="password" onChange={e => setLoginPassword(e.target.value)} />

      <Button onClick={handleLogin} disabled={loading}>  {/* Disable button during loading */}
        Login
      </Button>

      {loading && <LinearProgress sx={{ mt: 2 }} />} {/* Show linear progress bar during loading */}
      
      {loginError && <Alert severity="error" sx={{ mt: 2 }}>{loginError}</Alert>}
    </Box>
  );
};
