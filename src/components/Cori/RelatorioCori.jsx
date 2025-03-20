/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"; // Importando ícones adicionais para Paginação
import "../../styles/info.css"; // Importando os estilos

const RelatorioCori = () => {
  const [sortConfig, setSortConfig] = useState({
    key: "caseId",
    direction: "ascending",
  });
  const [filters, setFilters] = useState({
    caseId: "",
    feedbackSent: "",
    examsSent: "",
  });

  // Estados para controlar a abertura dos comboboxes
  // Removido: isDisciplineDropdownOpen e disciplineDropdownRef
  const [isFeedbackDropdownOpen, setIsFeedbackDropdownOpen] = useState(false);
  const [isExamsDropdownOpen, setIsExamsDropdownOpen] = useState(false);
  const [caseData, setCaseData] = useState([]);

  // Referências para os comboboxes
  // Removido: disciplineDropdownRef
  const feedbackDropdownRef = useRef(null);
  const examsDropdownRef = useRef(null);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer oat_Ng.ei11cmtKMTBoMjhFaDM2bW1USWcwbU5hUlhLblZxZTIxMW1wbERHSTI5NzMxNTIwODY'
      }
    };

    fetch('https://back-end-cori-feedbacks-node.opatj4.easypanel.host/cori/reports', options)
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map(item => ({
          caseId: item.caseId,
          attendanceId: item.treatmentId,
          studentRequestedExam: item.exams,
          examsSent: item.examsSended,
          feedbackSent: item.feedback
        }));
        setCaseData(formattedData);
      })
      .catch(err => console.error("Erro na requisição:", err));
  }, []);

  // Função de filtragem
  const filteredData = useMemo(() => {
    return caseData.filter((item) => {
      const caseIdMatch = filters.caseId
        ? item.caseId.toLowerCase().includes(filters.caseId.toLowerCase())
        : true;
      // Removido: Filtragem por disciplina e ator
      const feedbackMatch = filters.feedbackSent
        ? filters.feedbackSent === "Concluído"
          ? item.feedbackSent
          : !item.feedbackSent
        : true;
      const examsMatch = filters.examsSent
        ? filters.examsSent === "Concluído"
          ? item.examsSent
          : !item.examsSent
        : true;

      return caseIdMatch && feedbackMatch && examsMatch;
    });
  }, [filters, caseData]);

  // Função de ordenação
  const sortedData = useMemo(() => {
    const sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Converter valores booleanos para string para comparação
        if (typeof aValue === "boolean")
          aValue = aValue ? "Concluído" : "Pendente";
        if (typeof bValue === "boolean")
          bValue = bValue ? "Concluído" : "Pendente";

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Removido: disciplinas e atores únicos
  // const disciplines = [...new Set(caseData.map((item) => item.discipline))];
  // const actors = [...new Set(caseData.map((item) => item.actor))];

  // Função para fechar dropdowns ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      // Removido: Fechamento do dropdown de disciplina
      // if (
      //   disciplineDropdownRef.current &&
      //   !disciplineDropdownRef.current.contains(event.target)
      // ) {
      //   setIsDisciplineDropdownOpen(false);
      // }
      if (
        feedbackDropdownRef.current &&
        !feedbackDropdownRef.current.contains(event.target)
      ) {
        setIsFeedbackDropdownOpen(false);
      }
      if (
        examsDropdownRef.current &&
        !examsDropdownRef.current.contains(event.target)
      ) {
        setIsExamsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Função para atualizar os filtros e resetar a página atual
  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
    setCurrentPage(1); // Resetar para a primeira página ao filtrar
  };

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const totalPages = Math.ceil(sortedData.length / recordsPerPage);

  const currentRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return sortedData.slice(startIndex, startIndex + recordsPerPage);
  }, [currentPage, sortedData]);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    setFilters({
      caseId: "",
      feedbackSent: "",
      examsSent: "",
    });
    setCurrentPage(1);
  };

  return (
    <div className="info-container">
      <h1 className="title">
        <LayoutDashboard color="#FF0F68" size={24} />{" "}
        <strong>Acompanhamento</strong>
      </h1>
      {/* Filtros */}
      <div className="search-filter-container">
        {/* Combobox Disciplina Removido */}

        {/* Combobox Feedbacks */}
        <div className="combobox-container" ref={feedbackDropdownRef}>
          <button
            className={`combobox-button ${isFeedbackDropdownOpen ? "active" : ""}`}
            onClick={() => setIsFeedbackDropdownOpen(!isFeedbackDropdownOpen)}
          >
            <span className="combobox-icon">Feedback</span>
            {isFeedbackDropdownOpen ? (
              <ChevronUp size={16} className="chevron-icon" />
            ) : (
              <ChevronDown size={16} className="chevron-icon" />
            )}
          </button>
          {isFeedbackDropdownOpen && (
            <div className="combobox-dropdown">
              <div
                onClick={() => {
                  handleFilterChange("feedbackSent", "");
                  setIsFeedbackDropdownOpen(false);
                }}
                className={`dropdown-item ${filters.feedbackSent === "" ? "active" : ""}`}
              >
                Todos os Feedbacks
              </div>
              <div
                onClick={() => {
                  handleFilterChange("feedbackSent", "Concluído");
                  setIsFeedbackDropdownOpen(false);
                }}
                className={`dropdown-item ${filters.feedbackSent === "Concluído" ? "active" : ""}`}
              >
                Enviado
              </div>
              <div
                onClick={() => {
                  handleFilterChange("feedbackSent", "Pendente");
                  setIsFeedbackDropdownOpen(false);
                }}
                className={`dropdown-item ${filters.feedbackSent === "Pendente" ? "active" : ""}`}
              >
                Pendente
              </div>
            </div>
          )}
        </div>

        {/* Combobox Exames */}
        <div className="combobox-container" ref={examsDropdownRef}>
          <button
            className={`combobox-button ${isExamsDropdownOpen ? "active" : ""}`}
            onClick={() => setIsExamsDropdownOpen(!isExamsDropdownOpen)}
          >
            <span className="combobox-icon">Exames</span>
            {isExamsDropdownOpen ? (
              <ChevronUp size={16} className="chevron-icon" />
            ) : (
              <ChevronDown size={16} className="chevron-icon" />
            )}
          </button>
          {isExamsDropdownOpen && (
            <div className="combobox-dropdown">
              <div
                onClick={() => {
                  handleFilterChange("examsSent", "");
                  setIsExamsDropdownOpen(false);
                }}
                className={`dropdown-item ${filters.examsSent === "" ? "active" : ""}`}
              >
                Todos os Exames
              </div>
              <div
                onClick={() => {
                  handleFilterChange("examsSent", "Concluído");
                  setIsExamsDropdownOpen(false);
                }}
                className={`dropdown-item ${filters.examsSent === "Concluído" ? "active" : ""}`}
              >
                Enviado
              </div>
              <div
                onClick={() => {
                  handleFilterChange("examsSent", "Pendente");
                  setIsExamsDropdownOpen(false);
                }}
                className={`dropdown-item ${filters.examsSent === "Pendente" ? "active" : ""}`}
              >
                Pendente
              </div>
            </div>
          )}
        </div>

        {/* Botão de Limpar Filtros */}
        <button className="clear-filters-button" onClick={clearAllFilters}>
          <RefreshCw size={16} className="clear-filters-icon" />
        </button>
      </div>

      {/* Tabela */}
      <table className="case-table">
        <thead>
          <tr>
            {/* Coluna de Atendimento agora é a primeira */}
            <th onClick={() => requestSort("attendanceId")}>Atendimento</th>
            <th onClick={() => requestSort("caseId")}>Caso</th>
            {/* Removidas as colunas Disciplina e Ator */}
            <th onClick={() => requestSort("studentRequestedExam")}>
              Solicitação Exame
            </th>
            <th onClick={() => requestSort("examsSent")}>Envio de Exames</th>
            <th onClick={() => requestSort("feedbackSent")}>
              Envio do Feedback
            </th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((caseItem, index) => (
            <tr key={index}>
              {/* Coluna de Atendimento com badge azul */}
              <td data-label="Atendimento">
                <span className="badge-attendance-id">
                  {caseItem.attendanceId}
                </span>
              </td>
              <td>{caseItem.caseId}</td>
              {/* Removidas as colunas Disciplina e Ator */}
              <td>
                {caseItem.studentRequestedExam ? (
                  <span className="badge-realizado">Solicitado</span>
                ) : (
                  <span className="badge-nao-realizado">Pendente</span>
                )}
              </td>
              <td>
                {caseItem.examsSent ? (
                  <span className="badge-realizado">Enviado</span>
                ) : (
                  <span className="badge-nao-realizado">Pendente</span>
                )}
              </td>
              <td>
                {caseItem.feedbackSent ? (
                  <span className="badge-realizado">Enviado</span>
                ) : (
                  <span className="badge-nao-realizado">Pendente</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="pagination-container">
          {/* Botão de Página Anterior */}
          <button
            className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
            onClick={prevPage}
            disabled={currentPage === 1}
            aria-label="Página Anterior"
          >
            <ArrowLeft />
          </button>

          {/* Texto de Página Atual */}
          <span className="pagination-text">
            Página {currentPage} de {totalPages}
          </span>

          {/* Botão de Próxima Página */}
          <button
            className={`pagination-button ${currentPage === totalPages ? "disabled" : ""}`}
            onClick={nextPage}
            disabled={currentPage === totalPages}
            aria-label="Próxima Página"
          >
            <ArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default RelatorioCori;
