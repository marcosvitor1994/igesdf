"use client"
import { Form } from "react-bootstrap"

const SpecialtyFilter = ({ specialties, onFilterChange }) => {
  return (
    <Form.Group>
      <Form.Label>Especialidade:</Form.Label>
      <Form.Control as="select" onChange={(e) => onFilterChange(e.target.value)}>
        <option value="">Todas</option>
        {specialties.map((specialty) => (
          <option key={specialty} value={specialty}>
            {specialty}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  )
}

export default SpecialtyFilter
