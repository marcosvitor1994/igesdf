"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando dados do funil...</p>
        </div>
      </div>
    )
  }

  const rates = calculateConversionRates()
  const motivosNaoComparecimento = getMotivosNaoComparecimento()

  return (
    <div className="space-y-6">
      {/* Seletor de Mês */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedMonth("abril")}
          className={`px-4 py-2 rounded ${selectedMonth === "abril" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Abril
        </button>
        <button
          onClick={() => setSelectedMonth("maio")}
          className={`px-4 py-2 rounded ${selectedMonth === "maio" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Maio
        </button>
        <button
          onClick={() => setSelectedMonth("junho")}
          className={`px-4 py-2 rounded ${selectedMonth === "junho" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Junho
        </button>
      </div>

      {/* Funil de Conversão */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alta Demanda</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rates.total}</div>
            <p className="text-xs text-muted-foreground">Solicitações com status "Alta demanda"</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rates.agendados}</div>
            <p className="text-xs text-muted-foreground">Taxa: {rates.taxaAgendamento}%</p>
            <Progress value={rates.taxaAgendamento} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transportes</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rates.transportados}</div>
            <p className="text-xs text-muted-foreground">Taxa: {rates.taxaTransporte}%</p>
            <Progress value={rates.taxaTransporte} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas Efetivadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rates.consultasEfetivadas}</div>
            <p className="text-xs text-muted-foreground">Taxa geral: {rates.taxaGeral}%</p>
            <Progress value={rates.taxaGeral} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento */}
      <Tabs defaultValue="motivos" className="w-full">
        <TabsList>
          <TabsTrigger value="motivos">Motivos de Não Comparecimento</TabsTrigger>
          <TabsTrigger value="detalhes">Detalhes do Funil</TabsTrigger>
        </TabsList>

        <TabsContent value="motivos">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Motivos de Não Comparecimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {motivosNaoComparecimento.map(([motivo, quantidade], index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{motivo}</span>
                    <Badge variant="outline">{quantidade}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detalhes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Status dos Transportes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {funnelData.transportes.reduce((acc, transporte) => {
                    acc[transporte.status] = (acc[transporte.status] || 0) + 1
                    return acc
                  }, {})}
                  {Object.entries(
                    funnelData.transportes.reduce((acc, transporte) => {
                      acc[transporte.status] = (acc[transporte.status] || 0) + 1
                      return acc
                    }, {}),
                  ).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm">{status}</span>
                      <Badge variant={status === "REALIZADA" ? "default" : "destructive"}>{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparecimento às Consultas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Compareceram
                    </span>
                    <Badge variant="default">{funnelData.consultas.filter((c) => c.efetivada).length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      Não compareceram
                    </span>
                    <Badge variant="destructive">{funnelData.consultas.filter((c) => c.cancelada).length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      Com atraso
                    </span>
                    <Badge variant="outline">{funnelData.consultas.filter((c) => c.atraso).length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PsychiatryConversionFunnel
