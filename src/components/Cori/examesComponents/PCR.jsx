// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../../styles/Cori/examesComponents/PCR.css";

const PCR = ({ onDataChange }) => {
  const [data, setData] = useState({
    pcr: "",
  });

  const handleChange = (e) => {
    const newData = { ...data, pcr: e.target.value };
    setData(newData);
    onDataChange("pcr", newData);
  };

  return (
    <div className="exam-container">
      <h3>PCR (Proteína C Reativa)</h3>
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
            <td>PCR</td>
            <td>
              <input
                type="text"
                name="pcr"
                value={data.pcr}
                onChange={handleChange}
                placeholder="mg/L"
              />
            </td>
            <td>&lt; 3 mg/L</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

PCR.propTypes = {
  onDataChange: PropTypes.func.isRequired,
};

export default PCR;
