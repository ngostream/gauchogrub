import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {Link} from "react-router-dom"

export default function MealTime({time, sections, ogHn}) {
  // if(time == "Breakfast"){
  // set icon
  // }
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const getMealColor = (meal) => {
    if (meal === "Breakfast") return "#FFFDE7"; // soft pale gold
    if (meal === "Lunch") return "#E3F2FD";     // light, airy blue
    if (meal === "Dinner") return "#E8EAF6";    // muted lavender-blue
    return "#F5F5F5";                           // default: light gray
  };

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton  onClick={handleClick} sx={{
        backgroundColor: getMealColor(time),
        marginBottom: '10px',
        borderRadius: '8px',
        justifyContent: 'space-between',
        padding: '16px',
      }}>
        <h2 style = {{
          fontSize: '1.5rem',
          margin: 0,
          flex: 1,
          textAlign: "left"
        }}>{time}</h2>
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
