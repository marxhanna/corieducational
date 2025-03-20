/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// Roles/Ator.js

import React from "react";
import { Users, Calendar, Clock, FilePlus } from "lucide-react";

// Importação dos componentes específicos do Ator
import ConsultaInicialAtor from "../../Ator/ConsultaInicialAtor";
import ConsultaDeVoltaAtor from "../../Ator/ConsultaDeVoltaAtor";
import HistoricoAtor from "../../Ator/HistoricoAtor";
import FichaAtor from "../../Ator/FichaAtor";

const AtorMenu = ({
  activeComponentKey,
  setActiveComponentKey,
  setSidebarOpen,
}) => {
  const menuItems = [
    {
      key: "consultaInicialAtor",
      label: "Consulta Inicial",
      icon: <Calendar size={18} className="icon" />,
      component: <ConsultaInicialAtor />,
    },
    {
      key: "consultaDeVoltaAtor",
      label: "Consulta Retorno",
      icon: <Clock size={18} className="icon" />,
      component: <ConsultaDeVoltaAtor />,
    },
    {
      key: "fichaAtor",
      label: "Ficha Ator",
      icon: <FilePlus size={18} className="icon" />,
      component: <FichaAtor />,
    },
    {
      key: "historicoAtor",
      label: "Acompanhamento",
      icon: <Users size={18} className="icon" />,
      component: <HistoricoAtor />,
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

export const getAtorActiveComponent = (activeComponentKey) => {
  const componentsMap = {
    consultaInicialAtor: <ConsultaInicialAtor />,
    consultaDeVoltaAtor: <ConsultaDeVoltaAtor />,
    fichaAtor: <FichaAtor />,
    historicoAtor: <HistoricoAtor />,
  };

  return componentsMap[activeComponentKey] || null;
};

export default AtorMenu;
