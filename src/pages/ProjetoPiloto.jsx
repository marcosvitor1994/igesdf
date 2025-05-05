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
          <li>Evitar deslocamentos desnecessários, promovendo segurança e agilidade no cuidado.</li>
        </ul>
      </section>

      <section>
        <h2 style={sectionTitleStyle}>Objetivo Geral</h2>
        <p style={paragraphStyle}>
          Avaliar, por meio de um piloto, o impacto da <strong>inclusão de um Round Diário via Teleinterconsulta</strong> com foco nos <strong>3 pacientes com maior tempo de permanência</strong> nas UPAs geridas pelo IGESDF.
        </p>
      </section>

      <section>
        <h2 style={sectionTitleStyle}>Objetivos Específicos</h2>
        <ul style={listStyle}>
          <li>Reduzir o tempo de permanência dos pacientes nas UPAs;</li>
          <li>Promover atendimento especializado e discussão clínica estruturada;</li>
          <li>Otimizar o uso de recursos (exames e medicamentos);</li>
          <li>Reduzir a necessidade de pareceres presenciais e o transporte associado;</li>
          <li>Descongestionar a fila de espera por atendimento especializado.</li>
        </ul>
      </section>

      <section>
        <h2 style={sectionTitleStyle}>Metodologia e Desenho do Piloto</h2>
        <p style={paragraphStyle}><strong>Participantes:</strong></p>
        <ul style={listStyle}>
          <li>UPAs participantes: 5 unidades (UPA Vicente Pires, UPA Ceilândia II, UPA Ceilândia I, UPA Núcleo Bandeirante e Hospital do Sol);</li>
          <li>Equipe envolvida: Profissionais das UPAs e equipe de Teleinterconsulta;</li>
          <li>Acompanhamento: NUREM (Núcleo de Regulação Médica).</li>
        </ul>

        <p style={paragraphStyle}><strong>Funcionamento do Round:</strong></p>
        <ul style={listStyle}>
          <li>Duração do piloto: <strong>30 dias</strong>;</li>
          <li>Cada Round terá duração de <strong>1 hora por unidade</strong>;</li>
          <li>Distribuição semanal:
            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>Segundas e quintas:</strong> Manhã: Hospital do Sol e UPA Vicente Pires | Tarde: UPA Ceilândia II</li>
              <li><strong>Terças e sextas:</strong> Manhã: UPA Núcleo Bandeirante | Tarde: UPA Ceilândia I</li>
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
        <h2 style={sectionTitleStyle}>Processo Operacional</h2>
        <p style={paragraphStyle}><strong>Nas UPAs:</strong></p>
        <ul style={listStyle}>
          <li>Seleção dos 3 pacientes com maior tempo de permanência;</li>
          <li>Profissional designado realiza avaliação e prepara o caso para discussão.</li>
        </ul>

        <p style={paragraphStyle}><strong>Na Teleinterconsulta:</strong></p>
        <ul style={listStyle}>
          <li>Avaliação prévia dos prontuários dos pacientes selecionados;</li>
          <li>Participação da equipe na discussão do Round no horário agendado.</li>
        </ul>

        <p style={italicStyle}>Obs: Continua válida a solicitação de Teleinterconsulta para outros pacientes fora do Round, quando necessário.</p>
      </section>

      <section>
        <h2 style={sectionTitleStyle}>Monitoramento e Avaliação do Piloto</h2>
        <ul style={listStyle}>
          <li>Presença das unidades nas sessões de Round;</li>
          <li>Número de pacientes discutidos;</li>
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
          <li>Redução de riscos relacionados ao transporte e à espera por pareceres.</li>
        </ul>
      </section>
    </div>
    )
  }
  
  export default ProjetoPiloto
  