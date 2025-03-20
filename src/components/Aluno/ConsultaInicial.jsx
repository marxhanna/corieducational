/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

// src/components/ConsultaRetorno.jsx

import React, { useState, useRef, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ClipboardList, // Ícone para o título
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
import "../../styles/consultaEstudante.css"; // Importando o CSS atualizado

// Componente AccordionItem
const AccordionItem = ({ title, icon: Icon, children, isOpen, toggle }) => (
  <div className="consulta-retorno-accordion-item">
    <button
      type="button"
      className="consulta-retorno-accordion-header"
      onClick={toggle}
      aria-expanded={isOpen}
      aria-controls={`section-${title.replace(/\s+/g, "-")}`}
    >
      <div className="consulta-retorno-accordion-icon-container">
        <Icon size={20} />
      </div>
      <span>{title}</span>
      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
    {isOpen && (
      <div
        className="consulta-retorno-accordion-content"
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
      className="consulta-retorno-auto-resize-textarea"
      rows={1}
      readOnly={readOnly}
    />
  );
};

const ConsultaRetorno = () => {
  const [formData, setFormData] = useState({
    identificacaoPaciente: "João da Silva",
    identificacaoAtendimento: "Atendimento nº 12345",
    historicoFamiliar: "Mãe com diabetes tipo 2, pai com hipertensão",
    historicoMedico: "Diabetes tipo 2 diagnosticado há 5 anos",
    queixaPrincipal: "Dor de cabeça frequente e tontura",
    exames: "Hemograma completo, glicemia em jejum",
    hipotesesDiagnosticas: "",
    planoTratamento: "",
    encaminhamentos: "",
    feedbackAtendimento: "",
  });

  // Inicializar todos os accordions como fechados
  const [activeSections, setActiveSections] = useState({
    identificacaoPaciente: false,
    identificacaoAtendimento: false,
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
    // Lógica para finalizar o atendimento, como enviar os dados para uma API
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
    <div className="consulta-retorno-page-2">
      <div className="consulta-retorno-container">
        <h1 className="consulta-retorno-form-title">
          <div className="consulta-retorno-form-title-icon">
            <ClipboardList size={24} />
          </div>
          Consulta Inicial
        </h1>
        <form className="consulta-retorno-form">
          {/* Identificação do Paciente */}
          <AccordionItem
            title="Identificação do Paciente"
            icon={Users}
            isOpen={activeSections.identificacaoPaciente}
            toggle={() => toggleSection("identificacaoPaciente")}
          >
            <div className="consulta-retorno-form-group">
              <AutoResizeTextarea
                name="identificacaoPaciente"
                value={formData.identificacaoPaciente}
                onChange={handleInputChange}
                placeholder="Digite a identificação do paciente"
                readOnly={false}
              />
            </div>
          </AccordionItem>

          {/* Identificação do Atendimento */}
          <AccordionItem
            title="Identificação do Atendimento"
            icon={Clipboard}
            isOpen={activeSections.identificacaoAtendimento}
            toggle={() => toggleSection("identificacaoAtendimento")}
          >
            <div className="consulta-retorno-form-group">
              <AutoResizeTextarea
                name="identificacaoAtendimento"
                value={formData.identificacaoAtendimento}
                onChange={handleInputChange}
                placeholder="Digite a identificação do Atendimento"
                readOnly={false}
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
            <div className="consulta-retorno-form-group">
              <AutoResizeTextarea
                name="historicoFamiliar"
                value={formData.historicoFamiliar}
                onChange={handleInputChange}
                placeholder="Digite o histórico familiar"
                readOnly={false}
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
            <div className="consulta-retorno-form-group">
              <AutoResizeTextarea
                name="historicoMedico"
                value={formData.historicoMedico}
                onChange={handleInputChange}
                placeholder="Digite o histórico médico"
                readOnly={false}
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
            <div className="consulta-retorno-form-group">
              <AutoResizeTextarea
                name="queixaPrincipal"
                value={formData.queixaPrincipal}
                onChange={handleInputChange}
                placeholder="Digite a queixa principal"
                readOnly={false}
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
            <div className="consulta-retorno-form-group">
              <AutoResizeTextarea
                name="exames"
                value={formData.exames}
                onChange={handleInputChange}
                placeholder="Digite os exames"
                readOnly={false}
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
            <div className="consulta-retorno-form-group">
              <AutoResizeTextarea
                name="hipotesesDiagnosticas"
                value={formData.hipotesesDiagnosticas}
                onChange={handleInputChange}
                placeholder="Digite as hipóteses diagnósticas"
                readOnly={false}
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
            <div className="consulta-retorno-form-group">
              <AutoResizeTextarea
                name="planoTratamento"
                value={formData.planoTratamento}
                onChange={handleInputChange}
                placeholder="Digite o plano de tratamento"
                readOnly={false}
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
            <div className="consulta-retorno-form-group">
              <AutoResizeTextarea
                name="encaminhamentos"
                value={formData.encaminhamentos}
                onChange={handleInputChange}
                placeholder="Digite os encaminhamentos"
                readOnly={false}
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
            <div className="consulta-retorno-form-group">
              <AutoResizeTextarea
                name="feedbackAtendimento"
                value={formData.feedbackAtendimento}
                onChange={handleInputChange}
                placeholder="Digite o feedback do atendimento"
                readOnly={false}
              />
            </div>
          </AccordionItem>
        </form>

        {/* Botão Finalizar Atendimento */}
        <div className="consulta-retorno-button-container">
          <button
            type="button"
            className="consulta-retorno-finalizar-button"
            onClick={handleFinalizarAtendimento}
          >
            <Send size={20} /> Finalizar Atendimento
          </button>
        </div>
      </div>

      {/* Renderização do Toast com ações */}
      {toast && (
        <div className={`consulta-retorno-toast ${toast.type}`}>
          <span className="consulta-retorno-toast-message">
            {toast.message}
          </span>
          <button
            className="consulta-retorno-toast-close-button"
            onClick={closeToast}
            aria-label="Fechar Toast"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default ConsultaRetorno;
