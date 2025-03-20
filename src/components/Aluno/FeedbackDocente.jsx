import React, { useState, useRef, useEffect } from "react";
import { GraduationCap, Tag } from "lucide-react";
import "../../styles/Docente.css";

export const VideoFeedback = () => {
  const [idAtendimento, setIdAtendimento] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempId, setTempId] = useState(idAtendimento);
  const [feedbacks, setFeedbacks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (idAtendimento) {
      fetchFeedbacks(idAtendimento);
    }
  }, [idAtendimento]);

  const fetchFeedbacks = (id) => {
    const options = {
      method: 'GET',
      headers: {
        'User-Agent': 'insomnia/9.2.0',
        Authorization: 'Bearer oat_NQ.N1FxRE9DQTQ1Q19hNTE1SVBEaGtTZlRPYm1VT3gwR0NsUDVhRThYODMzMzAxMDg0Mw'
      }
    };

    fetch(`https://back-end-cori-feedbacks-node.opatj4.easypanel.host/students/coris-feedbacks/${id}`, options)
      .then(response => response.json())
      .then(data => {
        if (data.teachersFeedback.length > 0) {
          setFeedbacks(data.teachersFeedback);
          setVideos([
            {
              title: "Consulta Inicial",
              src: data.teachersFeedback[0].videoFilename ? `https://back-end-cori-feedbacks-node.opatj4.easypanel.host/videos/${data.teachersFeedback[0].videoFilename}` : null,
              content: data.teachersFeedback[0].content
            },
            {
              title: "Consulta de Retorno",
              src: data.teachersFeedback[1]?.videoFilename ? `https://back-end-cori-feedbacks-node.opatj4.easypanel.host/videos/${data.teachersFeedback[1].videoFilename}` : null,
              content: data.teachersFeedback[1]?.content || ""
            }
          ]);
        }
      })
      .catch(err => console.error("Erro ao buscar feedbacks:", err));
  };

  const handleVideoChange = (index) => {
    setCurrentVideo(index);
  };

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
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setTempId(idAtendimento);
    setIsEditing(false);
  };

  return (
    <section className="video-feedback-container">
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
                {idAtendimento || "Insira o ID do atendimento para visualizar os feedbacks"}
              </span>
            )}
          </span>
        </h2>
      </section>

      {idAtendimento ? (
        <div className="video-feedback-card">
          <div className="video-feedback-header">
            <h1 className="video-feedback-title">
              <GraduationCap className="icon" />
              Feedback Docente
            </h1>
          </div>
          <div className="video-feedback-content">
            <p className="video-feedback-text">{videos[currentVideo]?.content || "Nenhum feedback disponível."}</p>
            <div className="video-section">
              <div className="carousel-buttons">
                {videos.map((video, index) => (
                  <button
                    key={index}
                    className={`carousel-button ${index === currentVideo ? "active" : ""}`}
                    onClick={() => handleVideoChange(index)}
                  >
                    {video.title}
                  </button>
                ))}
              </div>
              <div className="video-container">
                {videos[currentVideo]?.src ? (
                  <video className="feedback-video" controls>
                    <source src={videos[currentVideo].src} type="video/mp4" />
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                ) : (
                  <p>Nenhum vídeo disponível.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="placeholder-message"></p>
      )}
    </section>
  );
};

export default VideoFeedback;
