import { useNavigate } from "react-router-dom"
import TimelineProject from "../components/Timeline"
import { Container, Image } from "react-bootstrap"
import logo_iges from "../images/logo-iges.png"

const TimelinePage = () => {
  const navigate = useNavigate()

  const handleFinishPresentation = () => {
    navigate("/home")
  }

  return (
    <Container fluid className="p-0" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div
        style={{ 
          padding: "20px", 
          backgroundColor: "#f8f9fa", 
          borderBottom: "1px solid #dee2e6", 
          textAlign: "center",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
        }}
      >
        <Image src={logo_iges || "/placeholder.svg"} alt="Logo IGES" style={{ height: "60px" }} />
        <h2 style={{ marginTop: "10px", color: "#0052cc" }}>Núcleo de Inovação, Ensino e Saúde Digital - NUSAD</h2>
        <h5 style={{ color: "#555" }}>Cronograma de Implementação</h5>
      </div>
      <div style={{ flex: 1, padding: "20px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <TimelineProject onFinish={handleFinishPresentation} />
      </div>
    </Container>
  )
}

export default TimelinePage