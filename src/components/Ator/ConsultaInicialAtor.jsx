/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  X,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Pill,
  Users,
  Heart,
  MessageCircle,
  Microscope,
  Stethoscope,
  Clipboard,
  ArrowRightCircle,
  MessageSquare,
  Send,
  FilePlus,
  ArrowRight,
  UploadCloud,
} from "lucide-react";
import "../../styles/ConsultaInicial.css";
import { v4 as uuidv4 } from "uuid"; // Importando uuid para gerar IDs

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

const ConsultaInicial = () => {
  const [formData, setFormData] = useState({
    identificacaoPaciente: "",
    identificacaoAtendimento: `A-${uuidv4().slice(0, 6)}`, // Gerando um UUID curto que começa com "A-"
    tarefaId: "", // Campo para o ID da Tarefa que o usuário vai preencher
  });

  const [videoFile, setVideoFile] = useState(null);
  const [activeSections, setActiveSections] = useState({
    identificacaoPaciente: false,
    identificacaoAtendimento: false,
    tarefaId: false, // Estado para controle de abertura do ID da Tarefa
    videoUpload: false,
  });
  const [toast, setToast] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleEncerrarAtendimento = () => {
    console.log(
      "Atendimento encerrado e vídeo processado.",
      formData,
      videoFile
    );
    setToast({
      message: "Atendimento encerrado com sucesso!",
      type: "success",
    });
    setFormData({
      identificacaoPaciente: "",
      identificacaoAtendimento: `A-${uuidv4().slice(0, 6)}`, // Gerando um novo UUID para cada atendimento
      tarefaId: "", // Limpar o campo ID da Tarefa
    });
    setVideoFile(null);
  };

  const closeToast = () => {
    setToast(null);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        closeToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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
            <ClipboardList size={24} />
          </div>
          Consulta Inicial
        </h1>
        <form className="consulta-inicial-form">
          {/* Identificação do Paciente */}
          <AccordionItem
            title="Identificação do Aluno"
            icon={Users}
            isOpen={activeSections.identificacaoPaciente}
            toggle={() => toggleSection("identificacaoPaciente")}
          >
            <div className="form-group">
              <AutoResizeTextarea
                name="identificacaoPaciente"
                value={formData.identificacaoPaciente}
                onChange={handleInputChange}
                placeholder="Digite a identificação do Aluno"
                readOnly={false}
              />
            </div>
          </AccordionItem>

          {/* Identificação do Atendimento (gerado automaticamente) */}
          <AccordionItem
            title="Identificação do Atendimento"
            icon={Clipboard}
            isOpen={activeSections.identificacaoAtendimento}
            toggle={() => toggleSection("identificacaoAtendimento")}
          >
            <div className="form-group">
              <input
                type="text"
                name="identificacaoAtendimento"
                value={formData.identificacaoAtendimento}
                readOnly
                className="read-only-input"
              />
            </div>
          </AccordionItem>

          {/* ID da Tarefa (preenchido pelo usuário) */}
          <AccordionItem
            title="ID da Tarefa"
            icon={Clipboard}
            isOpen={activeSections.tarefaId}
            toggle={() => toggleSection("tarefaId")}
          >
            <div className="form-group">
              <input
                type="text"
                name="tarefaId"
                value={formData.tarefaId}
                onChange={handleInputChange}
                placeholder="Digite o ID da Tarefa"
                className="input"
              />
            </div>
          </AccordionItem>

          {/* Upload de Vídeo */}
          <AccordionItem
            title="Upload de Vídeo do Atendimento"
            icon={UploadCloud}
            isOpen={activeSections.videoUpload}
            toggle={() => toggleSection("videoUpload")}
          >
            <div className="form-group">
              <input
                type="file"
                id="videoUpload"
                accept="video/*"
                onChange={handleVideoUpload}
                className="video-upload"
              />
              {videoFile && <p className="video-name">{videoFile.name}</p>}
            </div>
          </AccordionItem>
        </form>

        <div className="button-container">
          <button
            className="encerrar-button"
            onClick={handleEncerrarAtendimento}
          >
            <Send size={20} /> Encerrar Atendimento
          </button>
        </div>
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

export default ConsultaInicial;
