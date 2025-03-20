/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// Roles/Professor.js

// eslint-disable-next-line no-unused-vars
// Roles/Professor.js

import React from "react";
import {
  FileText,
  Users,
  AlertCircle,
  Layout,
  ClipboardList,
} from "lucide-react";

// Importação dos componentes específicos do Professor
import FeedbackDocente from "../../Professor/FeedbackDocente";
import HistoricoAlunos from "../../Professor/HistoricoAlunos";
import SugestaoNovoCaso from "../../Professor/SugestaoCaso";
import GerarTarefa from "../../Professor/GerarTarefa";
import PoolCasos from "../../Professor/PoolCasos";

const ProfessorMenu = ({
  activeComponentKey,
  setActiveComponentKey,
  setSidebarOpen,
}) => {
  const menuItems = [
    {
      key: "feedbackDocente",
      label: "Feedback Docente",
      icon: <FileText size={18} className="icon" />,
      component: <FeedbackDocente />,
    },
    {
      key: "historicoAlunos",
      label: "Acompanhamento",
      icon: <Users size={18} className="icon" />,
      component: <HistoricoAlunos />,
    },

    {
      key: "poolCasos",
      label: "Casos Clínicos",
      icon: <Layout size={18} className="icon" />,
      component: <PoolCasos />,
    },
    {
      key: "gerarTarefa",
      label: "Tarefas",
      icon: <ClipboardList size={18} className="icon" />,
      component: <GerarTarefa />,
    },
  ];

  return (
    <>
      {menuItems.map((item) => (
        <button
          key={item.key}
          className={`menu-item ${
            activeComponentKey === item.key ? "active" : ""
          }`}
          onClick={() => {
            setActiveComponentKey(item.key);
            setSidebarOpen(false); // Fecha o sidebar no mobile após a seleção
          }}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </>
  );
};

export const getProfessorActiveComponent = (activeComponentKey) => {
  const componentsMap = {
    feedbackDocente: <FeedbackDocente />,
    historicoAlunos: <HistoricoAlunos />,
    sugestaoNovoCaso: <SugestaoNovoCaso />,
    poolCasos: <PoolCasos />,
    gerarTarefa: <GerarTarefa />,
  };

  return componentsMap[activeComponentKey] || null;
};

export default ProfessorMenu;
