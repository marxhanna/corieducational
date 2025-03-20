/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Sidebar/navbar"; // Certifique-se de que o caminho para o Navbar está correto
import "./styles/alunoReview.css";

// Importação das funções para obter os componentes ativos
import { getAlunoActiveComponent } from "./components/Sidebar/Roles/Aluno";
import { getAtorActiveComponent } from "./components/Sidebar/Roles/Ator";
import { getCoriActiveComponent } from "./components/Sidebar/Roles/Cori";
import { getCoordenadorActiveComponent } from "./components/Sidebar/Roles/Coordenador";
import { getProfessorActiveComponent } from "./components/Sidebar/Roles/Professor";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Estudante");
  const [activeComponentKey, setActiveComponentKey] = useState("paciente");
  const [openMenus, setOpenMenus] = useState({});

  // Função para renderizar o componente ativo
  const renderActiveComponent = () => {
    switch (selectedRole) {
      case "Estudante":
        return getAlunoActiveComponent(activeComponentKey);
      case "Ator":
        return getAtorActiveComponent(activeComponentKey);
      case "Cori":
        return getCoriActiveComponent(activeComponentKey);
      case "Coordenador":
        return getCoordenadorActiveComponent(activeComponentKey);
      case "Professor":
        return getProfessorActiveComponent(activeComponentKey);
      default:
        return null;
    }
  };

  return (
    <div className="app-layout">
      {/* Navbar */}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        activeComponentKey={activeComponentKey}
        setActiveComponentKey={setActiveComponentKey}
        openMenus={openMenus}
        setOpenMenus={setOpenMenus}
      />

      {/* Main Content */}
      <div className="content-container">{renderActiveComponent()}</div>
    </div>
  );
};

export default App;
