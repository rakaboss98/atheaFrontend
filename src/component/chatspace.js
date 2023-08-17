// Import necessary libraries and modules
import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, LinearProgress } from '@mui/material';
import Typewriter from 'typewriter-effect/dist/core';
import Typography from '@mui/material/Typography';
import axios from 'axios';

// Define the ChatSpace functional component
export default function ChatSpace() {

  // State variables
  const [inputValue, setInputValue] = useState('');             // Store the input value
  const [folder, setFolder] = useState('');                     // Store the selected folder name
  const [folders, setFolders] = useState([]);                   // Store the list of available folders
  const [refresh, setRefresh] = useState(false);                // Track if the collections should be refreshed
  const [isLoadingCollection, setIsLoadingCollection] = useState(false); // Loading state for collection fetching
  const [isSubmittingQuery, setIsSubmittingQuery] = useState(false);     // Loading state for chat submission
  const [openaiKey, setOpenaiKey] = useState(localStorage.getItem('openaiKey') || '');  // Get key from cache or set to empty string

  // Constants
  const BASE_URL = 'https://athena-fhmx.onrender.com';         // Base API URL
  const token = localStorage.getItem('token');                 // Retrieve authentication token from local storage

  // Effect hook to fetch available collections from API when component mounts or refresh state changes
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/collections`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        const collections = response.data.collections;
        const folderNames = Object.keys(collections);          // Extract folder names from collections object
        setFolders(folderNames);                               // Update folders state with the fetched folder names
      } catch(error) {
        console.error('Failed to fetch collections', error);
      }
    };

    fetchCollections();
  }, [refresh]);  // Refresh state dependency ensures collections are refetched when refresh state changes

  // Handler to update input value state
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handler to set OpenAI key
  const handleOpenaiKeyChange = (e) => {
    const key = e.target.value;
    setOpenaiKey(key);                    // Update the OpenAI key state
    localStorage.setItem('openaiKey', key); // Save key in cache
  };

  // Handler to manage changes in the selected folder and fetch its content
  const handleFolderChange = async (e) => {
    if (!openaiKey) {
      alert("Please enter your OpenAI API key first."); 
      return;
    }
    const selectedFolder = e.target.value;
    setFolder(selectedFolder);
    setIsLoadingCollection(true); // Set loading state when beginning to fetch collection

    try {
      await axios.get(`${BASE_URL}/user/${encodeURIComponent(selectedFolder)}/download_collection`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      await axios.post(`${BASE_URL}/load_collection/${encodeURIComponent(selectedFolder)}`, {
        openai_api_key: openaiKey  // Hardcoded for demonstration, don't do this in practice.
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
    } catch(error) {
      console.error('Error during folder selection:', error);
    } finally {
      setIsLoadingCollection(false); // Reset loading state after collection fetch completes
    }
  };

  // Handler to toggle the refresh state
  const handleRefresh = () => {
    setRefresh(prevState => !prevState);                      // Toggle the refresh state value
  };

  // Handler to manage chat submissions
  const handleSubmit = async () => {
    setIsSubmittingQuery(true); // Set loading state when beginning chat submission

    try {
      const response = await axios.post(
        `${BASE_URL}/ask/${encodeURIComponent(folder)}`,
        { query: inputValue },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      const apiResponse = response.data;

      setInputValue('');  // Clear the input after submission

      // Initialize the Typewriter effect to display API response
      const tw = new Typewriter(twRef.current, {
        loop: false,
        delay: 80,
      });

      tw.deleteAll()
        .typeString(apiResponse)
        .start();
    } catch (error) {
      console.error('Error during chat submission:', error);
    } finally {
      setIsSubmittingQuery(false); // Reset loading state after chat submission completes
    }
  };

  const twRef = useRef();  // Reference for the Typewriter effect's DOM element

  // Render the ChatSpace component
  return (
    <Box sx={{justifyContent: 'center', alignItems: 'center'}}>
      <Typography sx={{ mt: 2, mb: 4 }} variant="h4" component="div" align="center">
        Chat Space
      </Typography>

      {isLoadingCollection && <LinearProgress sx={{mb: 2, width: '100%'}} />}     {/*Show progress bar if loading collection*/}
      {isSubmittingQuery && <LinearProgress sx={{mb: 2, width: '100%'}} />}       {/*Show progress bar if submitting chat*/}
      {/* OpenAI Key Input */}
      <TextField 
        fullWidth 
        variant="outlined"
        label="OpenAI API Key"
        value={openaiKey}
        onChange={handleOpenaiKeyChange}
        sx={{ mb: 2 }}
        placeholder="Enter your OpenAI API key"
      />
      {/* Collection selection dropdown */}
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

      {/* Typewriter effect display area */}
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

      {/* Input area for chat */}
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

        {/* Action buttons (Refresh and Submit) */}
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