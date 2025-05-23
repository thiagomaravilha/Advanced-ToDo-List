import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Avatar,
  Box,
  Paper,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';

const sexes = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Feminino' },
  { value: 'other', label: 'Outro' },
];

export default function UserProfile() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    birthdate: null,
    sex: '',
    company: '',
    photo: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    Meteor.call('userProfile.get', (err, profile) => {
      if (!err && profile) setValues(profile);
    });
  }, []);

  const handleChange = (field) => (event) => {
    setValues({ ...values, [field]: event.target.value });
  };

  const handleDateChange = (date) => {
    setValues({ ...values, birthdate: date });
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (upload) => {
      // @ts-ignore
      setValues({ ...values, photo: upload.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Meteor.call('userProfile.update', values, (err) => {
      if (!err) {
        alert('Perfil atualizado!');
        navigate("/welcome");
      } else {
        alert('Erro ao atualizar perfil');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ maxWidth: 450, mx: "auto", mt: 4, p: 2, position: "relative" }}>
        
        <Box sx={{ position: "absolute", right: -100, top: 0 }}>
          <Avatar
            src={values.photo}
            sx={{ width: 80, height: 80, bgcolor: "#ccc", fontSize: 12 }}
          >
            {!values.photo ? "Foto" : ""}
          </Avatar>
          <Button variant="contained" component="label" sx={{ mt: 1 }}>
            Upload
            <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
          </Button>
        </Box>

        <Paper sx={{ backgroundColor: "#ccc", p: 1, mb: 2 }} variant="outlined">
          <TextField
            label="Nome"
            variant="standard"
            fullWidth
            value={values.name}
            onChange={handleChange('name')}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              disableUnderline: true,
              sx: { backgroundColor: "#ccc" },
            }}
          />
        </Paper>

        <Paper sx={{ backgroundColor: "#ccc", p: 1, mb: 2 }} variant="outlined">
          <TextField
            label="e-mail"
            variant="standard"
            fullWidth
            value={values.email}
            onChange={handleChange('email')}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              disableUnderline: true,
              sx: { backgroundColor: "#ccc" },
            }}
          />
        </Paper>

        <Paper sx={{ backgroundColor: "#ccc", p: 1, mb: 2 }} variant="outlined">
          <LocalizationProvider dateAdapter={AdapterDateFns} 
            // @ts-ignore
            adapterLocale={ptBR}>
            <DatePicker
              label="Data de nascimento"
              value={values.birthdate}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  variant: "standard",
                  fullWidth: true,
                  InputLabelProps: { shrink: true },
                  InputProps: {
                    disableUnderline: true,
                    sx: { backgroundColor: "#ccc" },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Paper>

        <Paper sx={{ backgroundColor: "#ccc", p: 1, mb: 2 }} variant="outlined">
          <FormControl fullWidth variant="standard">
            <InputLabel shrink>Sexo</InputLabel>
            <Select
              value={values.sex}
              onChange={handleChange('sex')}
              disableUnderline
              sx={{ backgroundColor: "#ccc" }}
            >
              {sexes.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        <Paper sx={{ backgroundColor: "#ccc", p: 1, mb: 3 }} variant="outlined">
          <TextField
            label="Empresa"
            variant="standard"
            fullWidth
            value={values.company}
            onChange={handleChange('company')}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              disableUnderline: true,
              sx: { backgroundColor: "#ccc" },
            }}
          />
        </Paper>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button variant="outlined" onClick={() => navigate("/welcome")}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Salvar
          </Button>
        </Box>
      </Box>
    </form>
  );
}
