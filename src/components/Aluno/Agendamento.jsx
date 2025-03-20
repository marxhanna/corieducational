// src/components/Aluno/Agendamento.jsx
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Book,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle, // Ícone para o botão de finalizar
} from "lucide-react";
import { InlineWidget } from "react-calendly"; // Certifique-se de que o pacote está instalado
import "../../styles/Agendamento.css";

// Componente AccordionItem
const AccordionItem = ({ title, icon: Icon, children, isOpen, toggle }) => (
  <div className="accordion-item">
    <button
      type="button"
      className="accordion-header"
      onClick={toggle}
      aria-expanded={isOpen}
      aria-controls={`section-${title.replace(/\s+/g, "-")}`}
    >
      <div className="accordion-icon-container">
        <Icon size={20} />
      </div>
      <span>{title}</span>
      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
    {isOpen && (
      <div
        className="accordion-content"
        id={`section-${title.replace(/\s+/g, "-")}`}
        role="region"
        aria-labelledby={`header-${title.replace(/\s+/g, "-")}`}
      >
        {children}
      </div>
    )}
  </div>
);

const BEARER_TOKEN =
  "oat_NQ.N1FxRE9DQTQ1Q19hNTE1SVBEaGtTZlRPYm1VT3gwR0NsUDVhRThYODMzMzAxMDg0Mw";

// Componente Agendamento
const Agendamento = () => {
  const [selectedDiscipline, setSelectedDiscipline] = useState(""); // Armazena a disciplina selecionada
  const [taskId, setTaskId] = useState(""); // Armazena o ID da Tarefa (opcional)
  const [confirmedUrl, setConfirmedUrl] = useState(null); // Armazena a URL do Calendly
  const [activeSections, setActiveSections] = useState({
    disciplina: false,
    tarefaId: false,
    agendamento: false,
  });
  const [toast, setToast] = useState(null); // Estado para controlar o Toast
  const [disciplinas, setDisciplinas] = useState([]);
  const [selectedDisciplinaUuid, setSelectedDisciplinaUuid] = useState("");

  // URL fixa do Calendly, utilizada para qualquer disciplina
  const calendlyUrl =
    "https://calendly.com/augusto-rudolph/atendimento-ao-paciente?back=1&month=2024-10";

  // Função que retorna todas as disciplinas de todos os períodos
  const getDisciplines = async () => {
    try {
      const url = "https://back-end-cori-feedbacks-node.opatj4.easypanel.host/cori/discipline";
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BEARER_TOKEN}`, // Se necessário
        },
      });
  
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Disciplinas recebidas:", data);
      return data; // Retorna os dados para serem usados no componente
    } catch (err) {
      console.error("Erro ao buscar disciplinas:", err);
      setToast({
        message: `Erro ao carregar disciplinas: ${err.message}`,
        type: "error",
      });
      return []; // Retorna um array vazio em caso de erro
    }
  };  
    

  // Função para finalizar o agendamento
  const handleFinalizeClick = async () => {
    if (!confirmedUrl) {
      setToast({
        message: "Não há agendamento para finalizar.",
        type: "error",
      });
      return;
    }
  
    // Configurar o corpo da requisição com os dados do formulário
    const requestBody = {
      caseUuid: "gsdfgdfgdf", // Pode ser alterado conforme necessário
      studentServiceUuid: "aeafda3a-11d3-4530-a84f-114814ed2f8f", // Pode ser alterado conforme necessário
      taskUuid: taskId || null, // Se não houver tarefa, enviar null
      disciplineUuid: selectedDiscipline,
    };
  
    // Configurar opções da requisição
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "insomnia/11.0.0",
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    };
  
    try {
      const response = await fetch(
        "https://back-end-cori-feedbacks-node.opatj4.easypanel.host/students/schedule",
        options
      );
  
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Resposta da API:", data);
  
      setToast({
        message: "Agendamento finalizado com sucesso!",
        type: "success",
      });
  
      // Resetar o formulário após sucesso
      setSelectedDiscipline("");
      setTaskId("");
      setConfirmedUrl(null);
      setActiveSections({
        disciplina: false,
        tarefaId: false,
        agendamento: false,
      });
    } catch (error) {
      console.error("Erro ao finalizar agendamento:", error);
      setToast({
        message: `Erro ao finalizar agendamento: ${error.message}`,
        type: "error",
      });
    }
  };
  

  useEffect(() => {
    const fetchDisciplines = async () => {
      const data = await getDisciplines();
      setDisciplinas(data); // Armazena as disciplinas no estado
    };
  
    fetchDisciplines();
  }, []);
  

  // Função para fechar o Toast
  const closeToast = () => {
    setToast(null);
  };

  // Função para alternar a abertura dos AccordionItems
  const toggleSection = (section) => {
    setActiveSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="consulta-inicial-page-2">
      <div className="consulta-inicial-container">
        <h1 className="form-title">
          <div className="form-title-icon">
            <Calendar size={24} />
          </div>
          Agendamento
        </h1>
        <form className="consulta-inicial-form">
          {/* Seleção de Disciplina */}
          <AccordionItem
            title="Disciplina"
            icon={Book}
            isOpen={activeSections.disciplina}
            toggle={() => toggleSection("disciplina")}
          >
            <div className="form-group">
              <select
                className="form-group input combobox-select"
                value={selectedDiscipline}
                onChange={(e) => {
                  setSelectedDiscipline(e.target.value);
                  // Se uma disciplina for selecionada, define a URL fixa do Calendly
                  if (e.target.value) {
                    setConfirmedUrl(calendlyUrl);
                  } else {
                    setConfirmedUrl(null);
                  }
                  setTaskId("");
                }}
                aria-label="Selecionar Disciplina"
              >
                <option value="">Selecione a Disciplina</option>
                  {disciplinas.map((discipline, index) => (
                    <option key={index} value={discipline.uuid}>
                      {discipline.name}
                    </option>
                  ))}
              </select>
            </div>
          </AccordionItem>

          {/* ID da Tarefa (Opcional) */}
          <AccordionItem
            title="Tarefa"
            icon={Book}
            isOpen={activeSections.tarefaId}
            toggle={() => toggleSection("tarefaId")}
          >
            <div className="form-group">
              <input
                type="text"
                name="tarefaId"
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
                placeholder="Digite o ID da Tarefa (se houver)"
                className="form-group input"
                aria-label="ID da Tarefa"
              />
            </div>
          </AccordionItem>

          {/* Agendamento (Iframe) */}
          <AccordionItem
            title="Agendamento"
            icon={Calendar}
            isOpen={activeSections.agendamento}
            toggle={() => toggleSection("agendamento")}
          >
            {confirmedUrl && (
              <div className="iframe-container" style={{ height: "80vh" }}>
                <InlineWidget
                  url={confirmedUrl}
                  styles={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "12px",
                  }}
                />
                <button
                  className="reset-button"
                  onClick={() => {
                    setSelectedDiscipline("");
                    setTaskId("");
                    setConfirmedUrl(null);
                    setActiveSections({
                      disciplina: false,
                      tarefaId: false,
                      agendamento: false,
                    });
                  }}
                  aria-label="Resetar Agendamento"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {confirmedUrl && (
              <div className="button-container">
                <button
                  type="button"
                  className="encerrar-button"
                  onClick={handleFinalizeClick}
                >
                  <CheckCircle size={20} /> Finalizar Agendamento
                </button>
              </div>
            )}
          </AccordionItem>
        </form>
      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-close-button"
            onClick={closeToast}
            aria-label="Fechar Toast"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Agendamento;
