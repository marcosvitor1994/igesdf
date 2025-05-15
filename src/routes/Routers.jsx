import { Route, Routes } from "react-router-dom"
import PrivateRoute from "../routes/PrivateRoute"

// Pages
import Login from "../pages/Login"
import Home from "../pages/home"
import ProjetoPiloto from "../pages/ProjetoPiloto"
import Psiquiatria from "../pages/Psiquiatria"
import Cardiologia from "../pages/Cardiologia"
import Pediatria from "../pages/Pediatria"
import Pneumologia from "../pages/Pneumologia"
import Nusad from "../pages/Nusad"

const Routers = () => {
  return (
    <Routes>
      {/* Rota pública - apenas login */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Rotas protegidas */}
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/projeto-piloto" element={<ProjetoPiloto />} />
        <Route path="/psiquiatria" element={<Psiquiatria />} />
        <Route path="/cardiologia" element={<Cardiologia />} />
        <Route path="/pediatria" element={<Pediatria />} />
        <Route path="/pneumologia" element={<Pneumologia />} />
        <Route path="/nusad" element={<Nusad />} />
      </Route>
    </Routes>
  )
}

export default Routers
