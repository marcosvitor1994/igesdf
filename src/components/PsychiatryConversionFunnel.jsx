"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, Typography, Box, LinearProgress, Chip, Tabs, Tab, Button, ButtonGroup } from "@mui/material"
import { Users, Calendar, Truck, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import axios from "axios"

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
      // Buscar dados das agendas do mês selecionado
      const agendaResponse = await axios.get(`https://api-google-sheets-7zph.vercel.app/agenda/${selectedMonth}`)
      const agendaData = agendaResponse.data

      // Buscar dados do compilado
      const compiladoResponse = await axios.get("https://api-google-sheets-7zph.vercel.app/compilado_consultas")
      const compiladoData = compiladoResponse.data

      // Buscar dados da API principal (para alta demanda)
      const psychResponse = await axios.get("https://api-google-sheets-7zph.vercel.app/hospital")
      const psychData = psychResponse.data

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

    // Filtra os dados para psiquiatria com status "Alta demanda" ou "Alta Demanda"
    return data.values
      .slice(1) // Remove header
      .filter((row) => {
        const status = row[9] // Coluna de status
        const especialidade = row[6] // Coluna de especialidade
        return (status === "Alta demanda" || status === "Alta Demanda") && especialidade === "Psiquiatria"
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
      .slice(1) // Remove header
      .filter((row) => row[2] && row[2].trim() !== "") // Tem nome do paciente
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
      .slice(1) // Remove header
      .filter((row) => {
        const procedimento = row[9] // Coluna PROCEDIMENTO
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

    // Função para normalizar nomes para comparação
    const normalizeName = (name) => {
      if (!name) return ""
      return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/\s+/g, " ") // Remove espaços extras
        .replace(/[^\w\s]/g, "") // Remove caracteres especiais
        .trim()
    }

    // Função para extrair palavras-chave do nome
    const extractKeywords = (name) => {
      const normalized = normalizeName(name)
      return normalized.split(" ").filter(word => word.length > 2) // Palavras com mais de 2 caracteres
    }

    return agendamentos.map((agenda) => {
      const agendaKeywords = extractKeywords(agenda.paciente)
      
      // Buscar transporte correspondente usando múltiplas estratégias
      const transporte = transportes.find((t) => {
        const transporteKeywords = extractKeywords(t.paciente)
        
        // Estratégia 1: Correspondência exata normalizada
        if (normalizeName(agenda.paciente) === normalizeName(t.paciente)) {
          return true
        }
        
        // Estratégia 2: Pelo menos 2 palavras-chave em comum
        const commonKeywords = agendaKeywords.filter(keyword => 
          transporteKeywords.some(tKeyword => 
            tKeyword.includes(keyword) || keyword.includes(tKeyword)
          )
        )
        
        return commonKeywords.length >= 2
      })

      // Determinar status da consulta
      let efetivada = false
      let cancelada = false
      let atraso = false

      if (agenda.compareceu) {
        efetivada = agenda.compareceu === "SIM"
        cancelada = agenda.compareceu === "NÃO"
        atraso = agenda.compareceu.includes("ATRASO") || 
                 agenda.compareceu.includes("atraso") ||
                 agenda.compareceu.includes("Atraso")
      }

      return {
        ...agenda,
        transporte,
        efetivada,
        cancelada,
        atraso,
      }
    })
  }

  const calculateConversionRates = () => {
    const totalAltaDemanda = funnelData.altaDemanda.length
    const totalAgendados = funnelData.agendamentos.length
    const transportesRealizados = funnelData.transportes.filter((t) => t.status === "REALIZADA").length
    const consultasEfetivadas = funnelData.consultas.filter((c) => c.efetivada).length

    // Cálculos de taxa baseados no funil
    const taxaAgendamento = totalAltaDemanda > 0 ? ((totalAgendados / totalAltaDemanda) * 100) : 0
    const taxaTransporte = totalAgendados > 0 ? ((transportesRealizados / totalAgendados) * 100) : 0
    const taxaEfetivacao = transportesRealizados > 0 ? ((consultasEfetivadas / transportesRealizados) * 100) : 0
    const taxaGeral = totalAltaDemanda > 0 ? ((consultasEfetivadas / totalAltaDemanda) * 100) : 0

    return {
      totalAltaDemanda,
      totalAgendados,
      transportesRealizados,
      consultasEfetivadas,
      taxaAgendamento: Math.min(taxaAgendamento, 100).toFixed(1), // Limitado a 100%
      taxaTransporte: Math.min(taxaTransporte, 100).toFixed(1),
      taxaEfetivacao: Math.min(taxaEfetivacao, 100).toFixed(1),
      taxaGeral: Math.min(taxaGeral, 100).toFixed(1),
    }
  }

  const getMotivosNaoComparecimento = () => {
    const motivos = {}

    // Motivos das consultas
    funnelData.consultas.forEach((consulta) => {
      if (consulta.compareceu === "NÃO") {
        const motivo = consulta.observacao || "Não informado"
        motivos[motivo] = (motivos[motivo] || 0) + 1
      }
    })

    // Motivos dos transportes cancelados
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

  const getComparecimentoDetalhes = () => {
    const compareceram = funnelData.consultas.filter((c) => c.efetivada).length
    const naoCompareceram = funnelData.consultas.filter((c) => c.cancelada).length
    const comAtraso = funnelData.consultas.filter((c) => c.atraso).length
    
    return { compareceram, naoCompareceram, comAtraso }
  }

  const getStatusTransportes = () => {
    return funnelData.transportes.reduce((acc, transporte) => {
      acc[transporte.status] = (acc[transporte.status] || 0) + 1
      return acc
    }, {})
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
  const comparecimentoDetalhes = getComparecimentoDetalhes()
  const statusTransportes = getStatusTransportes()

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
              {rates.totalAltaDemanda}
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
              {rates.totalAgendados}
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
              {rates.transportesRealizados}
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
              {motivosNaoComparecimento.length > 0 ? (
                motivosNaoComparecimento.map(([motivo, quantidade], index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2">{motivo}</Typography>
                    <Chip label={quantidade} variant="outlined" size="small" />
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhum motivo de não comparecimento encontrado para o período selecionado.
                </Typography>
              )}
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
                    {Object.entries(statusTransportes).map(([status, count]) => (
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
                      <Chip label={comparecimentoDetalhes.compareceram} color="primary" size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <XCircle size={16} color="#dc2626" />
                        <Typography variant="body2">Não compareceram</Typography>
                      </Box>
                      <Chip label={comparecimentoDetalhes.naoCompareceram} color="error" size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AlertTriangle size={16} color="#ca8a04" />
                        <Typography variant="body2">Com atraso</Typography>
                      </Box>
                      <Chip label={comparecimentoDetalhes.comAtraso} variant="outlined" size="small" />
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