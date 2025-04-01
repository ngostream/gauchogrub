import * as React from 'react';
import {Link} from "react-router-dom"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import "./HallCard.css"
import "../App.css"
// https://stackoverflow.com/questions/50074276/how-to-import-two-component-but-same-name-from-two-libraries

export default function HallCard({hN}) {
    let image = ""; //should contact ucsb for permission to use images once we move to production
    let title ="";
    if(hN == "Carrillo Dining Commons"){
        image = "https://dining.ucsb.edu/sites/default/files/styles/slid/public/images/dining-commons/carrillo-entrance-night.jpg?itok=YWNO3tpD"
        title = "Carrillo Dining Commons"
    }
    else if(hN == "De La Guerra Dining Commons"){
        image = "https://dining.ucsb.edu/sites/default/files/styles/slid/public/images/dining-commons/dlg1.jpg?itok=ovQMoPAW"
        title = "DLG Dining Commons"
    }
    else if (hN == "Portola Dining Commons"){
        image = "https://dining.ucsb.edu/sites/default/files/styles/slid/public/images/dining-commons/portola2.jpg?itok=YitrfKUn"
        title = "Portola Dining Commons"
    }
    else if (hN == "Ortega Takeout"){
        image = "https://hdae.ucsb.edu/sites/default/files/images/blog/hero-ortega-fromsmig.jpg"
        title = "Ortega Takeout"
    }
  return (
    
    <Link to ={`/${encodeURIComponent(hN)}`}>
    <Card sx={{ maxWidth: 600 }} className = "hover-effect"> {/* change hover shadow color?*/}
      <CardContent>
        <h5>
            {hN}
        </h5>
      </CardContent>
      <CardMedia
        sx={{ height: 225,
            borderRadius: '4px'
         }}
        image= {image}
        title= {title}
      />
    </Card>
    </Link>
  );
}