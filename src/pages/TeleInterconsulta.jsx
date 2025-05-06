"use client"
import { Container, Row, Col, Card, Table, Accordion } from "react-bootstrap"
import {
  BookOpen,
  Calendar,
  ArrowRight,
  FileText,
  ClipboardList,
  HelpCircle,
  Building2,
  AlertTriangle,
  CheckSquare,
} from "lucide-react"
import FluxogramaParecer from "../images/PARECER MEDICO.png"

// Componente para os cards melhorados
function EnhancedTopCards() {
  return (
    <div className="top-cards-grid">
      {/* Card 1: Teleinterconsulta - Melhorado com ícones e descrição */}
      <Card
        className="card-clickable shadow-sm border-0 h-100"
        onClick={() =>
          window.open("https://drive.google.com/file/d/1B4pS8vC9_88XKAVTzewUii6jvf0KVbXd/view?usp=sharing", "_blank")
        }
        style={{ transition: "all 0.3s ease", cursor: "pointer" }}
      >
        <Card.Body className="d-flex flex-column p-4">
          <div className="d-flex align-items-center mb-3">
            <div
              style={{
                backgroundColor: "#f8d7da",
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "15px",
              }}
            >
              <FileText size={24} color="#dc3545" />
            </div>
            <h5 className="card-title mb-0 fw-bold">TELEINTERCONSULTA PARA PSIQUIATRIA</h5>
          </div>
          <p className="text-muted mb-3">
            Formulário para coleta da história clínica e avaliação psiquiátrica, incluindo dados do paciente, motivo da
            consulta, antecedentes e manifestações clínicas.
          </p>
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <span className="badge bg-light text-dark">Formulário</span>
            <div className="d-flex align-items-center text-danger">
              <small>Acessar documento</small>
              <ArrowRight size={16} className="ms-2" />
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Card 2: Manual - Melhorado com ícones e descrição */}
      <Card
        className="card-clickable shadow-sm border-0 h-100"
        onClick={() =>
          window.open("https://drive.google.com/file/d/1M58zyAvZVW8Hvu1CbBPNu_-XwA9EQAHU/view?usp=sharing", "_blank")
        }
        style={{ transition: "all 0.3s ease", cursor: "pointer" }}
      >
        <Card.Body className="d-flex flex-column p-4">
          <div className="d-flex align-items-center mb-3">
            <div
              style={{
                backgroundColor: "#d1e7dd",
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "15px",
              }}
            >
              <BookOpen size={24} color="#198754" />
            </div>
            <h5 className="card-title mb-0 fw-bold">MANUAL TELEINTERCONSULTA</h5>
          </div>
          <p className="text-muted mb-3">
            Guia com critérios de avaliação psiquiátrica, requisitos para internação, opções de unidades na rede SES/DF
            e exames laboratoriais necessários.
          </p>
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <span className="badge bg-light text-dark">Manual</span>
            <div className="d-flex align-items-center text-success">
              <small>Acessar manual</small>
              <ArrowRight size={16} className="ms-2" />
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Card 3: Tabela semanal - Mantido com melhorias visuais */}
      <Card className="shadow-sm border-0 h-100">
        <Card.Body className="p-4">
          <div className="d-flex align-items-center mb-3">
            <div
              style={{
                backgroundColor: "#cfe2ff",
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "15px",
              }}
            >
              <Calendar size={24} color="#0d6efd" />
            </div>
            <h5 className="card-title mb-0 fw-bold">Grade Semanal (Modelo)</h5>
          </div>
          <div className="table-responsive">
            <table className="weekly-table table table-bordered table-sm">
              <thead className="table-light">
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
                  <td className="fw-bold">8-9</td>
                  <td>UPA VP</td>
                  <td>UPA CEI II</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="fw-bold">9-10</td>
                  <td>UPA SAM</td>
                  <td>UPA RF</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="fw-bold">10-11</td>
                  <td>UPA SOB</td>
                  <td>UPA GAMA</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="fw-bold">11-12</td>
                  <td>UPA SS</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="fw-bold bg-light">ALMOÇO</td>
                  <td colSpan={5} className="bg-light"></td>
                </tr>
                <tr>
                  <td className="fw-bold">13-14</td>
                  <td>UPA REC</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="fw-bold">14-15</td>
                  <td>UPA VP</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="fw-bold">15-16</td>
                  <td>HCSOL</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="fw-bold">16-17</td>
                  <td>UPA CEI</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="fw-bold">17-18</td>
                  <td>UPA PLA</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

