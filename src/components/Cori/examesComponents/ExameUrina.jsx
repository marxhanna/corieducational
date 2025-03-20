// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../../styles/Cori/examesComponents/ExameUrina.css";

const ExameUrina = ({ onDataChange }) => {
  const [data, setData] = useState({
    aspecto: "",
    ph: "",
    densidade: "",
    glicose: "",
    proteinas: "",
    cetonas: "",
    sangueOculto: "",
    leucocitos: "",
    hemacias: "",
  });

  const handleChange = (e) => {
    const newData = { ...data, [e.target.name]: e.target.value };
    setData(newData);
    onDataChange("exameUrina", newData);
  };

  return (
    <div className="exam-container">
      <h3>Exame de Urina (EAS)</h3>
      <table>
        <thead>
          <tr>
            <th>Parâmetro</th>
            <th>Resultado</th>
            <th>Valores Normais</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Aspecto</td>
            <td>
              <input
                type="text"
                name="aspecto"
                value={data.aspecto}
                onChange={handleChange}
                placeholder="Transparente, etc."
              />
            </td>
            <td>Transparente</td>
          </tr>
          <tr>
            <td>pH</td>
            <td>
              <input
                type="text"
                name="ph"
                value={data.ph}
                onChange={handleChange}
                placeholder=""
              />
            </td>
            <td>5,0 - 7,0</td>
          </tr>
          <tr>
            <td>Densidade</td>
            <td>
              <input
                type="text"
                name="densidade"
                value={data.densidade}
                onChange={handleChange}
                placeholder=""
              />
            </td>
            <td>1,003 - 1,030</td>
          </tr>
          <tr>
            <td>Glicose</td>
            <td>
              <input
                type="text"
                name="glicose"
                value={data.glicose}
                onChange={handleChange}
                placeholder="Negativo, Traços, etc."
              />
            </td>
            <td>Negativo</td>
          </tr>
          <tr>
            <td>Proteínas</td>
            <td>
              <input
                type="text"
                name="proteinas"
                value={data.proteinas}
                onChange={handleChange}
                placeholder="Negativo, Traços, etc."
              />
            </td>
            <td>Negativo</td>
          </tr>
          {/* Continue com os demais parâmetros */}
        </tbody>
      </table>
    </div>
  );
};

ExameUrina.propTypes = {
  onDataChange: PropTypes.func.isRequired,
};

export default ExameUrina;
