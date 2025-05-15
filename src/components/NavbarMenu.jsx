"use client"

import { useState } from "react"
import { Navbar, Container, Nav, Offcanvas, Button } from "react-bootstrap"
import { useNavigate, useLocation } from "react-router-dom"
import logo_iges from "../images/logo-iges.png"

const NavbarMenu = () => {
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const navigateTo = (path) => {
    navigate(path)
    handleClose()
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const menuItems = [
    { path: "/home", name: "Início" },
    { path: "/projeto-piloto", name: "Projeto Piloto UPA VP" },
    { path: "/nusad", name: "Painel NUSAD" },
    { path: "/psiquiatria", name: "Psiquiatria" },
    { path: "/cardiologia", name: "Cardiologia" },
    { path: "/pediatria", name: "Pediatria" },
    { path: "/pneumologia", name: "Pneumologia" },
  ]

  const navStyle = {
    backgroundColor: "#0052cc",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  }

  const logoStyle = {
    height: "40px",
    marginRight: "10px",
  }

  const menuItemStyle = {
    padding: "12px 20px",
    margin: "5px 0",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  }

  // Estilo para item ativo - agora usando laranja
  const activeStyle = {
    backgroundColor: "#FF8C00", // Cor laranja
    color: "white",
    fontWeight: "bold",
  }

  return (
    <>
      <Navbar style={navStyle} variant="dark" expand="lg" className="mb-3">
        <Container fluid>
          <Navbar.Brand href="/home" className="d-flex align-items-center">
            <img src={logo_iges || "/placeholder.svg"} alt="Logo IGES" style={logoStyle} />
            <span>Painel NUSAD</span>
          </Navbar.Brand>

          {/* Botão para menu offcanvas em telas menores */}
          <Button variant="outline-light" onClick={handleShow} className="d-flex align-items-center">
            <span className="me-2">Menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>
        </Container>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose} placement="end" backdrop="static">
        <Offcanvas.Header closeButton className="bg-light">
          <Offcanvas.Title>Menu de Navegação</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <Nav className="flex-column p-3">
            {menuItems.map((item) => (
              <div
                key={item.path}
                className={`nav-link ${isActive(item.path) ? "text-white" : ""}`}
                style={{
                  ...menuItemStyle,
                  ...(isActive(item.path) ? activeStyle : {}),
                }}
                onClick={() => navigateTo(item.path)}
              >
                {item.name}
              </div>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default NavbarMenu
