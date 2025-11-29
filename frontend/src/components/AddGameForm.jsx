import React, { useState } from 'react';
import {
    Box, TextField, Button, Grid, MenuItem, Typography, Alert, Paper
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete'; // Ícone para cancelar
import { useGame } from '../contexts/GameContext.jsx';

const GENRES = [
    "Shooter", "MMORPG", "Strategy", "MOBA", "Racing", "Sports", "Social", "Sandbox",
    "Open-World", "Survival", "PvP", "PvE", "Pixel", "Zombie", "Turn-Based",
    "Fantasy", "Sci-Fi", "Action", "Horror", "Fighting"
];

const INITIAL_FORM_STATE = {
    title: '',
    short_description: '',
    game_url: '',
    thumbnail: '',
    genre: '',
    platform: 'Web Browser'
};

const AddGameForm = ({ onSuccess }) => {
    const { createGame } = useGame();

    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Função para Limpar e Fechar (Cancelar)
    const handleCancel = () => {
        setFormData(INITIAL_FORM_STATE); // Reseta os campos
        setError('');
        if (onSuccess) onSuccess(); // Fecha o formulário
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        if (!formData.title || !formData.short_description || !formData.game_url || !formData.genre) {
            setError('Preencha todos os campos obrigatórios (*)');
            setSubmitting(false);
            return;
        }

        const result = await createGame(formData);

        if (result.success) {
            setFormData(INITIAL_FORM_STATE); // Limpa após sucesso
            if (onSuccess) onSuccess();
        } else {
            setError(result.message);
        }
        setSubmitting(false);
    };

    return (
        <Paper elevation={3} sx={{ mt: 2, p: 3, bgcolor: '#f9f9f9', borderLeft: '6px solid #1976d2' }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                Cadastrar Novo Jogo
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} direction="column">

                    <Grid item xs={12}>
                        <TextField
                            fullWidth label="Título do Jogo *" name="title"
                            value={formData.title} onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth select label="Gênero *" name="genre"
                            value={formData.genre} onChange={handleChange}
                            // --- A CORREÇÃO MÁGICA ESTÁ AQUI ---
                            // disablePortal: true mantém o menu 'dentro' do DOM do formulário,
                            // impedindo que o ClickAwayListener feche o form ao clicar no select.
                            SelectProps={{
                                MenuProps: { disablePortal: true }
                            }}
                        >
                            {GENRES.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth label="Breve Descrição *" name="short_description"
                            multiline rows={3} value={formData.short_description} onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth label="URL do Jogo (Link) *" name="game_url"
                            placeholder="https://..." value={formData.game_url} onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth label="URL da Imagem (Thumbnail)" name="thumbnail"
                            placeholder="https://..." value={formData.thumbnail} onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleCancel}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                startIcon={<SaveIcon />}
                                disabled={submitting}
                            >
                                {submitting ? 'Salvando...' : 'Salvar Jogo'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default AddGameForm;