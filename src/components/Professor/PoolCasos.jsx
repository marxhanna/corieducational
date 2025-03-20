// eslint-disable-next-line no-unused-vars
import React, { useState, useMemo, useEffect, useRef } from "react";
import "../../styles/Professor/PoolCasos.css";
import { ChevronDown, Stethoscope, ChevronUp, RefreshCw } from "lucide-react";

const HistoricoCasosAlunos = () => {
  const [filters, setFilters] = useState({
    disciplina: "",
  });
  const [historico, setHistorico] = useState([]);
  const [isDisciplinaDropdownOpen, setIsDisciplinaDropdownOpen] =
    useState(false);

  const disciplinaDropdownRef = useRef(null);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer oat_Ng.ei11cmtKMTBoMjhFaDM2bW1USWcwbU5hUlhLblZxZTIxMW1wbERHSTI5NzMxNTIwODY'
      }
    };

    fetch('https://back-end-cori-feedbacks-node.opatj4.easypanel.host/teachers/cases', options)
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map(item => ({
          disciplina: "Disciplina Desconhecida",
          atendimentoId: item.uuid || "ID Não Disponível",
          resumoCaso: item.resume || "Resumo Não Disponível"
        }));
        setHistorico(formattedData);
      })
      .catch(err => console.error("Erro na requisição:", err));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        disciplinaDropdownRef.current &&
        !disciplinaDropdownRef.current.contains(event.target)
      ) {
        setIsDisciplinaDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      disciplina: "",
    });
  };

  const disciplinas = useMemo(() => {
    const disciplinasList = historico.map((caso) => caso.disciplina);
    return [...new Set(disciplinasList)];
  }, [historico]);

  const filteredHistorico = useMemo(() => {
    return historico.filter((caso) => {
      const disciplinaMatch = filters.disciplina
        ? caso.disciplina === filters.disciplina
        : true;

      return disciplinaMatch;
    });
  }, [filters, historico]);

  return (
    <div className="historico-casos-container">
      <h2 className="historico-casos-title">
        <Stethoscope
          color="#FF0F68"
          size={24}
          style={{ verticalAlign: "middle", marginRight: "8px" }}
        />
        <strong>Casos Clínicos</strong>
      </h2>

      {/* Filtro de Disciplina */}
      <div className="historico-filtros-container">
        {/* Combobox de Disciplina */}
        <div
          className="historico-combobox-container"
          ref={disciplinaDropdownRef}
        >
          <button
            className={`historico-combobox-button ${isDisciplinaDropdownOpen ? "active" : ""}`}
            onClick={() =>
              setIsDisciplinaDropdownOpen(!isDisciplinaDropdownOpen)
            }
            aria-haspopup="true"
            aria-expanded={isDisciplinaDropdownOpen}
          >
            <span className="historico-combobox-icon">Disciplina</span>
            {isDisciplinaDropdownOpen ? (
              <ChevronUp size={16} className="historico-chevron-icon" />
            ) : (
              <ChevronDown size={16} className="historico-chevron-icon" />
            )}
          </button>
          {isDisciplinaDropdownOpen && (
            <div className="historico-combobox-dropdown">
              <div
                onClick={() => {
                  handleFilterChange("disciplina", "");
                  setIsDisciplinaDropdownOpen(false);
                }}
                className={`historico-dropdown-item ${filters.disciplina === "" ? "active" : ""}`}
              >
                Todas as Disciplinas
              </div>
              {disciplinas.map((disciplina) => (
                <div
                  key={disciplina}
                  onClick={() => {
                    handleFilterChange("disciplina", disciplina);
                    setIsDisciplinaDropdownOpen(false);
                  }}
                  className={`historico-dropdown-item ${filters.disciplina === disciplina ? "active" : ""}`}
                >
                  {disciplina}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botão de Limpar Filtros */}
        <button
          className="historico-clear-filters-button"
          onClick={clearAllFilters}
        >
          <RefreshCw size={16} className="historico-clear-filters-icon" />
        </button>
      </div>

      {/* Tabela de histórico com rolagem horizontal em dispositivos móveis */}
      <div className="historico-table-responsive">
        <table className="historico-casos-table">
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Caso</th>
              <th>Resumo</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistorico.length > 0 ? (
              filteredHistorico.map((caso, index) => (
                <tr key={index}>
                  <td>
                    <span className="historico-badge-disciplina">
                      {caso.disciplina}
                    </span>
                  </td>
                  <td>
                    <span className="historico-badge-caso">
                      {caso.atendimentoId}
                    </span>
                  </td>
                  <td className="historico-caso-resumo">{caso.resumoCaso}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">Nenhum caso encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoricoCasosAlunos;
