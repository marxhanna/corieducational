/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ClipboardList } from "lucide-react";
import "../../styles/Ator/FichaAtor.css";

const GerarFichaAtor = () => {
  const [caseId, setCaseId] = useState(""); // Estado para o ID do caso/tarefa
  const [showClinicalCase, setShowClinicalCase] = useState(false); // Controle para exibir o caso clínico
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Controle de dropdown
  const [clinicalData, setClinicalData] = useState(null); // Dados do caso clínico
  const [loading, setLoading] = useState(false); // Estado de carregamento

  // Função para carregar os dados do caso clínico
  const fetchClinicalCase = async () => {
    const options = {
      method: "GET",
      headers: {
        "User-Agent": "insomnia/10.2.0",
        Authorization: "Bearer oat_Ng.ei11cmtKMTBoMjhFaDM2bW1USWcwbU5hUlhLblZxZTIxMW1wbERHSTI5NzMxNTIwODY",
      },
    };

    try {
      setLoading(true);
      const response = await fetch(
        `https://back-end-cori-feedbacks-node.opatj4.easypanel.host/actors/actor-record/${caseId}`,
        options
      );
      const data = await response.json();
      setClinicalData(data);
      setShowClinicalCase(true); // Exibir os dados após carregamento
    } catch (err) {
      console.error("Erro ao buscar dados clínicos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCaseIdChange = (e) => {
    setCaseId(e.target.value);
  };

  const handleCaseIdSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsDropdownOpen(false);
      fetchClinicalCase(); // Chamar a função de busca ao pressionar Enter
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="gerar-ficha-container">
      <h1>Ficha do Paciente</h1>

      {/* Dropdown para o ID do Caso/Tarefa */}
      <div className="accordion-item">
        <button
          type="button"
          className="accordion-header"
          onClick={toggleDropdown}
          aria-expanded={isDropdownOpen}
        >
          <div className="accordion-icon-container">
            <ClipboardList size={20} />
          </div>
          <span>ID do Caso/Tarefa</span>
          {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {isDropdownOpen && (
          <div className="accordion-content">
            <input
              id="caseId"
              type="text"
              value={caseId}
              onChange={handleCaseIdChange}
              onKeyDown={handleCaseIdSubmit}
              placeholder="Digite o ID do caso/tarefa e pressione Enter"
              className="input"
            />
          </div>
        )}
      </div>

      {/* Dados do Caso Clínico */}
      {loading && <p>Carregando dados...</p>}
      {clinicalData && (
        <div className="clinical-case">
          <h2>Caso Clínico</h2>

          <div className="clinical-case-card">
            <h3>Descrição</h3>
            <p>{clinicalData.description}</p>
          </div>

          {clinicalData.actorRecord.map((record) => (
            <div key={record.id} className="clinical-case-card">
              <h3>{record.type}</h3>
              <p>
                <strong>{record.title}:</strong> {record.content}
              </p>
            </div>
          ))}

          {clinicalData.vitals.map((vital) => (
            <div key={vital.id} className="clinical-case-card">
              <h3>Sinais Vitais</h3>
              <p>
                <strong>{vital.title}:</strong> {vital.content}
              </p>
            </div>
          ))}

          {clinicalData.exams.map((exam) => (
            <div key={exam.id} className="clinical-case-card">
              <h3>Exames</h3>
              <p>
                <strong>{exam.title}:</strong> {exam.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GerarFichaAtor;
