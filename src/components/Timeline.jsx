"use client"

import { useState } from "react"

const TimelineProject = ({ onFinish }) => {
  // Dados do cronograma - fácil de editar
  const [timelineData, setTimelineData] = useState({
    months: [
      {
        name: "ABRIL",
        color: "#0052cc", // Azul
        mainTask: "Apresentação Institucional e Alinhamento Inicial",
        activities: [
          "Reunião de boas-vindas e apresentação da coordenação",
          "Alinhamento de expectativas com a equipe",
          "Revisão dos objetivos estratégicos do Núcleo",
          "Ajustes nos detalhes operacionais e estruturais para início das ações",
        ],
      },
      {
        name: "MAIO",
        color: "#0052cc", // Azul
        mainTask: "Início do Projeto Piloto - UPA VICENTE PIRES",
        activities: [
          "Teleconsulta e Atendimento das fichas verdes - fase monitoramento",
          "Início das respostas de pareceres por especialidade clínicas no MV",
          "Integração com possibilidade de Teleinterconsulta conforme demanda",
        ],
      },
      {
        name: "JUNHO",
        color: "#6b7280", // Cinza
        mainTask: "Avaliação inicial do Piloto e Ajustes com base nos indicadores",
        activities: [
          "Capacitação Interna e Institucionalização dos processos digitais",
          "Início da ampliação dos pareceres para especialidades cirúrgicas",
        ],
      },
      {
        name: "JULHO",
        color: "#6b7280", // Cinza
        mainTask: "Planejamento para ampliação gradual para outras unidades",
        activities: ["Ampliação da atuação para as 12 UPAs, com reorganização de RH"],
      },
    ],
  })

  const [currentMonthIndex, setCurrentMonthIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Removemos a função de avançar automaticamente pelos meses
  // O usuário agora controla a navegação apenas com os botões

  const styles = {
    // Estilos para o componente
    container: {
      width: "100%",
      padding: "16px",
      backgroundColor: "white",
      fontFamily: "Arial, sans-serif",
    },
    monthsHeader: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "16px",
    },
    monthName: {
      fontSize: "14px",
      fontWeight: "600",
      textAlign: "center",
    },
    timelineContainer: {
      position: "relative",
      display: "flex",
      width: "100%",
      height: "64px",
      marginBottom: "8px",
    },
    timelineSection: {
      flex: 1,
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    timelineArrowFirst: {
      height: "64px",
      width: "16px",
      position: "absolute",
      left: "-16px",
    },
    mainTasksContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "24px",
    },
    mainTaskBox: {
      width: "25%",
      padding: "0 8px",
    },
    mainTaskTitle: {
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "8px",
    },
    activitiesContainer: {
      display: "flex",
    },
    activityBox: {
      width: "25%",
      padding: "0 8px",
    },
    activityList: {
      listStyle: "none",
      padding: "0",
      margin: "0",
    },
    activityItem: {
      fontSize: "12px",
      marginBottom: "8px",
    },
    editSection: {
      marginTop: "48px",
      paddingTop: "16px",
      borderTop: "1px solid #e5e7eb",
    },
    editTitle: {
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "8px",
    },
    editButton: {
      backgroundColor: "#0052cc",
      color: "white",
      padding: "4px 12px",
      borderRadius: "4px",
      fontSize: "14px",
      border: "none",
      cursor: "pointer",
    },
    editNote: {
      fontSize: "12px",
      marginTop: "8px",
      color: "#6b7280",
    },
    fadeAnimation: {
      opacity: isAnimating ? 0 : 1,
      transition: "opacity 1s ease",
    },
    focusedMonth: {
      transform: "scale(1.05)",
      transition: "transform 0.3s ease",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
  }

  // Função para criar o clipPath para as setas da timeline
  const getClipPath = (index) => {
    if (index === timelineData.months.length - 1) {
      return "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
    }
    return "polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%, 5% 50%)"
  }

  return (
    <div style={styles.container}>
      {/* Cabeçalho com os meses */}
      <div style={styles.monthsHeader}>
        {timelineData.months.map((month, index) => (
          <div
            key={`month-${index}`}
            style={{
              ...styles.monthName,
              color: month.color,
              ...(currentMonthIndex === index ? styles.focusedMonth : {}),
            }}
          >
            {month.name}
          </div>
        ))}
      </div>

      {/* Linha do tempo visual */}
      <div style={styles.timelineContainer}>
        {timelineData.months.map((month, index) => (
          <div
            key={`timeline-${index}`}
            style={{
              ...styles.timelineSection,
              backgroundColor: month.color,
              clipPath: getClipPath(index),
            }}
          >
            {index === 0 && (
              <div
                style={{
                  ...styles.timelineArrowFirst,
                  backgroundColor: month.color,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Conteúdo do mês atual com animação */}
      <div style={styles.fadeAnimation}>
        {/* Tarefa principal do mês atual */}
        <div style={styles.mainTasksContainer}>
          <div style={{ ...styles.mainTaskBox, width: "100%" }}>
            <h3 style={{ ...styles.mainTaskTitle, color: timelineData.months[currentMonthIndex].color }}>
              {timelineData.months[currentMonthIndex].mainTask}
            </h3>
          </div>
        </div>

        {/* Atividades do mês atual */}
        <div style={styles.activitiesContainer}>
          <div style={{ ...styles.activityBox, width: "100%" }}>
            <ul style={styles.activityList}>
              {timelineData.months[currentMonthIndex].activities.map((activity, actIndex) => (
                <li
                  key={`activity-${currentMonthIndex}-${actIndex}`}
                  style={{ ...styles.activityItem, color: timelineData.months[currentMonthIndex].color }}
                >
                  {activity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Controles de navegação manual */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button
          style={{
            backgroundColor: "#0052cc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "8px 16px",
            margin: "0 8px",
            cursor: "pointer",
          }}
          onClick={() => {
            setIsAnimating(true)
            setTimeout(() => {
              setCurrentMonthIndex((prevIndex) => (prevIndex === 0 ? timelineData.months.length - 1 : prevIndex - 1))
              setIsAnimating(false)
            }, 500)
          }}
        >
          Anterior
        </button>
        <button
          style={{
            backgroundColor: "#0052cc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "8px 16px",
            margin: "0 8px",
            cursor: "pointer",
          }}
          onClick={() => {
            setIsAnimating(true)
            setTimeout(() => {
              setCurrentMonthIndex((prevIndex) => (prevIndex + 1) % timelineData.months.length)
              setIsAnimating(false)
            }, 500)
          }}
        >
          Próximo
        </button>

        {onFinish && (
          <button
            style={{
              backgroundColor: "#FF0000",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              margin: "0 8px",
              cursor: "pointer",
            }}
            onClick={onFinish}
          >
            Continuar para o Fluxograma
          </button>
        )}
      </div>
    </div>
  )
}

export default TimelineProject
