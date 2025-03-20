/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

// src/components/GerarTarefa.jsx

import React, { useState, useMemo, useEffect, useRef } from "react";
import "../../styles/Professor/GerarTarefa.css";

import {
  ChevronDown,
  ChevronUp,
  RefreshCw,
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  X,
  BookOpen,
  FileText,
  Calendar,
  Send,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

// ------------- Componente Toast -------------
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`gt-toast ${type}`}>
      <span className="gt-toast-message">{message}</span>
      <button
        className="gt-toast-close-button"
        onClick={onClose}
        aria-label="Fechar Toast"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// ------------- Componente AccordionItem -------------
const AccordionItem = ({ title, icon: Icon, children, isOpen, toggle }) => (
  <div className="gt-accordion-item">
    <button
      type="button"
      className="gt-accordion-header"
      onClick={toggle}
      aria-expanded={isOpen}
      aria-controls={`section-${title.replace(/\s+/g, "-")}`}
    >
      <div className="gt-accordion-icon-container">
        <Icon size={20} />
      </div>
      <span>{title}</span>
      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
    {isOpen && (
      <div
        className="gt-accordion-content"
        id={`section-${title.replace(/\s+/g, "-")}`}
        role="region"
        aria-labelledby={`header-${title.replace(/\s+/g, "-")}`}
      >
        {children}
      </div>
    )}
  </div>
);

