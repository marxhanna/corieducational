// src/components/FeedbackDocente.jsx
/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  MessageCircle,
  LayoutDashboard,
  BookOpen,
  FileText,
  User,
  RefreshCw,
  PlayCircle,
  SkipBack,
  SkipForward,
  Send,
  X, // Importando o ícone X para fechar o Toast
} from "lucide-react";
import ReactMarkdown from "react-markdown"; // Importando react-markdown para renderizar Markdown
import MdEditor from "react-markdown-editor-lite"; // Importando o editor de Markdown
import MarkdownIt from "markdown-it"; // Importando o parser de Markdown
import "react-markdown-editor-lite/lib/index.css"; // Importando o CSS do editor
import "../../styles/Professor/FeedbackDocente.css"; // Importando o CSS

const mdParser = new MarkdownIt();

const FeedbackDocente = () => {
  const [filters, setFilters] = useState({
    disciplina: "",
    tarefaId: "",
    alunoId: "",
  });

  const [feedback, setFeedback] = useState("");
  const [currentAluno, setCurrentAluno] = useState(null); // Objeto { aluno }
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // 0 ou 1
  const [studentUuid, setStudentUuid] = useState("");
  const [uuidTarefa, setUuidTarefa] = useState("");
  const [historico, setHistorico] = useState([]);

  // Referências para os comboboxes
  const disciplinaDropdownRef = useRef(null);
  const tarefaDropdownRef = useRef(null);
  const alunoDropdownRef = useRef(null);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      const form = new FormData();
      const options = {
        method: "GET",
        headers: {
          "User-Agent": "insomnia/9.2.0",
          Authorization: "Bearer oat_NQ.N1FxRE9DQTQ1Q19hNTE1SVBEaGtTZlRPYm1VT3gwR0NsUDVhRThYODMzMzAxMDg0Mw",
        },
      };

      try {
        const response = await fetch(
          "https://back-end-cori-feedbacks-node.opatj4.easypanel.host/teachers/accompaniment",
          options
        );
        const data = await response.json();
        const updatedHistorico = processFeedbackData(data);
        setHistorico(updatedHistorico);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };

    fetchFeedbackData();
  }, []);

  const processFeedbackData = (data) => {
    // Processa a resposta da API para preencher o historico
    const updatedHistorico = [];
  
    data.forEach((feedbackItem) => {
      const { user, studentService } = feedbackItem;
      const tarefaId = feedbackItem.taskId;
  
      // Filtra feedbacks sem tarefaId
      if (!tarefaId) {
        return; // Ignora o feedback caso o tarefaId seja nulo
      }
  
      const alunoIndex = updatedHistorico.findIndex(
        (disciplina) => disciplina.tarefas.some((tarefa) => tarefa.alunos.some((aluno) => aluno.nome === user.fullName))
      );
  
      if (alunoIndex === -1) {
        updatedHistorico.push({
          disciplina: "Disciplina Não Informada",
          tarefas: [
            {
              tarefaId: feedbackItem.taskId,
              alunos: [
                {
                  nome: user.fullName,
                  atendimentoId: `A-${feedbackItem.id}`,
                  consultaIda: studentService.some((service) => service.medication),
                  consultaRetorno: studentService.some((service) => service.referrals),
                  feedbackDocente: feedbackItem.feedback,
                  videos: [
                    {
                      title: "Consulta Inicial",
                      src: feedbackItem.videoFilename,
                    },
                    {
                      title: "Consulta de Retorno",
                      src: feedbackItem.videoReturnFilename,
                    },
                  ],
                },
              ],
            },
          ],
        });
      } else {
        const tarefaIndex = updatedHistorico[alunoIndex].tarefas.findIndex((tarefa) => tarefa.tarefaId === feedbackItem.taskId);
  
        if (tarefaIndex === -1) {
          updatedHistorico[alunoIndex].tarefas.push({
            tarefaId: feedbackItem.taskId,
            alunos: [
              {
                nome: user.fullName,
                atendimentoId: `A-${feedbackItem.id}`,
                consultaIda: studentService.some((service) => service.medication),
                consultaRetorno: studentService.some((service) => service.referrals),
                feedbackDocente: feedbackItem.feedback,
                videos: [
                  {
                    title: "Consulta Inicial",
                    src: feedbackItem.videoFilename,
                  },
                  {
                    title: "Consulta de Retorno",
                    src: feedbackItem.videoReturnFilename,
                  },
                ],
              },
            ],
          });
        } else {
          updatedHistorico[alunoIndex].tarefas[tarefaIndex].alunos.push({
            nome: user.fullName,
            atendimentoId: `A-${feedbackItem.id}`,
            consultaIda: studentService.some((service) => service.medication),
            consultaRetorno: studentService.some((service) => service.referrals),
            feedbackDocente: feedbackItem.feedback,
            videos: [
              {
                title: "Consulta Inicial",
                src: feedbackItem.videoFilename,
              },
              {
                title: "Consulta de Retorno",
                src: feedbackItem.videoReturnFilename,
              },
            ],
          });
        }
      }
    });
  
    return updatedHistorico;
  };
  

  // Estados para controlar a abertura dos comboboxes
  const [isDisciplinaDropdownOpen, setIsDisciplinaDropdownOpen] =
    useState(false);
  const [isTarefaDropdownOpen, setIsTarefaDropdownOpen] = useState(false);
  const [isAlunoDropdownOpen, setIsAlunoDropdownOpen] = useState(false);

  // Estado para controlar o Toast
  const [toast, setToast] = useState(null);

  // Estado para controlar o carregamento (opcional)
  const [isLoading, setIsLoading] = useState(false);

  // Função para fechar dropdowns ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        disciplinaDropdownRef.current &&
        !disciplinaDropdownRef.current.contains(event.target)
      ) {
        setIsDisciplinaDropdownOpen(false);
      }
      if (
        tarefaDropdownRef.current &&
        !tarefaDropdownRef.current.contains(event.target)
      ) {
        setIsTarefaDropdownOpen(false);
      }
      if (
        alunoDropdownRef.current &&
        !alunoDropdownRef.current.contains(event.target)
      ) {
        setIsAlunoDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Função para atualizar os filtros
  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));

    // Não resetar outros filtros para permitir seleção independente
    if (filterName === "disciplina") {
      setCurrentAluno(null);
      setFeedback("");
      setCurrentVideoIndex(0);
    } else if (filterName === "tarefaId") {
      setCurrentAluno(null);
      setFeedback("");
      setCurrentVideoIndex(0);
    }
  };

  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    setFilters({
      disciplina: "",
      tarefaId: "",
      alunoId: "",
    });
    setFeedback("");
    setCurrentAluno(null);
    setCurrentVideoIndex(0);
  };

  // Lista única de disciplinas para o combobox
  const disciplinas = useMemo(() => {
    const list = historico.map((item) => item.disciplina);
    return [...new Set(list)];
  }, [historico]);

  // Lista de tarefas com base na disciplina selecionada ou todas
  const tarefas = useMemo(() => {
    if (!filters.disciplina) {
      // Recolha todas as tarefas de todas as disciplinas
      return historico.flatMap((d) => d.tarefas);
    }
    const disciplina = historico.find(
      (d) => d.disciplina === filters.disciplina
    );
    if (!disciplina) return [];
    return disciplina.tarefas;
  }, [filters.disciplina, historico]);

  // Lista de alunos com base na tarefa selecionada ou todas
  const alunos = useMemo(() => {
    if (!filters.tarefaId) {
      // Recolha todos os alunos de todas as tarefas de todas as disciplinas
      return historico.flatMap((d) => d.tarefas.flatMap((t) => t.alunos));
    }
    // Encontre a tarefa em qualquer disciplina
    const tarefa = historico
      .flatMap((d) => d.tarefas)
      .find((t) => t.tarefaId === filters.tarefaId);
    if (!tarefa) return [];
    return tarefa.alunos;
  }, [filters.tarefaId, historico]);

  // Seleção de aluno
  const selectedAluno = useMemo(() => {
    if (!filters.alunoId) return null;
    return historico
      .flatMap((d) => d.tarefas.flatMap((t) => t.alunos))
      .find((a) => a.atendimentoId === filters.alunoId);
  }, [filters.alunoId, historico]);

  // Função para selecionar um aluno para feedback
  const handleAlunoSelect = (aluno) => {
    setCurrentAluno(aluno);
    setFeedback(aluno.feedbackDocente || "");
    setCurrentVideoIndex(0);
  };

  // Função para enviar o feedback com simulação de API
  const handleSubmitFeedback = () => {
    console.log("Botão Enviar clicado");
    setIsLoading(true); // Iniciar o carregamento
  
    // Requisição para enviar o feedback
    const form = new FormData();
    form.append("studentUuid", selectedAluno?.uuid || "");
    form.append("content", feedback);
    form.append("video", "");
  
    const options = {
      method: "POST",
      headers: {
        Authorization:
          "Bearer oat_Ng.ei11cmtKMTBoMjhFaDM2bW1USWcwbU5hUlhLblZxZTIxMW1wbERHSTI5NzMxNTIwODY",
      },
      body: form,
    };
  
    // Chamada real à API
    fetch(
      `https://back-end-cori-feedbacks-node.opatj4.easypanel.host/teachers/give-feedback/${uuidTarefa}`,
      options
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao enviar o feedback");
        }
        return response.json();
      })
      .then((response) => {
        console.log("Resposta da API:", response);
  
        // Atualizar o feedback no estado
        const updatedHistorico = historico.map((disciplina) => {
          return {
            ...disciplina,
            tarefas: disciplina.tarefas.map((t) => {
              return {
                ...t,
                alunos: t.alunos.map((a) => {
                  if (a.atendimentoId === currentAluno.atendimentoId) {
                    return {
                      ...a,
                      feedbackDocente: feedback,
                    };
                  }
                  return a;
                }),
              };
            }),
          };
        });
  
        setHistorico(updatedHistorico);
  
        // Exibir mensagem de sucesso
        setToast({
          message: `Feedback enviado para ${currentAluno.nome}!`,
          type: "success",
        });
  
        // Resetar o feedback
        setFeedback("");
        setCurrentVideoIndex(0);
      })
      .catch((err) => {
        console.error(err);
  
        // Exibir mensagem de erro
        setToast({
          message: "Ocorreu um erro ao enviar o feedback. Tente novamente.",
          type: "error",
        });
      })
      .finally(() => {
        setIsLoading(false); // Finalizar o carregamento
      });
  };  

  // Funções para alternar entre os vídeos
  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      setFeedback(currentAluno.feedbackDocente || "");
    }
  };

  const handleNextVideo = () => {
    if (
      currentAluno.videos &&
      currentVideoIndex < currentAluno.videos.length - 1
    ) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setFeedback(currentAluno.feedbackDocente || "");
    }
  };

  // Função para fechar o Toast
  const closeToast = () => {
    setToast(null);
  };

  // Efeito para auto-fechar o Toast após 3 segundos
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        closeToast();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Função para manipular mudanças no editor de Markdown
  const handleEditorChange = ({ text }) => {
    setFeedback(text);
  };

  return (
    <div className="info-container professor-feedback-container">
      <h2 className="professor-feedback-title">
        <MessageCircle
          color="#FF0F68"
          size={24}
          style={{ verticalAlign: "middle", marginRight: "8px" }}
        />
        <strong>Feedback Docente</strong>
      </h2>

      {/* Filtros */}
      <div className="search-filter-container">
        {/* Combobox Disciplina */}
        <div className="combobox-container" ref={disciplinaDropdownRef}>
          <button
            className={`combobox-button ${
              isDisciplinaDropdownOpen ? "active" : ""
            }`}
            onClick={() =>
              setIsDisciplinaDropdownOpen(!isDisciplinaDropdownOpen)
            }
            aria-haspopup="true"
            aria-expanded={isDisciplinaDropdownOpen}
          >
            <span className="combobox-icon">
              <BookOpen size={16} />
              &nbsp;
              {filters.disciplina ? filters.disciplina : "Disciplina"}
            </span>
            <span className="chevron-icon">
              {isDisciplinaDropdownOpen ? "▲" : "▼"}
            </span>
          </button>
          {isDisciplinaDropdownOpen && (
            <div className="combobox-dropdown">
              <div
                onClick={() => {
                  handleFilterChange("disciplina", "");
                  setIsDisciplinaDropdownOpen(false);
                }}
                className={`dropdown-item ${
                  filters.disciplina === "" ? "active" : ""
                }`}
              >
                <BookOpen size={16} />
                &nbsp;Todas as Disciplinas
              </div>
              {disciplinas.map((disciplina) => (
                <div
                  key={disciplina}
                  onClick={() => {
                    handleFilterChange("disciplina", disciplina);
                    setIsDisciplinaDropdownOpen(false);
                  }}
                  className={`dropdown-item ${
                    filters.disciplina === disciplina ? "active" : ""
                  }`}
                >
                  <BookOpen size={16} />
                  &nbsp;{disciplina}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Combobox Tarefa */}
        <div className="combobox-container" ref={tarefaDropdownRef}>
          <button
            className={`combobox-button ${isTarefaDropdownOpen ? "active" : ""}`}
            onClick={() => setIsTarefaDropdownOpen(!isTarefaDropdownOpen)}
            aria-haspopup="true"
            aria-expanded={isTarefaDropdownOpen}
          >
            <span className="combobox-icon">
              <FileText size={16} />
              &nbsp;
              {filters.tarefaId ? filters.tarefaId : "Tarefa"}
            </span>
            <span className="chevron-icon">
              {isTarefaDropdownOpen ? "▲" : "▼"}
            </span>
          </button>
          {isTarefaDropdownOpen && (
            <div className="combobox-dropdown">
              <div
                onClick={() => {
                  handleFilterChange("tarefaId", "");
                  setIsTarefaDropdownOpen(false);
                }}
                className={`dropdown-item ${
                  filters.tarefaId === "" ? "active" : ""
                }`}
              >
                <FileText size={16} />
                &nbsp;Todas as Tarefas
              </div>
              {tarefas.map((tarefa) => (
                <div
                  key={tarefa.tarefaId}
                  onClick={() => {
                    handleFilterChange("tarefaId", tarefa.tarefaId);
                    setIsTarefaDropdownOpen(false);
                  }}
                  className={`dropdown-item ${
                    filters.tarefaId === tarefa.tarefaId ? "active" : ""
                  }`}
                >
                  <FileText size={16} />
                  &nbsp;{tarefa.tarefaId}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Combobox Aluno */}
        <div className="combobox-container" ref={alunoDropdownRef}>
          <button
            className={`combobox-button ${isAlunoDropdownOpen ? "active" : ""}`}
            onClick={() => setIsAlunoDropdownOpen(!isAlunoDropdownOpen)}
            aria-haspopup="true"
            aria-expanded={isAlunoDropdownOpen}
          >
            <span className="combobox-icon">
              <User size={16} />
              &nbsp;
              {filters.alunoId
                ? alunos.find((a) => a.atendimentoId === filters.alunoId)?.nome
                : "Aluno"}
            </span>
            <span className="chevron-icon">
              {isAlunoDropdownOpen ? "▲" : "▼"}
            </span>
          </button>
          {isAlunoDropdownOpen && (
            <div className="combobox-dropdown">
              <div
                onClick={() => {
                  handleFilterChange("alunoId", "");
                  setIsAlunoDropdownOpen(false);
                }}
                className={`dropdown-item ${
                  filters.alunoId === "" ? "active" : ""
                }`}
              >
                <User size={16} />
                &nbsp;Todos os Alunos
              </div>
              {alunos.map((aluno) => (
                <div
                  key={aluno.atendimentoId}
                  onClick={() => {
                    handleAlunoSelect(aluno);
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      alunoId: aluno.atendimentoId,
                    }));
                    setIsAlunoDropdownOpen(false);
                  }}
                  className={`dropdown-item ${
                    filters.alunoId === aluno.atendimentoId ? "active" : ""
                  }`}
                >
                  <User size={16} />
                  &nbsp;{aluno.nome}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botão de Limpar Filtros */}
        <button
          className="clear-filters-button"
          onClick={clearAllFilters}
          title="Limpar Filtros"
        >
          <RefreshCw size={16} />
        </button>

        {/* Botões de Troca de Vídeo */}
        {currentAluno && currentAluno.videos.length > 1 && (
          <div className="video-switch-buttons">
            <button
              className="video-switch-button"
              onClick={handlePrevVideo}
              disabled={currentVideoIndex === 0}
              title="Vídeo Anterior"
            >
              <SkipBack size={16} />
            </button>
            <button
              className="video-switch-button"
              onClick={handleNextVideo}
              disabled={currentVideoIndex === currentAluno.videos.length - 1}
              title="Próximo Vídeo"
            >
              <SkipForward size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Seção de Vídeo e Feedback */}
      {filters.alunoId && selectedAluno ? (
        <div className="professor-feedback-secao">
          <h3 className="professor-feedback-secao-title">
            Feedback para {selectedAluno.nome}
          </h3>

          {/* Vídeo */}
          <div className="professor-feedback-video-wrapper">
            {/* Simulação do vídeo */}
            <div className="video-placeholder">
              <PlayCircle className="play-icon" size={48} />
              <p>{selectedAluno.videos[currentVideoIndex].title}</p>
            </div>
          </div>

          {/* Área de texto para o feedback docente utilizando o editor de Markdown */}
          <div className="professor-feedback-input-group">
            <MdEditor
              value={feedback}
              style={{ height: "300px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
              view={{ menu: true, md: true, html: false }} // Apenas a área de edição
              placeholder="Digite o feedback..."
            />
          </div>
          <br />

          {/* Botão para enviar o feedback */}
          <button
            className="professor-feedback-submit-button"
            onClick={handleSubmitFeedback}
            disabled={!feedback || isLoading}
          >
            {isLoading ? (
              <span>Enviando...</span>
            ) : (
              <>
                <Send size={16} style={{ marginRight: "8px" }} />
                Enviar Feedback
              </>
            )}
          </button>
        </div>
      ) : (
        <>
          <br/><br/><br/><br/>
          <center><p>Selecione Disciplina, Tarefa e Aluno para poder enviar um feedback.</p></center>
        </>
       )}

      {/* Renderizar o Toast se existir */}
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

export default FeedbackDocente;
