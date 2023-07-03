import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import Typewriter from 'typewriter-effect/dist/core';
import Typography from '@mui/material/Typography';
import axios from 'axios';

// Our main ChatSpace Component
export default function ChatSpace() {
  // State variable for the user's chat input
  const [inputValue, setInputValue] = useState('');

  // State variable for the currently selected folder from dropdown
  const [folder, setFolder] = useState('');

  // State variable for the list of folders that the user can select from
  const [folders, setFolders] = useState([]);

  // State variable to trigger useEffect and refresh the list of collections
  const [refresh, setRefresh] = useState(false);

  // Effect hook to fetch the collections
  useEffect(() => {
    // Function to fetch collections
    const fetchCollections = async () => {
      try {
        // Get the user's token from local storage
        const token = localStorage.getItem('token');

        // Request the user's collections from the server
        const response = await axios.get('http://65.0.163.196/user/collections', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        // Parse the collections from the response
        const collections = response.data.collections;
        const folderNames = Object.keys(collections);

        // Update the list of folders
        setFolders(folderNames);
      } catch(error) {
        // Log any errors
        console.error('Failed to fetch collections', error);
      }
    };

    // Fetch the collections
    fetchCollections();
  }, [refresh]); // Depend on the refresh state variable so the effect is re-run when refresh changes

  // Function to handle changes to the chat input
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Function to handle selection of a folder from the dropdown
  const handleFolderChange = (e) => {
    setFolder(e.target.value);
  };

  // Function to handle clicking the refresh button
  const handleRefresh = () => {
    setRefresh(prevState => !prevState); // Flip the refresh state variable to trigger the effect
  };

  // Function to handle submitting a chat message
  const handleSubmit = () => {
    // Construct the chat response
    const response = inputValue + '\n' + "This is the mock response from the API call.";

    // Reset the chat input field
    setInputValue('');

    // Initialize the typewriter with the chat response
    const tw = new Typewriter(twRef.current, {
      loop: false,
      delay: 80,
    });

    tw.deleteAll() // Delete all currently printed strings
      .typeString(response) // Type the new string
      .start(); // Begin typing
  };

  // Ref for the Typewriter component
  const twRef = useRef();

  return (
    // Container for the chat UI
    <Box sx={{justifyContent: 'center', alignItems: 'center'}}>
      {/* Chat title */}
      <Typography sx={{ mt: 2, mb: 4 }} variant="h4" component="div" align="center">
        Chat Space
      </Typography>
      {/* Folder selection dropdown */}
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Collection</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={folder}
            label="Collection"
            onChange={handleFolderChange}
        >
            {folders.map((folderName, index) => (
                <MenuItem key={index} value={folderName}>{folderName}</MenuItem>
            ))}
        </Select>
      </FormControl>
      {/* Area for displaying chat messages */}
      <Box
        sx={{
          backgroundColor: 'grey.200',
          borderRadius: 'borderRadius',
          p: 2,
          minHeight: '150px',
          mt: 2,
          mb: 2,
          overflow: 'auto',
        }}
      >
        <div ref={twRef}></div>
      </Box>
      {/* Area for user to input chat messages */}
      <Grid container direction="column" sx={{ height: '1fr' }}>
        <Grid item xs={12}>
          <TextField
            multiline
            variant="outlined"
            value={inputValue}
            onChange={handleInputChange}
            rows={5}
            sx={{ width: '100%', marginBottom: '16px' }}
          />
        </Grid>
        {/* Submit and Refresh button */}
        <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center', flex: 1, alignItems: 'flex-end'}}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleRefresh}
            sx={{mr: 2, width: '150px', height: '50px'}}
          >
            Refresh collections
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{mr: 2, width: '150px', height: '50px'}}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
