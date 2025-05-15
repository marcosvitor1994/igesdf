"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert, Form, Button, Accordion } from "react-bootstrap"
import NavbarMenu from "../components/NavbarMenu"
import axios from "axios"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Registrar os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const ProjetoPiloto = () => {
  const [data, setData] = useState([])
  const [allData, setAllData] = useState([]) // Armazena todos os dados para o gráfico
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filteredData, setFilteredData] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [filter, setFilter] = useState({
    data: "",
    tipoAtendimento: "",
    medicado: "",
    exames: "",
    alta: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get("https://api-google-sheets-7zph.vercel.app/upa")

        // Verificar se a resposta contém dados
        if (response.data && Array.isArray(response.data.values)) {
          // Processar os dados da API
          const processedData = processData(response.data.values)

          // Armazenar todos os dados para o gráfico
          setAllData(processedData)

          // Filtrar apenas teleconsultas para exibição principal
          const teleconsultaData = processedData.filter(
            (item) => item["ATENDIDO PRESENCIAL OU TELECONSULTA?"] === "TELECONSULTA",
          )

          setData(teleconsultaData)
          setFilteredData(teleconsultaData)
        } else {
          throw new Error("Formato de dados inválido")
        }
      } catch (err) {
        setError("Erro ao carregar os dados. Por favor, tente novamente mais tarde.")
        console.error("Erro na requisição:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Função para processar os dados da API
  const processData = (values) => {
    if (!values || values.length < 2) return []

    const headers = values[0]
    const rows = values.slice(1)

    return rows.map((row) => {
      const item = {}
      headers.forEach((header, index) => {
        item[header] = row[index] || ""
      })
      return item
    })
  }

  useEffect(() => {
    // Aplicar filtros
    let result = [...data]

    if (filter.data) {
      result = result.filter((item) => item.DATA && item.DATA.includes(filter.data))
    }

    if (filter.tipoAtendimento) {
      result = result.filter((item) => item["ATENDIDO PRESENCIAL OU TELECONSULTA?"] === filter.tipoAtendimento)
    }

    if (filter.medicado) {
      result = result.filter((item) => item["MEDICADO NA UNIDADE"] === filter.medicado)
    }

    if (filter.exames) {
      result = result.filter((item) => item["EXAMES NA UNIDADE"] === filter.exames)
    }

    if (filter.alta) {
      if (filter.alta === "MÉDICO UNIDADE") {
        result = result.filter((item) => item["ALTA PELO MÉDICO DA UNIDADE"] === "SIM")
      } else if (filter.alta === "TELEATENDIMENTO") {
        result = result.filter((item) => item["ALTA VIA TELEATENDIMENTO"] === "SIM")
      }
    }

    setFilteredData(result)
  }, [filter, data])

  // Calcular estatísticas - Agora usando filteredData para refletir os filtros aplicados
  const calcularEstatisticas = () => {
    if (!filteredData.length) return null

    const total = filteredData.length
    const teleconsultas = filteredData.filter(
      (item) => item["ATENDIDO PRESENCIAL OU TELECONSULTA?"] === "TELECONSULTA",
    ).length
    const medicados = filteredData.filter((item) => item["MEDICADO NA UNIDADE"] === "SIM").length
    const comExames = filteredData.filter((item) => item["EXAMES NA UNIDADE"] === "SIM").length
    const altaMedico = filteredData.filter((item) => item["ALTA PELO MÉDICO DA UNIDADE"] === "SIM").length
    const altaTele = filteredData.filter((item) => item["ALTA VIA TELEATENDIMENTO"] === "SIM").length

    return {
      total,
      teleconsultas,
      medicados,
      comExames,
      altaMedico,
      altaTele,
      percentMedicados: total > 0 ? ((medicados / total) * 100).toFixed(1) : "0.0",
      percentExames: total > 0 ? ((comExames / total) * 100).toFixed(1) : "0.0",
      percentAltaMedico: total > 0 ? ((altaMedico / total) * 100).toFixed(1) : "0.0",
      percentAltaTele: total > 0 ? ((altaTele / total) * 100).toFixed(1) : "0.0",
    }
  }

  // Preparar dados para o gráfico de linha
  const prepareChartData = () => {
    if (!allData.length) return null

    // Agrupar dados por data
    const dataMap = new Map()

    allData.forEach((item) => {
      const date = item.DATA
      if (!date) return

      if (!dataMap.has(date)) {
        dataMap.set(date, { teleconsulta: 0, presencial: 0 })
      }

      const tipo = item["ATENDIDO PRESENCIAL OU TELECONSULTA?"]
      if (tipo === "TELECONSULTA") {
        dataMap.get(date).teleconsulta += 1
      } else if (tipo === "PRESENCIAL") {
        dataMap.get(date).presencial += 1
      }
    })

    // Ordenar datas
    const sortedDates = Array.from(dataMap.keys()).sort((a, b) => {
      const [diaA, mesA, anoA] = a.split("/").map(Number)
      const [diaB, mesB, anoB] = b.split("/").map(Number)

      if (anoA !== anoB) return anoA - anoB
      if (mesA !== mesB) return mesA - mesB
      return diaA - diaB
    })

    return {
      labels: sortedDates,
      datasets: [
        {
          label: "Teleconsultas",
          data: sortedDates.map((date) => dataMap.get(date).teleconsulta),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          tension: 0.1,
        },
        {
          label: "Atendimentos Presenciais",
          data: sortedDates.map((date) => dataMap.get(date).presencial),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          tension: 0.1,
        },
      ],
    }
  }

  const chartData = prepareChartData()
  const estatisticas = calcularEstatisticas()

  const handleFilterChange = (field, value) => {
    setFilter((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const resetFilters = () => {
    setFilter({
      data: "",
      tipoAtendimento: "",
      medicado: "",
      exames: "",
      alta: "",
    })
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const cardStyle = {
    height: "100%",
    borderRadius: "8px",
    border: "none",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  }

  return (
    <>
      <NavbarMenu />
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Projeto Piloto - UPA Vicente Pires</h1>
          <Button variant="outline-primary" onClick={toggleFilters} className="d-flex align-items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-funnel me-2"
              viewBox="0 0 16 16"
            >
              <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z" />
            </svg>
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
          </Button>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Carregando...</span>
            </Spinner>
            <p className="mt-3">Carregando dados do projeto...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            {/* Filtros - Agora ocultos por padrão */}
            {showFilters && (
              <Card className="mb-4" style={{ borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                <Card.Body>
                  <h5 className="mb-3">Filtros</h5>
                  <Row>
                    <Col md={2} className="mb-3">
                      <Form.Group>
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ex: 13/05"
                          value={filter.data}
                          onChange={(e) => handleFilterChange("data", e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2} className="mb-3">
                      <Form.Group>
                        <Form.Label>Tipo de Atendimento</Form.Label>
                        <Form.Select
                          value={filter.tipoAtendimento}
                          onChange={(e) => handleFilterChange("tipoAtendimento", e.target.value)}
                        >
                          <option value="">Todos</option>
                          <option value="TELECONSULTA">Teleconsulta</option>
                          <option value="PRESENCIAL">Presencial</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={2} className="mb-3">
                      <Form.Group>
                        <Form.Label>Medicado</Form.Label>
                        <Form.Select
                          value={filter.medicado}
                          onChange={(e) => handleFilterChange("medicado", e.target.value)}
                        >
                          <option value="">Todos</option>
                          <option value="SIM">Sim</option>
                          <option value="NÃO">Não</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={2} className="mb-3">
                      <Form.Group>
                        <Form.Label>Exames</Form.Label>
                        <Form.Select
                          value={filter.exames}
                          onChange={(e) => handleFilterChange("exames", e.target.value)}
                        >
                          <option value="">Todos</option>
                          <option value="SIM">Sim</option>
                          <option value="NÃO">Não</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={2} className="mb-3">
                      <Form.Group>
                        <Form.Label>Alta</Form.Label>
                        <Form.Select value={filter.alta} onChange={(e) => handleFilterChange("alta", e.target.value)}>
                          <option value="">Todos</option>
                          <option value="MÉDICO UNIDADE">Médico da Unidade</option>
                          <option value="TELEATENDIMENTO">Teleatendimento</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={2} className="mb-3 d-flex align-items-end">
                      <button className="btn btn-secondary w-100" onClick={resetFilters}>
                        Limpar Filtros
                      </button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            {/* REORGANIZADO: Cards de estatísticas agora vêm primeiro */}
            {estatisticas ? (
              <>
                {/* Primeira linha de cards */}
                <Row className="mb-4">
                  <Col md={4} className="mb-3">
                    <Card style={cardStyle} className="bg-primary text-white">
                      <Card.Body className="text-center">
                        <h2>{estatisticas.total}</h2>
                        <p className="mb-0">Total de Teleconsultas</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Card style={cardStyle} className="bg-success text-white">
                      <Card.Body className="text-center">
                        <h2>
                          {estatisticas.altaTele} ({estatisticas.percentAltaTele}%)
                        </h2>
                        <p className="mb-0">Altas via Teleatendimento</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Card style={cardStyle} className="bg-info text-white">
                      <Card.Body className="text-center">
                        <h2>
                          {estatisticas.altaMedico} ({estatisticas.percentAltaMedico}%)
                        </h2>
                        <p className="mb-0">Altas pelo Médico da Unidade</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Segunda linha de cards */}
                <Row className="mb-4">
                  <Col md={6} className="mb-3">
                    <Card style={cardStyle}>
                      <Card.Body className="text-center">
                        <h3>{estatisticas.medicados}</h3>
                        <p className="text-muted mb-0">Medicados na Unidade</p>
                        <div className="progress mt-2">
                          <div
                            className="progress-bar bg-warning"
                            style={{ width: `${estatisticas.percentMedicados}%` }}
                          >
                            {estatisticas.percentMedicados}%
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Card style={cardStyle}>
                      <Card.Body className="text-center">
                        <h3>{estatisticas.comExames}</h3>
                        <p className="text-muted mb-0">Exames Realizados</p>
                        <div className="progress mt-2">
                          <div className="progress-bar bg-info" style={{ width: `${estatisticas.percentExames}%` }}>
                            {estatisticas.percentExames}%
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            ) : (
              <Alert variant="info" className="mb-4">
                Não há dados disponíveis para exibir estatísticas.
              </Alert>
            )}

            {/* REORGANIZADO: Gráfico de linha agora vem depois dos cards */}
            <Card className="mb-4" style={{ borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
              <Card.Body>
                <h5 className="mb-3">Evolução de Atendimentos por Data</h5>
                {chartData ? (
                  <div style={{ height: "400px" }}>
                    <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "top",
                          },
                          title: {
                            display: true,
                            text: "Comparativo: Teleconsultas vs. Atendimentos Presenciais",
                          },
                          tooltip: {
                            mode: "index",
                            intersect: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: "Número de Atendimentos",
                            },
                          },
                          x: {
                            title: {
                              display: true,
                              text: "Data",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                ) : (
                  <Alert variant="info">Não há dados suficientes para gerar o gráfico.</Alert>
                )}
              </Card.Body>
            </Card>

            {/* Tabela de dados - Em um acordeão */}
            <Accordion className="mb-4">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <div className="d-flex align-items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-table me-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z" />
                    </svg>
                    <span>Detalhes dos Atendimentos</span>
                    <Badge bg="primary" pill className="ms-2">
                      {filteredData.length} registros
                    </Badge>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Cód. Atendimento</th>
                          <th>Paciente</th>
                          <th>Tipo</th>
                          <th>Medicado</th>
                          <th>Exames</th>
                          <th>Reavaliação</th>
                          <th>Alta Médico</th>
                          <th>Alta Tele</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.length > 0 ? (
                          filteredData.map((item, index) => (
                            <tr key={index}>
                              <td>{item.DATA}</td>
                              <td>{item["COD. DE ATENDIMENTO"]}</td>
                              <td>{item["INICIAIS DO PACIENTE"]}</td>
                              <td>
                                <Badge
                                  bg={
                                    item["ATENDIDO PRESENCIAL OU TELECONSULTA?"] === "TELECONSULTA" ? "success" : "info"
                                  }
                                >
                                  {item["ATENDIDO PRESENCIAL OU TELECONSULTA?"]}
                                </Badge>
                              </td>
                              <td>{item["MEDICADO NA UNIDADE"]}</td>
                              <td>{item["EXAMES NA UNIDADE"]}</td>
                              <td>{item["REAVALIAÇÃO"]}</td>
                              <td>{item["ALTA PELO MÉDICO DA UNIDADE"]}</td>
                              <td>{item["ALTA VIA TELEATENDIMENTO"]}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="text-center py-3">
                              Nenhum registro encontrado com os filtros aplicados.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </>
        )}
      </Container>
    </>
  )
}

export default ProjetoPiloto
