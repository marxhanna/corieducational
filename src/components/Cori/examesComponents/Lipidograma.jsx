// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../../styles/Cori/examesComponents/Lipidograma.css";

const Lipidograma = ({ onDataChange }) => {
  const [data, setData] = useState({
    colesterolTotal: "",
    hdl: "",
    ldl: "",
    vldl: "",
    triglicerideos: "",
  });

  const handleChange = (e) => {
    const newData = { ...data, [e.target.name]: e.target.value };
    setData(newData);
    onDataChange("lipidograma", newData);
  };

  return (
    <div className="exam-container">
      <h3>Lipidograma</h3>
      <table>
        <thead>
          <tr>
            <th>Parâmetro</th>
            <th>Resultado</th>
            <th>Valores Desejáveis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Colesterol Total</td>
            <td>
              <input
                type="text"
                name="colesterolTotal"
                value={data.colesterolTotal}
                onChange={handleChange}
                placeholder="mg/dL"
              />
            </td>
            <td>&lt; 200 mg/dL</td>
          </tr>
          <tr>
            <td>HDL Colesterol</td>
            <td>
              <input
                type="text"
                name="hdl"
                value={data.hdl}
                onChange={handleChange}
                placeholder="mg/dL"
              />
            </td>
            <td>&gt; 40 mg/dL</td>
          </tr>
          <tr>
            <td>LDL Colesterol</td>
            <td>
              <input
                type="text"
                name="ldl"
                value={data.ldl}
                onChange={handleChange}
                placeholder="mg/dL"
              />
            </td>
            <td>&lt; 130 mg/dL</td>
          </tr>
          <tr>
            <td>VLDL Colesterol</td>
            <td>
              <input
                type="text"
                name="vldl"
                value={data.vldl}
                onChange={handleChange}
                placeholder="mg/dL"
              />
            </td>
            <td>5 - 40 mg/dL</td>
          </tr>
          <tr>
            <td>Triglicerídeos</td>
            <td>
              <input
                type="text"
                name="triglicerideos"
                value={data.triglicerideos}
                onChange={handleChange}
                placeholder="mg/dL"
              />
            </td>
            <td>&lt; 150 mg/dL</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

Lipidograma.propTypes = {
  onDataChange: PropTypes.func.isRequired,
};

export default Lipidograma;
