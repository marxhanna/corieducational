// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../../styles/Cori/examesComponents/TempoProtrombina.css";

const TempoProtrombina = ({ onDataChange }) => {
  const [data, setData] = useState({
    tp: "",
    inr: "",
  });

  const handleChange = (e) => {
    const newData = { ...data, [e.target.name]: e.target.value };
    setData(newData);
    onDataChange("tempoProtrombina", newData);
  };

  return (
    <div className="exam-container">
      <h3>Tempo de Protrombina (TP)</h3>
      <table>
        <thead>
          <tr>
            <th>Parâmetro</th>
            <th>Resultado</th>
            <th>Valores de Referência</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tempo de Protrombina (TP)</td>
            <td>
              <input
                type="text"
                name="tp"
                value={data.tp}
                onChange={handleChange}
                placeholder="Segundos"
              />
            </td>
            <td>10 - 14 segundos</td>
          </tr>
          <tr>
            <td>INR</td>
            <td>
              <input
                type="text"
                name="inr"
                value={data.inr}
                onChange={handleChange}
                placeholder=""
              />
            </td>
            <td>0,8 - 1,2</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

TempoProtrombina.propTypes = {
  onDataChange: PropTypes.func.isRequired,
};

export default TempoProtrombina;
