import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close'; // Material-UI CloseIcon
import Autocomplete from '@mui/material/Autocomplete';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    borderRadius: '4px',
    boxShadow: '24px',
    padding: '16px',
    minWidth: '300px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(2),
  },
  tagsInput: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  tagInput: {
    width: '100%',
  },
}));

const CreateIssueModal = ({ isOpen, onClose, projectID }) => {
  const classes = useStyles();

  const generateRandomIssueID = () => {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 10000);
    const issueID = `ISSUE-${timestamp}-${randomNum}`;
    return issueID;
  };

  const [formData, setFormData] = useState({
    issue_id: generateRandomIssueID(),
    reported_by: localStorage.getItem('username'),
    summary: '',
    description: '',
    assignee: '',
    status: 'opened',
    tags: [],
  });

  const [assignees, setAssignees] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/project/${projectID}/assignees`)
      .then((response) => {
        if (response.status === 200) {
          setAssignees(response.data.assignees);
        }
      })
      .catch((error) => {
        console.error('Error fetching assignees:', error);
      });
  }, [projectID]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:8081/project/${projectID}/add_issue`, formData)
      .then((response) => {
        if (response.status === 200) {
          onClose();
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error('Error creating issue:', error);
      });
  };

  const handleAddTag = () => {
    const { tags, newTag } = formData;
    if (newTag && !tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...tags, newTag], newTag: '' });
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = formData.tags.filter((tag) => tag !== tagToRemove);
    setFormData({ ...formData, tags: updatedTags });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="create-issue-modal"
      aria-describedby="create-issue-description"
    >
      <Box className={classes.modalContent}>
        <Typography variant="h6" id="create-issue-modal" gutterBottom>
          Create Issue
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            label="Issue ID"
            variant="outlined"
            disabled
            value={formData.issue_id}
            required
          />
          <TextField
            label="Summary"
            variant="outlined"
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            required
          />
          <TextField
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
          <FormControl variant="outlined">
            <InputLabel>Assignee</InputLabel>
            <Select
              label="Assignee"
              value={formData.assignee}
              onChange={(e) =>
                setFormData({ ...formData, assignee: e.target.value })
              }
              required
            >
              <MenuItem value="">Select Assignee</MenuItem>
              {assignees?.map((assignee) => (
                <MenuItem
                  key={assignee.username}
                  value={assignee.username}
                  disabled={!assignee.assignable}
                >
                  {assignee.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div>
            <Typography>Tags:</Typography>
            <div className={classes.tagsInput}>
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                />
              ))}
              <TextField
                variant="outlined"
                className={classes.tagInput}
                value={formData.newTag || ''}
                onChange={(e) =>
                  setFormData({ ...formData, newTag: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag and press Enter"
              />
            </div>
          </div>
          <div className={classes.buttonContainer}>
            <Button variant="contained" color="primary" type="submit">
              Create
            </Button>
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateIssueModal;
