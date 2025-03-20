/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  FileText,
  Book,
  Repeat,
} from "lucide-react";
import "../../styles/info.css";

const Info = () => {
  const [sortConfig, setSortConfig] = useState({
    key: "caseId",
    direction: "ascending",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedReturnConsultation, setSelectedReturnConsultation] =
    useState(null);
  const [isTaskDropdownOpen, setIsTaskDropdownOpen] = useState(false);
  const [isCaseDropdownOpen, setIsCaseDropdownOpen] = useState(false);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [
    isReturnConsultationDropdownOpen,
    setIsReturnConsultationDropdownOpen,
  ] = useState(false);

  // Estado para os dados da API
  const [apiData, setApiData] = useState([]);

  // Referências para os dropdowns
  const taskDropdownRef = useRef(null);
  const caseDropdownRef = useRef(null);
  const subjectDropdownRef = useRef(null);
  const returnConsultationDropdownRef = useRef(null);

  // Buscar os dados da API ao montar o componente
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "User-Agent": "insomnia/11.0.0",
        Authorization:
          "Bearer oat_NQ.N1FxRE9DQTQ1Q19hNTE1SVBEaGtTZlRPYm1VT3gwR0NsUDVhRThYODMzMzAxMDg0Mw",
      },
    };

    fetch(
      "https://back-end-cori-feedbacks-node.opatj4.easypanel.host/students/status-table/",
      options
    )
      .then((response) => response.json())
      .then((data) => setApiData(data))
      .catch((err) => console.error(err));
  }, []);

  // Fechar os dropdowns ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        taskDropdownRef.current &&
        !taskDropdownRef.current.contains(event.target)
      ) {
        setIsTaskDropdownOpen(false);
      }
      if (
        caseDropdownRef.current &&
        !caseDropdownRef.current.contains(event.target)
      ) {
        setIsCaseDropdownOpen(false);
      }
      if (
        subjectDropdownRef.current &&
        !subjectDropdownRef.current.contains(event.target)
      ) {
        setIsSubjectDropdownOpen(false);
      }
      if (
        returnConsultationDropdownRef.current &&
        !returnConsultationDropdownRef.current.contains(event.target)
      ) {
        setIsReturnConsultationDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Opções dos filtros baseadas nos dados da API
  const taskOptions = useMemo(() => {
    const tasks = apiData.map((item) => item.task?.uuid || item.taskId);
    return [...new Set(tasks)];
  }, [apiData]);

  const caseOptions = useMemo(() => {
    const cases = apiData.map((item) => item.case?.uuid || item.caseId);
    return [...new Set(cases)];
  }, [apiData]);

  const subjectOptions = useMemo(() => {
    const subjects = apiData.map((item) => item.discipline?.name);
    return [...new Set(subjects)];
  }, [apiData]);

  const returnConsultationOptions = [
    { label: "Concluído", value: true },
    { label: "Pendente", value: false },
  ];

  // Ordenar os dados
  const sortedData = useMemo(() => {
    let sortableItems = [...apiData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Para os campos aninhados (tarefa e caso)
        if (sortConfig.key === "taskId") {
          aValue = a.task?.uuid || a.taskId;
          bValue = b.task?.uuid || b.taskId;
        }
        if (sortConfig.key === "caseId") {
          aValue = a.case?.uuid || a.caseId;
          bValue = b.case?.uuid || b.caseId;
        }
        if (aValue === null || aValue === undefined) aValue = "";
        if (bValue === null || bValue === undefined) bValue = "";

        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [apiData, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Filtrar os dados com base nos filtros e na pesquisa
  const filteredData = useMemo(() => {
    return sortedData.filter((item) => {
      const combinedValues = [
        item.task?.uuid || item.taskId,
        item.case?.uuid || item.caseId,
        item.studentServiceId,
        item.discipline?.name,
        item.feedbackCori,
        item.feedbackProf,
      ]
        .join(" ")
        .toLowerCase();

      const searchTermMatch = combinedValues.includes(searchTerm.toLowerCase());

      const taskFilterMatch = selectedTask
        ? (item.task?.uuid || item.taskId) === selectedTask
        : true;
      const caseFilterMatch = selectedCase
        ? (item.case?.uuid || item.caseId) === selectedCase
        : true;
      const subjectFilterMatch = selectedSubject
        ? item.discipline?.name === selectedSubject
        : true;
      const returnConsultationFilterMatch =
        selectedReturnConsultation !== null
          ? selectedReturnConsultation
            ? item.finalTreatment !== null
            : item.finalTreatment === null
          : true;

      return (
        searchTermMatch &&
        taskFilterMatch &&
        caseFilterMatch &&
        subjectFilterMatch &&
        returnConsultationFilterMatch
      );
    });
  }, [
    sortedData,
    searchTerm,
    selectedTask,
    selectedCase,
    selectedSubject,
    selectedReturnConsultation,
  ]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedTask(null);
    setSelectedCase(null);
    setSelectedSubject(null);
    setSelectedReturnConsultation(null);
  };

  return (
    <div className="info-container">
      <div className="title-container">
        <h1 className="title">
          <LayoutDashboard color="#FF0F68" size={24} />{" "}
          <strong>Atendimentos</strong>
        </h1>
      </div>

      {/* Filtros */}
      <div className="search-filter-container">
        {/* Combobox Tarefa */}
        <div className="combobox-container" ref={taskDropdownRef}>
          <button
            className={`combobox-button ${isTaskDropdownOpen ? "active" : ""}`}
            onClick={() => setIsTaskDropdownOpen(!isTaskDropdownOpen)}
            aria-haspopup="true"
            aria-expanded={isTaskDropdownOpen}
          >
            <span className="combobox-icon">
              <ClipboardCheck size={16} /> &nbsp;Tarefa
            </span>
            {isTaskDropdownOpen ? (
              <ChevronUp size={16} className="chevron-icon" />
            ) : (
              <ChevronDown size={16} className="chevron-icon" />
            )}
          </button>
          {isTaskDropdownOpen && (
            <div className="combobox-dropdown">
              <div
                onClick={() => {
                  setSelectedTask(null);
                  setIsTaskDropdownOpen(false);
                }}
                className={`dropdown-item ${selectedTask === null ? "active" : ""}`}
              >
                <ClipboardCheck size={16} style={{ marginRight: "8px" }} />
                Todas as Tarefas
              </div>
              {taskOptions.map((taskId) => (
                <div
                  key={taskId}
                  onClick={() => {
                    setSelectedTask(taskId);
                    setIsTaskDropdownOpen(false);
                  }}
                  className={`dropdown-item ${selectedTask === taskId ? "active" : ""}`}
                >
                  <ClipboardCheck size={16} style={{ marginRight: "8px" }} />
                  {taskId}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Combobox ID do Caso */}
        <div className="combobox-container" ref={caseDropdownRef}>
          <button
            className={`combobox-button ${isCaseDropdownOpen ? "active" : ""}`}
            onClick={() => setIsCaseDropdownOpen(!isCaseDropdownOpen)}
            aria-haspopup="true"
            aria-expanded={isCaseDropdownOpen}
          >
            <span className="combobox-icon">
              <FileText size={16} /> &nbsp;Caso
            </span>
            {isCaseDropdownOpen ? (
              <ChevronUp size={16} className="chevron-icon" />
            ) : (
              <ChevronDown size={16} className="chevron-icon" />
            )}
          </button>
          {isCaseDropdownOpen && (
            <div className="combobox-dropdown">
              <div
                onClick={() => {
                  setSelectedCase(null);
                  setIsCaseDropdownOpen(false);
                }}
                className={`dropdown-item ${selectedCase === null ? "active" : ""}`}
              >
                <FileText size={16} style={{ marginRight: "8px" }} />
                Todos os Casos
              </div>
              {caseOptions.map((caseId) => (
                <div
                  key={caseId}
                  onClick={() => {
                    setSelectedCase(caseId);
                    setIsCaseDropdownOpen(false);
                  }}
                  className={`dropdown-item ${selectedCase === caseId ? "active" : ""}`}
                >
                  <FileText size={16} style={{ marginRight: "8px" }} />
                  {caseId}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Combobox Disciplina */}
        <div className="combobox-container" ref={subjectDropdownRef}>
          <button
            className={`combobox-button ${isSubjectDropdownOpen ? "active" : ""}`}
            onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
            aria-haspopup="true"
            aria-expanded={isSubjectDropdownOpen}
          >
            <span className="combobox-icon">
              <Book size={16} /> &nbsp;Disciplina
            </span>
            {isSubjectDropdownOpen ? (
              <ChevronUp size={16} className="chevron-icon" />
            ) : (
              <ChevronDown size={16} className="chevron-icon" />
            )}
          </button>
          {isSubjectDropdownOpen && (
            <div className="combobox-dropdown">
              <div
                onClick={() => {
                  setSelectedSubject(null);
                  setIsSubjectDropdownOpen(false);
                }}
                className={`dropdown-item ${selectedSubject === null ? "active" : ""}`}
              >
                <Book size={16} style={{ marginRight: "8px" }} />
                Todas as Disciplinas
              </div>
              {subjectOptions.map((subject) => (
                <div
                  key={subject}
                  onClick={() => {
                    setSelectedSubject(subject);
                    setIsSubjectDropdownOpen(false);
                  }}
                  className={`dropdown-item ${selectedSubject === subject ? "active" : ""}`}
                >
                  <Book size={16} style={{ marginRight: "8px" }} />
                  {subject}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Combobox Consulta Retorno */}
        <div className="combobox-container" ref={returnConsultationDropdownRef}>
          <button
            className={`combobox-button ${isReturnConsultationDropdownOpen ? "active" : ""}`}
            onClick={() =>
              setIsReturnConsultationDropdownOpen(
                !isReturnConsultationDropdownOpen
              )
            }
            aria-haspopup="true"
            aria-expanded={isReturnConsultationDropdownOpen}
          >
            <span className="combobox-icon">
              <Repeat size={16} /> &nbsp;Retorno
            </span>
            {isReturnConsultationDropdownOpen ? (
              <ChevronUp size={16} className="chevron-icon" />
            ) : (
              <ChevronDown size={16} className="chevron-icon" />
            )}
          </button>
          {isReturnConsultationDropdownOpen && (
            <div className="combobox-dropdown">
              <div
                onClick={() => {
                  setSelectedReturnConsultation(null);
                  setIsReturnConsultationDropdownOpen(false);
                }}
                className={`dropdown-item ${selectedReturnConsultation === null ? "active" : ""}`}
              >
                <Repeat size={16} style={{ marginRight: "8px" }} />
                Todas as Consultas
              </div>
              {returnConsultationOptions.map((option) => (
                <div
                  key={option.label}
                  onClick={() => {
                    setSelectedReturnConsultation(option.value);
                    setIsReturnConsultationDropdownOpen(false);
                  }}
                  className={`dropdown-item ${selectedReturnConsultation === option.value ? "active" : ""}`}
                >
                  {option.value ? (
                    <span className="badge-realizado">{option.label}</span>
                  ) : (
                    <span className="badge-nao-realizado">{option.label}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botão para limpar os filtros */}
        <button
          className="clear-filters-button"
          onClick={clearAllFilters}
          aria-label="Limpar Filtros"
        >
          <RefreshCw size={16} className="clear-filters-icon" />
        </button>

        {/* Campo de pesquisa */}
        <input
          type="text"
          className="search-input"
          placeholder="Pesquisar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabela */}
      <div className="table-responsive">
        <table className="case-table">
          <thead>
            <tr>
              <th onClick={() => requestSort("taskId")}>Tarefa</th>
              <th onClick={() => requestSort("caseId")}>ID do Caso</th>
              <th onClick={() => requestSort("studentServiceId")}>
                Atendimento
              </th>
              <th onClick={() => requestSort("initTreatment")}>
                Consulta Inicial
              </th>
              <th onClick={() => requestSort("finalTreatment")}>
                Consulta Retorno
              </th>
              <th onClick={() => requestSort("exams")}>Exames</th>
              <th onClick={() => requestSort("discipline")}>Disciplina</th>
              <th onClick={() => requestSort("feedbackCori")}>Feedback Cori</th>
              <th onClick={() => requestSort("feedbackProf")}>
                Feedback Docente
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <span className="badge-attendance-id">
                      {item.task?.uuid || item.taskId}
                    </span>
                  </td>
                  <td>
                    <span className="badge-case-id">
                      {item.case?.uuid || item.caseId}
                    </span>
                  </td>
                  <td>{item.uuid}</td>
                  <td>
                    {item.initTreatment ? (
                      <span className="badge-realizado">Concluído</span>
                    ) : (
                      <span className="badge-nao-realizado">Pendente</span>
                    )}
                  </td>
                  <td>
                    {item.finalTreatment ? (
                      <span className="badge-realizado">Concluído</span>
                    ) : (
                      <span className="badge-nao-realizado">Pendente</span>
                    )}
                  </td>
                  <td>
                    {item.exams ? (
                      <span className="badge-realizado">Recebido</span>
                    ) : (
                      <span className="badge-nao-realizado">Pendente</span>
                    )}
                  </td>
                  <td>{item.discipline?.name}</td>
                  <td>
                    {item.feedbackCori ? (
                      <span className="badge-realizado">Enviado</span>
                    ) : (
                      <span className="badge-nao-realizado">Pendente</span>
                    )}
                  </td>
                  <td>
                    {item.feedbackProf ? (
                      <span className="badge-realizado">Enviado</span>
                    ) : (
                      <span className="badge-nao-realizado">Pendente</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  Nenhum dado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Info;
