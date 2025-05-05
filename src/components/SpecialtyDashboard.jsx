"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Calendar, CheckSquare, Heart, UserCheck, AlertTriangle, RefreshCw, PieChart } from "lucide-react"

const SpecialtyDashboard = ({ specialtyName, showSpecialtyFilter = false, additionalFeatures = false }) => {
  const [pedidos, setPedidos] = useState([])
  const [filteredPedidos, setFilteredPedidos] = useState([])
  const [specialtyFilter, setSpecialtyFilter] = useState(specialtyName || "")
  const [startDate, setStartDate] = useState(() => {
    const date = new Date("2025-04-01T12:00:00") // Adicionando horário para evitar problemas de fuso
    return date
  })
  const [endDate, setEndDate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    min: new Date("2025-04-01T12:00:00"),
    max: null,
  })
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchPedidos()
  }, [])

  const fetchPedidos = async () => {
    setLoading(true)
    try {
      const response = await axios.get("https://api-google-sheets-7zph.vercel.app/hospital")
      const data = response.data.values.slice(1) // Remove header row

      // Set the data
      setPedidos(data)

      // Calculate date range from the data
      const dates = data.map((pedido) => {
        const datePart = pedido[1].split(" ")[0] // Extract date part
        const [day, month, year] = datePart.split("/")
        return new Date(`${year}-${month}-${day}`)
      })

      const maxDate = dates.length > 0 ? new Date(Math.max(...dates)) : new Date()

      setDateRange({ min: new Date("2025-04-01T12:00:00"), max: maxDate })
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
  }, [pedidos, specialtyFilter, startDate, endDate])

  const applyFilters = () => {
    if (!pedidos.length) return

    let filtered = [...pedidos]

    if (specialtyFilter) {
      filtered = filtered.filter((pedido) => pedido[6] === specialtyFilter)
    }

    if (startDate && endDate) {
      filtered = filtered.filter((pedido) => {
        const dataParts = pedido[1].split(" ")[0].split("/")
        const dataSolicitacao = new Date(`${dataParts[2]}-${dataParts[1]}-${dataParts[0]}`)
        return dataSolicitacao >= startDate && dataSolicitacao <= endDate
      })
    }

    setFilteredPedidos(filtered)
  }

  const handleSpecialtyFilterChange = (event) => {
    setSpecialtyFilter(event.target.value)
  }

  const formatDateForInput = (date) => {
    if (!date) return ""
    // Cria uma nova data para evitar problemas de fuso horário
    const localDate = new Date(date.getTime())
    // Ajusta para meio-dia para evitar problemas de fuso
    localDate.setHours(12, 0, 0, 0)

    const day = localDate.getDate().toString().padStart(2, "0")
    const month = (localDate.getMonth() + 1).toString().padStart(2, "0")
    const year = localDate.getFullYear()
    return `${year}-${month}-${day}`
  }

  // Extract unique status values and count occurrences
  const statusCounts = filteredPedidos.reduce((acc, pedido) => {
    const status = pedido[9] || "Não definido"
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  // Data for the cards
  const totalAtendimentos = filteredPedidos.length
  const especialidades = [...new Set(pedidos.map((pedido) => pedido[6]))]
  const especialidadesFiltradas = [...new Set(filteredPedidos.map((pedido) => pedido[6]))]
  const atendimentosConcluidos = filteredPedidos.filter((pedido) => pedido[9] === "Concluído").length

  // Status classes
  const statusClasses = {
    Concluído: "status-concluido",
    Aguardando: "status-aguardando",
    Evadido: "status-evadido",
    Remarcado: "status-remarcado",
    "Não definido": "status-indefinido",
  }

  // If specialty is selected, show its details
  const selectedSpecialtyDetails = specialtyFilter
    ? {
        totalAtendimentos: filteredPedidos.length,
        concluidos: filteredPedidos.filter((p) => p[9] === "Concluído").length,
        medicos: [...new Set(filteredPedidos.map((p) => p[7]))],
      }
    : null

  return (
    <div className="nusad-container">
      <div className="nusad-header">
        <h1>Painel de Gerenciamento {specialtyName ? `- ${specialtyName}` : "NUSAD"}</h1>

        <button onClick={refreshData} className="refresh-button">
          <RefreshCw size={16} className={refreshing ? "icon-spin" : ""} />
          Atualizar dados
        </button>
      </div>

      <div className="filters-container">
        {showSpecialtyFilter && (
          <div className="filter-group">
            <label className="filter-label">
              <Heart size={16} />
              Especialidade
            </label>
            <select className="filter-select" value={specialtyFilter} onChange={handleSpecialtyFilterChange}>
              <option value="">Todas as especialidades</option>
              {especialidades.map((especialidade, index) => (
                <option key={index} value={especialidade}>
                  {especialidade}
                </option>
              ))}
            </select>
          </div>
        )}

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
                  const date = e.target.value ? new Date(e.target.value) : null
                  setStartDate(date)
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
                  const date = e.target.value ? new Date(e.target.value) : null
                  setEndDate(date)
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
                <p className="card-desc">
                  {specialtyFilter ? `Atendimentos de ${specialtyFilter}` : "Total de atendimentos no período"}
                </p>
              </div>
            </div>

            {/* Card: Especialidades */}
            {!specialtyName && (
              <div className="stats-card card-pink">
                <div className="card-icon">
                  <Heart className="icon" size={24} />
                </div>
                <div className="card-content">
                  <h3 className="card-title">Especialidades</h3>
                  <p className="card-value">{specialtyFilter ? 1 : especialidadesFiltradas.length}</p>
                  <p className="card-desc">
                    {specialtyFilter ? `Mostrando dados de ${specialtyFilter}` : "Número de especialidades ativas"}
                  </p>
                </div>
              </div>
            )}

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

          {/* Specialty Details when filtered */}
          {selectedSpecialtyDetails && (
            <div className="specialty-details">
              <h2>
                <Heart size={20} className="icon-pink" />
                Detalhes da Especialidade: {specialtyFilter}
              </h2>

              <div className="specialty-stats">
                <div className="specialty-stat blue">
                  <h3>Total de atendimentos</h3>
                  <p>{selectedSpecialtyDetails.totalAtendimentos}</p>
                </div>

                <div className="specialty-stat green">
                  <h3>Taxa de conclusão</h3>
                  <p>
                    {Math.round(
                      (selectedSpecialtyDetails.concluidos / selectedSpecialtyDetails.totalAtendimentos) * 100,
                    ) || 0}
                    %
                  </p>
                </div>

                <div className="specialty-stat amber">
                  <h3>Médicos atuantes</h3>
                  <p>{selectedSpecialtyDetails.medicos.length}</p>
                </div>
              </div>

              <div className="specialty-doctors">
                <h3>Médicos da especialidade:</h3>
                <div className="doctors-list">
                  {selectedSpecialtyDetails.medicos.map((medico, index) => (
                    <span key={index} className="doctor-tag">
                      {medico}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SpecialtyDashboard
