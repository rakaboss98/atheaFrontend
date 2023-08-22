// Import necessary libraries and components
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importing global styles
import Collection from './component/collection'; // Importing the Collection component
import Paper from '@mui/material/Paper'; // Material UI Paper component
import Container from '@mui/material/Container'; // Material UI Container component
import Grid from '@mui/material/Grid'; // Material UI Grid component
import Box from '@mui/material/Box'; // Material UI Box component
import Typography from '@mui/material/Typography'; // Material UI Typography component
import Chatspace from './component/chatspace';
import Login from './component/login';
import Signup from './component/signup';
import Button from '@mui/material/Button';

// Get root element for React to hook into
const root = ReactDOM.createRoot(document.getElementById('root'));


function App(){
  const [loggedIn, setLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);  // New state variable to track which form to display
  
  function logout() {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  if (!loggedIn){
    return (
      <React.StrictMode>
        <Container sx={{height: '100vh', mt:5, mb:5, pl:2, pr:2}} maxWidth={false}>
          <Grid container spacing={0}>
            {/* ... Header component here ... */}
            <Grid item xs={7} sx={{p:1}}>
              <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', overflow: 'auto' }}>
                <Typography variant="h1" component="div" sx={{ fontWeight: '', marginTop: 30 }}>
                  Docscreen.ai
                </Typography>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', marginTop: 2, ml: 0.75 }}>
                  Document Management Meets Intelligent Question-Answering
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Paper elevation={3} sx={{ height: '75vh', p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                { showSignup ? <Signup/> : <Login setLoggedIn={setLoggedIn}/> }
                <Button onClick={() => setShowSignup(!showSignup)}>
                  { showSignup ? "Already have an account? Sign In" : "Not a user yet? Sign Up" }
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </React.StrictMode>
    )
  }
  else {
    return (
      <React.StrictMode>
        <Container sx={{ height: '100vh', p: 2 }}>
          <Grid container spacing={3}>
            {/* Header container */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                <Typography variant="h3" component="div" sx = {{marginRight: 32, marginLeft:48, fontFamily: 'Verdana'}}>
                  ChatLiterate.com
                </Typography>
                <Button onClick={logout} sx={{ backgroundColor: '#ff0000', color: '#ffffff' }}>logout</Button>
              </Paper>
            </Grid>

            {/* Column container for Collection Component */}
            <Grid item xs={6}>
              <Paper elevation={2} sx={{ height: 'calc(100vh - 175px)', overflow: 'auto', p: 2, backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
                <Collection/>
              </Paper>
            </Grid>

            {/* Column container for other content */}
            <Grid item xs={6}>
              <Paper elevation={2} sx={{ height: 'calc(100vh - 175px)', overflow: 'auto', p: 2, backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                <Chatspace/>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </React.StrictMode>
    );
  }
}

// Render the main application
root.render(<App/>);