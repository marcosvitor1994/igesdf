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

  const styles = {
    container: {
      width: "100%",
      padding: "16px",
      backgroundColor: "white",
      fontFamily: "Arial, sans-serif",
    },
    monthsHeader: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "20px",
      position: "relative",
    },
    monthName: {
      fontSize: "16px",
      fontWeight: "600",
      textAlign: "center",
      padding: "8px 16px",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    timelineContainer: {
      position: "relative",
      display: "flex",
      width: "100%",
      height: "64px",
      marginBottom: "30px",
    },
    timelineSection: {
      flex: 1,
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s ease",
    },
    timelineArrowFirst: {
      height: "64px",
      width: "16px",
      position: "absolute",
      left: "-16px",
    },
    indicator: {
      position: "absolute",
      bottom: "-25px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "20px",
      height: "20px",
      backgroundColor: "white",
      border: "3px solid",
      borderRadius: "50%",
      zIndex: 2,
    },
    contentContainer: {
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      padding: "24px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      marginBottom: "30px",
      position: "relative",
      transition: "all 0.5s ease",
      opacity: isAnimating ? 0 : 1,
    },
    monthTag: {
      display: "inline-block",
      padding: "5px 15px",
      borderRadius: "20px",
      color: "white",
      fontWeight: "bold",
      fontSize: "18px",
      marginBottom: "15px",
    },
    mainTaskTitle: {
      fontSize: "22px",
      fontWeight: "600",
      marginBottom: "20px",
    },
    activityList: {
      listStyle: "none",
      padding: "0",
      margin: "0",
      fontSize: "16px",
    },
    activityItem: {
      fontSize: "16px",
      marginBottom: "12px",
      display: "flex",
      alignItems: "flex-start",
    },
    activityBullet: {
      minWidth: "24px",
      height: "24px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "12px",
      color: "white",
      fontWeight: "bold",
    },
    navigationButtons: {
      display: "flex",
      justifyContent: "center",
      marginTop: "20px",
    },
    navButton: {
      backgroundColor: "#0052cc",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "10px 20px",
      margin: "0 8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "500",
      transition: "background-color 0.3s ease",
    },
    continueButton: {
      backgroundColor: "#FF0000",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "10px 20px",
      margin: "0 8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "500",
      transition: "background-color 0.3s ease",
    },
    navButtonHover: {
      backgroundColor: "#003d99",
    },
    continueButtonHover: {
      backgroundColor: "#cc0000",
    },
  }

  // Função para criar o clipPath para as setas da timeline
  const getClipPath = (index) => {
    if (index === timelineData.months.length - 1) {
      return "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
    }
    return "polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%, 5% 50%)"
  }

  // Função para mudar o mês com animação
  const changeMonth = (newIndex) => {
    if (newIndex !== currentMonthIndex) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentMonthIndex(newIndex)
        setIsAnimating(false)
      }, 300)
    }
  }

  // Função para navegar para o mês anterior
  const goToPreviousMonth = () => {
    const newIndex = currentMonthIndex === 0 ? timelineData.months.length - 1 : currentMonthIndex - 1
    changeMonth(newIndex)
  }

  // Função para navegar para o próximo mês
  const goToNextMonth = () => {
    const newIndex = (currentMonthIndex + 1) % timelineData.months.length
    changeMonth(newIndex)
  }

  // Obter mês atual
  const currentMonth = timelineData.months[currentMonthIndex]

  return (
    <div style={styles.container}>
      {/* Cabeçalho com os meses */}
      <div style={styles.monthsHeader}>
        {timelineData.months.map((month, index) => (
          <div
            key={`month-${index}`}
            style={{
              ...styles.monthName,
              color: index === currentMonthIndex ? "white" : month.color,
              backgroundColor: index === currentMonthIndex ? month.color : "transparent",
              transform: index === currentMonthIndex ? "scale(1.1)" : "scale(1)",
              boxShadow: index === currentMonthIndex ? "0 4px 8px rgba(0, 0, 0, 0.15)" : "none",
            }}
            onClick={() => changeMonth(index)}
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
              height: index === currentMonthIndex ? "72px" : "64px",
              zIndex: index === currentMonthIndex ? 2 : 1,
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
            {index === currentMonthIndex && (
              <div
                style={{
                  ...styles.indicator,
                  borderColor: month.color,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Conteúdo do mês atual */}
      <div style={styles.contentContainer}>
        <div style={{ ...styles.monthTag, backgroundColor: currentMonth.color }}>
          {currentMonth.name}
        </div>
        <h2 style={{ ...styles.mainTaskTitle, color: currentMonth.color }}>
          {currentMonth.mainTask}
        </h2>
        <ul style={styles.activityList}>
          {currentMonth.activities.map((activity, actIndex) => (
            <li key={`activity-${currentMonthIndex}-${actIndex}`} style={styles.activityItem}>
              <div
                style={{
                  ...styles.activityBullet,
                  backgroundColor: currentMonth.color,
                }}
              >
                {actIndex + 1}
              </div>
              <div>{activity}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Controles de navegação manual */}
      <div style={styles.navigationButtons}>
        <button
          style={styles.navButton}
          onClick={goToPreviousMonth}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = styles.navButtonHover.backgroundColor
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = styles.navButton.backgroundColor
          }}
        >
          Anterior
        </button>
        <button
          style={styles.navButton}
          onClick={goToNextMonth}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = styles.navButtonHover.backgroundColor
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = styles.navButton.backgroundColor
          }}
        >
          Próximo
        </button>

        {onFinish && (
          <button
            style={styles.continueButton}
            onClick={onFinish}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = styles.continueButtonHover.backgroundColor
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = styles.continueButton.backgroundColor
            }}
          >
            Continuar para o Fluxograma
          </button>
        )}
      </div>
    </div>
  )
}

export default TimelineProject