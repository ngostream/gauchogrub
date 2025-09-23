import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import ReadOnlyStar from "./ReadOnlyStar.jsx";
import axios from "axios";
import { normalizeHallName } from "../utils/hallNames.js";

export default function MealTime({ time, sections, ogHn }) {
  const [open, setOpen] = useState(true);

  const hN = normalizeHallName(ogHn);
  const cacheKey = `${hN}-avgRatings`;

  const cachedRatings = localStorage.getItem(cacheKey);
  const [avgRatings, setAvgRatings] = useState(
    cachedRatings ? JSON.parse(cachedRatings) : {}
  );

  useEffect(() => {
    const fetchAvgRatings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/${hN}/avg_ratings`
        );
        setAvgRatings(response.data);
        localStorage.setItem(cacheKey, JSON.stringify(response.data));
      } catch (error) {
        console.error("fetch average rating failed:", error);
      }
    };

    fetchAvgRatings();
  }, [hN, cacheKey]);

  return (
    <List
      sx={{ width: "100%", bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      {/* meal time header */}
      <ListItemButton
        onClick={() => setOpen(!open)}
        sx={{
          mb: 2,
          borderLeft: "6px solid #0F3C67",
          borderRadius: "8px",
          px: 3,
          py: 1.5,
          bgcolor: "#F9F9F9",
          justifyContent: "space-between",
          alignItems: "center",
          "&:hover": { bgcolor: "#eef3f7" },
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0, flex: 1 }}>
          {time}
        </h2>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {Object.entries(sections).map(([section, food]) => (
            <div
              key={section}
              style={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                padding: "0.75rem 1rem",
                margin: "0.5rem 0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              {/* section header */}
              <h3
                style={{
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                  marginBottom: "0.5rem",
                  textAlign: "left",
                }}
              >
                {section}
              </h3>

              {/* food items */}
              {food.map((items) => (
                <Link
                  key={items}
                  to={`/${ogHn}/${encodeURIComponent(items)}`}
                  style={{ textDecoration: "none" }}
                >
                  <ListItemButton
                    sx={{
                      color: "black",
                      fontWeight: 400,
                      borderRadius: "6px",
                      mb: 1,
                      "&:hover": { bgcolor: "#f4f7fa" },
                    }}
                  >
                    {items} &nbsp;
                    <ReadOnlyStar r={avgRatings[items] ?? 0} size="small" />
                  </ListItemButton>
                </Link>
              ))}
            </div>
          ))}
        </List>
      </Collapse>
    </List>
  );
}
