// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../../styles/Cori/examesComponents/Creatinina.css";

const Creatinina = ({ onDataChange }) => {
  const [data, setData] = useState({
    creatinina: "",
  });

  const handleChange = (e) => {
    const newData = { ...data, creatinina: e.target.value };
    setData(newData);
    onDataChange("creatinina", newData);
  };

  return (
    <div className="exam-container">
      <h3>Creatinina</h3>
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
            <td>Creatinina Sérica</td>
            <td>
              <input
                type="text"
                name="creatinina"
                value={data.creatinina}
                onChange={handleChange}
                placeholder="mg/dL"
              />
            </td>
            <td>0,6 - 1,3 mg/dL</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

Creatinina.propTypes = {
  onDataChange: PropTypes.func.isRequired,
};

export default Creatinina;
