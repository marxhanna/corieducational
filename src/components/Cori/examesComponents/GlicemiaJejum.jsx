/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../../styles/Cori/examesComponents/GlicemiaJejum.css";

const GlicemiaJejum = ({ onDataChange }) => {
  const [data, setData] = useState({
    glicemia: "",
  });

  const handleChange = (e) => {
    const newData = { ...data, glicemia: e.target.value };
    setData(newData);
    onDataChange("glicemiaJejum", newData);
  };

  return (
    <div className="exam-container">
      <h3>Glicemia de Jejum</h3>
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
            <td>Glicemia</td>
            <td>
              <input
                type="text"
                name="glicemia"
                value={data.glicemia}
                onChange={handleChange}
                placeholder="mg/dL"
              />
            </td>
            <td>70 - 99 mg/dL</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

GlicemiaJejum.propTypes = {
  onDataChange: PropTypes.func.isRequired,
};

export default GlicemiaJejum;
