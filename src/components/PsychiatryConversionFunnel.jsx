"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, Typography, Box, LinearProgress, Chip, Tabs, Tab, Button, ButtonGroup } from "@mui/material"
import { Users, Calendar, Truck, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

const PsychiatryConversionFunnel = () => {
  const [funnelData, setFunnelData] = useState({
    altaDemanda: [],
    agendamentos: [],
    transportes: [],
    consultas: [],
  })
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState("maio")
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    fetchFunnelData()
  }, [selectedMonth])

  const fetchFunnelData = async () => {
    setLoading(true)
    try {
      // Buscar dados da API principal (Alta demanda)
      const psychResponse = await fetch("/api/psiquiatria")
      const psychData = await psychResponse.json()

      // Buscar dados das agendas
      const agendaResponse = await fetch(`/api/agenda/${selectedMonth}`)
      const agendaData = await agendaResponse.json()

      // Buscar dados do compilado
      const compiladoResponse = await fetch("/api/compilado")
      const compiladoData = await compiladoResponse.json()

      // Processar dados
      const altaDemandaPatients = processAltaDemanda(psychData)
      const agendamentosData = processAgendamentos(agendaData)
      const transportesData = processTransportes(compiladoData)
      const consultasData = processConsultas(agendaData, compiladoData)

      setFunnelData({
        altaDemanda: altaDemandaPatients,
        agendamentos: agendamentosData,
        transportes: transportesData,
        consultas: consultasData,
      })
    } catch (error) {
      console.error("Erro ao buscar dados do funil:", error)
    } finally {
      setLoading(false)
    }
  }

  const processAltaDemanda = (data) => {
    if (!data?.values) return []

    return data.values
      .slice(1)
      .filter((row) => {
        const status = row[9] // Coluna de status
        return status === "Alta demanda"
      })
      .map((row) => ({
        id: row[0],
        paciente: row[2],
        unidade: row[4],
        data: row[1],
        status: row[9],
      }))
  }

  const processAgendamentos = (data) => {
    if (!data?.values) return []

    return data.values
      .slice(1)
      .filter((row) => row[2])
      .map((row) => ({
        data: row[0],
        horario: row[1],
        paciente: row[2],
        sesame: row[3],
        unidade: row[4],
        classificacao: row[5],
        compareceu: row[9],
        observacao: row[10],
      }))
  }

  const processTransportes = (data) => {
    if (!data?.values) return []

    return data.values
      .slice(1)
      .filter((row) => {
        const procedimento = row[9]
        return procedimento === "PSIQUIATRIA"
      })
      .map((row) => ({
        os: row[1],
        paciente: row[2],
        origem: row[6],
        destino: row[7],
        status: row[11],
        motivo: row[12],
      }))
  }

  const processConsultas = (agendaData, compiladoData) => {
    const agendamentos = processAgendamentos(agendaData)
    const transportes = processTransportes(compiladoData)

    return agendamentos.map((agenda) => {
      const transporte = transportes.find(
        (t) =>
          t.paciente.toLowerCase().includes(agenda.paciente.toLowerCase()) ||
          agenda.paciente.toLowerCase().includes(t.paciente.toLowerCase()),
      )

      return {
        ...agenda,
        transporte,
        efetivada: agenda.compareceu === "SIM",
        cancelada: agenda.compareceu === "NÃO",
        atraso: agenda.compareceu?.includes("ATRASO"),
      }
    })
  }

  const calculateConversionRates = () => {
    const total = funnelData.altaDemanda.length
    const agendados = funnelData.agendamentos.length
    const transportados = funnelData.transportes.filter((t) => t.status === "REALIZADA").length
    const consultasEfetivadas = funnelData.consultas.filter((c) => c.efetivada).length

    return {
      total,
      agendados,
      transportados,
      consultasEfetivadas,
      taxaAgendamento: total > 0 ? ((agendados / total) * 100).toFixed(1) : 0,
      taxaTransporte: agendados > 0 ? ((transportados / agendados) * 100).toFixed(1) : 0,
      taxaEfetivacao: transportados > 0 ? ((consultasEfetivadas / transportados) * 100).toFixed(1) : 0,
      taxaGeral: total > 0 ? ((consultasEfetivadas / total) * 100).toFixed(1) : 0,
    }
  }

  const getMotivosNaoComparecimento = () => {
    const motivos = {}

    funnelData.consultas.forEach((consulta) => {
      if (consulta.compareceu === "NÃO") {
        const motivo = consulta.observacao || "Não informado"
        motivos[motivo] = (motivos[motivo] || 0) + 1
      }
    })

    funnelData.transportes.forEach((transporte) => {
      if (transporte.status === "CANCELADA") {
        const motivo = transporte.motivo || "Não informado"
        motivos[motivo] = (motivos[motivo] || 0) + 1
      }
    })

    return Object.entries(motivos)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
        <Box sx={{ width: '100%', maxWidth: '300px', mb: 2 }}>
          <LinearProgress />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Carregando dados do funil...
        </Typography>
      </Box>
    )
  }

  const rates = calculateConversionRates()
  const motivosNaoComparecimento = getMotivosNaoComparecimento()

  return (
    <Box sx={{ p: 3 }}>
      {/* Seletor de Mês */}
      <Box sx={{ mb: 3 }}>
        <ButtonGroup variant="contained" aria-label="month selector">
          <Button
            onClick={() => setSelectedMonth("abril")}
            variant={selectedMonth === "abril" ? "contained" : "outlined"}
          >
            Abril
          </Button>
          <Button
            onClick={() => setSelectedMonth("maio")}
            variant={selectedMonth === "maio" ? "contained" : "outlined"}
          >
            Maio
          </Button>
          <Button
            onClick={() => setSelectedMonth("junho")}
            variant={selectedMonth === "junho" ? "contained" : "outlined"}
          >
            Junho
          </Button>
        </ButtonGroup>
      </Box>

      {/* Funil de Conversão */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Card sx={{ minHeight: '140px' }}>
          <CardHeader 
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" component="h3">Alta Demanda</Typography>
                <Users size={20} color="#dc2626" />
              </Box>
            }
          />
          <CardContent sx={{ pt: 0 }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
              {rates.total}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Solicitações com status "Alta demanda"
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minHeight: '140px' }}>
          <CardHeader 
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" component="h3">Agendamentos</Typography>
                <Calendar size={20} color="#ea580c" />
              </Box>
            }
          />
          <CardContent sx={{ pt: 0 }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
              {rates.agendados}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              Taxa: {rates.taxaAgendamento}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={parseFloat(rates.taxaAgendamento)} 
              sx={{ height: 6, borderRadius: 3 }}
            />
          </CardContent>
        </Card>

        <Card sx={{ minHeight: '140px' }}>
          <CardHeader 
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" component="h3">Transportes</Typography>
                <Truck size={20} color="#2563eb" />
              </Box>
            }
          />
          <CardContent sx={{ pt: 0 }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
              {rates.transportados}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              Taxa: {rates.taxaTransporte}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={parseFloat(rates.taxaTransporte)} 
              sx={{ height: 6, borderRadius: 3 }}
            />
          </CardContent>
        </Card>

        <Card sx={{ minHeight: '140px' }}>
          <CardHeader 
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" component="h3">Consultas Efetivadas</Typography>
                <CheckCircle size={20} color="#16a34a" />
              </Box>
            }
          />
          <CardContent sx={{ pt: 0 }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
              {rates.consultasEfetivadas}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              Taxa geral: {rates.taxaGeral}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={parseFloat(rates.taxaGeral)} 
              sx={{ height: 6, borderRadius: 3 }}
            />
          </CardContent>
        </Card>
      </Box>

      {/* Detalhamento com Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} aria-label="detalhamento tabs">
            <Tab label="Motivos de Não Comparecimento" />
            <Tab label="Detalhes do Funil" />
          </Tabs>
        </Box>

        {/* Tab 1: Motivos */}
        {tabValue === 0 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top 5 Motivos de Não Comparecimento
            </Typography>
            <Box sx={{ mt: 2 }}>
              {motivosNaoComparecimento.map(([motivo, quantidade], index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">{motivo}</Typography>
                  <Chip label={quantidade} variant="outlined" size="small" />
                </Box>
              ))}
            </Box>
          </CardContent>
        )}

        {/* Tab 2: Detalhes */}
        {tabValue === 1 && (
          <CardContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Status dos Transportes
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {Object.entries(
                      funnelData.transportes.reduce((acc, transporte) => {
                        acc[transporte.status] = (acc[transporte.status] || 0) + 1
                        return acc
                      }, {})
                    ).map(([status, count]) => (
                      <Box key={status} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{status}</Typography>
                        <Chip 
                          label={count} 
                          color={status === "REALIZADA" ? "primary" : "error"}
                          size="small"
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Comparecimento às Consultas
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle size={16} color="#16a34a" />
                        <Typography variant="body2">Compareceram</Typography>
                      </Box>
                      <Chip label={funnelData.consultas.filter((c) => c.efetivada).length} color="primary" size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <XCircle size={16} color="#dc2626" />
                        <Typography variant="body2">Não compareceram</Typography>
                      </Box>
                      <Chip label={funnelData.consultas.filter((c) => c.cancelada).length} color="error" size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AlertTriangle size={16} color="#ca8a04" />
                        <Typography variant="body2">Com atraso</Typography>
                      </Box>
                      <Chip label={funnelData.consultas.filter((c) => c.atraso).length} variant="outlined" size="small" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </CardContent>
        )}
      </Card>
    </Box>
  )
}

export default PsychiatryConversionFunnel