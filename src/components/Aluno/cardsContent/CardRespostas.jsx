// eslint-disable-next-line no-unused-vars
import React from "react";

const CardRespostas = () => (
  <div className="card">
    <div className="card-header">
      <h2 className="card-title">3. Respostas</h2>
    </div>
    <div className="card-body">
      <div className="info-section">
        <h3 className="info-title">
          <span className="subtitle-number">3.1</span> Diagnóstico Proposto
        </h3>
        <p className="info-content">Bronquite Aguda.</p>
      </div>

      <div className="info-section">
        <h3 className="info-title">
          <span className="subtitle-number">3.2</span> Exames Solicitados
        </h3>
        <p className="info-content">
          Hemograma completo, raio-X de tórax, dosagem de PCR.
        </p>
      </div>

      <div className="info-section">
        <h3 className="info-title">
          <span className="subtitle-number">3.3</span> Sintomas Considerados
          Relevantes
        </h3>
        <p className="info-content">
          Tosse produtiva, febre baixa, desconforto respiratório leve.
        </p>
      </div>
    </div>
  </div>
);

export default CardRespostas;
