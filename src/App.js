import { useEffect } from 'react'
import { Routes , Route, Navigate, useNavigate, Link } from 'react-router-dom'
import { Dashboard } from './components/Pages/Dashboard'
import { Volunteers } from './components/Pages/Volunteers'
import { VolunteerDetails } from './components/Pages/VolunteerDetails'
import { VolunteerSignUp } from './components/Pages/VolunteerSignUp'
import { VolunteerProfile } from './components/Pages/VolunteerProfile'
import { Kids } from './components/Pages/Kids'
import { KidDetails } from './components/Pages/KidDetails'
import { KidSignUp } from './components/Pages/KidSignUp'
import { KidIds } from './components/Pages/KidIds'
import { QrScanner } from './components/Pages/QrScanner'
import { Attendance } from './components/Pages/Attendance'
import { AttendancePrint } from './components/Pages/AttendancePrint'
import { Login } from './components/Pages/Login'
import { PrivacyPolicy } from './components/Pages/PrivacyPolicy'
import { KidDelete } from './components/Pages/KidDelete'
import Nav from './components/Nav'
import { VolunteerIds } from './components/Pages/VolunteerIds'

function App() {
  var token = window.localStorage.getItem('nxtgen.token');
  if (!token) {
    window.localStorage.setItem('nxtgen.isLoggedIn', false);
    window.localStorage.setItem('nxtgen.access', JSON.stringify({}));
  } else {
    const data = JSON.parse(atob(token.split('.')[1]));
    if (new Date(data.exp * 1000) < new Date()) {
      window.localStorage.removeItem('nxtgen.token');
      window.localStorage.setItem('nxtgen.isLoggedIn', false);
      window.localStorage.setItem('nxtgen.access', JSON.stringify({}));
    } else {
      var isLoggedIn = window.localStorage.getItem('nxtgen.isLoggedIn') === 'true';
      var access = JSON.parse(window.localStorage.getItem('nxtgen.access'));
    }
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (window.pathInfo) {
      navigate(window.pathInfo);
    }
  }, []);

  return <>
        <Nav isLoggedIn={isLoggedIn} access={access} />
        <Routes>
            {!isLoggedIn && (
                <>
                <Route path="/login" element={<Login />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/login" />} />
                <Route path="/delete" element={<KidDelete />} />
                </>
            )}
            {isLoggedIn && (
                <>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/scanner" element={<QrScanner />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/attendance/date/:date/service/:service/level/:level" element={<Attendance />} />
                <Route path="/attendance/print/date/:date/service/:service/level/:level" element={<AttendancePrint />} />
                <Route path="/profile" element={<VolunteerProfile />} />
                {access?.users?.includes('view') && <Route path="/volunteers" element={<Volunteers />} />}
                {access?.users?.includes('view') && <Route path="/volunteers/:id" element={<VolunteerDetails />} />}
                {access?.users?.includes('view') && <Route path="/volunteers/print" element={<VolunteerIds />} />}
                {access?.users?.includes('view') && <Route path="/signup" element={<VolunteerSignUp />} />}
                {access?.kids?.includes('view') && <Route path="/kids" element={<Kids />} />}
                {access?.kids?.includes('view') && <Route path="/kids/:id" element={<KidDetails />} />}
                {access?.kids?.includes('view') && <Route path="/kids/print" element={<KidIds />} />}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/delete" element={<KidDelete />} />
                </>
            )}
            <Route path="/register" element={<KidSignUp />} />
            <Route path="/register/:id" element={<KidSignUp />} />
        </Routes>
        <div className="flex-col h-16 bg-gray-50 text-black">
            <p className=" flex justify-center text-sm ml-4 text-gray-400">
              <span>&copy; 2025 NXTGEN Kids Church Ministry</span>
            </p>
            <p className="flex justify-center text-sm ml-4 text-gray-400">
                <Link to="/privacy-policy" className="hover:text-gray-300">Privacy Policy</Link>
            </p>
        </div>
    </>
}

export default App