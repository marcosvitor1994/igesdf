"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Calendar, CheckSquare, Heart, UserCheck, AlertTriangle, RefreshCw, PieChart } from "lucide-react"

const CardiologyDashboard = () => {
  const [pedidos, setPedidos] = useState([])
  const [filteredPedidos, setFilteredPedidos] = useState([])
  const [startDate, setStartDate] = useState(() => {
    return new Date(2025, 4, 1, 12, 0, 0, 0) // Maio = mês 4 (0-indexed)
  })
  const [endDate, setEndDate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    min: new Date(2025, 4, 1, 12, 0, 0, 0), // Maio = mês 4 (0-indexed)
    max: null,
  })
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchPedidos()
  }, [])

  const fetchPedidos = async () => {
    setLoading(true)
    try {
      const response = await axios.get("https://api-google-sheets-7zph.vercel.app/cardiologia")
      const data = response.data.values.slice(1) // Remove header row

      // Set the data
      setPedidos(data)

      // Calculate date range from the data - usando o novo formato de data
      const dates = data.map((pedido) => {
        const dateStr = pedido[1] // "Data da Solicitação" está na coluna 1
        if (!dateStr) return new Date()

        // Formato: "6/2/25 12:54" (M/D/YY H:MM)
        const [datePart] = dateStr.split(" ")
        const [month, day, year] = datePart.split("/")
        // Assumindo que anos de 2 dígitos são 20XX
        const fullYear = year.length === 2 ? `20${year}` : year
        return new Date(fullYear, month - 1, day, 12, 0, 0, 0)
      })

      const maxDate = dates.length > 0 ? new Date(Math.max(...dates)) : new Date()

      setDateRange({ min: new Date(2025, 4, 1, 12, 0, 0, 0), max: maxDate })
      setEndDate(maxDate)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    setRefreshing(true)
    fetchPedidos().finally(() => {
      setTimeout(() => setRefreshing(false), 500)
    })
  }

  useEffect(() => {
    applyFilters()
  }, [pedidos, startDate, endDate])

  const applyFilters = () => {
    if (!pedidos.length) return

    let filtered = [...pedidos]

    if (startDate && endDate) {
      filtered = filtered.filter((pedido) => {
        const dateStr = pedido[1] // "Data da Solicitação" está na coluna 1
        if (!dateStr) return false

        // Formato: "6/2/25 12:54" (M/D/YY H:MM)
        const [datePart] = dateStr.split(" ")
        const [month, day, year] = datePart.split("/")
        const fullYear = year.length === 2 ? `20${year}` : year
        const dataSolicitacao = new Date(fullYear, month - 1, day, 12, 0, 0, 0)

        // Criar datas de comparação no mesmo formato (meio-dia local)
        const startCompare = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 12, 0, 0, 0)
        const endCompare = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 12, 0, 0, 0)

        return dataSolicitacao >= startCompare && dataSolicitacao <= endCompare
      })
    }

    setFilteredPedidos(filtered)
  }

  const formatDateForInput = (date) => {
    if (!date) return ""

    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  // Extract unique status values and count occurrences
  // Status está na coluna 9: "Status Chamado"
  const statusCounts = filteredPedidos.reduce((acc, pedido) => {
    const status = pedido[9] || "Não definido"
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  // Data for the cards
  const totalAtendimentos = filteredPedidos.length
  const atendimentosConcluidos = filteredPedidos.filter((pedido) => pedido[9] === "Concluído").length

  // Extrair médicos únicos - coluna 8: "Especialista"
  const medicos = [
    ...new Set(filteredPedidos.map((pedido) => pedido[8]).filter((medico) => medico && medico !== "Não atribuído")),
  ]

  // Status classes para os novos status da cardiologia
  const statusClasses = {
    Concluído: "status-concluido",
    "Especialista pronto para vídeo": "status-aguardando",
    "Alta Demanda": "status-evadido",
    "Teleconsultor indisponível": "status-evadido",
    "Pedido duplicado": "status-remarcado",
    "Problemas Técnicos": "status-remarcado",
    "Não definido": "status-indefinido",
  }

  return (
    <div className="nusad-container">
      <div className="nusad-header">
        <h1>Painel de Gerenciamento - Cardiologia</h1>

        <button onClick={refreshData} className="refresh-button">
          <RefreshCw size={16} className={refreshing ? "icon-spin" : ""} />
          Atualizar dados
        </button>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label className="filter-label">
            <Calendar size={16} />
            Intervalo de Datas
          </label>
          <div className="date-range">
            <div className="date-input-group">
              <input
                type="date"
                className="date-input"
                value={formatDateForInput(startDate)}
                onChange={(e) => {
                  if (e.target.value) {
                    const [year, month, day] = e.target.value.split("-")
                    const date = new Date(year, month - 1, day, 12, 0, 0, 0)
                    setStartDate(date)
                  } else {
                    setStartDate(null)
                  }
                }}
                min={formatDateForInput(dateRange.min)}
                max={formatDateForInput(endDate || dateRange.max)}
              />
            </div>
            <span className="date-separator">até</span>
            <div className="date-input-group">
              <input
                type="date"
                className="date-input"
                value={formatDateForInput(endDate)}
                onChange={(e) => {
                  if (e.target.value) {
                    const [year, month, day] = e.target.value.split("-")
                    const date = new Date(year, month - 1, day, 12, 0, 0, 0)
                    setEndDate(date)
                  } else {
                    setEndDate(null)
                  }
                }}
                min={formatDateForInput(startDate || dateRange.min)}
                max={formatDateForInput(dateRange.max)}
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <span>Carregando dados...</span>
        </div>
      ) : (
        <>
          <div className="cards-container">
            {/* Card: Total de Atendimentos */}
            <div className="stats-card card-blue">
              <div className="card-icon">
                <CheckSquare className="icon" size={24} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Total</h3>
                <p className="card-value">{totalAtendimentos}</p>
                <p className="card-desc">Total de atendimentos de Cardiologia</p>
              </div>
            </div>

            {/* Card: Atendimentos Concluídos */}
            <div className="stats-card card-green">
              <div className="card-icon">
                <UserCheck className="icon" size={24} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Concluídos</h3>
                <p className="card-value">{atendimentosConcluidos}</p>
                <p className="card-desc">
                  {Math.round((atendimentosConcluidos / totalAtendimentos) * 100) || 0}% do total de atendimentos
                </p>
              </div>
            </div>

            {/* Card: Médicos Atuantes */}
            <div className="stats-card card-pink">
              <div className="card-icon">
                <Heart className="icon" size={24} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Especialistas</h3>
                <p className="card-value">{medicos.length}</p>
                <p className="card-desc">Cardiologistas atuantes no período</p>
              </div>
            </div>

            {/* Card: Atendimentos não concluídos */}
            <div className="stats-card card-amber">
              <div className="card-icon">
                <AlertTriangle className="icon" size={24} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Outros status</h3>
                <p className="card-value">{totalAtendimentos - atendimentosConcluidos}</p>
                <p className="card-desc">
                  {Math.round(((totalAtendimentos - atendimentosConcluidos) / totalAtendimentos) * 100) || 0}% do total
                </p>
              </div>
            </div>
          </div>

          {/* Status breakdown section */}
          <div className="status-breakdown">
            <div className="section-header">
              <PieChart size={20} />
              <h2>Detalhamento por Status</h2>
            </div>

            <div className="status-grid">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className={`status-card ${statusClasses[status] || "status-indefinido"}`}>
                  <div className="status-header">
                    <span className="status-name">{status}</span>
                    <span className="status-count">{count}</span>
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${(count / totalAtendimentos) * 100}%` }}></div>
                  </div>
                  <p className="status-percent">{Math.round((count / totalAtendimentos) * 100) || 0}% do total</p>
                </div>
              ))}
            </div>
          </div>

          {/* Specialty Details */}
          <div className="specialty-details">
            <h2>
              <Heart size={20} className="icon-pink" />
              Detalhes da Especialidade: Cardiologia
            </h2>

            <div className="specialty-stats">
              <div className="specialty-stat blue">
                <h3>Total de atendimentos</h3>
                <p>{totalAtendimentos}</p>
              </div>

              <div className="specialty-stat green">
                <h3>Taxa de conclusão</h3>
                <p>{Math.round((atendimentosConcluidos / totalAtendimentos) * 100) || 0}%</p>
              </div>

              <div className="specialty-stat amber">
                <h3>Cardiologistas atuantes</h3>
                <p>{medicos.length}</p>
              </div>
            </div>

            <div className="specialty-doctors">
              <h3>Cardiologistas da especialidade:</h3>
              <div className="doctors-list">
                {medicos.map((medico, index) => (
                  <span key={index} className="doctor-tag">
                    {medico}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CardiologyDashboard
