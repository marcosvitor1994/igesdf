import { Card } from "react-bootstrap"

const DashboardCard = ({ title, value, icon, color }) => {
  const cardStyle = {
    backgroundColor: color,
    color: "white",
    textAlign: "center",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  }

  const iconStyle = {
    fontSize: "2em",
    marginBottom: "10px",
  }

  return (
    <Card style={cardStyle}>
      <Card.Body>
        <div style={iconStyle}>{icon}</div>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{value}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default DashboardCard