import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { useCreate } from "@refinedev/core";
import React, { useState } from 'react';

interface CreateFormProps {
  open: boolean; // Determines if the dialog is open or closed
  onClose: () => void; // Function to be called when the dialog is closed
}

export const CreateForm: React.FC<CreateFormProps> = ({ open, onClose }) => {
  const { mutate: create, isLoading } = useCreate({ resource: "jobs", });
  const [url, setUrl] = useState('');

  const handleSubmit = async () => {
    try {
      create({
        values: {
          url
        },
        successNotification: (data, values, resource) => {
          return {
            message: `L'URL ${url} a été correctement ajouté à la liste des liens à scraper`,
            description: `Tâche correctement enregistrée`,
            type: "success",
          };
        },
      });
      setUrl("");
      onClose();
    }
    catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Informations sur la nouvelle tâche</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="URL de la page à scraper"
          fullWidth
          variant="outlined"
          value={url} // Set the value from state
          onChange={(e) => setUrl(e.target.value)} // Update state on change
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleSubmit}>
          Enregistrer
        </Button>
        <Button onClick={onClose} color="error">
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
};