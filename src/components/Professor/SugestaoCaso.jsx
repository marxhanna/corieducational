// src/components/SugestaoNovoCaso.jsx
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { XCircle, Send, Stethoscope } from "lucide-react"; // Importando ícones
import MdEditor from "react-markdown-editor-lite"; // Importando o editor de Markdown
import MarkdownIt from "markdown-it"; // Importando o parser de Markdown
import "react-markdown-editor-lite/lib/index.css"; // Importando o CSS do editor
import "../../styles/Professor/SugestaoNovoCaso.css"; // Importando o CSS

const mdParser = new MarkdownIt();

const SugestaoNovoCaso = () => {
  const [sugestao, setSugestao] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]); // Estado para armazenar imagens selecionadas
  const [selectedSubject, setSelectedSubject] = useState(""); // Estado para a matéria
  const [selectedPeriod, setSelectedPeriod] = useState(""); // Estado para o período

  // Estados para controlar os comboboxes
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [showSubjectSuggestions, setShowSubjectSuggestions] = useState(false);
  const [filteredPeriods, setFilteredPeriods] = useState([]);
  const [showPeriodSuggestions, setShowPeriodSuggestions] = useState(false);

  const subjectDropdownRef = useRef(null);
  const periodDropdownRef = useRef(null);

  // Estado para controlar o Toast
  const [toast, setToast] = useState(null);

  // Estado para controlar o carregamento
  const [isLoading, setIsLoading] = useState(false);

  // Listas de matérias e períodos
  const subjects = [
    "Sistema Cardiorrespiratório",
    "Sistema Nervoso",
    "Semiologia",
    "Sistema Digestório",
  ];
  const periods = [
    "1º Período",
    "2º Período",
    "3º Período",
    "4º Período",
    "5º Período",
  ];

  // Função para lidar com a mudança na matéria (combobox)
  const handleSubjectChange = (e) => {
    const userInput = e.target.value;
    setSelectedSubject(userInput);

    if (userInput) {
      const suggestions = subjects.filter((subject) =>
        subject.toLowerCase().includes(userInput.toLowerCase())
      );
      setFilteredSubjects(suggestions);
      setShowSubjectSuggestions(true);
    } else {
      setFilteredSubjects([]);
      setShowSubjectSuggestions(false);
    }
  };

  // Função para selecionar uma sugestão de matéria
  const handleSubjectSuggestionClick = (suggestion) => {
    setSelectedSubject(suggestion);
    setFilteredSubjects([]);
    setShowSubjectSuggestions(false);
  };

  // Função para lidar com a mudança no período (combobox)
  const handlePeriodChange = (e) => {
    const userInput = e.target.value;
    setSelectedPeriod(userInput);

    if (userInput) {
      const suggestions = periods.filter((period) =>
        period.toLowerCase().includes(userInput.toLowerCase())
      );
      setFilteredPeriods(suggestions);
      setShowPeriodSuggestions(true);
    } else {
      setFilteredPeriods([]);
      setShowPeriodSuggestions(false);
    }
  };

  // Função para selecionar uma sugestão de período
  const handlePeriodSuggestionClick = (suggestion) => {
    setSelectedPeriod(suggestion);
    setFilteredPeriods([]);
    setShowPeriodSuggestions(false);
  };

  // Função para lidar com a mudança no editor de Markdown
  const handleEditorChange = ({ text }) => {
    setSugestao(text);
  };

  // Função para lidar com a seleção de imagens
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]); // Permite adicionar múltiplas imagens
  };

  // Função para deletar uma imagem da lista
  const handleDeleteImage = (indexToDelete) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToDelete)
    );
  };

  // Função para enviar a sugestão com simulação de API
  const handleSubmit = () => {
    console.log("Botão Enviar clicado");
    setIsLoading(true); // Iniciar o carregamento

    // Simulação de chamada à API
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% de chance de sucesso
      console.log("Simulando envio. Sucesso:", isSuccess);
      setIsLoading(false); // Finalizar o carregamento

      if (isSuccess) {
        setToast({
          message: "Caso enviado com sucesso!",
          type: "success",
        });
        // Resetar os campos após sucesso
        setSelectedSubject("");
        setSelectedPeriod("");
        setSugestao("");
        setSelectedFiles([]);
      } else {
        setToast({
          message: "Ocorreu um erro ao enviar o caso. Tente novamente.",
          type: "error",
        });
      }
    }, 1000);
  };

  // Função para fechar o Toast
  const closeToast = () => {
    setToast(null);
  };

  // Efeito para fechar os comboboxes ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        subjectDropdownRef.current &&
        !subjectDropdownRef.current.contains(event.target)
      ) {
        setShowSubjectSuggestions(false);
      }
      if (
        periodDropdownRef.current &&
        !periodDropdownRef.current.contains(event.target)
      ) {
        setShowPeriodSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Efeito para auto-fechar o Toast após 3 segundos
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        closeToast();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="sugestao-caso-container">
      <h2 className="professor-feedback-title">
        <Stethoscope
          color="#FF0F68"
          size={24}
          style={{ verticalAlign: "middle", marginRight: "8px" }}
        />
        <strong>Sugestão de Caso</strong>
      </h2>

      {/* Editor de Markdown para a sugestão */}
      <div className="sugestao-caso-input-group">
        <MdEditor
          value={sugestao}
          style={{ height: "300px" }}
          renderHTML={(text) => mdParser.render(text)}
          onChange={handleEditorChange}
          view={{ menu: true, md: true, html: false }} // Apenas a área de edição
          placeholder="Digite as informações textuais do caso aqui..."
        />
      </div>

      {/* Seção para enviar imagens */}
      <div className="sugestao-caso-upload-group">
        <br />
        <br />
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileChange}
          className="sugestao-caso-file-input"
          accept="image/*"
        />
      </div>

      {/* Preview das imagens selecionadas */}
      {selectedFiles.length > 0 && (
        <div className="sugestao-caso-preview">
          <p>Imagens Selecionadas:</p>
          <div className="sugestao-caso-preview-grid">
            {selectedFiles.map((file, index) => {
              const fileUrl = URL.createObjectURL(file); // Gerar URL para pré-visualização
              return (
                <div key={index} className="sugestao-caso-preview-item">
                  <img
                    src={fileUrl}
                    alt={`Preview ${index + 1}`}
                    className="sugestao-caso-preview-image"
                  />
                  <button
                    className="sugestao-caso-delete-button"
                    onClick={() => handleDeleteImage(index)}
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <br />
      <br />

      {/* Botão para enviar a sugestão */}
      <button
        className="sugestao-caso-submit-button"
        onClick={handleSubmit}
        disabled={
          !sugestao ||
          selectedFiles.length === 0 ||
          !selectedSubject ||
          !selectedPeriod ||
          isLoading
        } // Desabilita o botão se algo estiver vazio ou durante o envio
      >
        {isLoading ? (
          <span>Enviando...</span>
        ) : (
          <>
            <Send size={16} style={{ marginRight: "8px" }} />
            Enviar
          </>
        )}
      </button>

      {/* Renderizar o Toast se existir */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-close-button"
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

export default SugestaoNovoCaso;
