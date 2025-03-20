/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ChevronsUpDown, Check, ChevronLeft } from "lucide-react";
import "../../styles/Sidebar.css";
import * as Avatar from "@radix-ui/react-avatar";

// Importação dos avatares
import AvatarCori from "../../assets/images/cori.png";
import AvatarProfessor from "../../assets/images/professor.png";
import AvatarAtor from "../../assets/images/ator.png";
import AvatarCoordenador from "../../assets/images/coordenador.png";
import AvatarAluno from "../../assets/images/aluno.png";
import AvatarUniversidade from "../../assets/images/pucpr.webp";

// Importação dos componentes de menu
import AlunoMenu from "./Roles/Aluno";
import AtorMenu from "./Roles/Ator";
import CoriMenu from "./Roles/Cori";
import CoordenadorMenu from "./Roles/Coordenador";
import ProfessorMenu from "./Roles/Professor";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  selectedRole,
  setSelectedRole,
  activeComponentKey,
  setActiveComponentKey,
  openMenus,
  setOpenMenus,
}) => {
  // Mapeamento de roles para avatares
  const roleAvatars = {
    Estudante: AvatarUniversidade,
    Cori: AvatarUniversidade,
    Professor: AvatarUniversidade,
    Ator: AvatarUniversidade,
    Coordenador: AvatarUniversidade,
  };

  // Roles disponíveis para seleção
  const availableRoles = ["Cori", "Professor", "Ator", "Estudante"];

  // Estado para exibição do dropdown de troca de "role"
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Estado para inputId e setInputId
  const [inputId, setInputId] = useState("");

  // Função para resetar componentes
  const resetComponent = (key) => {
    console.log(`Resetando o componente: ${key}`);
    if (key === "agendamento") {
      setInputId("");
    }
    // Adicione outras lógicas de reset conforme necessário
  };

  // Função para alternar o dropdown de troca de role
  const toggleRoleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Função para selecionar um novo role
  const handleRoleSelect = (role) => {
    setIsDropdownOpen(false); // Fecha o dropdown
    setSelectedRole(role); // Atualiza o role selecionado
    setActiveComponentKey(null); // Reseta o componente ativo
    setOpenMenus({}); // Reseta os menus abertos
  };

  // Função para renderizar o menu de acordo com o role
  const renderRoleMenu = () => {
    switch (selectedRole) {
      case "Estudante":
        return (
          <AlunoMenu
            activeComponentKey={activeComponentKey}
            setActiveComponentKey={setActiveComponentKey}
            openMenus={openMenus}
            setOpenMenus={setOpenMenus}
            inputId={inputId}
            setInputId={setInputId}
            resetComponent={resetComponent}
            setSidebarOpen={setSidebarOpen}
          />
        );
      case "Ator":
        return (
          <AtorMenu
            activeComponentKey={activeComponentKey}
            setActiveComponentKey={setActiveComponentKey}
            openMenus={openMenus}
            setOpenMenus={setOpenMenus}
            setSidebarOpen={setSidebarOpen}
          />
        );
      case "Cori":
        return (
          <CoriMenu
            activeComponentKey={activeComponentKey}
            setActiveComponentKey={setActiveComponentKey}
            openMenus={openMenus}
            setOpenMenus={setOpenMenus}
            setSidebarOpen={setSidebarOpen}
          />
        );
      case "Professor":
        return (
          <ProfessorMenu
            activeComponentKey={activeComponentKey}
            setActiveComponentKey={setActiveComponentKey}
            openMenus={openMenus}
            setOpenMenus={setOpenMenus}
            setSidebarOpen={setSidebarOpen}
          />
        );
      case "Coordenador":
        return (
          <CoordenadorMenu
            activeComponentKey={activeComponentKey}
            setActiveComponentKey={setActiveComponentKey}
            openMenus={openMenus}
            setOpenMenus={setOpenMenus}
            setSidebarOpen={setSidebarOpen}
          />
        );
      default:
        return null;
    }
  };

  // Fechar a sidebar ao clicar fora (no overlay)
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sidebarOpen && !event.target.closest(".sidebar")) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [sidebarOpen, setSidebarOpen]);

  const [userName, setUserName] = useState("");

  const options = {
    method: 'GET',
    headers: {
      'User-Agent': 'insomnia/10.2.0',
      Authorization: 'Bearer oat_Ng.ei11cmtKMTBoMjhFaDM2bW1USWcwbU5hUlhLblZxZTIxMW1wbERHSTI5NzMxNTIwODY'
    }
  };
  
  fetch('https://back-end-cori-feedbacks-node.opatj4.easypanel.host/users/basics', options)
    .then(response => response.json())
    .then(response => setUserName(response.fullName))
    .catch(err => console.error(err));

  return (
    <>
      {/* Overlay para o menu mobile */}
      {sidebarOpen && (
        <div
          className="overlay visible"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo e avatar */}
        <div className="logo-container" onClick={toggleRoleDropdown}>
          <div className="logo-content">
            <Avatar.Root className="AvatarRoot">
              <Avatar.Image
                className="AvatarImage"
                src={roleAvatars[selectedRole]}
                alt={selectedRole}
              />
              <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                {selectedRole[0]}
              </Avatar.Fallback>
            </Avatar.Root>

            <div className="roleAvatar">
              <p>
                <strong>{selectedRole}</strong>
              </p>
              <p className="usuario">{userName}</p>
            </div>

            <div className={`chevron ${isDropdownOpen ? "open" : ""}`}>
              <ChevronsUpDown />
            </div>
          </div>
        </div>

        {/* Dropdown para troca de role */}
        {isDropdownOpen && (
          <div className="dropdown-role">
            {availableRoles
              .filter((role) => role !== selectedRole) // Exclui o role ativo
              .map((role) => (
                <div
                  className="role-option"
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                >
                  <Avatar.Root className="AvatarRoot">
                    <Avatar.Image
                      className="AvatarImage"
                      src={roleAvatars[role]}
                      alt={role}
                    />
                  </Avatar.Root>
                  <span>
                    <strong>{role}</strong>
                  </span>
                  {selectedRole === role && (
                    <Check size={16} className="check-icon" />
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Menu */}
        <nav className="menu">{renderRoleMenu()}</nav>
      </div>
    </>
  );
};

export default Sidebar;
