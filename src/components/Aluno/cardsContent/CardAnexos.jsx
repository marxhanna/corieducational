// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

const CardAnexos = () => {
  const [activeSections, setActiveSections] = useState([]);

  const toggleSection = (index) => {
    setActiveSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">11. Anexos</h2>
      </div>
      <div className="card-body">
        <div className="info-section">
          <button className="collapsible" onClick={() => toggleSection(1)}>
            <span className="subtitle-number">11.1</span>
            {activeSections.includes(1) ? <ChevronDown /> : <ChevronRight />}
            Referências Bibliográficas
          </button>
          <div
            className="content"
            style={{
              display: activeSections.includes(1) ? "block" : "none",
            }}
          >
            <p className="info-content">
              -{" "}
              <a href="" target="_blank">
                GOLDMAN, L.; SCHAFER, A. I. Cecil: Medicina Interna. Elsevier
                Saunders, 2020.
              </a>
              <br />-{" "}
              <a href="" target="_blank">
                Murray & Nadel&apos;s Textbook of Respiratory Medicine. 7ª ed.
                Saunders, 2021.
              </a>
              <br />-{" "}
              <a
                href="https://www.nejm.org/doi/full/10.1056/NEJMra1312885"
                target="_blank"
              >
                Wunderink RG, Waterer GW. Community-acquired pneumonia.{" "}
                <em>N Engl J Med.</em> 2014;370(6):543-51.
              </a>
              <br />-{" "}
              <a
                href="https://www.atsjournals.org/doi/full/10.1164/rccm.201908-1581ST"
                target="_blank"
              >
                Metlay JP, Waterer GW, Long AC, et al. Diagnosis and Treatment
                of Adults with Community-acquired Pneumonia.{" "}
                <em>Am J Respir Crit Care Med.</em> 2019;200(7).
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardAnexos;
