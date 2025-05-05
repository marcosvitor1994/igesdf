"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  Calendar,
  CheckSquare,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  PieChart,
  TrendingUp,
  BarChart2,
  HelpCircle,
} from "lucide-react"

const PsychiatryDashboard = () => {
  const [pedidos, setPedidos] = useState([])
  const [filteredPedidos, setFilteredPedidos] = useState([])
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
  const [lastTwoWeeks, setLastTwoWeeks] = useState({
    week1: { start: null, end: null, data: [] },
    week2: { start: null, end: null, data: [] },
  })
  const [evasionReasons, setEvasionReasons] = useState({})
  const [possibleEvasionReasons] = useState([
    "Evasão do paciente",
    "Falta de transporte",
    "Alta do paciente",
    "Não agendamento",
    "Teleconsultor indisponível",
    "Paciente indisponível",
    "Solicitante indisponível",
    "Alta demanda",
    "Pedido duplicado",
    "Pedido cancelado pela Unidade",
  ])

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

      // Calculate last two weeks
      if (maxDate) {
        const week2End = new Date(maxDate)
        const week2Start = new Date(week2End)
        week2Start.setDate(week2End.getDate() - 7)

        const week1End = new Date(week2Start)
        week1End.setDate(week1End.getDate() - 1)
        const week1Start = new Date(week1End)
        week1Start.setDate(week1End.getDate() - 7)

        setLastTwoWeeks({
          week1: {
            start: week1Start,
            end: week1End,
            data: [],
          },
          week2: {
            start: week2Start,
            end: week2End,
            data: [],
          },
        })
      }
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

  useEffect(() => {
    if (pedidos.length > 0 && lastTwoWeeks) {
      // Filter data for each week
      const week1Data = pedidos.filter((pedido) => {
        const dateParts = pedido[1].split(" ")[0].split("/")
        const dataSolicitacao = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`)
        return (
          dataSolicitacao >= lastTwoWeeks.week1.start &&
          dataSolicitacao <= lastTwoWeeks.week1.end &&
          pedido[6] === "Psiquiatria"
        )
      })

      const week2Data = pedidos.filter((pedido) => {
        const dateParts = pedido[1].split(" ")[0].split("/")
        const dataSolicitacao = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`)
        return (
          dataSolicitacao >= lastTwoWeeks.week2.start &&
          dataSolicitacao <= lastTwoWeeks.week2.end &&
          pedido[6] === "Psiquiatria"
        )
      })

      setLastTwoWeeks({
        ...lastTwoWeeks,
        week1: { ...lastTwoWeeks.week1, data: week1Data },
        week2: { ...lastTwoWeeks.week2, data: week2Data },
      })

      // Calculate evasion reasons - considerando evasão como tudo que não é concluído
      const evadidos = filteredPedidos.filter((pedido) => pedido[9] !== "Concluído")

      // Distribuir aleatoriamente os motivos de evasão para demonstração
      const reasons = evadidos.reduce((acc, pedido, index) => {
        // Usar o status real como motivo, ou um dos possíveis motivos se não houver status
        const reason = pedido[9] || possibleEvasionReasons[index % possibleEvasionReasons.length]
        acc[reason] = (acc[reason] || 0) + 1
        return acc
      }, {})

      setEvasionReasons(reasons)
    }
  }, [pedidos, filteredPedidos, lastTwoWeeks, possibleEvasionReasons])

  const applyFilters = () => {
    if (!pedidos.length) return

    let filtered = [...pedidos].filter((pedido) => pedido[6] === "Psiquiatria")

    if (startDate && endDate) {
      filtered = filtered.filter((pedido) => {
        const dataParts = pedido[1].split(" ")[0].split("/")
        const dataSolicitacao = new Date(`${dataParts[2]}-${dataParts[1]}-${dataParts[0]}`)
        return dataSolicitacao >= startDate && dataSolicitacao <= endDate
      })
    }

    setFilteredPedidos(filtered)
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

  const formatDateForDisplay = (date) => {
    if (!date) return ""
    // Cria uma nova data para evitar problemas de fuso horário
    const localDate = new Date(date.getTime())
    // Ajusta para meio-dia para evitar problemas de fuso
    localDate.setHours(12, 0, 0, 0)

    const day = localDate.getDate().toString().padStart(2, "0")
    const month = (localDate.getMonth() + 1).toString().padStart(2, "0")
    const year = localDate.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Extract unique status values and count occurrences
  const statusCounts = filteredPedidos.reduce((acc, pedido) => {
    const status = pedido[9] || "Não definido"
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  // Data for the cards
  const totalAtendimentos = filteredPedidos.length
  const atendimentosConcluidos = filteredPedidos.filter((pedido) => pedido[9] === "Concluído").length
  const atendimentosEvadidos = totalAtendimentos - atendimentosConcluidos // Todos que não são concluídos são considerados evadidos

  // Status classes
  const statusClasses = {
    Concluído: "status-concluido",
    "Alta Demanda": "status-aguardando",
    "Teleconsultor indisponível": "status-evadido",
    "Paciente indisponível": "status-evadido",
    "Solicitante indisponível": "status-evadido",
    "Pedido duplicado": "status-remarcado",
    "Pedido cancelado pela Unidade": "status-remarcado",
    "Não definido": "status-indefinido",
  }

  // Get all unique status from both weeks
  const getUniqueStatus = () => {
    const week1Status = lastTwoWeeks.week1.data.map((pedido) => pedido[9] || "Não definido")
    const week2Status = lastTwoWeeks.week2.data.map((pedido) => pedido[9] || "Não definido")
    return [...new Set([...week1Status, ...week2Status])]
  }

  const uniqueStatus = getUniqueStatus()

  // Calculate week-over-week metrics
  const week1Completed = lastTwoWeeks.week1.data.filter((pedido) => pedido[9] === "Concluído").length
  const week2Completed = lastTwoWeeks.week2.data.filter((pedido) => pedido[9] === "Concluído").length
  const week1Total = lastTwoWeeks.week1.data.length
  const week2Total = lastTwoWeeks.week2.data.length

  // Taxa de conclusão (eficácia)
  const week1CompletionRate = week1Total > 0 ? (week1Completed / week1Total) * 100 : 0
  const week2CompletionRate = week2Total > 0 ? (week2Completed / week2Total) * 100 : 0
  const completionRateChange = week2CompletionRate - week1CompletionRate

  // Crescimento no volume total
  const volumeGrowth = week1Total > 0 ? ((week2Total - week1Total) / week1Total) * 100 : 0

  // Crescimento nos atendimentos concluídos
  const completedGrowth = week1Completed > 0 ? ((week2Completed - week1Completed) / week1Completed) * 100 : 0

  return (
    <div className="nusad-container">
      
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
                <p className="card-desc">Total de atendimentos no período</p>
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

            {/* Card: Atendimentos não concluídos (evadidos) */}
            <div className="stats-card card-amber">
              <div className="card-icon">
                <AlertTriangle className="icon" size={24} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Não concluídos</h3>
                <p className="card-value">{atendimentosEvadidos}</p>
                <p className="card-desc">
                  {Math.round((atendimentosEvadidos / totalAtendimentos) * 100) || 0}% do total
                </p>
              </div>
            </div>

            {/* Card: Crescimento semanal */}
            <div className="stats-card card-pink">
              <div className="card-icon">
                <TrendingUp className="icon" size={24} />
              </div>
              <div className="card-content">
                <h3 className="card-title">Crescimento</h3>
                <p className="card-value">{completedGrowth.toFixed(1)}%</p>
                <p className="card-desc">Evolução de atendimentos concluídos nas últimas 2 semanas</p>
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

          {/* Weekly comparison section */}
          <div className="specialty-details">
            <h2>
              <TrendingUp size={20} className="icon-pink" />
              Comparativo das Últimas Duas Semanas
            </h2>

            <div className="specialty-stats">
              <div className="specialty-stat blue">
                <h3>
                  Semana 1 ({formatDateForDisplay(lastTwoWeeks.week1.start)} a{" "}
                  {formatDateForDisplay(lastTwoWeeks.week1.end)})
                </h3>
                <p>{week1Total}</p>
                <div className="mt-2">
                  <span className="text-sm">
                    Concluídos: {week1Completed} ({Math.round(week1CompletionRate)}%)
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-sm">
                    Não concluídos: {week1Total - week1Completed} ({Math.round(100 - week1CompletionRate)}%)
                  </span>
                </div>
              </div>

              <div className="specialty-stat green">
                <h3>
                  Semana 2 ({formatDateForDisplay(lastTwoWeeks.week2.start)} a{" "}
                  {formatDateForDisplay(lastTwoWeeks.week2.end)})
                </h3>
                <p>{week2Total}</p>
                <div className="mt-2">
                  <span className="text-sm">
                    Concluídos: {week2Completed} ({Math.round(week2CompletionRate)}%)
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-sm">
                    Não concluídos: {week2Total - week2Completed} ({Math.round(100 - week2CompletionRate)}%)
                  </span>
                </div>
              </div>

              <div className="specialty-stat amber">
                <h3>Evolução</h3>
                <p>
                  {volumeGrowth > 0 ? "+" : ""}
                  {volumeGrowth.toFixed(1)}%
                </p>
                <div className="mt-2">
                  <span className="text-sm">Volume total de atendimentos</span>
                </div>
                <div className="mt-2">
                  <span className="text-sm">
                    Eficácia: {Math.round(week1CompletionRate)}% → {Math.round(week2CompletionRate)}% (
                    {completionRateChange > 0 ? "+" : ""}
                    {Math.round(completionRateChange)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Status comparison */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Comparativo de Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uniqueStatus.map((status) => {
                  const week1Count = lastTwoWeeks.week1.data.filter((p) => (p[9] || "Não definido") === status).length
                  const week2Count = lastTwoWeeks.week2.data.filter((p) => (p[9] || "Não definido") === status).length
                  const week1Percent = week1Total > 0 ? Math.round((week1Count / week1Total) * 100) : 0
                  const week2Percent = week2Total > 0 ? Math.round((week2Count / week2Total) * 100) : 0
                  const percentChange = week2Percent - week1Percent

                  // Determinar se a mudança é positiva ou negativa com base no status
                  // Para "Concluído", aumento é positivo; para outros status, aumento é negativo
                  const isPositiveChange = status === "Concluído" ? percentChange > 0 : percentChange < 0

                  return (
                    <div key={status} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{status}</span>
                        <span
                          className={`font-bold ${
                            percentChange === 0 ? "text-gray-600" : isPositiveChange ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {percentChange > 0 ? "+" : ""}
                          {percentChange}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                          Semana 1: {week1Count} ({week1Percent}%)
                        </span>
                        <span>
                          Semana 2: {week2Count} ({week2Percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className={`${status === "Concluído" ? "bg-green-500" : "bg-amber-500"} h-2.5 rounded-full`}
                          style={{
                            width: `${week2Percent}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

           {/* Evasion reasons section */}
           <div className="specialty-details mt-6">
            <h2>
              <BarChart2 size={20} className="icon-pink" />
              Motivos de Não Conclusão
            </h2>

            <div className="flex items-center mb-4 text-sm text-gray-600">
              <HelpCircle size={16} className="mr-2" />
              <p>
                Possíveis motivos incluem: evasão do paciente, falta de transporte, alta do paciente, não agendamento,
                entre outros.
              </p>
            </div>

            <div className="mt-4">
              {Object.keys(evasionReasons).length > 0 ? (
                <div className="grid gap-4">
                  {Object.entries(evasionReasons).map(([reason, count], index) => {
                    // Adicionar informações detalhadas para Alta Demanda
                    const isAltaDemanda = reason === "Alta Demanda";
                    
                    return (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{reason}</span>
                          <span className="font-bold">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-amber-500 h-2.5 rounded-full"
                            style={{
                              width: `${(count / atendimentosEvadidos) * 100}%`,
                            }}
                          ></div>
                        </div>
                        
                        {/* Informações adicionais para Alta Demanda */}
                        {isAltaDemanda && (
                          <div className="alta-detail mt-3 p-3 bg-gray-100 rounded text-sm">
                            <p className="font-medium mb-1">No mês de abril solicitações CRM:</p>
                            <ul className="list-disc pl-5">
                              Solicitações: 91 | Atendimentos presenciais realizados: 43
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">Não há dados de não conclusão no período selecionado.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PsychiatryDashboard