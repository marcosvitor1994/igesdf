import React, { useState } from 'react';
import PsychiatryDashboard from './PsychiatryDashboard';
import FluxogramaParecer from '../images/PARECER MEDICO.png'

// Componente para os 3 novos cards usando Bootstrap / CSS puro
function TopCards() {
  return (
    <div className="top-cards-grid">
      {/* Card 1: Teleinterconsulta */}
      <button
        type="button"
        className="card card-clickable"
        onClick={() => window.open(
          'https://drive.google.com/file/d/1B4pS8vC9_88XKAVTzewUii6jvf0KVbXd/view?usp=sharing',
          '_blank'
        )}
      >
        <div className="stats-card card-pink">TELEINTERCONSULTA PARA PSIQUIATRIA</div>
      </button>

      {/* Card 2: Manual */}
      <button
        type="button"
        className="card card-clickable"
        onClick={() => window.open(
          'https://drive.google.com/file/d/1M58zyAvZVW8Hvu1CbBPNu_-XwA9EQAHU/view?usp=sharing',
          '_blank'
        )}
      >
        <div className="stats-card card-pink">MANUAL TELEINTERCONSULTA</div>
      </button>

      {/* Card 3: Tabela semanal */}
      <div className="card">
        <div className="stats-card card-pink">Grade Semanal (Modelo)</div>
        <div className="card-body">
          <table className="weekly-table">
            <thead>
              <tr>
                <th>Horário</th>
                <th>SEG</th>
                <th>TER</th>
                <th>QUA</th>
                <th>QUI</th>
                <th>SEX</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>8-9</td>
                <td>UPA VP</td>
                <td>UPA CEI II</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>9-10</td>
                <td>UPA SAM</td>
                <td>UPA RF</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>10-11</td>
                <td>UPA SOB</td>
                <td>UPA GAMA</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>11-12</td>
                <td>UPA SS</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>ALMOÇO</td>
                <td colSpan={5}></td>
              </tr>
              <tr>
                <td>13-14</td>
                <td>UPA REC</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>14-15</td>
                <td>UPA VP</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>15-16</td>
                <td>HCSOL</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>16-17</td>
                <td>UPA CEI</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>17-18</td>
                <td>UPA PLA</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function UpdatedPsychiatryDashboard() {
  const [showDetail, setShowDetail] = useState(false);
  const handleAltaClick = () => setShowDetail(prev => !prev);

  // Dados hard-coded de abril (ignorar totais finais)
  const altaSolicitacoes = 91;
  const altaAtendidas = 43;

  return (
    
    <div className="psy-dashboard-container">
        <div className="nusad-container">

        <div className="nusad-header">
            <h1>Painel de Gerenciamento - Psiquiatria</h1>  
        </div>  
            
    </div>
      {/* Cabeçalho e divider existentes */}
      <header className="psy-dashboard-header">
        {/* ... conteúdo do cabeçalho ... */}
      </header>
      <hr />

      {/* Inserção dos cards superiores */}
      <TopCards />
     

      {/* Espaço para o fluxograma */}
      <div className="image-container">
        <img
          src={FluxogramaParecer}
          alt="Fluxograma"
          className="new-fluxograma"
        />
      </div>

      {/* Conteúdo original do dashboard */}
      <PsychiatryDashboard />

      
    </div>
    
  );
}
