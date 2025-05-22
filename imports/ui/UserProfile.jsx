import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Avatar, Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import ptBR from 'date-fns/locale/pt-BR';
import '/client/user-profile.css';

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
            }
            else alert('Erro ao atualizar perfil');
        });
    };

  return (
    <form onSubmit={handleSubmit} className="user-profile-form">
      <Stack spacing={2} alignItems="center" sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
        <Avatar src={values.photo} sx={{ width: 100, height: 100 }} />
        <Button variant="contained" component="label">
          Upload Foto
          <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
        </Button>
        <TextField label="Nome" value={values.name} onChange={handleChange('name')} fullWidth />
        <TextField label="Email" value={values.email} onChange={handleChange('email')} fullWidth />

        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          // @ts-ignore
          adapterLocale={ptBR}
        >
          <DatePicker
            label="Data de Nascimento"
            value={values.birthdate}
            onChange={handleDateChange}
            // @ts-ignore
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>

        <FormControl fullWidth>
          <InputLabel>Sexo</InputLabel>
          <Select value={values.sex} label="Sexo" onChange={handleChange('sex')}>
            {sexes.map((s) => (
              <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField label="Empresa" value={values.company} onChange={handleChange('company')} fullWidth />

        
        <div className="form-buttons">
          <Button variant="outlined" onClick={() => navigate("/welcome")}>
            Voltar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </div>
      </Stack>
    </form>
  );
}