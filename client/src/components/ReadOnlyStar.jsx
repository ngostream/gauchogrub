import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

export default function ReadOnlyStar({r, size}){
    return (
        <Stack spacing={1}>
          <Rating defaultValue ={0} value = {r} size={size} precision={0.5} readOnly/>
        </Stack>
      )
}