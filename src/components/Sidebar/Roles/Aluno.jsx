/* eslint-disable react/prop-types */
// Roles/Aluno.js

// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import {
  ClipboardList,
  Stethoscope,
  User,
  TestTube,
  MessageSquare,
  PlusCircle,
  Calendar,
  Clock,
  Edit3,
  ChevronDown,
} from "lucide-react";

// Importação dos componentes específicos do Aluno
import Ficha from "../../Aluno/Ficha";
import Exames from "../../Aluno/Exames";
import Resumo from "../../Aluno/FeedbackCori";
import FeedbackDocenteAluno from "../../Aluno/FeedbackDocente";
import Info from "../../Aluno/info";
import ConsultaInicial from "../../Aluno/ConsultaInicial";
import ConsultaDeVolta from "../../Aluno/ConsultaDeVolta";
import Agendamento from "../../Aluno/Agendamento";

const AlunoMenu = ({
  activeComponentKey,
  setActiveComponentKey,
  openMenus,
  setOpenMenus,
  inputId,
  setInputId,
  resetComponent,
  setSidebarOpen,
}) => {
  const [menuData] = useState([
    {
      key: "consultas",
      label: "Atendimentos",
      icon: <ClipboardList size={18} className="icon" />,
      submenus: [
        {
          type: "input",
          key: "inputId",
        },
        {
          key: "info",
          label: "Atendimentos",
          icon: <Stethoscope size={18} className="icon" />,
          component: <Info />,
        },
        {
          key: "paciente",
          label: "Pacientes",
          icon: <User size={18} className="icon" />,
          component: <Ficha />,
        },
        {
          key: "exames",
          label: "Exames",
          icon: <TestTube size={18} className="icon" />,
          component: <Exames />,
        },
        {
          key: "resumo",
          label: "Feedback Geral",
          icon: <MessageSquare size={18} className="icon" />,
          component: <Resumo />,
        },
        {
          key: "atendimento",
          label: "Feedback Docente",
          icon: <MessageSquare size={18} className="icon" />,
          component: <FeedbackDocenteAluno />,
        },
      ],
    },
    {
      key: "novoAtendimento",
      label: "Consultas",
      icon: <PlusCircle size={18} className="icon" />,
      submenus: [
        {
          key: "consultaInicial",
          label: "Consulta Inicial",
          icon: <Calendar size={18} className="icon" />,
          component: <ConsultaInicial />,
        },
        {
          key: "consultaDeVolta",
          label: "Retorno Paciente",
          icon: <Clock size={18} className="icon" />,
          component: <ConsultaDeVolta />,
        },
        {
          key: "agendamento",
          label: "Agendamento",
          icon: <Edit3 size={18} className="icon" />,
          component: <Agendamento />,
          onClick: () => resetComponent("agendamento"), // Será atualizado
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
                {menu.submenus.map((submenu) => {
                  if (submenu.key === "agendamento") {
                    return (
                      <button
                        key={submenu.key}
                        className={`menu-item ${
                          activeComponentKey === submenu.key ? "active" : ""
                        }`}
                        onClick={() => {
                          submenu.onClick(); // Chama resetComponent("agendamento")
                          setActiveComponentKey("agendamento"); // Atualiza o componente ativo
                          setSidebarOpen(false); // Fecha o sidebar no mobile após a seleção
                        }}
                      >
                        {submenu.icon}
                        <span>{submenu.label}</span>
                      </button>
                    );
                  } else {
                    return submenu.type !== "input" ? (
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
                    ) : null;
                  }
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export const getAlunoActiveComponent = (activeComponentKey) => {
  const componentsMap = {
    info: <Info />,
    paciente: <Ficha />,
    exames: <Exames />,
    resumo: <Resumo />,
    atendimento: <FeedbackDocenteAluno />,
    consultaInicial: <ConsultaInicial />,
    consultaDeVolta: <ConsultaDeVolta />,
    agendamento: <Agendamento />,
  };

  return componentsMap[activeComponentKey] || null;
};

export default AlunoMenu;
