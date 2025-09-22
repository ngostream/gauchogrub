import React , {useState, useEffect} from "react"
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {Link} from "react-router-dom";
import ReadOnlyStar from "./ReadOnlyStar.jsx";
import axios from "axios";
export default function MealTime({time, sections, ogHn}) {
  const [open, setOpen] = React.useState(true);
  const [avgRatings, setAvgRatings] = useState({});
  useEffect(() => {
    const cacheKey = `${ogHn}-avgRatings`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setAvgRatings(JSON.parse(cached));
    }
    const fetchAvgRatings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/${ogHn}/avg_ratings`);
        setAvgRatings(response.data);
        localStorage.setItem(cacheKey, JSON.stringify(response.data));
      } catch (error) {
        console.error("fetch average rating failed:", error);
      }
    };
    if (Object.keys(sections).length > 0) {
      fetchAvgRatings();
    }
  }, [ogHn, sections]);
  
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton  onClick={handleClick} sx={{
        marginBottom: '10px',
        borderLeft: '6px solid #0F3C67',
        borderRadius: '4px',
        padding: '16px',
        backgroundColor: '#F9F9F9',
        justifyContent: 'space-between',
        alignItems: 'center'
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
            <div
              key={section}
              style={{
                backgroundColor: "#fafafa",
                borderRadius: "8px",
                padding: "0.5rem 0.75rem",
                margin: "0.5rem 0"
              }}
            >
            <h3 style = {{
              fontWeight: "500",
              letterSpacing: "0.5px",
              textAlign: "left"}}
              key = {section}>{section}
            </h3>
                {food.map((items)=>(
                <div key = {items}>
                    <Link to={`/${ogHn}/${encodeURIComponent(items)}`}><ListItemButton style ={{color: "black", fontWeight: "normal"}} > {items} &nbsp; <ReadOnlyStar r = {avgRatings[items] ?? 0} size = "small"/></ListItemButton></Link>
                </div>
            ))}
            </div>
        ))}
        </List>
      </Collapse>
    </List>
  );
}
