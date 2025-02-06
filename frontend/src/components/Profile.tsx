import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Input,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LockResetIcon from '@mui/icons-material/LockReset';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    company: '',
    job_title: '',
    profile_picture: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [token]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      if (response.ok) {
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert(t('passwords_mismatch'));
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/api/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });
      if (response.ok) {
        setPasswordMode(false);
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const formData = new FormData();
      formData.append('profile_picture', e.target.files[0]);
      try {
        const response = await fetch('http://localhost:8000/api/upload-profile-picture/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const data = await response.json();
        setProfileData({ ...profileData, profile_picture: data.profile_picture });
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
  };

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            {t('profile')}
            <IconButton onClick={() => setEditMode(!editMode)} sx={{ float: 'right' }}>
              {editMode ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </Typography>
          
          <label htmlFor="profile-picture-upload">
            <Avatar
              src={profileData.profile_picture}
              sx={{ width: 100, height: 100, cursor: 'pointer', mb: 2 }}
            />
          </label>
          <Input
            id="profile-picture-upload"
            type="file"
            inputProps={{ accept: 'image/*' }}
            onChange={handleFileUpload}
            sx={{ display: 'none' }}
          />

          <form onSubmit={handleProfileSubmit}>
            <TextField
              fullWidth
              label={t('name')}
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              margin="normal"
              disabled={!editMode}
            />
            <TextField
              fullWidth
              label={t('email')}
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              margin="normal"
              disabled={!editMode}
            />
            <TextField
              fullWidth
              label={t('company')}
              name="company"
              value={profileData.company}
              onChange={handleProfileChange}
              margin="normal"
              disabled={!editMode}
            />
            <TextField
              fullWidth
              label={t('job_title')}
              name="job_title"
              value={profileData.job_title}
              onChange={handleProfileChange}
              margin="normal"
              disabled={!editMode}
            />
            {editMode && (
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                {t('save_changes')}
              </Button>
            )}
          </form>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            {t('change_password')}
            <IconButton onClick={() => setPasswordMode(!passwordMode)} sx={{ float: 'right' }}>
              <LockResetIcon />
            </IconButton>
          </Typography>
          
          {passwordMode && (
            <form onSubmit={handlePasswordSubmit}>
              <TextField
                fullWidth
                type="password"
                label={t('current_password')}
                name="current_password"
                value={passwordData.current_password}
                onChange={handlePasswordChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                type="password"
                label={t('new_password')}
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                type="password"
                label={t('confirm_password')}
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
                margin="normal"
                required
              />
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                {t('change_password')}
              </Button>
            </form>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Profile;