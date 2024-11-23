import React from "react";
import { Link, NavLink } from "react-router-dom";

function Nav() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <nav>
      <Link to="/" className="title">NxtGen</Link>
      <div className="menu" onClick={() => {
        setMenuOpen(!menuOpen);
      }}><span></span><span></span><span></span></div>
      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink to="/">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/qr-scanner">Qr Scanner</NavLink>
        </li>
        <li>
          <NavLink to="/kids">Kids</NavLink>
        </li>
        <li>
          <NavLink to="/volunteers">Volunteers</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;