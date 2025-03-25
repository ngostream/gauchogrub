import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function HallCard({hallName}) {
  return (
    <Card sx={{ maxWidth: 600 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {hallName}
        </Typography>
        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography> */}
      </CardContent>
      <CardMedia
        sx={{ height: 100 }}
        image="/static/images/cards/contemplative-reptile.jpg"
        title="green iguana"
      />
      <CardActions>
        <Button size="small">Directions</Button> {/* link to maps?*/}
        {/* <Button size="small">Learn More</Button> */}
      </CardActions>
    </Card>
  );
}