const GerarTarefa = () => {
  // ------------------ STATES ------------------
  const [filters, setFilters] = useState({
    periodo: "",
    disciplina: "",
    casoEscolhido: "",
  });
  const [historico, setHistorico] = useState([]); // Dados da tabela
  const [toast, setToast] = useState(null);

  const [isPeriodoDropdownOpen, setIsPeriodoDropdownOpen] = useState(false);
  const [isDisciplinaDropdownOpen, setIsDisciplinaDropdownOpen] =
    useState(false);
  const [isCasoDropdownOpen, setIsCasoDropdownOpen] = useState(false);

  const periodoDropdownRef = useRef(null);
  const disciplinaDropdownRef = useRef(null);
  const casoDropdownRef = useRef(null);

  // Mostrar/Esconder formulário
  const [showForm, setShowForm] = useState(false);

  // Accordion do formulário
  const [activeSections, setActiveSections] = useState({
    tarefaId: false,
    disciplina: false,
    casoId: false,
    periodo: false,
  });

  // Dados do formulário
  const [formData, setFormData] = useState({
    tarefaId: `T-${uuidv4().slice(0, 6)}`,
    disciplina: "", // <-- Agora será o UUID da disciplina
    casoId: "", // <-- Agora será o UUID do caso
    periodo: "",
  });

  // ------------- NOVOS STATES p/ Disciplinas & Casos -------------
  const [allDisciplines, setAllDisciplines] = useState([]);
  const [allCases, setAllCases] = useState([]);

  // =========================== useEffect - Montagem ===========================
  useEffect(() => {
    // 1) Buscar Tarefas
    const options = {
      method: "GET",
      headers: {
        Authorization:
          "Bearer oat_Ng.ei11cmtKMTBoMjhFaDM2bW1USWcwbU5hUlhLblZxZTIxMW1wbERHSTI5NzMxNTIwODY",
      },
    };
    fetch(
      "https://back-end-cori-feedbacks-node.opatj4.easypanel.host/teachers/tasks",
      options
    )
      .then((response) => response.json())
      .then((data) => {
        // data: array de tarefas com { disciplineId, caseId, user, createdAt, etc. }
        // Precisamos associar caseId -> 'resume' e disciplineId -> 'name'
        setHistorico(data);
      })
      .catch((err) => console.error("Erro ao buscar tasks:", err));

    // 2) Buscar Disciplinas
    fetch(
      "https://back-end-cori-feedbacks-node.opatj4.easypanel.host/cori/discipline",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer oat_Ng.ei11cmtKMTBoMjhFaDM2bW1USWcwbU5hUlhLblZxZTIxMW1wbERHSTI5NzMxNTIwODY",
        },
      }
    )
      .then((res) => res.json())
      .then((disciplineData) => {
        // Ex.: [ { id: 7, uuid: 'D-abc123', name: 'Cardiologia' }, ... ]
        setAllDisciplines(disciplineData);
      })
      .catch((err) => console.error("Erro ao buscar disciplinas:", err));

    // 3) Buscar Casos
    fetch(
      "https://back-end-cori-feedbacks-node.opatj4.easypanel.host/cori/cases",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer oat_Ng.ei11cmtKMTBoMjhFaDM2bW1USWcwbU5hUlhLblZxZTIxMW1wbERHSTI5NzMxNTIwODY",
        },
      }
    )
      .then((res) => res.json())
      .then((casesData) => {
        // Ex.: [ { id: 10, uuid: 'C-1234', resume: 'Resumo do caso X', ... }, ... ]
        setAllCases(casesData);
      })
      .catch((err) => console.error("Erro ao buscar casos:", err));
  }, []);

  // =========================== MAPS de ID => Nome ===========================
  const disciplineMap = useMemo(() => {
    // Monta: { [id]: { uuid, name } }
    const map = new Map();
    allDisciplines.forEach((disc) => {
      map.set(disc.id, disc);
    });
    return map;
  }, [allDisciplines]);

  const caseMap = useMemo(() => {
    // Monta: { [id]: { uuid, resume, ... } }
    // Lembrando que "id" é a PK do caso, e "uuid" é algo como "C-1234"
    const map = new Map();
    allCases.forEach((c) => {
      map.set(c.id, c);
    });
    return map;
  }, [allCases]);

  // =========================== Montar 'filteredHistorico' c/ Resumo ===========================
  const filteredHistorico = useMemo(() => {
    // 1) Filtra as tasks
    const base = historico.filter((item) => {
      const periodoMatch = filters.periodo
        ? item.periodo === filters.periodo
        : true;
      const disciplinaMatch = filters.disciplina
        ? `Disciplina ${item.disciplineId}` === filters.disciplina
        : true;
      const casoMatch = filters.casoEscolhido
        ? `C-${item.caseId}` === filters.casoEscolhido
        : true;
      return periodoMatch && disciplinaMatch && casoMatch;
    });

    // 2) Enriquecer com 'disciplina' e 'resumo'
    // Notar que no backend `item.disciplineId` e `item.caseId` podem ser IDs inteiros
    // Então vamos pegar do disciplineMap e do caseMap
    return base.map((item) => {
      // disciplineId => disciplineMap => { uuid, name }
      const discObj = disciplineMap.get(item.disciplineId);
      const disciplineName = discObj
        ? discObj.name
        : `Disciplina ${item.disciplineId}`;

      // caseId => caseMap => { uuid, resume, ... }
      const caseObj = caseMap.get(item.caseId);
      const caseResume = caseObj ? caseObj.resume : "Resumo não encontrado";

      return {
        ...item,
        disciplinaNome: disciplineName,
        casoUUID: caseObj ? caseObj.uuid : `C-${item.caseId}`,
        casoResumo: caseResume,
      };
    });
  }, [historico, disciplineMap, caseMap, filters]);

  // =========================== FECHAMENTO DE DROPDOWNS ===========================
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        periodoDropdownRef.current &&
        !periodoDropdownRef.current.contains(event.target)
      ) {
        setIsPeriodoDropdownOpen(false);
      }
      if (
        disciplinaDropdownRef.current &&
        !disciplinaDropdownRef.current.contains(event.target)
      ) {
        setIsDisciplinaDropdownOpen(false);
      }
      if (
        casoDropdownRef.current &&
        !casoDropdownRef.current.contains(event.target)
      ) {
        setIsCasoDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================== Montar arrays para combos ===========================
  const periodos = useMemo(() => {
    const arr = filteredHistorico.map((item) => item.periodo || "1°");
    return [...new Set(arr)];
  }, [filteredHistorico]);

  const disciplinas = useMemo(() => {
    // Exemplo: "Disciplina 7"
    // Ajuste se quiser mostrar o nome real
    const arr = filteredHistorico.map(
      (item) => `Disciplina ${item.disciplineId}`
    );
    return [...new Set(arr)];
  }, [filteredHistorico]);

  const casos = useMemo(() => {
    // Ex.: "C-10"
    const arr = filteredHistorico.map((item) => `C-${item.caseId}`);
    return [...new Set(arr)];
  }, [filteredHistorico]);

  // =========================== Handlers de Filtros e Combos ===========================
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      periodo: "",
      disciplina: "",
      casoEscolhido: "",
    });
  };

  // =========================== Abrir / Fechar Formulário ===========================
  const handleOpenForm = () => {
    // Zerar form
    setFormData({
      tarefaId: `T-${uuidv4().slice(0, 6)}`,
      disciplina: "",
      casoId: "",
      periodo: "",
    });
    setActiveSections({
      tarefaId: false,
      disciplina: false,
      casoId: false,
      periodo: false,
    });
    setShowForm(true);
  };

  // =========================== Submit do Form ===========================
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validação
    if (
      !formData.disciplina.trim() ||
      !formData.casoId.trim() ||
      !formData.periodo.trim()
    ) {
      setToast({
        message: "Por favor, preencha todos os campos.",
        type: "error",
      });
      return;
    }

    // Monta corpo
    const body = JSON.stringify({
      uuid: formData.tarefaId, // Ex.: "T-abcd12"
      disciplineUuid: formData.disciplina, // <- UUID da disciplina
      caseUuid: formData.casoId, // <- UUID do caso
      periodo: formData.periodo, // Se o back-end aceitar
    });

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "insomnia/9.2.0",
        Authorization:
          "Bearer oat_NQ.N1FxRE9DQTQ1Q19hNTE1SVBEaGtTZlRPYm1VT3gwR0NsUDVhRThYODMzMzAxMDg0Mw",
      },
      body,
    };

    fetch(
      "https://back-end-cori-feedbacks-node.opatj4.easypanel.host/teachers/create-task",
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setToast({
          message: `Tarefa adicionada com sucesso!`,
          type: "success",
        });
        // Fecha formulário
        setShowForm(false);
        // Reset
        setFormData({
          tarefaId: `T-${uuidv4().slice(0, 6)}`,
          disciplina: "",
          casoId: "",
          periodo: "",
        });
        setActiveSections({
          tarefaId: false,
          disciplina: false,
          casoId: false,
          periodo: false,
        });
      })
      .catch((err) => {
        console.error(err);
        setToast({
          message: "Ocorreu um erro ao enviar a tarefa. Tente novamente.",
          type: "error",
        });
      });
  };

  // =========================== Accordion Toggles ===========================
  const toggleSection = (section) => {
    setActiveSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // =========================== Mudança nos inputs do formulário ===========================
  const handleInputChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // =========================== Render ===========================
  return (
    <div className="gt-info-container">
      <h2 className="gt-historico-alunos-title" style={{ textAlign: "center" }}>
        <LayoutDashboard
          color="#FF0F68"
          size={24}
          style={{ verticalAlign: "middle", marginRight: "8px" }}
        />
        <strong>Tarefas</strong>
        <br />
        <br />
      </h2>

      {/* FORMULÁRIO DE NOVA TAREFA */}
      {showForm && (
        <form className="gt-new-task-form" onSubmit={handleFormSubmit}>
          <h3 className="gt-form-title">
            <ClipboardList size={24} style={{ marginRight: "8px" }} />
            Nova Tarefa
          </h3>
          <button
            type="button"
            className="gt-close-form-button"
            onClick={() => setShowForm(false)}
            aria-label="Fechar Formulário"
          >
            <X size={20} />
          </button>

          {/* ID da Tarefa */}
          <AccordionItem
            title="ID da Tarefa"
            icon={FileText}
            isOpen={activeSections.tarefaId}
            toggle={() => toggleSection("tarefaId")}
          >
            <div className="gt-form-group">
              <input
                type="text"
                name="tarefaId"
                value={formData.tarefaId}
                readOnly
                className="gt-read-only-input"
              />
            </div>
          </AccordionItem>

          {/* Disciplina */}
          <AccordionItem
            title="Disciplina"
            icon={BookOpen}
            isOpen={activeSections.disciplina}
            toggle={() => toggleSection("disciplina")}
          >
            <div className="gt-form-group">
              {/* Em vez de input, agora SELECT com as disciplinas obtidas de allDisciplines */}
              <select
                name="disciplina"
                value={formData.disciplina}
                onChange={handleInputChangeForm}
              >
                <option value="">Selecione uma disciplina...</option>
                {allDisciplines.map((disc) => (
                  <option key={disc.uuid} value={disc.uuid}>
                    {disc.name}
                  </option>
                ))}
              </select>
            </div>
          </AccordionItem>

          {/* Período */}
          <AccordionItem
            title="Período"
            icon={Calendar}
            isOpen={activeSections.periodo}
            toggle={() => toggleSection("periodo")}
          >
            <div className="gt-form-group">
              <input
                type="text"
                name="periodo"
                value={formData.periodo}
                onChange={handleInputChangeForm}
                placeholder="Digite o período"
                autoComplete="off"
              />
            </div>
          </AccordionItem>

          {/* Caso (ID) */}
          <AccordionItem
            title="ID do Caso"
            icon={FileText}
            isOpen={activeSections.casoId}
            toggle={() => toggleSection("casoId")}
          >
            <div className="gt-form-group">
              {/* SELECT com a lista de casos de allCases */}
              <select
                name="casoId"
                value={formData.casoId}
                onChange={handleInputChangeForm}
              >
                <option value="">Selecione um caso...</option>
                {allCases.map((c) => (
                  <option key={c.uuid} value={c.uuid}>
                    {c.uuid} — {c.resume?.slice(0, 20)}...
                  </option>
                ))}
              </select>
            </div>
          </AccordionItem>

          <button type="submit" className="gt-submit-button">
            <Send size={16} style={{ marginRight: "8px" }} />
            Salvar
          </button>
        </form>
      )}

      {/* FILTROS */}
      <div className="gt-search-filter-container">
        {/* Filtro por Período */}
        <div className="gt-combobox-container" ref={periodoDropdownRef}>
          <button
            className={`gt-combobox-button ${
              isPeriodoDropdownOpen ? "active" : ""
            }`}
            onClick={() => setIsPeriodoDropdownOpen(!isPeriodoDropdownOpen)}
          >
            <Calendar size={16} style={{ marginRight: "8px" }} />
            Período
            {isPeriodoDropdownOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          {isPeriodoDropdownOpen && (
            <div className="gt-combobox-dropdown">
              {periodos.map((periodo) => (
                <div
                  key={periodo}
                  onClick={() => {
                    handleFilterChange("periodo", periodo);
                    setIsPeriodoDropdownOpen(false);
                  }}
                  className={`gt-dropdown-item ${
                    filters.periodo === periodo ? "active" : ""
                  }`}
                >
                  {periodo}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filtro por Disciplina */}
        <div className="gt-combobox-container" ref={disciplinaDropdownRef}>
          <button
            className={`gt-combobox-button ${
              isDisciplinaDropdownOpen ? "active" : ""
            }`}
            onClick={() =>
              setIsDisciplinaDropdownOpen(!isDisciplinaDropdownOpen)
            }
          >
            <BookOpen size={16} style={{ marginRight: "8px" }} />
            Disciplina
            {isDisciplinaDropdownOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          {isDisciplinaDropdownOpen && (
            <div className="gt-combobox-dropdown">
              {disciplinas.map((disciplina) => (
                <div
                  key={disciplina}
                  onClick={() => {
                    handleFilterChange("disciplina", disciplina);
                    setIsDisciplinaDropdownOpen(false);
                  }}
                  className={`gt-dropdown-item ${
                    filters.disciplina === disciplina ? "active" : ""
                  }`}
                >
                  {disciplina}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filtro por Caso */}
        <div className="gt-combobox-container" ref={casoDropdownRef}>
          <button
            className={`gt-combobox-button ${isCasoDropdownOpen ? "active" : ""}`}
            onClick={() => setIsCasoDropdownOpen(!isCasoDropdownOpen)}
          >
            <FileText size={16} style={{ marginRight: "8px" }} />
            Caso Escolhido
            {isCasoDropdownOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          {isCasoDropdownOpen && (
            <div className="gt-combobox-dropdown">
              {casos.map((caso) => (
                <div
                  key={caso}
                  onClick={() => {
                    handleFilterChange("casoEscolhido", caso);
                    setIsCasoDropdownOpen(false);
                  }}
                  className={`gt-dropdown-item ${
                    filters.casoEscolhido === caso ? "active" : ""
                  }`}
                >
                  {caso}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botão Limpar Filtros */}
        <button className="gt-clear-filters-button" onClick={clearAllFilters}>
          <RefreshCw size={16} />
        </button>

        {/* Botão para abrir o formulário */}
        <button className="gt-add-task-button" onClick={handleOpenForm}>
          <PlusCircle size={16} />
        </button>
      </div>

      {/* TABELA DE HISTÓRICO */}
      <div className="gt-table-responsive">
        <table className="gt-case-table">
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Tarefa</th>
              <th>Período</th>
              <th>Caso</th>
              <th>Resumo</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistorico.length > 0 ? (
              filteredHistorico.map((item, index) => (
                <tr key={index}>
                  <td>
                    <span className="gt-badge-discipline">
                      {item.disciplinaNome || `Disciplina ${item.disciplineId}`}
                    </span>
                  </td>
                  <td>
                    <span className="gt-badge-task-id">{item.uuid}</span>
                  </td>
                  <td>{item.periodo || "1°"}</td>
                  <td>{item.casoUUID || `C-${item.caseId}`}</td>
                  <td className="gt-descricao-caso">{item.casoResumo}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Nenhuma tarefa encontrada</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default GerarTarefa;
