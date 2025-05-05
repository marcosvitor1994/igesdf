import { Route, Routes } from "react-router-dom"
import PrivateRoute from "../routes/PrivateRoute"

//pages
import Login from "../pages/Login"
import Home from "../pages/home"

// Páginas de exemplo para cada seção do fluxograma
import Teleconsulta from "../pages/Teleconsulta"
import TeleInterconsulta from "../pages/TeleInterconsulta"
import Rounds from "../pages/Rounds"
import ProjetoPiloto from "../pages/ProjetoPiloto"
import Psiquiatria from "../pages/Psiquiatria"
import Cardiologia from "../pages/Cardiologia"
import Pediatria from "../pages/Pediatria"
import Pneumologia from "../pages/Pneumologia"
import ClinicaMedica from "../pages/ClinicaMedica"
import HbHrsm from "../pages/HbHrsm"
import Nusad from "../pages/Nusad"
import TimelineProject from "../components/Timeline"

const Routers = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* Rotas para cada seção do fluxograma */}
          <Route path="/teleconsulta" element={<Teleconsulta />} />
          <Route path="/teleinterconsulta" element={<TeleInterconsulta />} />
          <Route path="/rounds" element={<Rounds />} />
          <Route path="/projeto-piloto" element={<ProjetoPiloto />} />
          <Route path="/psiquiatria" element={<Psiquiatria />} />
          <Route path="/cardiologia" element={<Cardiologia />} />
          <Route path="/pediatria" element={<Pediatria />} />
          <Route path="/pneumologia" element={<Pneumologia />} />
          <Route path="/clinica-medica-2" element={<ClinicaMedica />} />
          <Route path="/hb-hrsm" element={<HbHrsm />} />
          <Route path="/nusad" element={<Nusad />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/timeline" element={<TimelineProject />} />
      </Routes>
    </>
  )
}

export default Routers
