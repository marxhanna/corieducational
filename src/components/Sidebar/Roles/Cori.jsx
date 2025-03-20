/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// Roles/Cori.js

// Roles/Cori.js

import React from "react";
import {
  MessageSquare,
  TestTube,
  UserCheck,
  FilePlus,
  ChartBar,
  PlusCircle,
} from "lucide-react";

// Importação dos componentes específicos do Cori
import GerarFeedbackCori from "../../Cori/GerarFeedbackCori";
import GerarExames from "../../Cori/GerarExames";
import GerarFichaAtor from "../../Cori/GerarFichaAtor";
import GerarFichaPaciente from "../../Cori/GerarFichaPaciente";
import RelatorioCori from "../../Cori/RelatorioCori";
import CadastroCaso from "../../Cori/CadastroCaso";

const CoriMenu = ({
  activeComponentKey,
  setActiveComponentKey,
  setSidebarOpen,
}) => {
  const menuItems = [
    {
      key: "gerarFeedbackCori",
      label: "Feedback",
      icon: <MessageSquare size={18} className="icon" />,
      component: <GerarFeedbackCori />,
    },
    {
      key: "gerarExames",
      label: "Exames",
      icon: <TestTube size={18} className="icon" />,
      component: <GerarExames />,
    },
    {
      key: "gerarFichaAtor",
      label: "Ficha Ator",
      icon: <UserCheck size={18} className="icon" />,
      component: <GerarFichaAtor />,
    },
    {
      key: "gerarFichaPaciente",
      label: "Ficha Paciente",
      icon: <FilePlus size={18} className="icon" />,
      component: <GerarFichaPaciente />,
    },
    {
      key: "relatorioCori",
      label: "Relatório",
      icon: <ChartBar size={18} className="icon" />,
      component: <RelatorioCori />,
    },
    {
      key: "cadastroCaso",
      label: "Cadastro Caso",
      icon: <PlusCircle size={18} className="icon" />,
      component: <CadastroCaso />,
    },
  ];

  return (
    <>
      {menuItems.map((item) => (
        <button
          key={item.key}
          className={`menu-item ${activeComponentKey === item.key ? "active" : ""}`}
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

export const getCoriActiveComponent = (activeComponentKey) => {
  const componentsMap = {
    gerarFeedbackCori: <GerarFeedbackCori />,
    gerarExames: <GerarExames />,
    gerarFichaAtor: <GerarFichaAtor />,
    gerarFichaPaciente: <GerarFichaPaciente />,
    relatorioCori: <RelatorioCori />,
    cadastroCaso: <CadastroCaso />,
  };

  return componentsMap[activeComponentKey] || null;
};

export default CoriMenu;
