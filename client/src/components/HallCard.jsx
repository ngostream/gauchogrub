import * as React from 'react';
import {Link} from "react-router-dom"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import "../App.css"
// https://stackoverflow.com/questions/50074276/how-to-import-two-component-but-same-name-from-two-libraries

export default function HallCard({hN}) {
    let image = ""; //should contact ucsb for permission to use images once we move to production
    let title ="";
    if(hN == "Carrillo Dining Commons"){
        image = "/img/carrillo.png"
    }
    else if(hN == "De La Guerra Dining Commons"){
        image = "/img/dlg.png"
        title = "DLG Dining Commons"
    }
    else if (hN == "Portola Dining Commons"){
        image = "/img/portola.png"
        title = "Portola Dining Commons"
    }
    else if (hN == "Ortega Takeout"){
        image = "/img/ortega.png"
        title = "Ortega Takeout"
    }
  return (
    
    <Link to ={`/${encodeURIComponent(hN)}`}>
    <Card sx={{ maxWidth: 600 }} className = "hover-effect"> {/* change hover shadow color?*/}
      <CardContent>
        <h5 style={{
          fontSize: "20px",
          fontWeight: "600",
          letterSpacing: "0.5px",
        }}>
            {hN}
        </h5>
      </CardContent>
      <CardMedia
        sx={{ height: 220,
            borderRadius: '4px'
         }}
        image= {image}
        title= {title}
      />
    </Card>
    </Link>
  );
}