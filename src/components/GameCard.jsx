import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
    Chip,
    Box
} from '@mui/material';

const GameCard = ({ game }) => {
    return (
        <Card
            sx={{
                // Ocupa 100% da célula do Grid que criamos
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 3,
                transition: '0.3s',
                '&:hover': {
                    transform: 'translateY(-5px)', // Efeito quando passar o mouse
                    boxShadow: 6,
                }
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    sx={{
                        height: 180,
                        objectFit: 'cover',
                        objectPosition: 'center top'
                    }}
                    image={game.thumbnail}
                    alt={game.title}
                />
                <Chip
                    label={game.genre}
                    size="small"
                    color="primary"
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        fontWeight: 'bold',
                        fontSize: '0.7rem'
                    }}
                />
            </Box>

            <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    title={game.title}
                    sx={{
                        fontWeight: 'bold',
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {game.title}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mt: 1
                    }}
                >
                    {game.short_description}
                </Typography>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    variant="contained"
                    fullWidth
                    href={game.game_url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Ver Detalhes
                </Button>
            </CardActions>
        </Card>
    );
};

export default GameCard;