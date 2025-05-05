"use client"

import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import ReactFlow, { Controls, Background, useNodesState, useEdgesState } from "reactflow"
import "reactflow/dist/style.css"
import { Container } from "react-bootstrap"
import logo_iges from "../images/logo-iges.png"

// Estilo personalizado para os nós
const nodeStyle = {
  padding: "10px 20px",
  borderRadius: "30px",
  background: "#1a73e8",
  color: "white",
  fontWeight: "bold",
  border: "none",
  textAlign: "center",
  minWidth: "180px",
  cursor: "pointer",
  fontSize: "14px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

// Nós do fluxograma
const initialNodes = [
  {
    id: "nusad",
    position: { x: 400, y: 50 },
    data: { label: "NUSAD" },
    style: { ...nodeStyle, background: "#0047AB" },
  },
  {
    id: "teleconsulta",
    position: { x: 150, y: 150 },
    data: { label: "TELECONSULTA" },
    style: nodeStyle,
  },
  {
    id: "teleinterconsulta",
    position: { x: 400, y: 150 },
    data: { label: "TELE INTERCONSULTA" },
    style: nodeStyle,
  },
  {
    id: "rounds",
    position: { x: 650, y: 150 },
    data: { label: "ROUNDS" },
    style: nodeStyle,
  },
  {
    id: "projeto-piloto",
    position: { x: 150, y: 250 },
    data: { label: "Projeto piloto - UPA VICENTE PIRES" },
    style: { ...nodeStyle, fontSize: "12px" },
  },
  {
    id: "psiquiatria",
    position: { x: 400, y: 250 },
    data: { label: "PSIQUIATRIA" },
    style: nodeStyle,
  },
  {
    id: "hb-hrsm",
    position: { x: 650, y: 250 },
    data: { label: "HB/HRSM/UPAS/HCSOL" },
    style: nodeStyle,
  },
  {
    id: "cardiologia",
    position: { x: 400, y: 350 },
    data: { label: "CARDIOLOGIA" },
    style: nodeStyle,
  },
  {
    id: "clinica-medica-2",
    position: { x: 650, y: 350 },
    data: { label: "CLÍNICA MÉDICA" },
    style: nodeStyle,
  },
  {
    id: "pediatria",
    position: { x: 400, y: 450 },
    data: { label: "PEDIATRIA" },
    style: nodeStyle,
  },
  {
    id: "pneumologia",
    position: { x: 400, y: 550 },
    data: { label: "PNEUMOLOGIA" },
    style: nodeStyle,
  },
]

// Conexões entre os nós
const initialEdges = [
  { id: "e1-2", source: "nusad", target: "teleconsulta" },
  { id: "e1-3", source: "nusad", target: "teleinterconsulta" },
  { id: "e1-4", source: "nusad", target: "rounds" },
  { id: "e2-5", source: "teleconsulta", target: "projeto-piloto" },
  { id: "e3-6", source: "teleinterconsulta", target: "psiquiatria" },
  { id: "e6-9", source: "psiquiatria", target: "cardiologia" },
  { id: "e9-10", source: "cardiologia", target: "pediatria" },
  { id: "e10-11", source: "pediatria", target: "pneumologia" },
  { id: "e4-7", source: "rounds", target: "hb-hrsm" },
  { id: "e7-10", source: "hb-hrsm", target: "clinica-medica-2" },
]

const Home = () => {
  const navigate = useNavigate()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Função para lidar com o clique em um nó
  const onNodeClick = useCallback(
    (event, node) => {
      // Aqui você pode navegar para a página correspondente ao nó clicado
      console.log(`Clicou no nó: ${node.id}`)

      // Exemplo de navegação
      navigate(`/${node.id}`)
    },
    [navigate],
  )

  return (
    <Container fluid className="p-0" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div
        style={{ padding: "20px", backgroundColor: "#f8f9fa", borderBottom: "1px solid #dee2e6", textAlign: "center" }}
      >
        <img src={logo_iges || "/placeholder.svg"} alt="Logo IGES" style={{ height: "60px" }} />
        <h2 style={{ marginTop: "10px" }}>Núcleo de Inovação, Ensino e Saúde Digital - NUSAD</h2>
        <h5>Amandha Roberta Fernandes Dias</h5>
        <h5>Chefe do Núcleo</h5>
      </div>
      <div style={{ height: "calc(100% - 120px)", width: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-right"
        >
          <Controls />
          <Background color="#ffffff" gap={16} />
        </ReactFlow>
      </div>
    </Container>
  )
}

export default Home
