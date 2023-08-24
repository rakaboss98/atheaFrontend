import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import {useDropzone} from 'react-dropzone'
import { LinearProgress } from '@mui/material';

// Collection component represents the user's collections of books
export default function Collection() {

  // These are the states for this component
  // collectionsUpdated is used to trigger a refetch of the collections after an update
  // selectedFolder is the currently selected collection
  // folders and folderItems are used to store the fetched collection data
  const [collectionsUpdated, setCollectionsUpdated] = React.useState(false)
  const [selectedFolder, setSelectedFolder] = React.useState(null);
  const [folders, setFolders] = React.useState([]);
  const [folderItems, setFolderItems] = React.useState({});
  const [uploading, setUploading] = React.useState(false);

  // useEffect hook to fetch the collections data from the API
  React.useEffect(() => {
    const fetchCollections = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('https://athena-fhmx.onrender.com/user/collections', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        const collections = response.data.collections;
        const folderNames = Object.keys(collections);
        const items = Object.fromEntries(
          Object.entries(collections).map(([folder, books])=>[folder, Object.keys(books)])
        );

        setFolders(folderNames);
        setFolderItems(items);
      } catch(error){
        console.error('Failed to fetch collections', error);
      }
    };

    fetchCollections();
    setCollectionsUpdated(false);

  }, [collectionsUpdated]);

  // When a folder is clicked, select it to show its items
  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
  };

  // Go back to the list of folders
  const handleBackClick = () => {
    setSelectedFolder(null);
  };

  // Add a new folder by making an API request
  const handleAddFolder = async () => {
    const newFolderName = prompt("Enter new folder name");
    if (newFolderName) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`https://athena-fhmx.onrender.com/user/create_collection/${newFolderName}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (response.status === 200) {
          setCollectionsUpdated(true);
        } else {
          console.error('Failed to create new folder', response);
        }
      } catch (error) {
        console.error('Failed to create new folder', error);
      }
    }    
  };

  // Delete a folder by making an API request
  const handleDeleteFolder = async (folderName) => {
    if (window.confirm("Are you sure you want to delete this folder?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`https://athena-fhmx.onrender.com/user/delete_collection/${folderName}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (response.status === 200) {
          setCollectionsUpdated(true);
        } else {
          console.error('Failed to delete folder', response);
        }
      } catch (error) {
        console.error('Failed to delete folder', error);
      }
    }    
  };

// Function to handle file Uploads
const handleFileUpload = async (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    setUploading(true)
    for (let i = 0; i < files.length; i++) {
      try {
        const file = files[i];
        const formData = new FormData();
        formData.append('book', file, file.name);

        const token = localStorage.getItem('token');
        const response = await axios.post(`https://athena-fhmx.onrender.com/user/${selectedFolder}/add_book`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          }
        });

        if (response.status === 200) {
          console.log('File uploaded successfully: ', file.name);
        } else {
          console.error('Failed to upload file', file.name);
        }
      } catch (error) {
        console.error('Failed to upload file', error);
      }
    }
    // Refresh collections after all files have been processed
    setCollectionsUpdated(true);
    setUploading(false);
  }
  };

// Function to handle book deletion
const handleDeleteBook = async (bookName) => {
  if (window.confirm("Are you sure you want to delete this book?")) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`https://athena-fhmx.onrender.com/user/delete_book/${selectedFolder}/${bookName}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.status === 200) {
        console.log('Book deleted successfully: ', bookName);
        setCollectionsUpdated(true);
      } else {
        console.error('Failed to delete book', response);
      }
    } catch (error) {
      console.error('Failed to delete book', error);
    }
  }    
  };

 
  // If a folder is selected, show its items
  if (selectedFolder) {
    return (
      <Box sx={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
        {uploading && <LinearProgress/>}
        <Grid container alignItems="center">
          <Grid item xs={1}>
            <IconButton edge="start" color="inherit" onClick={handleBackClick} aria-label="back">
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid item xs={11}>
            <Typography sx={{ mt: 1.5, mb: 2 }} variant="h4" component="div" align="center">
              {selectedFolder}
            </Typography>
          </Grid>
        </Grid>
        <List>
          {folderItems[selectedFolder].map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item} />
              <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteBook(item)}>
                <DeleteIcon />
              </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      <label htmlFor="upload-button">
        <Button variant="contained" component='span' style={{ margin: 'auto', display: 'flex' }}>
          Upload PDF
        </Button>
      </label>
      <input
        accept="application/pdf"
        style={{ display: 'none' }}
        id="upload-button"
        type="file"
        multiple
        onChange={handleFileUpload}
        />
      </Box>
    );
  }

  // Otherwise, show the list of folders
  return (
    <Box sx={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Typography sx={{ mt: 2, mb: 2, fontWeight: 'bold' }} variant="h4" component="div" align="center">
        My Collections
      </Typography>
      <List>
        {folders.map((folderName, index) => (
          <ListItem onClick={() => handleFolderClick(folderName)} key={index}
          sx={{
            ':hover': {
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            }
          }}
          >
            <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={folderName} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteFolder(folderName)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddFolder}
        style={{ margin: 'auto', display: 'flex' }}
      >
        Add Folder
      </Button>
    </Box>
  );
};
