"use client"

import { useState } from "react"
import PsychiatryDashboard from "./PsychiatryDashboard"

export default function UpdatedPsychiatryDashboard() {
  const [showDetail, setShowDetail] = useState(false)
  const handleAltaClick = () => setShowDetail((prev) => !prev)

  // Dados hard-coded de abril (ignorar totais finais)
  const altaSolicitacoes = 91
  const altaAtendidas = 43

  return (
    <div className="psy-dashboard-container">
      <div className="nusad-container">
        <div className="nusad-header">
          <h1>Painel de Gerenciamento - Psiquiatria</h1>
        </div>
      </div>

      {/* Conteúdo original do dashboard */}
      <PsychiatryDashboard />
    </div>
  )
}
