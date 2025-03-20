/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Activity,
  Clipboard,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Calendar,
} from "lucide-react"; // Ícones aprimorados
import DatePicker from "react-datepicker"; // Importação do react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Importação do CSS do react-datepicker
import "../../styles/Ator/info.css"; // Rota corrigida para o CSS
import { format } from "date-fns"; // Para formatar a data

const Info = () => {
  const [sortConfig, setSortConfig] = useState({
    key: "caseId",
    direction: "ascending",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [selectedCase, setSelectedCase] = useState("");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isCaseDropdownOpen, setIsCaseDropdownOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [caseData, setcaseData] = useState([]);

  const [startDate, endDate] = selectedDateRange;

  const statusDropdownRef = useRef(null);
  const caseDropdownRef = useRef(null);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer oat_Ng.ei11cmtKMTBoMjhFaDM2bW1USWcwbU5hUlhLblZxZTIxMW1wbERHSTI5NzMxNTIwODY'
      }
    };

    fetch('https://back-end-cori-feedbacks-node.opatj4.easypanel.host/actors/accompaniment', options)
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map(item => ({
          attendanceId: "a12b34cd",
          taskId: "T-001",
          caseId: "f68b1e4c",
          patientId: "A001",
          initialConsultation: true,
          returnConsultation: true,
          initialDate: "2024-11-09",
          returnDate: "2024-11-16"
        }));
        setcaseData(formattedData);
      })
      .catch(err => console.error("Erro na requisição:", err));
  }, []);

  const filteredData = useMemo(() => {
    return caseData.filter((item) => {
      const searchTermMatch = Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const statusFilterMatch = statusFilter
        ? (statusFilter === "Concluído" && item.returnConsultation) ||
          (statusFilter === "Pendente" && !item.returnConsultation)
        : true;
      const caseFilterMatch = selectedCase
        ? item.caseId === selectedCase
        : true;
      const dateFilterMatch =
        startDate && endDate
          ? new Date(item.initialDate) >= startDate &&
            new Date(item.initialDate) <= endDate
          : true;

      return (
        searchTermMatch &&
        statusFilterMatch &&
        caseFilterMatch &&
        dateFilterMatch
      );
    });
  }, [searchTerm, statusFilter, selectedCase, startDate, endDate, caseData]);

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Para datas, converter para Date
        if (sortConfig.key.toLowerCase().includes("date")) {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

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

  const cases = [...new Set(caseData.map((item) => item.caseId))];

  // Função para fechar dropdowns ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setIsStatusDropdownOpen(false);
      }
      if (
        caseDropdownRef.current &&
        !caseDropdownRef.current.contains(event.target)
      ) {
        setIsCaseDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setSelectedCase("");
    setSelectedDateRange([null, null]);
    setCurrentPage(1);
  };

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const totalPages = Math.ceil(sortedData.length / recordsPerPage);

  const currentRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [currentPage, sortedData]);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="monitoramento-container">
      <h1 className="monitoramento-title">
        <LayoutDashboard color="#FF0F68" size={24} />{" "}
        <strong>Acompanhamento</strong>
      </h1>
      {/* Área de Busca e Filtros */}
      <div className="monitoramento-search-filter">
        {/* Combobox Status Retorno */}
        <div className="monitoramento-combobox" ref={statusDropdownRef}>
          <button
            className={`monitoramento-combobox-button ${
              isStatusDropdownOpen ? "active" : ""
            }`}
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
          >
            <Activity size={16} className="monitoramento-combobox-icon" />
            {statusFilter ? statusFilter : "Status Retorno"}
            {isStatusDropdownOpen ? (
              <ChevronUp size={16} className="monitoramento-chevron-icon" />
            ) : (
              <ChevronDown size={16} className="monitoramento-chevron-icon" />
            )}
          </button>
          {isStatusDropdownOpen && (
            <div className="monitoramento-dropdown">
              <div
                onClick={() => {
                  setStatusFilter("Concluído");
                  setIsStatusDropdownOpen(false);
                  setCurrentPage(1);
                }}
                className={`monitoramento-dropdown-item ${
                  statusFilter === "Concluído" ? "active" : ""
                }`}
              >
                Concluído
              </div>
              <div
                onClick={() => {
                  setStatusFilter("Pendente");
                  setIsStatusDropdownOpen(false);
                  setCurrentPage(1);
                }}
                className={`monitoramento-dropdown-item ${
                  statusFilter === "Pendente" ? "active" : ""
                }`}
              >
                Pendente
              </div>
            </div>
          )}
        </div>

        {/* Botão de Intervalo de Datas com Ícone de Calendário */}
        <div className="monitoramento-date-picker">
          {!datePickerOpen && (
            <button
              className="monitoramento-date-picker-button"
              onClick={() => setDatePickerOpen(true)}
            >
              <Calendar size={16} className="monitoramento-date-picker-icon" />
            </button>
          )}
          {datePickerOpen && (
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setSelectedDateRange(update);
                setCurrentPage(1);
              }}
              isClearable={true}
              inline
              onClickOutside={() => setDatePickerOpen(false)}
            />
          )}
        </div>

        {/* Combobox Caso */}
        <div className="monitoramento-combobox" ref={caseDropdownRef}>
          <button
            className={`monitoramento-combobox-button ${
              isCaseDropdownOpen ? "active" : ""
            }`}
            onClick={() => setIsCaseDropdownOpen(!isCaseDropdownOpen)}
          >
            <Clipboard size={16} className="monitoramento-combobox-icon" />
            {selectedCase ? selectedCase : "Caso"}
            {isCaseDropdownOpen ? (
              <ChevronUp size={16} className="monitoramento-chevron-icon" />
            ) : (
              <ChevronDown size={16} className="monitoramento-chevron-icon" />
            )}
          </button>
          {isCaseDropdownOpen && (
            <div className="monitoramento-dropdown">
              {cases.map((caseId) => (
                <div
                  key={caseId}
                  onClick={() => {
                    setSelectedCase(caseId);
                    setIsCaseDropdownOpen(false);
                    setCurrentPage(1);
                  }}
                  className={`monitoramento-dropdown-item ${
                    selectedCase === caseId ? "active" : ""
                  }`}
                >
                  {caseId}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botão de Limpar Filtros */}
        <button
          className="monitoramento-clear-filters-button"
          onClick={clearAllFilters}
        >
          <RefreshCw size={16} className="monitoramento-clear-filters-icon" />
        </button>
      </div>

      {/* Tabela Responsiva */}
      <div className="table-responsive">
        <table className="monitoramento-table">
          <thead>
            <tr>
              <th onClick={() => requestSort("attendanceId")}>Atendimento</th>
              <th onClick={() => requestSort("taskId")}>Tarefa</th>
              <th onClick={() => requestSort("caseId")}>Caso</th>
              <th onClick={() => requestSort("initialConsultation")}>
                Status Inicial
              </th>
              <th onClick={() => requestSort("returnConsultation")}>
                Status Retorno
              </th>
              <th onClick={() => requestSort("initialDate")}>Data Inicial</th>
              <th onClick={() => requestSort("returnDate")}>Data Retorno</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((caseItem, index) => (
              <tr key={index}>
                <td data-label="Atendimento">{caseItem.attendanceId}</td>
                <td data-label="Tarefa">
                  <span className="monitoramento-badge-tarefa">
                    {caseItem.taskId}
                  </span>
                </td>
                <td data-label="Caso">
                  <span className="monitoramento-badge-caso">
                    {caseItem.caseId}
                  </span>
                </td>
                <td data-label="Status Inicial">
                  <span
                    className={
                      caseItem.initialConsultation
                        ? "monitoramento-badge-realizado"
                        : "monitoramento-badge-nao-realizado"
                    }
                  >
                    {caseItem.initialConsultation ? "Concluído" : "Pendente"}
                  </span>
                </td>
                <td data-label="Status Retorno">
                  <span
                    className={
                      caseItem.returnConsultation
                        ? "monitoramento-badge-realizado"
                        : "monitoramento-badge-nao-realizado"
                    }
                  >
                    {caseItem.returnConsultation
                      ? "Concluído"
                      : "Não Concluído"}
                  </span>
                </td>
                <td data-label="Data Inicial">
                  {caseItem.initialDate
                    ? format(new Date(caseItem.initialDate), "dd/MM/yyyy")
                    : "Não realizada"}
                </td>
                <td data-label="Data Retorno">
                  {caseItem.returnDate ? (
                    format(new Date(caseItem.returnDate), "dd/MM/yyyy")
                  ) : (
                    <span className="monitoramento-badge-nao-marcado">
                      Indisponível
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="monitoramento-pagination">
          <button
            className={`monitoramento-pagination-button ${
              currentPage === 1 ? "disabled" : ""
            }`}
            onClick={prevPage}
            disabled={currentPage === 1}
            aria-label="Página Anterior"
          >
            <ArrowLeft />
          </button>

          <span className="monitoramento-pagination-text">
            Página {currentPage} de {totalPages}
          </span>

          <button
            className={`monitoramento-pagination-button ${
              currentPage === totalPages ? "disabled" : ""
            }`}
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

export default Info;
