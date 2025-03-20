// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

const CardIntroducao = () => {
  const [activeSections, setActiveSections] = useState([]);

  const toggleSection = (index) => {
    setActiveSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">2. Introdução</h2>
      </div>
      <div className="card-body">
        <div className="info-section">
          <button className="collapsible" onClick={() => toggleSection(1)}>
            <span className="subtitle-number">2.1</span>
            {activeSections.includes(1) ? <ChevronDown /> : <ChevronRight />}
            Objetivo do Relatório
          </button>
          <div
            className="content"
            style={{
              display: activeSections.includes(1) ? "block" : "none",
            }}
          >
            <p className="info-content">
              Este relatório tem como objetivo analisar as respostas fornecidas
              pelo aluno <strong>João Silva</strong> para um caso clínico
              específico de pneumonia comunitária, identificar o raciocínio
              utilizado, comparar com o caminho diagnóstico ideal e apontar
              áreas de melhoria.
            </p>
          </div>
        </div>

        <div className="info-section">
          <button className="collapsible" onClick={() => toggleSection(2)}>
            <span className="subtitle-number">2.2</span>
            {activeSections.includes(2) ? <ChevronDown /> : <ChevronRight />}
            Contextualização do Caso Clínico
          </button>
          <div
            className="content"
            style={{
              display: activeSections.includes(2) ? "block" : "none",
            }}
          >
            <p className="info-content">
              Paciente de 65 anos, sexo masculino, com histórico de tabagismo,
              apresentando febre alta, tosse produtiva com expectoração
              purulenta e dispneia há três dias.
            </p>
          </div>
        </div>

        <div className="info-section">
          <button className="collapsible" onClick={() => toggleSection(3)}>
            <span className="subtitle-number">2.3</span>
            {activeSections.includes(3) ? <ChevronDown /> : <ChevronRight />}
            Respostas do Aluno
          </button>
          <div
            className="content"
            style={{
              display: activeSections.includes(3) ? "block" : "none",
            }}
          >
            <p className="info-content">
              <strong>Diagnóstico Proposto:</strong> Bronquite Aguda
              <br />
              <strong>Exames Solicitados:</strong> Hemograma completo, raio-X de
              tórax, PCR
              <br />
              <strong>Sintomas Relevantes:</strong> Tosse produtiva, febre
              baixa, desconforto respiratório leve
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardIntroducao;
