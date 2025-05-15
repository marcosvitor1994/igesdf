"use client"
import { Container, Row, Col, Card } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import NavbarMenu from "../components/NavbarMenu"
import logo_iges from "../images/logo-iges.png"

const Home = () => {
  const navigate = useNavigate()

  const cards = [
    {
      title: "Projeto Piloto UPA VP",
      description: "Acompanhamento do projeto piloto na UPA Vicente Pires",
      path: "/projeto-piloto",
      color: "#0052cc",
    },
    {
      title: "Painel NUSAD",
      description: "Visão geral de todos os atendimentos",
      path: "/nusad",
      color: "#00875A",
    },
    {
      title: "Psiquiatria",
      description: "Monitoramento dos atendimentos de Psiquiatria",
      path: "/psiquiatria",
      color: "#E91E63",
    },
    {
      title: "Cardiologia",
      description: "Monitoramento dos atendimentos de Cardiologia",
      path: "/cardiologia",
      color: "#FF5722",
    },
    {
      title: "Pediatria",
      description: "Monitoramento dos atendimentos de Pediatria",
      path: "/pediatria",
      color: "#3F51B5",
    },
    {
      title: "Pneumologia",
      description: "Monitoramento dos atendimentos de Pneumologia",
      path: "/pneumologia",
      color: "#607D8B",
    },
  ]

  const cardStyle = {
    cursor: "pointer",
    height: "100%",
    transition: "transform 0.3s, box-shadow 0.3s",
    border: "none",
    borderRadius: "8px",
    overflow: "hidden",
  }

  const cardHeaderStyle = {
    padding: "20px",
    color: "white",
    fontWeight: "bold",
  }

  return (
    <>
      <NavbarMenu />
      <Container className="py-4">
        <div className="text-center mb-5">
          <img src={logo_iges || "/placeholder.svg"} alt="Logo IGES" style={{ height: "80px" }} />
          <h1 className="mt-3">Núcleo de Inovação, Ensino e Saúde Digital</h1>
          <p className="lead">Painel de Monitoramento</p>
        </div>

        <Row xs={1} md={2} lg={3} className="g-4">
          {cards.map((card, idx) => (
            <Col key={idx}>
              <Card
                style={cardStyle}
                onClick={() => navigate(card.path)}
                className="shadow"
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)"
                  e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)"
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)"
                }}
              >
                <div style={{ ...cardHeaderStyle, backgroundColor: card.color }}>{card.title}</div>
                <Card.Body>
                  <Card.Text>{card.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  )
}

export default Home
