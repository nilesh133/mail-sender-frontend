import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import './jobapplicationform.css';

const JobApplicationForm = () => {
    const [formData, setFormData] = useState({
        recruiterName: '',
        emailTo: '',
        companyName: '',
        profile: '',
    });
    const [resume, setResume] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!resume) {
            setError('Please upload your resume before submitting.');
            setSuccess(false);
            return;
        }

        const data = new FormData();
        data.append('recruiterName', formData.recruiterName);
        data.append('emailTo', formData.emailTo);
        data.append('companyName', formData.companyName);
        data.append('profile', formData.profile);
        data.append('resume', resume);

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/send-email`, data);
            setSuccess(true);
            setFormData({ recruiterName: '', emailTo: '', companyName: '', profile: '' });
            setResume(null);
        } catch (err) {
            const message = err.response?.data || 'Failed to send email. Please try again later.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
        className="jaf_main">
            {/* <Typography variant="h5" textAlign="center" mb={3}>
                Job Application Form
            </Typography> */}

            {success && <Alert severity="success" sx={{ mb: 2 }}>Email sent successfully!</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <TextField
                    // label="Recruiter Name"
                    name="recruiterName"
                    value={formData.recruiterName}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    placeholder='Recruiter Name'
                />
                <TextField
                    // label="Email To"
                    name="emailTo"
                    value={formData.emailTo}
                    onChange={handleChange}
                    type="email"
                    fullWidth
                    required
                    margin="normal"
                    placeholder='Email To'
                />
                <TextField
                    // label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    placeholder='Company Name'
                />
                <TextField
                    // label="Job Profile"
                    name="profile"
                    value={formData.profile}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    placeholder="Job Profile"
                />
                <Button
                    variant="outlined"
                    component="label"
                    sx={{ mt: 2 }}
                    fullWidth
                >
                    Upload Resume
                    <input
                        type="file"
                        hidden
                        accept=".pdf"
                        onChange={handleFileChange}
                    />
                </Button>
                {resume && (
                    <Typography variant="body2" color="textSecondary" mt={1}>
                        Selected File: {resume.name}
                    </Typography>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                    fullWidth
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
            </form>
        </Box>
    );
};

export default JobApplicationForm;
