// Import necessary libraries and components
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Collection from './component/collection';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chatspace from './component/chatspace';
import Login from './component/login';
import Signup from './component/signup';
import Button from '@mui/material/Button';

const root = ReactDOM.createRoot(document.getElementById('root'));

function App(){
  const [loggedIn, setLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  function logout() {
    localStorage.removeItem('token');
    setLoggedIn(false);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  if (!loggedIn){
    return (
      <Container sx={{height: '100vh', mt: 2, mb: 2, pl: 2, pr: 2}} maxWidth={false}>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={7} sx={{ p: 1 }}>
            <Box sx={{ 
                p: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'left', 
                justifyContent: 'center', 
                height: '100%'  // Makes sure the box takes full height
              }}>
              <Typography variant="h2" component="div" sx={{ fontWeight: '', mt: 3 }}>
                Docscreen.ai
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mt: 2, ml:0.50}}>
                Where Document Management Meets Intelligent Question-Answering
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Paper elevation={3} sx={{ minHeight: '75vh', maxHeight: '100vh', p: 3, mt: 3, mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              { showSignup ? <Signup/> : <Login setLoggedIn={setLoggedIn}/> }
              <Button onClick={() => setShowSignup(!showSignup)}>
                { showSignup ? "Already have an account? Sign In" : "Not a user yet? Sign Up" }
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
  else {
    return (
      <Container sx={{ height: '100vh', p: 2 }} maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, overflow: 'auto'}}>
              <Typography variant="h2" sx={{ fontFamily: '' }}>
                Docscreen.ai
              </Typography>
              <Button onClick={logout} sx={{ backgroundColor: '#ff0000', color: '#ffffff' }}>logout</Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Paper elevation={2} sx={{ height: 'calc(100vh - 175px)', overflow: 'auto', p: 2 }}>
              <Collection/>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={7}>
            <Paper elevation={2} sx={{ height: 'calc(100vh - 175px)', overflow: 'auto', p: 2 }}>
              <Chatspace/>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

root.render(<App/>);
