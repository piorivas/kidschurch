import { Routes , Route } from 'react-router-dom'
import { Dashboard, QrScanner, Kids, KidsForm, Volunteers, VolunteerForm } from './components/Pages'
import Nav from './components/Nav'

function App() {
  return <>
            <Nav />
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/qr-scanner" element={<QrScanner />} />
                <Route path="/kids" element={<Kids />} />
                <Route path="/kids_form" element={<KidsForm />} />
                <Route path="/volunteers" element={<Volunteers />} />
                <Route path="/volunteers_form" element={<VolunteerForm />} />
                <Route path="*" element={<Dashboard />} />
            </Routes>
        </>
}

export default App