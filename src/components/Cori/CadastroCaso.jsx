/* src/components/CardWithTextarea.jsx */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Send, PlusCircle } from "lucide-react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import "../../styles/Cori/CadastroCaso.css";

// (Opcional) Se quiser deixar o token fixo aqui apenas para teste
const BEARER_TOKEN =
  "oat_NQ.N1FxRE9DQTQ1Q19hNTE1SVBEaGtTZlRPYm1VT3gwR0NsUDVhRThYODMzMzAxMDg0Mw";

const mdParser = new MarkdownIt();

const CardWithTextarea = () => {
  // Estado que guardará a lista de disciplinas vindas do GET
  const [disciplinas, setDisciplinas] = useState([]);

  // Estado que guardará qual disciplina (uuid) está selecionada no <select>
  const [selectedDisciplinaUuid, setSelectedDisciplinaUuid] = useState("");

  // Estado para o resumo do caso
  const [resumo, setResumo] = useState("");

  // Estado para o texto em Markdown completo
  const [inputValue, setInputValue] = useState("");

  // Estado para o Toast de sucesso/erro
  const [toast, setToast] = useState(null);

  // 1. Buscar disciplinas na montagem do componente (GET)
  useEffect(() => {
    const url =
      "https://back-end-cori-feedbacks-node.opatj4.easypanel.host/cori/discipline";

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Se o backend exige token, inclua aqui:
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Disciplinas recebidas:", data);
        setDisciplinas(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar disciplinas:", err);
        setToast({
          message: `Erro ao carregar disciplinas: ${err.message}`,
          type: "error",
        });
      });
  }, []);

  // 2. Lógica do <select> para escolher a disciplina
  const handleDisciplinaChange = (e) => {
    setSelectedDisciplinaUuid(e.target.value);
  };

  // 3. Lógica do resumo do caso
  const handleResumoChange = (e) => {
    setResumo(e.target.value);
  };

  // 4. Lógica do editor de texto Markdown
  const handleInputChange = ({ text }) => {
    setInputValue(text);
  };

  // 5. Envio do caso (POST)
  const handleSubmit = () => {
    console.log("Enviando caso...");
    console.log("Discipline UUID selecionada:", selectedDisciplinaUuid);
    console.log("Resumo do Caso:", resumo);
    console.log("Texto completo (Markdown):", inputValue);

    const postUrl =
      "https://back-end-cori-feedbacks-node.opatj4.easypanel.host/cori/case";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Novamente, inclua o token, se necessário
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      body: JSON.stringify({
        description: inputValue, // Texto do caso em Markdown
        resume: resumo, // Resumo do caso
        disciplineUuid: selectedDisciplinaUuid, // UUID da disciplina selecionada
      }),
    };

    fetch(postUrl, options)
      .then((response) => {
        console.log("Status do POST:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Resposta da API (POST caso):", data);

        if (!data || data.error) {
          throw new Error(data?.error || "Erro desconhecido no envio do caso");
        }

        setToast({
          message: "Caso enviado com sucesso!",
          type: "success",
        });

        // Resetar os campos após sucesso
        setSelectedDisciplinaUuid("");
        setResumo("");
        setInputValue("");
      })
      .catch((err) => {
        console.error("Erro ao enviar o caso:", err);
        setToast({
          message: "Ocorreu um erro ao enviar o caso. Tente novamente.",
          type: "error",
        });
      });
  };

  // 6. Toast (mensagem de sucesso/erro)
  const closeToast = () => {
    setToast(null);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        closeToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="card-container">
      <div className="card">
        <h2 className="title">
          <PlusCircle color="#FF0F68" size={24} />{" "}
          <strong>Gerar Novo Caso</strong>
        </h2>

        {/* Seletor de Disciplinas */}
        <div className="form-group">
          <label htmlFor="discipline">Disciplina</label>
          <select
            id="discipline"
            value={selectedDisciplinaUuid}
            onChange={handleDisciplinaChange}
            className="input-disciplina"
          >
            {/* Placeholder */}
            <option value="">Selecione uma disciplina...</option>

            {disciplinas.map((disc) => (
              <option key={disc.uuid} value={disc.uuid}>
                {disc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Área de texto para o resumo do caso */}
        <div className="resumo-caso">
          <textarea
            id="resumo"
            value={resumo}
            onChange={handleResumoChange}
            placeholder="Cole o resumo do caso aqui..."
            className="textarea-resumo"
            rows="4"
          />
        </div>
        <br />

        {/* Editor Markdown para o texto completo */}
        <div className="markdown-editor">
          <MdEditor
            value={inputValue}
            style={{ height: "300px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleInputChange}
            view={{ menu: true, md: true, html: false }}
            placeholder="Digite o texto do caso completo aqui..."
          />
        </div>

        <button className="send-button" onClick={handleSubmit}>
          <Send size={16} /> Enviar Caso
        </button>
      </div>

      {/* Renderizar o Toast se existir */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close-button" onClick={closeToast}>
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default CardWithTextarea;
