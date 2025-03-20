import React, { useState, useRef, useEffect } from "react";
import "../../styles/exames.css";
import { Tag } from "lucide-react";

const Exames = () => {
  const [idAtendimento, setIdAtendimento] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempId, setTempId] = useState("");
  const [exams, setExams] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const fetchExams = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const options = {
        method: "GET",
        headers: {
          "User-Agent": "insomnia/9.2.0",
          Authorization: "Bearer oat_NQ.N1FxRE9DQTQ1Q19hNTE1SVBEaGtTZlRPYm1VT3gwR0NsUDVhRThYODMzMzAxMDg0Mw"
        }
      };
      const response = await fetch(`https://back-end-cori-feedbacks-node.opatj4.easypanel.host/students/exams-images/${id}`, options);
      if (!response.ok) throw new Error("Falha ao buscar exames.");
      const data = await response.json();
      setExams(data.exams.flatMap(exam => exam.examsImage));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSpanClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setTempId(e.target.value);
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
      setIdAtendimento(tempId);
      fetchExams(tempId);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setTempId(idAtendimento);
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div className="exames-container">
      <section className="paciente-card-id">
        <h2 className="paciente-card-title">
          <span className="badge">
            <Tag className="badge-icon" aria-label="ID do Atendimento" />
            {isEditing ? (
              <input
                type="text"
                value={tempId}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="id-input-editable"
                aria-label="Editar ID do Atendimento"
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
                aria-label="Clique para editar o ID do Atendimento"
              >
                {idAtendimento || "Insira o ID do atendimento"}
              </span>
            )}
          </span>
        </h2>
      </section>

      {loading && <p>Carregando exames...</p>}
      {error && <p className="error">Erro: {error}</p>}
      {!loading && !error && (!exams || exams.length === 0) && idAtendimento && (
        <p>Nenhuma imagem de exame encontrada.</p>
      )}
      {!idAtendimento && <p>Insira o ID do atendimento para visualizar os exames.</p>}

      <div className="exames-grid">
        {exams && exams.map((exam) => (
          <div key={exam.id} className="exame-card">
            <img
              src={`https://back-end-cori-feedbacks-node.opatj4.easypanel.host/uploads/${exam.filename}`}
              alt={exam.originalFilename}
            />
            <div className="exame-card-title">{exam.originalFilename}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exames;
