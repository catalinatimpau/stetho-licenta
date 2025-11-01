import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Pacienti from './pages/Pacienti';
import DetaliiPacient from './pages/DetaliiPacient';
import InfoForm from './pages/InfoForm';
import AddPatientForm from './pages/AddPatientForm';





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pacienti" element={<Pacienti />} />
        <Route path="/detalii-pacient" element={<DetaliiPacient />} />
        <Route path="/info" element={<InfoForm />} />
        <Route path="/add-patient" element={<AddPatientForm />} />


      </Routes>
    </Router>
  );
}

export default App;
