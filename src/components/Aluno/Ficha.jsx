/* eslint-disable no-unused-vars */
// src/components/Paciente.js
import React, { useState, useRef, useEffect } from "react";
import { User, Heart, Clipboard, Tag, X } from "lucide-react";
import "../../styles/paciente.css";

const Paciente = () => {
  // Estado do ID do Caso (UUID)
  const [idCaso, setIdCaso] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempId, setTempId] = useState(idCaso);
  const inputRef = useRef(null);

  // Estados para os dados retornados da API
  const [patientRecord, setPatientRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estado para o Toast (notificações)
  const [toast, setToast] = useState(null);

  // Função para fechar o Toast
  const closeToast = () => {
    setToast(null);
  };

  // Função para buscar a ficha do paciente via API
  const fetchPatientRecord = async (uuid) => {
    if (!uuid) return;
    setLoading(true);
    try {
      const response = await fetch(`https://back-end-cori-feedbacks-node.opatj4.easypanel.host/students/patient-record/${uuid}`);
      if (!response.ok) {
        throw new Error("ID inválido");
      }
      const data = await response.json();
      setPatientRecord(data);
    } catch (err) {
      setPatientRecord(null);
      // Exibe o Toast com a mensagem "ID inválido"
      setToast({ message: "ID inválido", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Função que dispara a busca quando o usuário clica no botão "Buscar"
  const handleSearch = () => {
    if (tempId.trim() !== "") {
      setIdCaso(tempId);
      fetchPatientRecord(tempId);
    }
  };

  // Funções para edição do ID do Caso
  const handleSpanClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setTempId(e.target.value);
  };

  const handleInputBlur = () => {
    saveId();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      saveId();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const saveId = () => {
    if (tempId.trim() !== "") {
      setIdCaso(tempId);
      fetchPatientRecord(tempId);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setTempId(idCaso);
    setIsEditing(false);
  };

  // Focar automaticamente no input ao entrar em modo de edição
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div className="paciente-container">
      {/* Seção para exibir e editar o ID do Caso */}
      <section className="paciente-card-id">
        <h2 className="paciente-card-title">
          <span className="badge">
            <Tag className="badge-icon" aria-label="ID do Caso" />
            {isEditing ? (
              <input
                type="text"
                value={tempId}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                className="id-input-editable"
                aria-label="Editar ID do Caso"
                ref={inputRef}
              />
            ) : (
              <span
                className="id-display"
                onClick={handleSpanClick}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSpanClick();
                  }
                }}
                role="button"
                aria-label="Clique para editar o ID do Caso"
              >
                {idCaso || "Clique para inserir o ID do Caso"}
              </span>
            )}
          </span>
          <button
            onClick={handleSearch}
            className="buscar-button"
            aria-label="Buscar registro do paciente"
          >
            Buscar
          </button>
        </h2>
      </section>

      {/* Mensagem de carregamento */}
      {loading && <p>Carregando dados do paciente...</p>}

      {/* Renderiza os dados da ficha do paciente, se retornados */}
      {patientRecord && (
        <>
          {/* Dados do Paciente */}
          <section className="paciente-card">
            <h2 className="paciente-card-title">
              <User className="icon" aria-label="Dados do Paciente" />
              Dados do Paciente
            </h2>
            <div className="paciente-info-grid">
              {patientRecord.patient && patientRecord.patient.length > 0 ? (
                patientRecord.patient.map((item) => (
                  <div className="paciente-info-item" key={item.id}>
                    <div className="paciente-info-label">{item.title}</div>
                    <div className="paciente-info-value">{item.content}</div>
                  </div>
                ))
              ) : (
                <p>Nenhum dado do paciente encontrado.</p>
              )}
            </div>
          </section>

          {/* Dados Vitais */}
          <section className="paciente-card">
            <h2 className="paciente-card-title">
              <Heart className="icon" aria-label="Dados Vitais" />
              Dados Vitais
            </h2>
            <div className="paciente-info-grid">
              {patientRecord.vitals && patientRecord.vitals.length > 0 ? (
                patientRecord.vitals.map((item) => (
                  <div className="paciente-info-item" key={item.id}>
                    <div className="paciente-info-label">{item.title}</div>
                    <div className="paciente-info-value">{item.content}</div>
                  </div>
                ))
              ) : (
                <p>Nenhum dado vital encontrado.</p>
              )}
            </div>
          </section>

          {/* Exame Físico Pré-Realizado */}
          <section className="paciente-card">
            <h2 className="paciente-card-title">
              <Clipboard
                className="icon"
                aria-label="Exame Físico Pré-Realizado"
              />
              Exame Físico Pré-Realizado
            </h2>
            <div className="paciente-exam-grid">
              {patientRecord.exams && patientRecord.exams.length > 0 ? (
                patientRecord.exams.map((item) => (
                  <div className="paciente-exam-item" key={item.id}>
                    <div className="paciente-exam-area">{item.title}</div>
                    <div className="paciente-exam-finding">{item.content}</div>
                  </div>
                ))
              ) : (
                <p>Nenhum exame pré-realizado encontrado.</p>
              )}
            </div>
          </section>
        </>
      )}

      {/* Toast Notification */}
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

export default Paciente;
