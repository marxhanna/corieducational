// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../../styles/Cori/examesComponents/Ureia.css";

const Ureia = ({ onDataChange }) => {
  const [data, setData] = useState({
    ureia: "",
  });

  const handleChange = (e) => {
    const newData = { ...data, ureia: e.target.value };
    setData(newData);
    onDataChange("ureia", newData);
  };

  return (
    <div className="exam-container">
      <h3>Ureia</h3>
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
            <td>Ureia Sérica</td>
            <td>
              <input
                type="text"
                name="ureia"
                value={data.ureia}
                onChange={handleChange}
                placeholder="mg/dL"
              />
            </td>
            <td>15 - 45 mg/dL</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

Ureia.propTypes = {
  onDataChange: PropTypes.func.isRequired,
};

export default Ureia;
