/* eslint-disable react/prop-types */
// Roles/Coordenador.js

// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Settings, FileText, Users, Book, ChevronDown } from "lucide-react";

// Importação dos componentes específicos do Coordenador
import FeedbackDocente from "../../Professor/FeedbackDocente";
import HistoricoAlunos from "../../Professor/HistoricoAlunos";

const CoordenadorMenu = ({
  activeComponentKey,
  setActiveComponentKey,
  openMenus,
  setOpenMenus,
  setSidebarOpen,
}) => {
  const [menuData] = useState([
    {
      key: "coordenador",
      label: "Coordenador",
      icon: <Settings size={18} className="icon" />,
      submenus: [
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
      ],
    },
    {
      key: "professor",
      label: "Professor",
      icon: <Book size={18} className="icon" />,
      submenus: [
        {
          key: "feedbackDocenteProfessor",
          label: "Feedback Docente",
          icon: <FileText size={18} className="icon" />,
          component: <FeedbackDocente />,
        },
        {
          key: "historicoAlunosProfessor",
          label: "Acompanhamento",
          icon: <Users size={18} className="icon" />,
          component: <HistoricoAlunos />,
        },
      ],
    },
  ]);

  // Função para alternar a abertura dos menus
  const toggleMenu = (menuKey) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [menuKey]: !prevState[menuKey],
    }));
  };

  return (
    <>
      {menuData.map((menu) => (
        <div key={menu.key}>
          {/* Botão principal do menu */}
          <button
            className={`menu-item ${openMenus[menu.key] ? "active" : ""}`}
            onClick={() => toggleMenu(menu.key)}
          >
            {menu.icon}
            <span>{menu.label}</span>
            <ChevronDown
              size={18}
              className={`arrow-icon ${openMenus[menu.key] ? "open" : ""}`}
            />
          </button>

          {/* Dropdown do menu */}
          {openMenus[menu.key] && menu.submenus && (
            <div className="dropdown">
              <div className="submenu">
                {menu.submenus.map((submenu) => (
                  <button
                    key={submenu.key}
                    className={`menu-item ${
                      activeComponentKey === submenu.key ? "active" : ""
                    }`}
                    onClick={() => {
                      setActiveComponentKey(submenu.key);
                      setSidebarOpen(false); // Fecha o sidebar no mobile após a seleção
                    }}
                  >
                    {submenu.icon}
                    <span>{submenu.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export const getCoordenadorActiveComponent = (activeComponentKey) => {
  const componentsMap = {
    feedbackDocente: <FeedbackDocente />,
    historicoAlunos: <HistoricoAlunos />,
    feedbackDocenteProfessor: <FeedbackDocente />,
    historicoAlunosProfessor: <HistoricoAlunos />,
  };

  return componentsMap[activeComponentKey] || null;
};

export default CoordenadorMenu;
