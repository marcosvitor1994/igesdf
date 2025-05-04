import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  Calendar, 
  CheckSquare, 
  Heart, 
  UserCheck, 
  AlertTriangle 
} from "lucide-react";

const Nusad = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await axios.get("https://api-google-sheets-7zph.vercel.app/hospital");
      const data = response.data.values.slice(1); // Remove header row
      setPedidos(data);
      setFilteredPedidos(data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [pedidos, specialtyFilter, startDate, endDate]);

  const applyFilters = () => {
    let filtered = [...pedidos];

    if (specialtyFilter) {
      filtered = filtered.filter((pedido) => pedido[6] === specialtyFilter);
    }

    if (startDate && endDate) {
      filtered = filtered.filter((pedido) => {
        const dataSolicitacao = new Date(pedido[1].split(" ")[0].split("/").reverse().join("-"));
        return dataSolicitacao >= startDate && dataSolicitacao <= endDate;
      });
    }

    setFilteredPedidos(filtered);
  };

  const handleSpecialtyFilterChange = (event) => {
    setSpecialtyFilter(event.target.value);
  };

  // Dados para os cards
  const totalAtendimentos = filteredPedidos.length;
  const atendimentosConcluidos = filteredPedidos.filter(pedido => pedido[9] === "Concluído").length;
  const atendimentosEvadidos = totalAtendimentos - atendimentosConcluidos;
  const especialidades = [...new Set(pedidos.map((pedido) => pedido[6]))];

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Painel de Gerenciamento NUSAD</h2>

      <div className="row mb-4">
        <div className="col-md-6 col-lg-4 mb-3">
          <label htmlFor="specialty" className="form-label">Especialidade:</label>
          <select 
            className="form-select" 
            id="specialty" 
            value={specialtyFilter} 
            onChange={handleSpecialtyFilterChange}
          >
            <option value="">Todas</option>
            {especialidades.map((especialidade, index) => (
              <option key={index} value={especialidade}>
                {especialidade}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 col-lg-8 mb-3">
          <label className="form-label">Intervalo de Datas:</label>
          <div className="d-flex gap-2 align-items-center">
            <div className="input-group">
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="form-control"
                dateFormat="dd/MM/yyyy"
                placeholderText="Data inicial"
                maxDate={endDate || new Date()}
                minDate={new Date("2024-01-01")}
              />
              <span className="input-group-text">
                <Calendar size={18} />
              </span>
            </div>
            <span>até</span>
            <div className="input-group">
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date()}
                className="form-control"
                dateFormat="dd/MM/yyyy"
                placeholderText="Data final"
              />
              <span className="input-group-text">
                <Calendar size={18} />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card bg-info bg-opacity-25 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <CheckSquare className="text-secondary" size={20} />
                <h5 className="card-title">Total de Atendimentos</h5>
              </div>
              <p className="card-text text-muted small">Total de atendimentos no período</p>
              <h3 className="mt-3">{totalAtendimentos}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card bg-danger bg-opacity-25 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <Heart className="text-secondary" size={20} />
                <h5 className="card-title">Especialidades</h5>
              </div>
              <p className="card-text text-muted small">Número de especialidades atendidas</p>
              <h3 className="mt-3">{especialidades.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card bg-success bg-opacity-25 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <UserCheck className="text-secondary" size={20} />
                <h5 className="card-title">Atendimentos concluídos</h5>
              </div>
              <p className="card-text text-muted small">Quantidade de atendimentos concluídos</p>
              <h3 className="mt-3">{atendimentosConcluidos}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card bg-warning bg-opacity-25 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <AlertTriangle className="text-secondary" size={20} />
                <h5 className="card-title">Atendimentos evadidos</h5>
              </div>
              <p className="card-text text-muted small">Atendimentos sem conclusão</p>
              <h3 className="mt-3">{atendimentosEvadidos}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nusad;