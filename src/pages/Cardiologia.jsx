"use client"

import { useState, useEffect } from "react"
import { 
  BarChart2, Clock, Users, AlertCircle, Activity, Calendar, 
  TrendingUp, Award, FileText, Map, UserCheck, Repeat, Clock3
} from "lucide-react"
import SpecialtyDashboard from "../components/SpecialtyDashboard"

const Cardiologia = () => {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("visao-geral")

  // Dados simulados para demonstração - será substituído por dados reais da API
  const mockData = {
    visaoGeral: {
      totalAtendimentos: 543,
      mediaDiaria: 18.1,
      pacientesUnicos: 412,
      taxaAbsenteismo: 12.4,
      tempoMedioAtendimento: 32, // em minutos
      profissionaisAtivos: [
        { nome: "Dr. Silva", atendimentos: 132 },
        { nome: "Dra. Ferreira", atendimentos: 121 },
        { nome: "Dr. Costa", atendimentos: 108 },
        { nome: "Dra. Oliveira", atendimentos: 102 },
        { nome: "Dr. Santos", atendimentos: 80 }
      ]
    },
    operacionais: {
      faixasHorario: [
        { faixa: "08:00 - 10:00", total: 125 },
        { faixa: "10:00 - 12:00", total: 156 },
        { faixa: "12:00 - 14:00", total: 78 },
        { faixa: "14:00 - 16:00", total: 124 },
        { faixa: "16:00 - 18:00", total: 60 }
      ],
      tempoMedioProfissional: [
        { nome: "Dr. Silva", tempo: 28 },
        { nome: "Dra. Ferreira", tempo: 35 },
        { nome: "Dr. Costa", tempo: 31 },
        { nome: "Dra. Oliveira", tempo: 29 },
        { nome: "Dr. Santos", tempo: 38 }
      ],
      classificacaoRisco: [
        { nivel: "Baixo", total: 201 },
        { nivel: "Médio", total: 246 },
        { nivel: "Alto", total: 96 }
      ],
      origemPaciente: [
        { origem: "UPA Centro", total: 173 },
        { origem: "UPA Zona Norte", total: 152 },
        { origem: "UPA Zona Sul", total: 120 },
        { origem: "Unidade Básica", total: 98 }
      ]
    },
    tendencias: {
      evolucaoSemanal: [
        { semana: "01-07 Abr", total: 120 },
        { semana: "08-14 Abr", total: 132 },
        { semana: "15-21 Abr", total: 145 },
        { semana: "22-28 Abr", total: 146 }
      ],
      comparativoTelemedicina: {
        antes: 412,
        depois: 543,
        variacao: 31.8
      },
      distribuicaoDiaSemana: [
        { dia: "Segunda", total: 112 },
        { dia: "Terça", total: 123 },
        { dia: "Quarta", total: 105 },
        { dia: "Quinta", total: 118 },
        { dia: "Sexta", total: 85 }
      ]
    },
    qualidade: {
      resolutividadeSemEncaminhamento: 76.2,
      reincidenciaPacientes: 8.5,
      tempoMedioSolicitacaoAtendimento: 3.2 // em dias
    }
  }

  useEffect(() => {
    // Simulando o carregamento dos dados
    setTimeout(() => {
      setPedidos(mockData)
      setLoading(false)
    }, 1000)
    
    // Futuramente, substituir por chamada real à API
    // const fetchData = async () => {
    //   try {
    //     const response = await axios.get("https://api-hospital/cardiologia/metricas")
    //     setPedidos(response.data)
    //   } catch (error) {
    //     console.error("Erro ao buscar dados de métricas:", error)
    //   } finally {
    //     setLoading(false)
    //   }
    // }
    // fetchData()
  }, [])

  const renderVisaoGeral = () => {
    const data = mockData.visaoGeral
    
    return (
      <div className="extended-section">
        <div className="section-header">
          <Activity size={20} />
          <h2>Visão Geral</h2>
        </div>
        
        <div className="metrics-cards">
          <div className="metric-card">
            <div className="metric-icon blue">
              <FileText size={20} />
            </div>
            <div className="metric-content">
              <h3>Total de Atendimentos</h3>
              <p className="metric-value">{data.totalAtendimentos}</p>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon green">
              <Clock size={20} />
            </div>
            <div className="metric-content">
              <h3>Média Diária</h3>
              <p className="metric-value">{data.mediaDiaria}</p>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon purple">
              <Users size={20} />
            </div>
            <div className="metric-content">
              <h3>Pacientes Únicos</h3>
              <p className="metric-value">{data.pacientesUnicos}</p>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon amber">
              <AlertCircle size={20} />
            </div>
            <div className="metric-content">
              <h3>Absenteísmo</h3>
              <p className="metric-value">{data.taxaAbsenteismo}%</p>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon teal">
              <Clock3 size={20} />
            </div>
            <div className="metric-content">
              <h3>Tempo Médio</h3>
              <p className="metric-value">{data.tempoMedioAtendimento} min</p>
            </div>
          </div>
        </div>
        
        <div className="top-professionals">
          <h3>Profissionais Mais Ativos</h3>
          <div className="professionals-bar-chart">
            {data.profissionaisAtivos.map((prof, index) => (
              <div key={index} className="prof-bar-container">
                <div className="prof-name">{prof.nome}</div>
                <div className="prof-bar-wrapper">
                  <div 
                    className="prof-bar" 
                    style={{ 
                      width: `${(prof.atendimentos / data.profissionaisAtivos[0].atendimentos) * 100}%` 
                    }}
                  ></div>
                  <span className="prof-value">{prof.atendimentos}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  const renderOperacionais = () => {
    const data = mockData.operacionais
    
    return (
      <div className="extended-section">
        <div className="section-header">
          <BarChart2 size={20} />
          <h2>Indicadores Operacionais</h2>
        </div>
        
        <div className="indicators-grid">
          <div className="indicator-panel">
            <h3>Atendimentos por Faixa de Horário</h3>
            <div className="horizontal-bars">
              {data.faixasHorario.map((faixa, index) => (
                <div key={index} className="horizontal-bar-item">
                  <div className="bar-label">{faixa.faixa}</div>
                  <div className="bar-container">
                    <div 
                      className="bar blue-bar" 
                      style={{ 
                        width: `${(faixa.total / Math.max(...data.faixasHorario.map(f => f.total))) * 100}%` 
                      }}
                    ></div>
                    <span className="bar-value">{faixa.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="indicator-panel">
            <h3>Tempo Médio por Profissional (min)</h3>
            <div className="horizontal-bars">
              {data.tempoMedioProfissional.map((prof, index) => (
                <div key={index} className="horizontal-bar-item">
                  <div className="bar-label">{prof.nome}</div>
                  <div className="bar-container">
                    <div 
                      className="bar green-bar" 
                      style={{ 
                        width: `${(prof.tempo / Math.max(...data.tempoMedioProfissional.map(p => p.tempo))) * 100}%` 
                      }}
                    ></div>
                    <span className="bar-value">{prof.tempo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="indicator-panel">
            <h3>Classificação de Risco</h3>
            <div className="donut-chart-container">
              <div className="donut-chart">
                {/* Lógica visual para o gráfico de rosca feito em CSS */}
                <div className="donut-segment baixo" style={{ 
                  transform: `rotate(0deg)`,
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * data.classificacaoRisco[0].total / 543)}% ${50 - 50 * Math.sin(2 * Math.PI * data.classificacaoRisco[0].total / 543)}%, 50% 50%)`
                }}></div>
                <div className="donut-segment medio" style={{ 
                  transform: `rotate(${360 * data.classificacaoRisco[0].total / 543}deg)`,
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * data.classificacaoRisco[1].total / 543)}% ${50 - 50 * Math.sin(2 * Math.PI * data.classificacaoRisco[1].total / 543)}%, 50% 50%)`
                }}></div>
                <div className="donut-segment alto" style={{ 
                  transform: `rotate(${360 * (data.classificacaoRisco[0].total + data.classificacaoRisco[1].total) / 543}deg)`,
                  clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%, 50% 50%)`
                }}></div>
                <div className="donut-hole"></div>
              </div>
              <div className="donut-legend">
                <div className="legend-item">
                  <span className="legend-color baixo-color"></span>
                  <span>Baixo: {data.classificacaoRisco[0].total} ({Math.round(data.classificacaoRisco[0].total/543*100)}%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color medio-color"></span>
                  <span>Médio: {data.classificacaoRisco[1].total} ({Math.round(data.classificacaoRisco[1].total/543*100)}%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color alto-color"></span>
                  <span>Alto: {data.classificacaoRisco[2].total} ({Math.round(data.classificacaoRisco[2].total/543*100)}%)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="indicator-panel">
            <h3>Origem do Paciente</h3>
            <div className="horizontal-bars">
              {data.origemPaciente.map((origem, index) => (
                <div key={index} className="horizontal-bar-item">
                  <div className="bar-label">{origem.origem}</div>
                  <div className="bar-container">
                    <div 
                      className="bar purple-bar" 
                      style={{ 
                        width: `${(origem.total / Math.max(...data.origemPaciente.map(o => o.total))) * 100}%` 
                      }}
                    ></div>
                    <span className="bar-value">{origem.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  const renderTendencias = () => {
    const data = mockData.tendencias
    
    return (
      <div className="extended-section">
        <div className="section-header">
          <TrendingUp size={20} />
          <h2>Tendências Temporais</h2>
        </div>
        
        <div className="trends-container">
          <div className="trend-panel wide">
            <h3>Evolução Semanal dos Atendimentos</h3>
            <div className="line-chart">
              <div className="chart-lines">
                {data.evolucaoSemanal.map((semana, index) => (
                  <div key={index} className="chart-line-container">
                    <div 
                      className="chart-line" 
                      style={{ 
                        height: `${(semana.total / Math.max(...data.evolucaoSemanal.map(s => s.total))) * 100}%` 
                      }}
                    >
                      <span className="line-value">{semana.total}</span>
                    </div>
                    <div className="line-label">{semana.semana}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="trend-panel">
            <h3>Comparativo Telemedicina</h3>
            <div className="comparison-container">
              <div className="comparison-item">
                <div className="comparison-label">Antes</div>
                <div className="comparison-value">{data.comparativoTelemedicina.antes}</div>
                <div className="comparison-bar-container">
                  <div 
                    className="comparison-bar before" 
                    style={{ 
                      width: `${(data.comparativoTelemedicina.antes / data.comparativoTelemedicina.depois) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="comparison-item">
                <div className="comparison-label">Depois</div>
                <div className="comparison-value">{data.comparativoTelemedicina.depois}</div>
                <div className="comparison-bar-container">
                  <div className="comparison-bar after" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div className="variation-indicator positive">
                <TrendingUp size={16} />
                <span>{data.comparativoTelemedicina.variacao}% de aumento</span>
              </div>
            </div>
          </div>
          
          <div className="trend-panel">
            <h3>Distribuição por Dia da Semana</h3>
            <div className="day-distribution">
              {data.distribuicaoDiaSemana.map((dia, index) => (
                <div key={index} className="day-container">
                  <div className="day-label">{dia.dia}</div>
                  <div 
                    className="day-bar" 
                    style={{ 
                      height: `${(dia.total / Math.max(...data.distribuicaoDiaSemana.map(d => d.total))) * 100}%` 
                    }}
                  ></div>
                  <div className="day-value">{dia.total}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  const renderQualidade = () => {
    const data = mockData.qualidade
    
    return (
      <div className="extended-section">
        <div className="section-header">
          <Award size={20} />
          <h2>Qualidade e Efetividade</h2>
        </div>
        
        <div className="quality-metrics">
          <div className="quality-card">
            <div className="circular-progress-container">
              <div className="circular-progress">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path 
                    className="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path 
                    className="circle"
                    strokeDasharray={`${data.resolutividadeSemEncaminhamento}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="percentage">{data.resolutividadeSemEncaminhamento}%</text>
                </svg>
              </div>
              <h3>Resolutividade</h3>
              <p>Casos resolvidos sem encaminhamento</p>
            </div>
          </div>
          
          <div className="quality-card">
            <div className="quality-indicator">
              <div className="indicator-icon amber">
                <Repeat size={24} />
              </div>
              <div className="indicator-content">
                <h3>Reincidência de Pacientes</h3>
                <p className="indicator-value">{data.reincidenciaPacientes}%</p>
                <p className="indicator-description">Consultas repetidas em até 7 dias</p>
              </div>
            </div>
          </div>
          
          <div className="quality-card">
            <div className="quality-indicator">
              <div className="indicator-icon teal">
                <Clock size={24} />
              </div>
              <div className="indicator-content">
                <h3>Tempo Médio Solicitação-Atendimento</h3>
                <p className="indicator-value">{data.tempoMedioSolicitacaoAtendimento} dias</p>
                <p className="indicator-description">Entre pedido e realização da consulta</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cardiologia-extended-container">
      
      {/* Dashboard padrão */}
      <SpecialtyDashboard specialtyName="Cardiologia" />
      <h1>Implementação Futura (sem dados reais)</h1> 
      {/* Navegação entre as seções avançadas */}
      <div className="extended-nav">
        <button 
          className={`tab-button ${activeTab === "visao-geral" ? "active" : ""}`} 
          onClick={() => setActiveTab("visao-geral")}
        >
          <Activity size={16} />
          Visão Geral
        </button>
        <button 
          className={`tab-button ${activeTab === "operacionais" ? "active" : ""}`} 
          onClick={() => setActiveTab("operacionais")}
        >
          <BarChart2 size={16} />
          Operacionais
        </button>
        <button 
          className={`tab-button ${activeTab === "tendencias" ? "active" : ""}`} 
          onClick={() => setActiveTab("tendencias")}
        >
          <TrendingUp size={16} />
          Tendências
        </button>
        <button 
          className={`tab-button ${activeTab === "qualidade" ? "active" : ""}`} 
          onClick={() => setActiveTab("qualidade")}
        >
          <Award size={16} />
          Qualidade
        </button>
      </div>
      
      {/* Conteúdo baseado na aba ativa */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <span>Carregando dados avançados...</span>
        </div>
      ) : (
        <div className="extended-content">
          {activeTab === "visao-geral" && renderVisaoGeral()}
          {activeTab === "operacionais" && renderOperacionais()}
          {activeTab === "tendencias" && renderTendencias()}
          {activeTab === "qualidade" && renderQualidade()}
        </div>
      )}
    </div>
  )
}

export default Cardiologia