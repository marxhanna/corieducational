// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../../styles/Cori/examesComponents/TSH.css";

const TSH = ({ onDataChange }) => {
  const [data, setData] = useState({
    tsh: "",
  });

  const handleChange = (e) => {
    const newData = { ...data, tsh: e.target.value };
    setData(newData);
    onDataChange("tsh", newData);
  };

  return (
    <div className="exam-container">
      <h3>TSH (Hormônio Estimulante da Tireoide)</h3>
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
            <td>TSH</td>
            <td>
              <input
                type="text"
                name="tsh"
                value={data.tsh}
                onChange={handleChange}
                placeholder="μUI/mL"
              />
            </td>
            <td>0,4 - 4,0 μUI/mL</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

TSH.propTypes = {
  onDataChange: PropTypes.func.isRequired,
};

export default TSH;