const TeleInterconsulta = () => {
  return (
    <Container fluid className="p-4">
      <div className="mb-4">
        <h1 className="mb-3">Tele Interconsulta</h1>
        <p className="lead">
          Sistema de teleinterconsulta para apoio especializado às unidades de saúde, permitindo discussão de casos e
          orientação terapêutica à distância.
        </p>
      </div>

      {/* Cards melhorados */}
      <EnhancedTopCards />

      {/* Fluxograma */}
      <div className="mt-4 mb-4">
        <Card className="shadow-sm border-0">
          <Card.Body className="p-4">
            <h4 className="mb-3">Fluxograma de Parecer Médico</h4>
            <div className="text-center">
              <img
                src={FluxogramaParecer || "/placeholder.svg"}
                alt="Fluxograma de Parecer Médico"
                className="img-fluid"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Informações da avaliação psiquiátrica */}
      <div className="mt-4">
        <Card className="shadow-sm border-0">
          <Card.Body className="p-4">
            <h4 className="mb-3">Avaliação Psiquiátrica</h4>
            <p>
              Na avaliação psiquiátrica via teleinterconsulta, é necessário coletar informações essenciais para garantir
              um atendimento adequado e seguro ao paciente. O formulário de teleinterconsulta para psiquiatria permite o
              registro estruturado de dados relevantes para a tomada de decisão clínica.
            </p>

            <h5 className="mt-4">Informações Necessárias para Avaliação</h5>
            <Row className="mt-3">
              <Col md={6}>
                <ul className="list-group">
                  <li className="list-group-item d-flex align-items-center">
                    <CheckSquare size={18} className="text-success me-2" />
                    Sinais e sintomas da doença mental
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <CheckSquare size={18} className="text-success me-2" />
                    Histórico de tratamento psiquiátrico e medicações em uso
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <CheckSquare size={18} className="text-success me-2" />
                    Uso de álcool ou substâncias ilícitas
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <CheckSquare size={18} className="text-success me-2" />
                    Exame do estado mental atual
                  </li>
                </ul>
              </Col>
              <Col md={6}>
                <ul className="list-group">
                  <li className="list-group-item d-flex align-items-center">
                    <CheckSquare size={18} className="text-success me-2" />
                    Avaliação de risco suicida (quando aplicável)
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <CheckSquare size={18} className="text-success me-2" />
                    Rede de apoio disponível para o paciente
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <CheckSquare size={18} className="text-success me-2" />
                    Comorbidades clínicas relevantes
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <CheckSquare size={18} className="text-success me-2" />
                    Gestação ou amamentação (quando aplicável)
                  </li>
                </ul>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>

      {/* Critérios de internação */}
      <div className="mt-4">
        <Card className="shadow-sm border-0">
          <Card.Body className="p-4">
            <h4 className="mb-3">Critérios de Regulação para Internação Psiquiátrica</h4>
            <p>
              De acordo com a Nota Técnica N.º 1/2022 – SES/SAIS/COASIS/DISSAM, são elegíveis para internação em Unidade
              Psiquiátrica pacientes que, por motivo decorrente da alteração do juízo crítico, apresentarem:
            </p>

            <Row className="mt-3">
              <Col md={6}>
                <div className="p-3 bg-light rounded mb-3">
                  <h5 className="d-flex align-items-center">
                    <AlertTriangle size={20} className="text-danger me-2" />
                    Critérios de Risco
                  </h5>
                  <ul className="list-unstyled mt-2">
                    <li className="mb-2">• Incapacidade grave de autocuidado</li>
                    <li className="mb-2">• Risco iminente de suicídio ou prejuízos graves à saúde</li>
                    <li className="mb-2">• Risco de autoagressão ou agressão a terceiros</li>
                    <li className="mb-2">• Risco de prejuízo moral ou dano patrimonial</li>
                    <li className="mb-2">• Risco de perturbação à ordem pública</li>
                  </ul>
                </div>
              </Col>
              <Col md={6}>
                <div className="p-3 bg-light rounded mb-3">
                  <h5 className="d-flex align-items-center">
                    <HelpCircle size={20} className="text-primary me-2" />
                    Critérios Clínicos
                  </h5>
                  <ul className="list-unstyled mt-2">
                    <li className="mb-2">• Refratariedade a tratamentos ambulatoriais</li>
                    <li className="mb-2">• Necessidade de medicamentos que demandem ajustes frequentes</li>
                    <li className="mb-2">• Dúvida diagnóstica que exija recursos hospitalares</li>
                    <li className="mb-2">• Necessidade de vigilância constante</li>
                    <li className="mb-2">• Ausência de suporte familiar ou social consistente</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>

      {/* Unidades de internação */}
      <div className="mt-4">
        <Card className="shadow-sm border-0">
          <Card.Body className="p-4">
            <h4 className="mb-3">Unidades de Internação Psiquiátrica na Rede SES/DF</h4>

            <Accordion className="mt-3">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <div className="d-flex align-items-center">
                    <Building2 size={18} className="me-2 text-danger" />
                    <strong>HSVP (Hospital São Vicente de Paulo)</strong>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <p>
                    Usuários com idade entre 18 e 59 anos, 11 meses e 29 dias, que NÃO apresentem particularidades
                    clínicas.
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <div className="d-flex align-items-center">
                    <Building2 size={18} className="me-2 text-primary" />
                    <strong>Enfermaria de Saúde Mental do HUB</strong>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <ul>
                    <li>Idade entre 18 e 60 anos, com particularidades clínicas, exceto insuficiência respiratória</li>
                    <li>Idade a partir de 60 anos, independente de comorbidades clínicas</li>
                    <li>Gestação em curso ou puerpério (até 45 dias)</li>
                    <li>
                      Alterações mentais e comportamentais comórbidas a dependência de substâncias psicoativas, após
                      período de desintoxicação ou abstinência aguda
                    </li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  <div className="d-flex align-items-center">
                    <Building2 size={18} className="me-2 text-success" />
                    <strong>HBDF (Hospital de Base do Distrito Federal)</strong>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <ul>
                    <li>Idade entre 12 a 17 anos, 11 meses e 29 dias</li>
                    <li>Idade maior que 60 anos</li>
                    <li>Idade entre 18 e 60 anos, caso haja particularidades clínicas</li>
                    <li>Pessoas em privação de liberdade</li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="3">
                <Accordion.Header>
                  <div className="d-flex align-items-center">
                    <Building2 size={18} className="me-2 text-warning" />
                    <strong>HMIB (Hospital Materno-Infantil de Brasília)</strong>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <ul>
                    <li>
                      Gestação em curso ou puerpério (até 45 dias), independentemente da idade ou presença de
                      comorbidades
                    </li>
                    <li>Crianças até 11 anos, 11 meses e 29 dias</li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="4">
                <Accordion.Header>
                  <div className="d-flex align-items-center">
                    <Building2 size={18} className="me-2 text-info" />
                    <strong>HCB (Hospital da Criança de Brasília)</strong>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <p>Crianças até 11 anos, 11 meses e 29 dias.</p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Card.Body>
        </Card>
      </div>

      {/* Exames necessários */}
      <div className="mt-4">
        <Card className="shadow-sm border-0">
          <Card.Body className="p-4">
            <h4 className="mb-3">Exames Laboratoriais Necessários para Internação Psiquiátrica</h4>

            <Row className="mt-3">
              <Col md={6}>
                <div className="p-3 border rounded">
                  <h5 className="d-flex align-items-center">
                    <ClipboardList size={20} className="text-primary me-2" />
                    Exames Requeridos
                  </h5>
                  <Table className="table-sm mt-3">
                    <tbody>
                      <tr>
                        <td width="30">
                          <CheckSquare size={16} className="text-success" />
                        </td>
                        <td>Beta-HCG para mulheres em idade fértil</td>
                      </tr>
                      <tr>
                        <td>
                          <CheckSquare size={16} className="text-success" />
                        </td>
                        <td>Hemograma completo</td>
                      </tr>
                      <tr>
                        <td>
                          <CheckSquare size={16} className="text-success" />
                        </td>
                        <td>Função hepática</td>
                      </tr>
                      <tr>
                        <td>
                          <CheckSquare size={16} className="text-success" />
                        </td>
                        <td>Função renal</td>
                      </tr>
                      <tr>
                        <td>
                          <CheckSquare size={16} className="text-success" />
                        </td>
                        <td>Eletrólitos</td>
                      </tr>
                      <tr>
                        <td>
                          <CheckSquare size={16} className="text-success" />
                        </td>
                        <td>CPK</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Col>
              <Col md={6}>
                <div className="p-3 border rounded">
                  <h5 className="d-flex align-items-center">
                    <FileText size={20} className="text-danger me-2" />
                    Documentação para SISLEITOS
                  </h5>
                  <Table className="table-sm mt-3">
                    <tbody>
                      <tr>
                        <td width="30">
                          <CheckSquare size={16} className="text-success" />
                        </td>
                        <td>Identificação completa do paciente</td>
                      </tr>
                      <tr>
                        <td>
                          <CheckSquare size={16} className="text-success" />
                        </td>
                        <td>História da doença atual</td>
                      </tr>
                      <tr>
                        <td>
                          <CheckSquare size={16} className="text-success" />
                        </td>
                        <td>Exame físico e sinais vitais atualizados</td>
                      </tr>
                      <tr>
                        <td>
                          <CheckSquare size={16} className="text-success" />
                        </td>
                        <td>Parecer psiquiátrico indicando internação</td>
                      </tr>
                      <tr>
                        <td>
                          <CheckSquare size={16} className="text-success" />
                        </td>
                        <td>Exames laboratoriais atualizados</td>
                      </tr>
                      <tr>
                        <td>
                          <CheckSquare size={16} className="text-success" />
                        </td>
                        <td>Resultado de ECG</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>

      {/* Manifestações clínicas */}
      <div className="mt-4 mb-5">
        <Card className="shadow-sm border-0">
          <Card.Body className="p-4">
            <h4 className="mb-3">Manifestações Clínicas Avaliadas</h4>
            <p>
              O formulário de teleinterconsulta para psiquiatria permite a avaliação de diversas manifestações clínicas
              relevantes para o diagnóstico e manejo dos transtornos mentais.
            </p>

            <Row className="mt-4">
              <Col md={4}>
                <div className="p-3 bg-light rounded mb-3">
                  <h5 className="mb-3 text-danger">Sintomas Psíquicos</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">• Pensamentos intrusivos ou compulsões</li>
                    <li className="mb-2">• Ideação catastrófica ou medo intenso</li>
                    <li className="mb-2">• Delírios ou sensação de perseguição</li>
                    <li className="mb-2">• Humor deprimido ou exaltado</li>
                    <li className="mb-2">• Alucinações auditivas</li>
                    <li className="mb-2">• Angústia persistente</li>
                    <li className="mb-2">• Episódios de choro</li>
                    <li className="mb-2">• Ideação suicida ou desejo de morte</li>
                  </ul>
                </div>
              </Col>
              <Col md={4}>
                <div className="p-3 bg-light rounded mb-3">
                  <h5 className="mb-3 text-primary">Alterações Comportamentais</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">• Agitação psicomotora</li>
                    <li className="mb-2">• Impulsividade</li>
                    <li className="mb-2">• Agressividade</li>
                    <li className="mb-2">• Apatia e/ou anedonia</li>
                    <li className="mb-2">• Comprometimento do autocuidado</li>
                    <li className="mb-2">• Isolamento social</li>
                    <li className="mb-2">• Comportamentos de risco</li>
                    <li className="mb-2">• Alterações na fala e comunicação</li>
                  </ul>
                </div>
              </Col>
              <Col md={4}>
                <div className="p-3 bg-light rounded mb-3">
                  <h5 className="mb-3 text-success">Alterações Fisiológicas</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">• Alterações de peso (aumento/redução)</li>
                    <li className="mb-2">• Alterações do sono (aumento/redução)</li>
                    <li className="mb-2">• Alterações de energia (aumento/redução)</li>
                    <li className="mb-2">• Alterações de apetite (aumento/redução)</li>
                    <li className="mb-2">• Sintomas autonômicos (taquicardia, sudorese)</li>
                    <li className="mb-2">• Alterações psicomotoras</li>
                    <li className="mb-2">• Alterações na libido</li>
                    <li className="mb-2">• Sintomas físicos sem causa orgânica</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </Container>
  )
}

export default TeleInterconsulta
