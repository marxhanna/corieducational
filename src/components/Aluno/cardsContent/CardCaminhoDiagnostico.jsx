// eslint-disable-next-line no-unused-vars
import React from "react";

const CardCaminhoDiagnostico = () => (
  <div className="card">
    <div className="card-header">
      <h2 className="card-title">6. Caminho Diagnóstico Ideal</h2>
    </div>
    <div className="card-body">
      <div className="info-section">
        <h3 className="info-title">
          <span className="subtitle-number">6.1</span> Diagnóstico Correto
        </h3>
        <p className="info-content">Pneumonia Comunitária.</p>
      </div>
      <div className="info-section">
        <h3 className="info-title">
          <span className="subtitle-number">6.2</span> Exames Recomendados
        </h3>
        <p className="info-content">
          Raio-X de tórax, gasometria arterial, oximetria de pulso, culturas de
          escarro, hemoculturas.
        </p>
      </div>
      <div className="info-section">
        <h3 className="info-title">
          <span className="subtitle-number">6.3</span> Sintomas Chave
        </h3>
        <p className="info-content">
          Febre alta, tosse produtiva com expectoração purulenta, dispneia
          significativa, idade avançada, tabagismo.
        </p>
      </div>
      <div className="info-section">
        <h3 className="info-title">
          <span className="subtitle-number">6.4</span> Sequência Lógica
          Recomendada
        </h3>
        <p className="info-content">
          Analisar todos os sintomas, considerar fatores de risco, solicitar
          exames adequados para confirmar a pneumonia.
        </p>
      </div>
    </div>
  </div>
);

export default CardCaminhoDiagnostico;
