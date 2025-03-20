/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  HelpCircle,
  AlertCircle,
  Send,
  X,
  CheckCircle,
  Menu,
} from "lucide-react";
import "../../styles/Navbar.css";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [problemDescription, setProblemDescription] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dropdownRef = useRef(null);

  // Fechar o dropdown ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsSubmitted(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fechar o modal automaticamente após a submissão
  useEffect(() => {
    let timer;
    if (isSubmitted) {
      timer = setTimeout(() => {
        setIsDropdownOpen(false);
        setIsSubmitted(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isSubmitted]);

  const handleSendProblem = () => {
    // Lógica para enviar o relatório de problema
    console.log("Problema relatado:", {
      descricao: problemDescription,
      arquivos: attachedFiles,
    });
    // Limpar os campos e mostrar a confirmação
    setProblemDescription("");
    setAttachedFiles([]);
    setIsSubmitted(true);
  };

  // Manipulador para anexar arquivos
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setAttachedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Remover arquivo anexado
  const handleRemoveFile = (index) => {
    setAttachedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <nav className="navbar">
      {/* Lado esquerdo da navbar */}
      <div className="navbar-left">
        {/* Botão do menu hambúrguer para mobile */}
        <div
          className="burger-menu"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
      </div>

      {/* Ícones alinhados à direita */}
      <div className="navbar-right">
        <button className="navbar-icon-card">
          <Bell size={20} />
        </button>
        <div className="dropdown-container" ref={dropdownRef}>
          <button
            className={`navbar-icon-card ${isDropdownOpen ? "active" : ""}`}
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              setIsSubmitted(false);
            }}
          >
            <HelpCircle size={20} />
          </button>
          {isDropdownOpen && (
            <div className="dropdown-modal">
              {!isSubmitted ? (
                <>
                  <div className="modal-header">
                    <AlertCircle
                      size={24}
                      color="#FF0F68"
                      style={{ marginRight: "8px" }}
                    />
                    <h3>Relatar um Problema</h3>
                  </div>
                  <textarea
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Descreva o problema que você está enfrentando"
                  ></textarea>

                  <div className="attachment-section">
                    <label htmlFor="file-input" className="file-input-label">
                      Anexar Imagens
                      <input
                        id="file-input"
                        type="file"
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                        className="file-input"
                      />
                    </label>
                    <div className="file-preview">
                      {attachedFiles.map((file, index) => (
                        <div key={index} className="file-preview-item">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                          />
                          <button
                            className="remove-file-button"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <X size={16} color="#FF0F68" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="dropdown-buttons">
                    <button className="send-button" onClick={handleSendProblem}>
                      <Send size={16} style={{ marginRight: "6px" }} />
                      Enviar
                    </button>
                  </div>
                </>
              ) : (
                <div className="submission-confirmation">
                  <CheckCircle size={48} color="#28a745" />
                  <p>Enviado</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
