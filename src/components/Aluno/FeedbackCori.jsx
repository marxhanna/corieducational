import React, { useState, useRef, useEffect } from "react";
import { ThumbsUp, AlertCircle, Cpu, Tag } from "lucide-react";
import "../../styles/atendimento.css";

const CardProfessor = () => {
  const [idAtendimento, setIdAtendimento] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempId, setTempId] = useState("");
  const [feedbacks, setFeedbacks] = useState(null);
  const inputRef = useRef(null);

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
      setIdAtendimento(tempId);
      fetchFeedbacks(tempId);
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

  const fetchFeedbacks = (id) => {
    const options = {
      method: "GET",
      headers: {
        "User-Agent": "insomnia/9.2.0",
        Authorization: "Bearer oat_NQ.N1FxRE9DQTQ1Q19hNTE1SVBEaGtTZlRPYm1VT3gwR0NsUDVhRThYODMzMzAxMDg0Mw",
      },
    };

    fetch(`https://back-end-cori-feedbacks-node.opatj4.easypanel.host/students/coris-feedbacks/${id}`, options)
      .then((response) => response.json())
      .then((data) => {
        setFeedbacks(data.feedbacks);
      })
      .catch((err) => {
        console.error("Erro ao buscar feedbacks:", err);
        setFeedbacks(null);
      });
  };

  return (
    <div className="card-professor-container">
      <section className="paciente-card-id">
        <h2 className="paciente-card-title">
          <span className="badge">
            <Tag className="badge-icon" aria-label="ID do Atendimento" />
            {isEditing ? (
              <input
                type="text"
                value={tempId}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
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
                {idAtendimento || "Insira um ID para visualizar os feedbacks"}
              </span>
            )}
          </span>
        </h2>
      </section>

      <div className="card-professor-card">
        <div className="card-professor-header">
          <h1 className="video-feedback-title">
            <Cpu className="icon" />
            Feedback CoriEdu
          </h1>
        </div>
        <div className="card-professor-body">
          {feedbacks && feedbacks.length > 0 ? (
            feedbacks.map((feedback, index) => (
              <div key={index} className="info-section">
                <h2 className="info-title">
                  <ThumbsUp className="icon" />
                  <div className="titulo">Pontos Fortes</div>
                </h2>
                <p className="info-content">{feedback.strongs}</p>
                <br/>
                <h2 className="info-title">
                  <AlertCircle className="icon" />
                  <div className="titulo">Áreas para Melhoria</div>
                </h2>
                <p className="info-content">{feedback.weaknesses}</p>
              </div>
            ))
          ) : (
            <p className="no-feedback-message">Nenhum feedback disponível. Insira um ID válido.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardProfessor;
