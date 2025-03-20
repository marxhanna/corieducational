/* eslint-disable no-unused-vars */
/* src/components/GerarExames.jsx */
import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { X, Send, PillBottle } from "lucide-react"; // Importando ícones Lucide
import "../../styles/Cori/GerarExames.css"; // Importando o CSS

// Importando os componentes dos exames
import HemogramaCompleto from "./examesComponents/HemogramaCompleto";
import GlicemiaJejum from "./examesComponents/GlicemiaJejum";
import Creatinina from "./examesComponents/Creatinina";
import Ureia from "./examesComponents/Ureia";
import TSH from "./examesComponents/TSH";
import EletroforeseProteinas from "./examesComponents/EletroforeseProteinas";
import ExameUrina from "./examesComponents/ExameUrina";
import PCR from "./examesComponents/PCR";
import Lipidograma from "./examesComponents/Lipidograma";
import TempoProtrombina from "./examesComponents/TempoProtrombina";

const GerarExames = () => {
  const [appointmentId, setAppointmentId] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedExams, setSelectedExams] = useState([]);
  const [examsData, setExamsData] = useState({});
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // Estado para imagem expandida

  const [toast, setToast] = useState(null); // Estado para controlar o Toast

  const [isGenerating, setIsGenerating] = useState(false); // Estado para gerar exames
  const [isSending, setIsSending] = useState(false); // Estado para enviar exames

  const examRefs = useRef({});

  const examOptions = [
    { value: "hemogramaCompleto", label: "Hemograma Completo" },
    { value: "glicemiaJejum", label: "Glicemia de Jejum" },
    { value: "creatinina", label: "Creatinina" },
    { value: "ureia", label: "Ureia" },
    { value: "tsh", label: "TSH (Hormônio Estimulante da Tireoide)" },
    { value: "eletroforeseProteinas", label: "Eletroforese de Proteínas" },
    { value: "exameUrina", label: "Exame de Urina (EAS)" },
    { value: "pcr", label: "PCR (Proteína C Reativa)" },
    { value: "lipidograma", label: "Lipidograma" },
    { value: "tempoProtrombina", label: "Tempo de Protrombina (TP)" },
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const images = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prevImages) => [...prevImages, ...images]);
  };

  const handleExamSelection = (examValue) => {
    if (selectedExams.includes(examValue)) {
      setSelectedExams(selectedExams.filter((exam) => exam !== examValue));
    } else {
      setSelectedExams([...selectedExams, examValue]);
    }
  };

  const handleExamDataChange = (examKey, data) => {
    setExamsData({ ...examsData, [examKey]: data });
  };

  const handleDeleteImage = (index, type) => {
    if (type === "uploaded") {
      const src = uploadedImages[index];
      URL.revokeObjectURL(src); // Liberar memória
      setUploadedImages((prevImages) =>
        prevImages.filter((_, imgIndex) => imgIndex !== index)
      );
    } else if (type === "generated") {
      const src = generatedImages[index];
      URL.revokeObjectURL(src); // Liberar memória
      setGeneratedImages((prevImages) =>
        prevImages.filter((_, imgIndex) => imgIndex !== index)
      );
    }
  };

  const handleGenerateExams = async () => {
    // Verificações
    if (!appointmentId) {
      setToast({
        message: "Por favor, insira o ID do Atendimento.",
        type: "error",
      });
      return;
    }

    if (selectedExams.length === 0) {
      setToast({
        message: "Selecione pelo menos um exame para gerar.",
        type: "error",
      });
      return;
    }

    setIsGenerating(true);
    setToast(null); // Resetar toast anterior

    try {
      // Gerar imagens dos exames preenchidos
      const newGeneratedImages = [];
      for (const examKey of selectedExams) {
        const element = examRefs.current[examKey];
        if (element) {
          const canvas = await html2canvas(element);
          const dataURL = canvas.toDataURL("image/png");
          newGeneratedImages.push(dataURL);
        }
      }
      // Adicionar as novas imagens geradas sem remover as existentes
      setGeneratedImages((prevImages) => [
        ...prevImages,
        ...newGeneratedImages,
      ]);

      setToast({
        message: "Exames gerados com sucesso! Agora você pode enviá-los.",
        type: "success",
      });
    } catch (error) {
      console.error("Erro ao gerar exames:", error);
      setToast({
        message: "Ocorreu um erro ao gerar os exames. Tente novamente.",
        type: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificações
    if (!appointmentId) {
      setToast({
        message: "Por favor, insira o ID do Atendimento.",
        type: "error",
      });
      return;
    }

    if (selectedExams.length === 0) {
      setToast({
        message: "Selecione pelo menos um exame para gerar.",
        type: "error",
      });
      return;
    }

    if (generatedImages.length === 0 && uploadedImages.length === 0) {
      setToast({
        message: "Nenhuma imagem para enviar. Gere ou faça upload de exames.",
        type: "error",
      });
      return;
    }

    const token = localStorage.getItem('authToken');

    setIsSending(true);
    setToast(null); // Resetar toast anterior

    try {
      const form = new FormData();

      // Adicionando as imagens enviadas ao FormData
      uploadedImages.forEach((image) => {
        form.append("images", image);  // Adiciona cada imagem ao FormData
      });

      // Adicionando as imagens geradas ao FormData
      generatedImages.forEach((image) => {
        form.append("generatedImages", image);  // Adiciona cada imagem gerada ao FormData
      });

      // Enviar as imagens geradas e uploadadas para o backend
      const response = await fetch(`https://back-end-cori-feedbacks-node.opatj4.easypanel.host/cori/exams/${appointmentId}`, {
        method: "POST",
        headers: {
          'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
          'User-Agent': 'insomnia/9.2.0'
        },
        body: form,
      });

      const data = await response.text();

      if (response.ok) {
        setToast({
          message: "Exames enviados com sucesso!",
          type: "success",
        });
        // Resetar os campos após sucesso
        setAppointmentId("");
        setSelectedExams([]);
        setExamsData({});
        // Liberar URLs de objetos
        uploadedImages.forEach((src) => URL.revokeObjectURL(src));
        generatedImages.forEach((src) => URL.revokeObjectURL(src));
        setUploadedImages([]);
        setGeneratedImages([]);
      } else {
        setToast({
          message: data.error || "Ocorreu um erro ao enviar os exames.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao enviar exames:", error);
      setToast({
        message: "Ocorreu um erro ao enviar os exames. Tente novamente.",
        type: "error",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleImageClick = (src) => {
    setSelectedImage(src); // Definir a imagem selecionada para ser visualizada em tamanho maior
  };

  const closeModal = () => {
    setSelectedImage(null); // Fechar o modal
  };

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

  // Limpar URLs de objetos ao desmontar o componente
  useEffect(() => {
    return () => {
      uploadedImages.forEach((src) => URL.revokeObjectURL(src));
      generatedImages.forEach((src) => URL.revokeObjectURL(src));
    };
  }, [uploadedImages, generatedImages]);

  return (
    <div className="gerar-exames-container">
      {/* Input para o ID do Atendimento */}
      <div className="form-group">
        <h2 className="title">
          <PillBottle color="#FF0F68" size={24} /> <strong>Gerar Exames</strong>
        </h2>
        <label htmlFor="appointmentId">Id do Atendimento:</label>
        <input
          id="appointmentId"
          type="text"
          placeholder="Digite o ID do Atendimento"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
          required
        />
      </div>

      {/* Respostas Fictícias do Aluno */}
      <div className="student-responses">
        <h2>Respostas Fictícias do Aluno</h2>
        <p>
          <strong>ID do Atendimento:</strong> a1b2c3d4
        </p>
        <p>
          <strong>ID do Aluno:</strong> e5f6g7h8
        </p>

        <p>
          <strong>Exames Solicitados:</strong> Raio-X de tórax, Hemograma e PCR
        </p>
      </div>

      {/* Upload de Imagens */}
      <div className="form-group">
        <label htmlFor="imageUpload">Faça upload das imagens:</label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />
      </div>

      {/* Pré-visualização das Imagens Uploadadas e Geradas */}
      {(uploadedImages.length > 0 || generatedImages.length > 0) && (
        <div className="images-preview">
          <h3>Imagens:</h3>
          <div className="images-grid">
            {uploadedImages.map((src, index) => (
              <div key={`uploaded-${index}`} className="image-item">
                <img
                  src={src}
                  alt={`Upload ${index + 1}`}
                  onClick={() => handleImageClick(src)} // Clique para expandir
                />
                <button
                  className="delete-button"
                  onClick={() => handleDeleteImage(index, "uploaded")}
                  aria-label={`Deletar imagem uploadada ${index + 1}`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {generatedImages.map((src, index) => (
              <div key={`generated-${index}`} className="image-item">
                <img
                  src={src}
                  alt={`Exame Gerado ${index + 1}`}
                  onClick={() => handleImageClick(src)} // Clique para expandir
                />
                <button
                  className="delete-button"
                  onClick={() => handleDeleteImage(index, "generated")}
                  aria-label={`Deletar exame gerado ${index + 1}`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checkboxes de Exames */}
      <div className="form-group">
        <label>Selecione os Exames:</label>
        <div className="checkbox-group">
          {examOptions.map((exam) => (
            <label key={exam.value} className="checkbox-label">
              <input
                type="checkbox"
                value={exam.value}
                checked={selectedExams.includes(exam.value)}
                onChange={() => handleExamSelection(exam.value)}
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">{exam.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Renderização dos exames selecionados */}
      <div className="exams-list">
        {selectedExams.map((examKey) => {
          const ExamComponent = (() => {
            switch (examKey) {
              case "hemogramaCompleto":
                return HemogramaCompleto;
              case "glicemiaJejum":
                return GlicemiaJejum;
              case "creatinina":
                return Creatinina;
              case "ureia":
                return Ureia;
              case "tsh":
                return TSH;
              case "eletroforeseProteinas":
                return EletroforeseProteinas;
              case "exameUrina":
                return ExameUrina;
              case "pcr":
                return PCR;
              case "lipidograma":
                return Lipidograma;
              case "tempoProtrombina":
                return TempoProtrombina;
              default:
                return null;
            }
          })();

          if (ExamComponent) {
            return (
              <div key={examKey} ref={(el) => (examRefs.current[examKey] = el)}>
                <ExamComponent onDataChange={handleExamDataChange} />
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>

      {/* Botões de Gerar e Enviar Exames */}
      <div className="buttons-container">
        <button
          type="button"
          className="action-button"
          onClick={handleGenerateExams}
          disabled={isGenerating || selectedExams.length === 0}
        >
          <PillBottle size={16} /> Gerar Exames
        </button>
        <button
          type="button"
          className="action-button"
          onClick={handleSubmit}
          disabled={
            isSending ||
            (generatedImages.length === 0 && uploadedImages.length === 0)
          }
        >
          <Send size={16} /> Enviar Exames
        </button>
      </div>

      {/* Modal de visualização da imagem */}
      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <span className="close">&times;</span>
          <img
            className="modal-content"
            src={selectedImage}
            alt="Imagem Expandida"
          />
        </div>
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
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default GerarExames;
