import React from 'react';

const ProjetoPiloto = () => {

  const containerStyle: React.CSSProperties = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
    lineHeight: 1.6,
    textAlign: 'left',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '24px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: '32px',
    marginBottom: '12px',
  };

  const listStyle: React.CSSProperties = {
    paddingLeft: '20px',
    marginBottom: '12px',
  };

  const paragraphStyle: React.CSSProperties = {
    marginBottom: '12px',
  };

  const italicStyle: React.CSSProperties = {
    fontStyle: 'italic',
    marginTop: '8px',
  };

    return (
      
      <div style={containerStyle}>
      <h1 style={headingStyle}>Projeto Piloto - UPA VICENTE PIRES – IGESDF</h1>

      <section>
        <h2 style={sectionTitleStyle}>Contexto e Justificativa</h2>
        <ul style={listStyle}>
          <li>Manter a melhor linha de cuidado aos pacientes atendidos nas Unidades de Pronto Atendimento (UPAs);</li>
          <li>Reduzir riscos e danos associados à transferência de pacientes para consultas presenciais especializadas;</li>
          <li>Aproveitar o potencial da Telemedicina para qualificar o atendimento e apoiar a tomada de decisão clínica;</li>
        </ul>
      </section>

      <section>
        <h2 style={sectionTitleStyle}>Objetivo Geral</h2>
        
        <ul style={listStyle}>
          <li>Reduzir o tempo de permanência dos pacientes nas UPAs;</li>
          <li>Promover atendimento especializado;</li>
          <li>Otimizar o uso de recursos (exames e medicamentos);</li>
          <li>Reduzir a necessidade de pareceres presenciais e o transporte associado;</li>
          <li>Descongestionar a fila de espera por atendimento.</li>
        </ul>
      </section>

      <section>
        <h2 style={sectionTitleStyle}>Metodologia e Desenho do Piloto</h2>
        <p style={paragraphStyle}><strong>Participantes:</strong></p>
        <ul style={listStyle}>
          <li>UPAs participantes: UPA Vicente Pires;</li>
          <li>Equipe envolvida: Profissionais das UPAs e equipe de Tele consulta;</li>
          <li>Acompanhamento: NUSAD (Núcleo de Inovação, Ensino e Saúde Digital).</li>
        </ul>

        <p style={paragraphStyle}><strong>Funcionamento:</strong></p>
        <ul style={listStyle}>
          <li>Duração do piloto: <strong>30 dias</strong>;</li>
          <li><strong>1 hora por unidade</strong>;</li>
          <li>Distribuição semanal:
            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>Segundas - sextas:</strong> 7 as 19h - previsao do inicio dos atendimentos as 8h com finalizacao as 17h para suprir os retornos</li>
            </ul>
          </li>
        </ul>

        <p style={paragraphStyle}><strong>Horários propostos:</strong></p>
        <ul style={listStyle}>
          <li>Manhã: 08h30 às 09h30 ou 10h00 às 11h00</li>
          <li>Tarde: 14h30 às 15h30 ou 16h00 às 17h00</li>
        </ul>
      </section>

      <section>
        <h2 style={sectionTitleStyle}>Monitoramento e Avaliação do Piloto</h2>
        <ul style={listStyle}>
          <li>Número de pacientes;</li>
          <li>Desfechos positivos/negativos;</li>
          <li>Percepção dos envolvidos sobre a efetividade do processo.</li>
        </ul>
      </section>

      <section>
        <h2 style={sectionTitleStyle}>Resultados Esperados</h2>
        <ul style={listStyle}>
          <li>Redução significativa da permanência de pacientes nas UPAs;</li>
          <li>Melhoria da qualidade do cuidado com suporte especializado;</li>
          <li>Maior eficiência na gestão de recursos;</li>
          <li>Redução de riscos relacionados a espera por pareceres.</li>
        </ul>
      </section>
    </div>
    )
  }
  
  export default ProjetoPiloto
  