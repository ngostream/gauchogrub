import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {Link} from "react-router-dom"
import { Typography, Box } from '@mui/material';

export default function MealTime({time, sections, ogHn}) {
  // if(time == "Breakfast"){
  // set icon
  // }
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      // subheader={
      //   <ListSubheader component="div" id="nested-list-subheader">
      //     <h2 style = {{textAlign: "left"}}>{time}</h2>
      //   </ListSubheader>
      // }
    >
      <ListItemButton  onClick={handleClick}>
        <ListItemIcon>
          
        </ListItemIcon>
        <h2 style = {{textAlign: "center"}}>{time}</h2>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
        {Object.entries(sections).map(([section,food])=>(
            <div key = {section}>
            <h3 style = {{fontWeight: "normal", textAlign: "left"}} key = {section}>{section}</h3>
                {food.map((items)=>(
                <div key = {items}>
                    <Link to={`/${ogHn}/${encodeURIComponent(items)}`}><ListItemButton style ={{color: "black", fontWeight: "normal"}} > {items}</ListItemButton></Link>
                </div>
            ))}
            </div>
        ))}
          <ListItemButton sx={{ pl: 4 }}>

          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
}
