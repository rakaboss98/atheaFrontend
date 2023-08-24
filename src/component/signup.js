import React, { useState } from 'react';
import { TextField, Button, Typography, LinearProgress, Box } from '@mui/material';
import Alert from '@mui/material/Alert';
import axios from 'axios';

export default function Signup() {
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async () => {
        setError('');         // Reset any existing errors
        setIsLoading(true);  // Begin loading when starting signup request

        // validate the email domain
        if (!signupEmail.endsWith("@gmail.com")){
            setError('Please sign up with a valid email ID');
            setIsLoading(false) // stop loading since we have client side error
            return;
        };
        try {
            // await axios.post('https://athena-fhmx.onrender.com/user/', { username: signupEmail, password: signupPassword, collections: {} });
            await axios.post('https://65.0.163.196/user/', { username: signupEmail, password: signupPassword, collections: {} });

        } catch (error) {
            console.error('Signup Error', error);
            setError('Signup error. Please try again.'); // If there's an error, display it to the user
        } finally {
            setIsLoading(false);  // Stop loading after the API call is completed, regardless of its result
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <Typography sx={{ mt: 0, mb: 2, fontWeight: 'bold' }} variant="h3">Sign Up</Typography>
            
            {/* Input field for Email */}
            <TextField sx = {{mb:1}} label="Email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} />
            
            {/* Input field for Password */}
            <TextField sx = {{mb:2}} label="Password" value={signupPassword} type="password" onChange={e => setSignupPassword(e.target.value)} />
            
            {/* Signup button; it displays a progress circle if loading, otherwise displays "Sign Up" */}
            <Button sx = {{mb:1}} disabled={isLoading} onClick={handleSignup} variant="contained" color="primary" size="large">
                Sign Up
            </Button>

            {/* Display the linear progress bar when isLoading is true */}
            {isLoading && <LinearProgress sx={{ mt: 2 }} />}
            
            {/* Display error messages if they exist */}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Box>
    );
}
