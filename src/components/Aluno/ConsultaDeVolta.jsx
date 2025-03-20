/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// src/components/ConsultaRetorno.jsx

import React, { useState, useRef, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ClipboardList, // Novo ícone para o título
  Pill,
  Users,
  Heart,
  MessageCircle,
  Microscope,
  Stethoscope,
  Clipboard,
  ArrowRightCircle,
  MessageSquare,
  Send, // Ícone de enviar
} from "lucide-react"; // Importando ícones necessários
import "../../styles/consultaAlunoVolta.css"; // Importando o CSS atualizado

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

// Componente AutoResizeTextarea
const AutoResizeTextarea = ({
  name,
  value,
  onChange,
  placeholder,
  readOnly,
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="auto-resize-textarea"
      rows={1}
      readOnly={readOnly}
    />
  );
};

const ConsultaRetorno = () => {
  const [formData, setFormData] = useState({
    identificacaoPaciente: "João da Silva",
    historicoMedicacoes: "AAS, Metformina",
    historicoFamiliar: "Mãe com diabetes tipo 2, pai com hipertensão",
    historicoMedico: "Diabetes tipo 2 diagnosticado há 5 anos",
    queixaPrincipal: "Dor de cabeça frequente e tontura",
    exames: "Hemograma completo, glicemia em jejum", // Preenchido com exemplo
    hipotesesDiagnosticas: "",
    planoTratamento: "",
    encaminhamentos: "",
    feedbackAtendimento: "",
  });

  // Inicializar todos os accordions como fechados
  const [activeSections, setActiveSections] = useState({
    identificacaoPaciente: false,
    historicoMedicacoes: false,
    historicoFamiliar: false,
    historicoMedico: false,
    queixaPrincipal: false,
    exames: false,
    hipotesesDiagnosticas: false,
    planoTratamento: false,
    encaminhamentos: false,
    feedbackAtendimento: false,
  });

  const [toast, setToast] = useState(null); // Controle para o Toast

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleSection = (section) => {
    setActiveSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFinalizarAtendimento = () => {
    // Aqui você pode adicionar a lógica para finalizar o atendimento, como enviar os dados para uma API
    console.log("Atendimento finalizado.", formData);
    setToast({
      message: "Atendimento finalizado com sucesso.",
      type: "success",
    });

    // Exibe o toast de sucesso por 3 segundos
    setTimeout(() => closeToast(), 3000);
  };

  const closeToast = () => setToast(null);

  return (
    <div className="consulta-inicial-page-3">
      <div className="consulta-inicial-container">
        <h1 className="form-title">
          <div className="form-title-icon">
            <ClipboardList size={24} /> {/* Ícone atualizado */}
          </div>
          Consulta de Retorno
        </h1>
        <form className="consulta-inicial-form">
          {/* Identificação do Paciente */}
          <AccordionItem
            title="Identificação do Paciente"
            icon={Users}
            isOpen={activeSections.identificacaoPaciente}
            toggle={() => toggleSection("identificacaoPaciente")}
          >
            <div className="form-group">
              <AutoResizeTextarea
                name="identificacaoPaciente"
                value={formData.identificacaoPaciente}
                onChange={handleInputChange}
                placeholder="Digite a identificação do paciente"
                readOnly
              />
            </div>
          </AccordionItem>

          {/* Histórico de Medicações */}
          <AccordionItem
            title="Histórico de Medicações"
            icon={Pill}
            isOpen={activeSections.historicoMedicacoes}
            toggle={() => toggleSection("historicoMedicacoes")}
          >
            <div className="form-group">
              <AutoResizeTextarea
                name="historicoMedicacoes"
                value={formData.historicoMedicacoes}
                onChange={handleInputChange}
                placeholder="Digite as medicações"
                readOnly
              />
            </div>
          </AccordionItem>

          {/* Histórico Familiar */}
          <AccordionItem
            title="Histórico Familiar"
            icon={Users}
            isOpen={activeSections.historicoFamiliar}
            toggle={() => toggleSection("historicoFamiliar")}
          >
            <div className="form-group">
              <AutoResizeTextarea
                name="historicoFamiliar"
                value={formData.historicoFamiliar}
                onChange={handleInputChange}
                placeholder="Digite o histórico familiar"
                readOnly
              />
            </div>
          </AccordionItem>

          {/* Histórico Médico */}
          <AccordionItem
            title="Histórico Médico"
            icon={Heart}
            isOpen={activeSections.historicoMedico}
            toggle={() => toggleSection("historicoMedico")}
          >
            <div className="form-group">
              <AutoResizeTextarea
                name="historicoMedico"
                value={formData.historicoMedico}
                onChange={handleInputChange}
                placeholder="Digite o histórico médico"
                readOnly
              />
            </div>
          </AccordionItem>

          {/* Queixa Principal */}
          <AccordionItem
            title="Queixa Principal"
            icon={MessageCircle}
            isOpen={activeSections.queixaPrincipal}
            toggle={() => toggleSection("queixaPrincipal")}
          >
            <div className="form-group">
              <AutoResizeTextarea
                name="queixaPrincipal"
                value={formData.queixaPrincipal}
                onChange={handleInputChange}
                placeholder="Digite a queixa principal"
                readOnly
              />
            </div>
          </AccordionItem>

          {/* Exames */}
          <AccordionItem
            title="Exames"
            icon={Microscope}
            isOpen={activeSections.exames}
            toggle={() => toggleSection("exames")}
          >
            <div className="form-group">
              <AutoResizeTextarea
                name="exames"
                value={formData.exames}
                onChange={handleInputChange}
                placeholder="Digite os exames"
                readOnly
              />
            </div>
          </AccordionItem>

          {/* Hipóteses Diagnósticas */}
          <AccordionItem
            title="Hipóteses Diagnósticas"
            icon={Stethoscope}
            isOpen={activeSections.hipotesesDiagnosticas}
            toggle={() => toggleSection("hipotesesDiagnosticas")}
          >
            <div className="form-group">
              <AutoResizeTextarea
                name="hipotesesDiagnosticas"
                value={formData.hipotesesDiagnosticas}
                onChange={handleInputChange}
                placeholder="Digite as hipóteses diagnósticas"
              />
            </div>
          </AccordionItem>

          {/* Plano de Tratamento */}
          <AccordionItem
            title="Plano de Tratamento"
            icon={Clipboard}
            isOpen={activeSections.planoTratamento}
            toggle={() => toggleSection("planoTratamento")}
          >
            <div className="form-group">
              <AutoResizeTextarea
                name="planoTratamento"
                value={formData.planoTratamento}
                onChange={handleInputChange}
                placeholder="Digite o plano de tratamento"
              />
            </div>
          </AccordionItem>

          {/* Encaminhamentos */}
          <AccordionItem
            title="Encaminhamentos"
            icon={ArrowRightCircle}
            isOpen={activeSections.encaminhamentos}
            toggle={() => toggleSection("encaminhamentos")}
          >
            <div className="form-group">
              <AutoResizeTextarea
                name="encaminhamentos"
                value={formData.encaminhamentos}
                onChange={handleInputChange}
                placeholder="Digite os encaminhamentos"
              />
            </div>
          </AccordionItem>

          {/* Feedback Atendimento */}
          <AccordionItem
            title="Feedback do Atendimento"
            icon={MessageSquare}
            isOpen={activeSections.feedbackAtendimento}
            toggle={() => toggleSection("feedbackAtendimento")}
          >
            <div className="form-group">
              <AutoResizeTextarea
                name="feedbackAtendimento"
                value={formData.feedbackAtendimento}
                onChange={handleInputChange}
                placeholder="Digite o feedback do atendimento"
              />
            </div>
          </AccordionItem>
        </form>

        {/* Botão Finalizar Atendimento */}
        <div className="button-container">
          <button
            type="button"
            className="finalizar-button"
            onClick={handleFinalizarAtendimento}
          >
            <Send size={20} /> Finalizar Atendimento
          </button>
        </div>
      </div>

      {/* Renderização do Toast com ações */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close-button" onClick={closeToast}>
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default ConsultaRetorno;
