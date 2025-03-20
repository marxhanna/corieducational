/* eslint-disable no-unused-vars */
// src/components/HistoricoAlunos.jsx

import React, { useState, useMemo, useEffect, useRef } from "react";
import "../../styles/Professor/HistoricoAlunos.css";
import {
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ClipboardCheck,
  MessageSquare,
  LayoutDashboard,
  BookOpen,
} from "lucide-react"; // Importando os ícones necessários

const HistoricoAlunos = () => {
  // Estado inicial para os filtros
  const [filters, setFilters] = useState({
    disciplina: "",
    tarefaId: "",
    feedbackDocente: "",
  });

  // Estados para controlar a abertura dos comboboxes
  const [isDisciplinaDropdownOpen, setIsDisciplinaDropdownOpen] =
    useState(false);
  const [isTarefaDropdownOpen, setIsTarefaDropdownOpen] = useState(false);
  const [isFeedbackDocenteDropdownOpen, setIsFeedbackDocenteDropdownOpen] =
    useState(false);

  // Referências para os comboboxes
  const disciplinaDropdownRef = useRef(null);
  const tarefaDropdownRef = useRef(null);
  const feedbackDocenteDropdownRef = useRef(null);

  const options = {
    method: 'GET',
    headers: {
      'User-Agent': 'insomnia/10.3.0',
      Authorization: 'Bearer oat_Ng.ei11cmtKMTBoMjhFaDM2bW1USWcwbU5hUlhLblZxZTIxMW1wbERHSTI5NzMxNTIwODY'
    }
  };

  fetch('https://back-end-cori-feedbacks-node.opatj4.easypanel.host/teachers/accompaniment', options)
    .then(response => response.json())
    .then(data => {
      const formattedData = data.map(item => {
        const studentService = item.studentService?.[0] || {};
        return {
          disciplina: "Disciplina Desconhecida", // Substitua se necessário
          nome: item.user.fullName,
          casoId: studentService.uuid || "Caso não informado",
          tarefaId: item.taskId,
          consultaIda: !!item.videoFilename,
          consultaRetorno: !!item.videoReturnFilename,
          feedbackDocente: !!item.feedback,
        };
      });
      setHistorico(formattedData);
    })
    .catch(err => console.error(err));

  // Dados de exemplo para os alunos
  const [historico, setHistorico] = useState([]);

  // Função para fechar os dropdowns ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        disciplinaDropdownRef.current &&
        !disciplinaDropdownRef.current.contains(event.target)
      ) {
        setIsDisciplinaDropdownOpen(false);
      }
      if (
        tarefaDropdownRef.current &&
        !tarefaDropdownRef.current.contains(event.target)
      ) {
        setIsTarefaDropdownOpen(false);
      }
      if (
        feedbackDocenteDropdownRef.current &&
        !feedbackDocenteDropdownRef.current.contains(event.target)
      ) {
        setIsFeedbackDocenteDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Função para atualizar os filtros
  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    setFilters({
      disciplina: "",
      tarefaId: "",
      feedbackDocente: "",
    });
  };

  // Lista única de disciplinas para o combobox
  const disciplinas = useMemo(() => {
    const disciplinasList = historico.map((aluno) => aluno.disciplina);
    return [...new Set(disciplinasList)];
  }, [historico]);

  // Lista única de IDs de tarefas para o combobox
  const tarefas = useMemo(() => {
    const ids = historico.map((aluno) => aluno.tarefaId);
    return [...new Set(ids)];
  }, [historico]);

  // Função para filtrar os alunos com base nos filtros selecionados
  const filteredHistorico = useMemo(() => {
    return historico.filter((aluno) => {
      const disciplinaMatch = filters.disciplina
        ? aluno.disciplina === filters.disciplina
        : true;
      const tarefaMatch = filters.tarefaId
        ? aluno.tarefaId === filters.tarefaId
        : true;
      const feedbackDocenteMatch = filters.feedbackDocente
        ? filters.feedbackDocente === "Enviado"
          ? aluno.feedbackDocente
          : !aluno.feedbackDocente
        : true;

      return disciplinaMatch && tarefaMatch && feedbackDocenteMatch;
    });
  }, [filters, historico]);

  return (
    <div className="ha-info-container">
      <h2 className="ha-historico-alunos-title" style={{ textAlign: "center" }}>
        <LayoutDashboard
          color="#FF0F68"
          size={24}
          style={{ verticalAlign: "middle", marginRight: "8px" }}
        />
        <strong>Acompanhamento</strong> <br />
        <br />
      </h2>

      {/* Filtros */}
      <div className="ha-search-filter-container">
        {/* Combobox Disciplina */}
        <div className="ha-combobox-container" ref={disciplinaDropdownRef}>
          <button
            className={`ha-combobox-button ${
              isDisciplinaDropdownOpen ? "active" : ""
            }`}
            onClick={() =>
              setIsDisciplinaDropdownOpen(!isDisciplinaDropdownOpen)
            }
            aria-haspopup="true"
            aria-expanded={isDisciplinaDropdownOpen}
          >
            <span className="ha-combobox-icon">
              <BookOpen size={16} /> {/* Ícone Adicionado */}
              &nbsp;Disciplina
            </span>
            {isDisciplinaDropdownOpen ? (
              <ChevronUp size={16} className="ha-chevron-icon" />
            ) : (
              <ChevronDown size={16} className="ha-chevron-icon" />
            )}
          </button>
          {isDisciplinaDropdownOpen && (
            <div className="ha-combobox-dropdown">
              <div
                onClick={() => {
                  handleFilterChange("disciplina", "");
                  setIsDisciplinaDropdownOpen(false);
                }}
                className={`ha-dropdown-item ${
                  filters.disciplina === "" ? "active" : ""
                }`}
              >
                <BookOpen size={16} style={{ marginRight: "8px" }} />
                Todas as Disciplinas
              </div>
              {disciplinas.map((disciplina) => (
                <div
                  key={disciplina}
                  onClick={() => {
                    handleFilterChange("disciplina", disciplina);
                    setIsDisciplinaDropdownOpen(false);
                  }}
                  className={`ha-dropdown-item ${
                    filters.disciplina === disciplina ? "active" : ""
                  }`}
                >
                  <BookOpen size={16} style={{ marginRight: "8px" }} />
                  {disciplina}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Combobox Tarefa */}
        <div className="ha-combobox-container" ref={tarefaDropdownRef}>
          <button
            className={`ha-combobox-button ${
              isTarefaDropdownOpen ? "active" : ""
            }`}
            onClick={() => setIsTarefaDropdownOpen(!isTarefaDropdownOpen)}
            aria-haspopup="true"
            aria-expanded={isTarefaDropdownOpen}
          >
            <span className="ha-combobox-icon">
              <ClipboardCheck size={16} /> {/* Ícone Adicionado */}
              &nbsp;Tarefa
            </span>
            {isTarefaDropdownOpen ? (
              <ChevronUp size={16} className="ha-chevron-icon" />
            ) : (
              <ChevronDown size={16} className="ha-chevron-icon" />
            )}
          </button>
          {isTarefaDropdownOpen && (
            <div className="ha-combobox-dropdown">
              <div
                onClick={() => {
                  handleFilterChange("tarefaId", "");
                  setIsTarefaDropdownOpen(false);
                }}
                className={`ha-dropdown-item ${
                  filters.tarefaId === "" ? "active" : ""
                }`}
              >
                <ClipboardCheck size={16} style={{ marginRight: "8px" }} />
                Todas as Tarefas
              </div>
              {tarefas.map((tarefa) => (
                <div
                  key={tarefa}
                  onClick={() => {
                    handleFilterChange("tarefaId", tarefa);
                    setIsTarefaDropdownOpen(false);
                  }}
                  className={`ha-dropdown-item ${
                    filters.tarefaId === tarefa ? "active" : ""
                  }`}
                >
                  <ClipboardCheck size={16} style={{ marginRight: "8px" }} />
                  {tarefa}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Combobox Feedback Docente */}
        <div className="ha-combobox-container" ref={feedbackDocenteDropdownRef}>
          <button
            className={`ha-combobox-button ${
              isFeedbackDocenteDropdownOpen ? "active" : ""
            }`}
            onClick={() =>
              setIsFeedbackDocenteDropdownOpen(!isFeedbackDocenteDropdownOpen)
            }
            aria-haspopup="true"
            aria-expanded={isFeedbackDocenteDropdownOpen}
          >
            <span className="ha-combobox-icon">
              <MessageSquare size={16} /> {/* Ícone Adicionado */}
              &nbsp;Feedback
            </span>
            {isFeedbackDocenteDropdownOpen ? (
              <ChevronUp size={16} className="ha-chevron-icon" />
            ) : (
              <ChevronDown size={16} className="ha-chevron-icon" />
            )}
          </button>
          {isFeedbackDocenteDropdownOpen && (
            <div className="ha-combobox-dropdown">
              <div
                onClick={() => {
                  handleFilterChange("feedbackDocente", "");
                  setIsFeedbackDocenteDropdownOpen(false);
                }}
                className={`ha-dropdown-item ${
                  filters.feedbackDocente === "" ? "active" : ""
                }`}
              >
                <MessageSquare size={16} style={{ marginRight: "8px" }} />
                Todos os Feedbacks
              </div>
              <div
                onClick={() => {
                  handleFilterChange("feedbackDocente", "Enviado");
                  setIsFeedbackDocenteDropdownOpen(false);
                }}
                className={`ha-dropdown-item ${
                  filters.feedbackDocente === "Enviado" ? "active" : ""
                }`}
              >
                <span className="ha-badge-realizado">Enviado</span>
              </div>
              <div
                onClick={() => {
                  handleFilterChange("feedbackDocente", "Pendente");
                  setIsFeedbackDocenteDropdownOpen(false);
                }}
                className={`ha-dropdown-item ${
                  filters.feedbackDocente === "Pendente" ? "active" : ""
                }`}
              >
                <span className="ha-badge-pendente">Pendente</span>
              </div>
            </div>
          )}
        </div>

        {/* Botão de Limpar Filtros */}
        <button className="ha-clear-filters-button" onClick={clearAllFilters}>
          <RefreshCw size={16} className="ha-clear-filters-icon" />
        </button>
      </div>

      {/* Tabela de histórico */}
      <div className="ha-table-responsive">
        <table className="ha-case-table">
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Aluno</th>
              <th>Caso</th>
              <th>Tarefa</th>
              <th>Consulta Inicial</th>
              <th>Consulta Retorno</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistorico.length > 0 ? (
              filteredHistorico.map((aluno, index) => (
                <tr key={index}>
                  <td>
                    <span className="ha-badge-disciplina">
                      {aluno.disciplina}
                    </span>
                  </td>
                  <td>{aluno.nome}</td>
                  <td>
                    <span className="ha-badge-caso">{aluno.casoId}</span>
                  </td>
                  <td>
                    <span className="ha-badge-tarefa">{aluno.tarefaId}</span>
                  </td>
                  <td>
                    {aluno.consultaIda ? (
                      <span className="ha-badge-realizado">Concluído</span>
                    ) : (
                      <span className="ha-badge-pendente">Pendente</span>
                    )}
                  </td>
                  <td>
                    {aluno.consultaRetorno ? (
                      <span className="ha-badge-realizado">Concluído</span>
                    ) : (
                      <span className="ha-badge-pendente">Pendente</span>
                    )}
                  </td>
                  <td>
                    {aluno.feedbackDocente ? (
                      <span className="ha-badge-realizado">Enviado</span>
                    ) : (
                      <span className="ha-badge-pendente">Pendente</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Nenhum aluno encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoricoAlunos;
