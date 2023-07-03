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
  const [loggedIn, setLoggedIn] = useState(false)
  
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
        <Container sx={{height: '100vh', p:2}}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                <Typography variant="h3" component="div" sx = {{marginRight: 40, marginLeft:40, fontFamily: 'Verdana'}}>
                  ChatLiterate.com
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
            <Paper elevation={3} sx={{ height: '60vh', p: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
              <Signup/>
            </Paper>
            </Grid>
            <Grid item xs={6}>
            <Paper elevation={3} sx={{ height: '60vh', p: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
              <Login setLoggedIn={setLoggedIn}/>
            </Paper>
            </Grid>
          </Grid>
        </Container>
        {/* <Login setLoggedIn={setLoggedIn}/> */}
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
              <Paper elevation={2} sx={{ height: 'calc(100vh - 250px)', overflow: 'auto', p: 2, backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
                <Collection/>
              </Paper>
            </Grid>

            {/* Column container for other content */}
            <Grid item xs={6}>
              <Paper elevation={2} sx={{ height: 'calc(100vh - 250px)', overflow: 'auto', p: 2, backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
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