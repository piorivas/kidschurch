import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

function Nav({isLoggedIn, access}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const signInOut = () => {
    if (isLoggedIn) {
      window.localStorage.setItem('nxtgen.isLoggedIn', 'false');
      window.localStorage.setItem('nxtgen.access', JSON.stringify({}));
      window.localStorage.setItem('nxtgen.token', '');
    }
    
    navigate('/login');
  }
  
  return (
    <header className="bg-white shadow-md z-40">
      <nav className="flex items-center w-[92%] mx-auto">
        <Link to="/" className="flex-grow">
          <img className="w-32 my-5" src="https://i.ibb.co/72KrMst/LOGO-Horizontal-Colored.jpg" alt="NXTGEN" border="0" />
        </Link>
        <div className={`z-10 absolute md:static bg-white py-8 md:py-0 justify-center left-0 ${menuOpen ? 'top-[9%]' : 'top-[-100%]'} w-full md:w-auto flex items-center px-5`}>
          <ul className="flex flex-col md:flex-row md:items-center md:gap-[4vw] gap-8" onClick={() => {setMenuOpen(false)}}>
            { isLoggedIn && 
              <li><NavLink className="hover:text-orange-500 active:text-orange-500" to="/scanner" activeclassname="text-orange-500">Scanner</NavLink></li>}
            { isLoggedIn && 
              <li><NavLink className="hover:text-orange-500 active:text-orange-500" to="/attendance" activeclassname="text-orange-500">Attendance</NavLink></li>}
            { (isLoggedIn && access?.kids?.includes('view')) && 
              <li><NavLink className="hover:text-orange-500 active:text-orange-500" to="/kids" activeclassname="text-orange-500">Kids</NavLink></li>}
            { (isLoggedIn && access?.users?.includes('view')) && 
              <li><NavLink className="hover:text-orange-500 active:text-orange-500" to="/volunteers" activeclassname="text-orange-500">Volunteers</NavLink></li>}
            <li><NavLink className="hover:text-orange-500" to="/register" activeclassname="text-orange-500">Registration</NavLink></li>
          </ul>
        </div>
        <div className="flex items-center gap-6">
          {(location.pathname !== '/login' && location.pathname !== '/') && (
            <button 
              className="bg-cyan-500 text-white px-5 py-2 rounded-full hover:bg-cyan-400"
              onClick={() => {signInOut()}}
            >{ isLoggedIn ? 'Sign Out' : 'Sign In'}</button>
          )}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
            className={`size-6 cursor-pointer ${ !isLoggedIn ? 'hidden':''}`} onClick={() => {navigate('/profile')}}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
            className={`size-6 cursor-pointer md:hidden ${ menuOpen ? 'hidden':''}`} onClick={() => {setMenuOpen(!menuOpen)}}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
            className={`size-6 cursor-pointer md:hidden ${ menuOpen ? '':'hidden'}`} onClick={() => {setMenuOpen(!menuOpen)}}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>
      </nav>
    </header>
  );
}

export default Nav;