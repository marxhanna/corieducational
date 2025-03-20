// src/components/Toast/Toast.jsx
// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/Sidebar/Toast"; // Importando o CSS específico para o Toast

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    // Auto-fechar o Toast após 3 segundos
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    // Limpeza do timer quando o componente é desmontado
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <span className="toast-message">{message}</span>
      <button className="toast-close-button" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error"]).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Toast;
