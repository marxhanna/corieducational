// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

const CardAnaliseRespostas = () => {
  const [activeSections, setActiveSections] = useState([]);

  const toggleSection = (index) => {
    setActiveSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">4. Análise das Respostas</h2>
      </div>
      <div className="card-body">
        <div className="info-section">
          <button className="collapsible" onClick={() => toggleSection(3)}>
            <span className="subtitle-number">4.1</span>
            {activeSections.includes(3) ? <ChevronDown /> : <ChevronRight />}
            Avaliação do Diagnóstico Proposto
          </button>
          <div
            className="content"
            style={{
              display: activeSections.includes(3) ? "block" : "none",
            }}
          >
            <p className="info-content">
              <strong>Correção:</strong> O diagnóstico proposto de bronquite
              aguda não é compatível com o quadro clínico do paciente. A
              presença de febre alta, tosse produtiva com expectoração purulenta
              e dispneia em um paciente de 65 anos com histórico de tabagismo
              são características mais sugestivas de pneumonia comunitária, uma
              condição potencialmente grave e que requer manejo mais agressivo.
              <br />
              <strong>Comparação com Diagnóstico Ideal:</strong> O diagnóstico
              diferencial deve considerar a idade avançada, histórico de
              tabagismo e a evolução rápida dos sintomas, que são fatores de
              risco importantes para pneumonia comunitária. A não consideração
              desses fatores levou à proposta de um diagnóstico incompleto e
              inadequado.
            </p>
          </div>
        </div>

        <div className="info-section">
          <button className="collapsible" onClick={() => toggleSection(4)}>
            <span className="subtitle-number">4.2</span>
            {activeSections.includes(4) ? <ChevronDown /> : <ChevronRight />}
            Avaliação dos Exames Solicitados
          </button>
          <div
            className="content"
            style={{
              display: activeSections.includes(4) ? "block" : "none",
            }}
          >
            <p className="info-content">
              <strong>Pertinência:</strong> O hemograma completo e o raio-X de
              tórax são exames iniciais adequados e fundamentais para o
              diagnóstico de doenças respiratórias, como pneumonia. Entretanto,
              exames adicionais como a gasometria arterial e a oximetria de
              pulso são necessários para avaliar a gravidade da insuficiência
              respiratória e orientar a conduta terapêutica.
              <br />
              <strong>Sugestões de Exames Adicionais:</strong> Recomenda-se
              também a realização de culturas de escarro para identificação do
              patógeno causador da pneumonia, e hemoculturas, principalmente em
              pacientes com febre alta e sinais sistêmicos, para afastar
              bacteremia.
            </p>
          </div>
        </div>

        <div className="info-section">
          <button className="collapsible" onClick={() => toggleSection(5)}>
            <span className="subtitle-number">4.3</span>
            {activeSections.includes(5) ? <ChevronDown /> : <ChevronRight />}
            Avaliação dos Sintomas Considerados
          </button>
          <div
            className="content"
            style={{
              display: activeSections.includes(5) ? "block" : "none",
            }}
          >
            <p className="info-content">
              <strong>Relevância:</strong> Sintomas importantes foram ignorados.
              <br />
              <strong>Omissões:</strong> Febre alta, dispneia significativa.
              <br />
              <strong>Interpretação dos Sintomas:</strong> A interpretação foi
              parcial, não correlacionando todos os sintomas com o diagnóstico
              correto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardAnaliseRespostas;
