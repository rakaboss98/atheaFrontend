import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, CircularProgress, Box, Paper } from '@mui/material';
import Alert from '@mui/material/Alert';
import axios from 'axios';

export default function Signup(){
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async () => {
        setError('');
        setIsLoading(true);
        try {
          await axios.post('https://athena-fhmx.onrender.com/user/', { username: signupEmail, password: signupPassword, collections: {} });
          setIsLoading(false);
        } catch (error) {
          console.error('Signup Error', error);
          setIsLoading(false);
          setError('Signup error. Please try again.');
        }
      };

      return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: '20px', width : '100%'}}>
            <Typography sx={{ mt: 5, mb: 5 }} variant="h4">Sign Up</Typography>
            <TextField label="Email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} />
            <TextField label="Password" value={signupPassword} type="password" onChange={e => setSignupPassword(e.target.value)} />
            <Button disabled={isLoading} onClick={handleSignup}>
            {isLoading ? <CircularProgress size={24} /> : "Sign Up"}
            </Button>
            {error && <Alert severity="error">{error}</Alert>}
        </Box>
      );

}