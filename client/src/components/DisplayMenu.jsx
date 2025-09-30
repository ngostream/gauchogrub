import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "./Nav.jsx";
import "../App.css";

import { normalizeHallName, displayHallName } from "../utils/hallNames.js";
import BackButton from "./BackButton.jsx";
import MealTime from "./MealTime.jsx";

function DisplayMenu({ dict }) {
  const rawHN = decodeURIComponent(useParams().hN);
  const hN = normalizeHallName(rawHN);
  const prettyName = displayHallName(hN);

  // check if hall is closed
  const isClosed =
    !dict[hN] ||
    Object.keys(dict[hN]).length === 0 ||
    Object.values(dict[hN]).every(
      (stations) => !stations || Object.keys(stations).length === 0
    );

  // get visible meal times
  const mealTimes = Object.entries(dict[hN] || {}).filter(
    // eslint-disable-next-line no-unused-vars
    ([time, stations]) => Object.keys(stations).length !== 0
  );

  return (
    <Container style={{ paddingBottom: "80px" }}>
      <Nav />

      {/* back button */}
      <div className="flexLeft">
        <BackButton to="/" />
      </div>

      {/* hall name header */}
      <h1 className="page-header pt-3">{prettyName}</h1>
      <hr />

      {isClosed ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            fontWeight: 600,
            fontSize: "1.2rem",
            backgroundColor: "#f9f9f9",
            padding: "1rem",
            borderRadius: "8px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          {prettyName} is currently closed.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "flex-start", // keep back button stable
          }}
        >
          {mealTimes.map(([times, stations]) => (
            <div
              key={times}
              style={{
                flex: mealTimes.length === 1 ? "1 1 100%" : "0 0 360px",
                minWidth: "360px", // prevents jumping when collapsing
              }}
            >
              <MealTime time={times} sections={stations} ogHn={hN} />
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

export default DisplayMenu;
