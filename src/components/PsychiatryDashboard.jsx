"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DateFilter from "./DateFilter"
import DashboardCard from "./DashboardCard"
import PsychiatryConversionFunnel from "./PsychiatryConversionFunnel"
import { Users, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react"

const PsychiatryDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: "2025-04-01",
    endDate: "2025-04-30",
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterData()
  }, [data, dateRange])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/psiquiatria")
      const result = await response.json()

      if (result?.values) {
        const processedData = result.values.slice(1).map((row) => ({
          id: row[0],
          data: parseDate(row[1]),
          paciente: row[2],
          medico: row[3],
          unidade: row[4],
          especialidade: row[5],
          status: row[9],
          observacoes: row[10],
        }))

        setData(processedData)
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const parseDate = (dateStr) => {
    if (!dateStr) return null

    const [datePart] = dateStr.split(" ")
    const [day, month, year] = datePart.split("/")
    return new Date(2000 + Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
  }

  const filterData = () => {
    if (!data.length) return

    const startDate = new Date(dateRange.startDate)
    const endDate = new Date(dateRange.endDate)
    endDate.setHours(23, 59, 59, 999)

    const filtered = data.filter((item) => {
      if (!item.data) return false
      return item.data >= startDate && item.data <= endDate
    })

    setFilteredData(filtered)
  }

  const getStatusCounts = () => {
    const counts = {}
    filteredData.forEach((item) => {
      const status = item.status || "Não informado"
      counts[status] = (counts[status] || 0) + 1
    })
    return counts
  }

  const getStatusColor = (status) => {
    const colors = {
      Concluído: "bg-green-100 text-green-800",
      "Alta demanda": "bg-red-100 text-red-800",
      "Em andamento": "bg-blue-100 text-blue-800",
      Cancelado: "bg-gray-100 text-gray-800",
      Pendente: "bg-yellow-100 text-yellow-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const statusCounts = getStatusCounts()
  const totalSolicitacoes = filteredData.length
  const altaDemanda = statusCounts["Alta demanda"] || 0
  const concluidos = statusCounts["Concluído"] || 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-wrap gap-4">
        <DateFilter dateRange={dateRange} onDateChange={setDateRange} />
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard
          title="Total de Solicitações"
          value={totalSolicitacoes}
          icon={<Users className="h-4 w-4" />}
          trend="+12% vs mês anterior"
        />

        <DashboardCard
          title="Alta Demanda"
          value={altaDemanda}
          icon={<AlertTriangle className="h-4 w-4" />}
          trend={`${((altaDemanda / totalSolicitacoes) * 100).toFixed(1)}% do total`}
          className="border-red-200"
        />

        <DashboardCard
          title="Concluídos"
          value={concluidos}
          icon={<CheckCircle className="h-4 w-4" />}
          trend={`${((concluidos / totalSolicitacoes) * 100).toFixed(1)}% do total`}
          className="border-green-200"
        />

        <DashboardCard
          title="Taxa de Conversão"
          value={`${((concluidos / altaDemanda) * 100 || 0).toFixed(1)}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend="Alta demanda → Concluído"
        />
      </div>

      {/* Tabs principais */}
      <Tabs defaultValue="funil" className="w-full">
        <TabsList>
          <TabsTrigger value="funil">Funil de Conversão</TabsTrigger>
          <TabsTrigger value="status">Status das Solicitações</TabsTrigger>
          <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
        </TabsList>

        <TabsContent value="funil">
          <PsychiatryConversionFunnel />
        </TabsContent>

        <TabsContent value="status">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{status}</span>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(status)}>{count}</Badge>
                        <span className="text-xs text-gray-500">{((count / totalSolicitacoes) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Principais Unidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(
                    filteredData.reduce((acc, item) => {
                      const unidade = item.unidade || "Não informado"
                      acc[unidade] = (acc[unidade] || 0) + 1
                      return acc
                    }, {}),
                  )
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([unidade, count]) => (
                      <div key={unidade} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{unidade}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detalhes">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Data</th>
                      <th className="text-left p-2">Paciente</th>
                      <th className="text-left p-2">Unidade</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Médico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.slice(0, 10).map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{item.data?.toLocaleDateString("pt-BR")}</td>
                        <td className="p-2 font-medium">{item.paciente}</td>
                        <td className="p-2">{item.unidade}</td>
                        <td className="p-2">
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        </td>
                        <td className="p-2">{item.medico}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PsychiatryDashboard
