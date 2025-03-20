// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import MarkdownIt from "markdown-it";
import { MessageSquare } from "lucide-react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import "../../styles/Cori/GerarFeedbackCori.css";

const mdParser = new MarkdownIt();

const FeedbackForm = () => {
  const [studentId, setStudentId] = useState("");
  const [studentFBId, setStudentFBId] = useState("");
  const [isIdValid, setIsIdValid] = useState(false);
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [studentData, setStudentData] = useState(null);

  const handleStudentIdChange = (e) => {
    setStudentId(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      validateAndLoadStudentResponses(studentId);
    }
  };

  const validateAndLoadStudentResponses = (id) => {
    const options = {
      method: "GET",
      headers: {
        "User-Agent": "insomnia/10.3.0",
        Authorization: "Bearer oat_Ng.ei11cmtKMTBoMjhFaDM2bW1USWcwbU5hUlhLblZxZTIxMW1wbERHSTI5NzMxNTIwODY",
      },
    };

    fetch("https://back-end-cori-feedbacks-node.opatj4.easypanel.host/teachers/accompaniment", options)
      .then((response) => response.json())
      .then((data) => {
        const foundStudent = data.find((item) => item.uuid === id);
        if (foundStudent) {
          setIsIdValid(true);
          setStudentData(foundStudent);
          setStudentFBId(foundStudent.user.uuid);
          console.log(studentFBId);
        } else {
          setIsIdValid(false);
          alert("ID do Atendimento inválido. Por favor, insira o ID correto.");
        }
      })
      .catch((err) => console.error(err));
  };

  const handleStrengthsChange = ({ text }) => {
    setStrengths(text);
  };

  const handleImprovementsChange = ({ text }) => {
    setImprovements(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        weaknesses: improvements,
        strengths: strengths,
      }),
    };

    fetch(`https://back-end-cori-feedbacks-node.opatj4.easypanel.host/cori/feedbacks/${studentFBId}`, options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  };

  return (
    <div className="feedback-form-container">
      <h2 className="title">
        <MessageSquare color="#FF0F68" size={24} /> <strong>Gerar Feedback</strong>
      </h2>

      <div className="form-group">
        <label htmlFor="studentId">ID do Atendimento:</label>
        <input
          id="studentId"
          type="text"
          value={studentId}
          onChange={handleStudentIdChange}
          onKeyDown={handleKeyPress}
          placeholder="Digite o ID do Atendimento"
          required
        />
      </div>

      {isIdValid && studentData && (
        <>
          <div className="student-responses">
            <h2>Respostas do Atendimento</h2>
            <p><strong>ID do Atendimento:</strong> {studentData.uuid}</p>
            <p><strong>ID do Aluno:</strong> {studentData.user.uuid}</p>
            <p><strong>Nome do Aluno:</strong> {studentData.user.fullName}</p>
            <p><strong>E-mail do Aluno:</strong> {studentData.user.email}</p>
            {studentData.studentService && studentData.studentService.length > 0 ? (
              studentData.studentService.map((service, index) => (
                <div key={index}>
                  <p><strong>Histórico de Medicações:</strong> {service.medication}</p>
                  <p><strong>Histórico Familiar:</strong> {service.familyHistory}</p>
                  <p><strong>Histórico Médico:</strong> {service.medicalHistory}</p>
                  <p><strong>Queixa Principal:</strong> {service.complaint}</p>
                  <p><strong>Exames Solicitados:</strong> {service.exams}</p>
                </div>
              ))
            ) : (
              <p>Nenhum dado de consulta encontrado para este atendimento.</p>
            )}
          </div>

          <form className="feedback-form" onSubmit={handleSubmit}>
            <h2>Formulário de Feedback</h2>

            <div className="form-group">
              <label>Pontos Fortes:</label>
              <MdEditor
                value={strengths}
                style={{ height: "300px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleStrengthsChange}
                view={{ menu: true, md: true, html: false }}
              />
            </div>

            <div className="form-group">
              <label>Pontos a Melhorar:</label>
              <MdEditor
                value={improvements}
                style={{ height: "300px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleImprovementsChange}
                view={{ menu: true, md: true, html: false }}
              />
            </div>

            <button type="submit" className="submit-button">
              Enviar Feedback
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default FeedbackForm;
