// src/components/GerarFichaAtor.jsx
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { X, Plus, Send, FilePlus } from "lucide-react";
import "../../styles/Cori/GerarFichaAtor.css"; // Importe aqui o CSS compatível

// Se precisar de token Bearer
const AUTH_TOKEN =
  "oat_NQ.N1FxRE9DQTQ1Q19hNTE1SVBEaGtTZlRPYm1VT3gwR0NsUDVhRThYODMzMzAxMDg0Mw";

const GerarFichaAtor = () => {
  const [caseId, setCaseId] = useState("");
  const [sections, setSections] = useState({
    diagnostico: [],
    dadosPaciente: [],
    historiaMedica: [],
    historiaFamiliar: [],
    medicacaoAtual: [],
    hda: [],
    examesFisicos: [],
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [toast, setToast] = useState(null);

  // Lista completa de casos e disciplinas
  const [allCases, setAllCases] = useState([]);
  const [allDisciplines, setAllDisciplines] = useState([]);

  // Filtro selecionado (disciplineId)
  const [disciplineFilter, setDisciplineFilter] = useState("");

  // Caso selecionado ao clicar em "Utilizar"
  const [selectedCase, setSelectedCase] = useState(null);

  // Títulos das seções
  const sectionTitles = [
    "Diagnóstico",
    "Dados do Paciente",
    "História Médica",
    "História Familiar",
    "Medicação Atual",
    "História da Doença Atual (HDA)",
    "Exame Físico",
  ];

  // ------------------------------------------------
  // 1. Buscar Casos e Disciplinas ao montar o componente
  // ------------------------------------------------
  useEffect(() => {
    // Busca todos os casos
    fetch(
      "https://back-end-cori-feedbacks-node.opatj4.easypanel.host/cori/cases",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`, // se precisar
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar casos");
        return res.json();
      })
      .then((casesData) => {
        setAllCases(casesData);
      })
      .catch((err) => console.error("Erro ao buscar casos:", err));

    // Busca todas as disciplinas
    fetch(
      "https://back-end-cori-feedbacks-node.opatj4.easypanel.host/cori/discipline",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`, // se precisar
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar disciplinas");
        return res.json();
      })
      .then((discData) => {
        setAllDisciplines(discData);
      })
      .catch((err) => console.error("Erro ao buscar disciplinas:", err));
  }, []);

  // ------------------------------------------------
  // 2. Mapear ID -> Nome da disciplina (disciplineMap)
  // ------------------------------------------------
  const disciplineMap = useMemo(() => {
    const map = new Map();
    allDisciplines.forEach((disc) => {
      map.set(disc.id, disc.name);
    });
    return map;
  }, [allDisciplines]);

  // ------------------------------------------------
  // 3. Definir últimos 5 casos
  // ------------------------------------------------
  const lastFiveCases = useMemo(() => {
    // Pega os últimos 5 do array principal
    const slicePart = allCases.slice(-5);
    // Inverte para exibir o mais recente primeiro
    return slicePart.reverse();
  }, [allCases]);

  // ------------------------------------------------
  // 4. Obter as disciplinas que aparecem nesses 5 casos
  // ------------------------------------------------
  const lastFiveDisciplineIds = useMemo(() => {
    // Coletamos os disciplineId dos últimos 5 casos
    const ids = lastFiveCases.map((c) => c.disciplineId);
    return Array.from(new Set(ids)); // remover duplicados
  }, [lastFiveCases]);

  // Reduz a lista de disciplinas apenas às que aparecem nos últimos 5 casos
  const lastFiveDisciplines = useMemo(() => {
    return allDisciplines.filter((d) => lastFiveDisciplineIds.includes(d.id));
  }, [allDisciplines, lastFiveDisciplineIds]);

  // ------------------------------------------------
  // 5. Filtro de disciplina entre os 5 casos
  // ------------------------------------------------
  // Se disciplineFilter estiver vazio, mostra todos.
  // Caso contrário, filtra lastFiveCases
  const displayedCases = useMemo(() => {
    if (!disciplineFilter) return lastFiveCases;
    const numericFilter = parseInt(disciplineFilter, 10);
    return lastFiveCases.filter((c) => c.disciplineId === numericFilter);
  }, [lastFiveCases, disciplineFilter]);

  // ------------------------------------------------
  // 6. Funções para manipular as seções (Pacientes, Vitais, etc.)
  // ------------------------------------------------
  const handleAddItem = (section) => {
    setSections((prev) => ({
      ...prev,
      [section]: [...prev[section], { title: "", content: "" }],
    }));
  };

  const handleInputChange = (section, index, field, value) => {
    const updated = sections[section].map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setSections((prev) => ({ ...prev, [section]: updated }));
  };

  const handleRemoveItem = (section, index) => {
    setSections((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  // ------------------------------------------------
  // 7. "Utilizar" um caso
  // ------------------------------------------------
  const handleUtilizarCaso = (caso) => {
    setSelectedCase(caso);
    setCaseId(caso.uuid);
  };

  // ------------------------------------------------
  // 8. Envio da ficha (POST /cori/patient-record/:uuid)
  // ------------------------------------------------
  const handleSubmit = () => {
    if (!caseId) {
      setToast({
        message: "É necessário informar o ID do caso!",
        type: "error",
      });
      return;
    }
  
    // Transformando os dados no formato correto
    const requestBody = {
      data: [
        ...sections.dadosPaciente.map(({ title, content }) => ({
          type: "Dados do Paciente",
          title,
          content,
        })),
        ...sections.examesFisicos.map(({ title, content }) => ({
          type: "Exames Físicos",
          title,
          content,
        })),
        ...sections.diagnostico.map(({ title, content }) => ({
          type: "Diagnóstico",
          title,
          content,
        })),
        ...sections.historiaMedica.map(({ title, content }) => ({
          type: "História Médica",
          title,
          content,
        })),
        ...sections.historiaFamiliar.map(({ title, content }) => ({
          type: "História Familiar",
          title,
          content,
        })),
        ...sections.medicacaoAtual.map(({ title, content }) => ({
          type: "Medicação Atual",
          title,
          content,
        })),
        ...sections.hda.map(({ title, content }) => ({
          type: "HDA",
          title,
          content,
        })),
      ],
    };
  
    fetch(
      `https://back-end-cori-feedbacks-node.opatj4.easypanel.host/cori/actor-record/${caseId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(requestBody),
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao enviar os dados. Tente novamente.");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Ficha enviada. Resposta da API:", data);
        setToast({ message: "Ficha enviada com sucesso!", type: "success" });
        // Limpar campos
        setCaseId("");
        setSections({
          diagnostico: [],
          dadosPaciente: [],
          historiaMedica: [],
          historiaFamiliar: [],
          medicacaoAtual: [],
          hda: [],
          examesFisicos: [],
        });
      })
      .catch((err) => {
        console.error("Erro ao enviar ficha:", err);
        setToast({
          message: "Ocorreu um erro ao enviar a ficha. Tente novamente.",
          type: "error",
        });
      });
  };
  
  // ------------------------------------------------
  // 9. Toast (mensagem de sucesso/erro)
  // ------------------------------------------------
  const closeToast = () => {
    setToast(null);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => closeToast(), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // ------------------------------------------------
  // 10. Navegação por seções
  // ------------------------------------------------
  const goToStep = (index) => {
    setCurrentStep(index);
  };

  // ------------------------------------------------
  // 11. Render
  // ------------------------------------------------
  return (
    <div className="gerar-ficha-container">
      <h1 className="title">
        <FilePlus color="#FF0F68" size={24} />{" "}
        <strong>Gerar Ficha do Paciente</strong>
      </h1>

      {/* Filtro de Disciplina (apenas as do último 5) */}
      <div className="filter-container">
        <label htmlFor="disciplineFilter" className="filter-label">
          Filtrar por Disciplina:
        </label>
        <select
          id="disciplineFilter"
          className="filter-select"
          value={disciplineFilter}
          onChange={(e) => setDisciplineFilter(e.target.value)}
        >
          <option value="">Todas</option>
          {lastFiveDisciplines.map((disc) => (
            <option key={disc.id} value={disc.id}>
              {disc.name}
            </option>
          ))}
        </select>
      </div>
      <br />

      {/* Tabela dos últimos 5 casos (com filtro aplicado) */}
      <div className="table-responsive">
        <table className="case-table">
          <thead>
            <tr>
              <th>UUID do Caso</th>
              <th>Disciplina</th>
              <th>Resumo</th>
              <th>Ação</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedCases.map((caso) => {
              const discName = disciplineMap.get(caso.disciplineId) || "";
              return (
                <tr key={caso.uuid}>
                  <td>{caso.uuid}</td>
                  <td>{discName}</td>
                  <td>{caso.resume}</td>
                  <td>
                    <button
                      className="submit-button btn-sm"
                      onClick={() => handleUtilizarCaso(caso)}
                    >
                      Utilizar
                    </button>
                  </td>
                  <td>
                    {caso.actorRecord && caso.actorRecord.length > 0 ? (
                      <span>✓</span>
                    ) : (
                      <span>X</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <br />
      {/* Campo para digitar ID do Caso (opcional) */}
      <div className="form-group">
        <label htmlFor="caseId">ID do Caso:</label>
        <input
          id="caseId"
          type="text"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          placeholder="Digite o ID do caso"
        />
      </div>

      {/* Caso Clínico selecionado */}
      <div className="clinical-case">
        <h2>Caso Clínico</h2>

        <div className="clinical-case-card">
          <h3>Disciplina</h3>
          <p>{disciplineMap.get(selectedCase?.disciplineId) || ""}</p>
        </div>

        <div className="clinical-case-card">
          <h3>Resumo do Caso</h3>
          <p>{selectedCase?.resume || ""}</p>
        </div>

        <div className="clinical-case-card">
          <h3>Descrição Completa</h3>
          <p>{selectedCase?.description || ""}</p>
        </div>
      </div>

      {/* Navegação por seções */}
      <div className="navigation-container">
        {sectionTitles.map((title, index) => (
          <button
            key={index}
            className={`navigation-button ${index === currentStep ? "active" : ""}`}
            onClick={() => goToStep(index)}
          >
            {title}
          </button>
        ))}
      </div>

      {/* Seções (Dados do Paciente, etc.) */}
      {currentStep === 0 && (
        <Section
          title="Diagnóstico"
          items={sections.diagnostico}
          onAdd={() => handleAddItem("diagnostico")}
          onInputChange={(i, field, val) =>
            handleInputChange("diagnostico", i, field, val)
          }
          onRemove={(i) => handleRemoveItem("diagnostico", i)}
        />
      )}

      {currentStep === 1 && (
        <Section
          title="Dados do Paciente"
          items={sections.dadosPaciente}
          onAdd={() => handleAddItem("dadosPaciente")}
          onInputChange={(i, field, val) =>
            handleInputChange("dadosPaciente", i, field, val)
          }
          onRemove={(i) => handleRemoveItem("dadosPaciente", i)}
        />
      )}

      {currentStep === 2 && (
        <Section
          title="História Médica"
          items={sections.historiaMedica}
          onAdd={() => handleAddItem("historiaMedica")}
          onInputChange={(i, field, val) =>
            handleInputChange("historiaMedica", i, field, val)
          }
          onRemove={(i) => handleRemoveItem("historiaMedica", i)}
        />
      )}

      {currentStep === 3 && (
        <Section
          title="História Familiar"
          items={sections.historiaFamiliar}
          onAdd={() => handleAddItem("historiaFamiliar")}
          onInputChange={(i, field, val) =>
            handleInputChange("historiaFamiliar", i, field, val)
          }
          onRemove={(i) => handleRemoveItem("historiaFamiliar", i)}
        />
      )}

      {currentStep === 4 && (
        <Section
          title="Medicação Atual"
          items={sections.medicacaoAtual}
          onAdd={() => handleAddItem("medicacaoAtual")}
          onInputChange={(i, field, val) =>
            handleInputChange("medicacaoAtual", i, field, val)
          }
          onRemove={(i) => handleRemoveItem("medicacaoAtual", i)}
        />
      )}

      {currentStep === 5 && (
        <Section
          title="História da Doença Atual (HDA)"
          items={sections.hda}
          onAdd={() => handleAddItem("hda")}
          onInputChange={(i, field, val) =>
            handleInputChange("hda", i, field, val)
          }
          onRemove={(i) => handleRemoveItem("hda", i)}
        />
      )}

      {currentStep === 6 && (
        <Section
          title="Exame Físico"
          items={sections.examesFisicos}
          onAdd={() => handleAddItem("examesFisicos")}
          onInputChange={(i, field, val) =>
            handleInputChange("examesFisicos", i, field, val)
          }
          onRemove={(i) => handleRemoveItem("examesFisicos", i)}
        />
      )}

      {/* Botão de Enviar Ficha */}
      <button className="submit-button" onClick={handleSubmit}>
        <Send /> Enviar Ficha
      </button>

      {/* Toast (feedback ao usuário) */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close-button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}
    </div>
  );
};

// --------------------------------
// Seção genérica (dados do paciente, vitais, etc.)
// --------------------------------
const Section = ({ title, items, onAdd, onInputChange, onRemove }) => {
  return (
    <div className="section-container">
      <h2>{title}</h2>
      {items.length === 0 && <p>Nenhum item adicionado.</p>}
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <input
              type="text"
              placeholder="Título"
              value={item.title}
              onChange={(e) => onInputChange(index, "title", e.target.value)}
            />
            <textarea
              placeholder="Conteúdo"
              value={item.content}
              onChange={(e) => onInputChange(index, "content", e.target.value)}
            />
            <button className="remove-button" onClick={() => onRemove(index)}>
              <X />
            </button>
          </li>
        ))}
      </ul>
      <button className="add-button" onClick={onAdd}>
        <Plus /> Adicionar {title}
      </button>
    </div>
  );
};

Section.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
  onAdd: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default GerarFichaAtor;
