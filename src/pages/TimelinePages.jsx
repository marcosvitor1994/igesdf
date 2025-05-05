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
        style={{ padding: "20px", backgroundColor: "#f8f9fa", borderBottom: "1px solid #dee2e6", textAlign: "center" }}
      >
        <Image src={logo_iges || "/placeholder.svg"} alt="Logo IGES" style={{ height: "60px" }} />
        <h2 style={{ marginTop: "10px" }}>Núcleo de Inovação, Ensino e Saúde Digital - NUSAD</h2>
        <h5>Cronograma de Implementação</h5>
      </div>
      <div style={{ flex: 1, padding: "20px" }}>
        <TimelineProject onFinish={handleFinishPresentation} />
      </div>
    </Container>
  )
}

export default TimelinePage
