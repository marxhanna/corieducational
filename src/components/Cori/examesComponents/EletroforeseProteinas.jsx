// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../../styles/Cori/examesComponents/EletroforeseProteinas.css";

const EletroforeseProteinas = ({ onDataChange }) => {
  const [data, setData] = useState({
    albumina: "",
    alfa1Globulina: "",
    alfa2Globulina: "",
    betaGlobulina: "",
    gamaGlobulina: "",
  });

  const handleChange = (e) => {
    const newData = { ...data, [e.target.name]: e.target.value };
    setData(newData);
    onDataChange("eletroforeseProteinas", newData);
  };

  return (
    <div className="exam-container">
      <h3>Eletroforese de Proteínas</h3>
      <table>
        <thead>
          <tr>
            <th>Fração</th>
            <th>Resultado</th>
            <th>Valores de Referência (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Albumina</td>
            <td>
              <input
                type="text"
                name="albumina"
                value={data.albumina}
                onChange={handleChange}
                placeholder="%"
              />
            </td>
            <td>53 - 65%</td>
          </tr>
          <tr>
            <td>Alfa 1-Globulina</td>
            <td>
              <input
                type="text"
                name="alfa1Globulina"
                value={data.alfa1Globulina}
                onChange={handleChange}
                placeholder="%"
              />
            </td>
            <td>2 - 5%</td>
          </tr>
          <tr>
            <td>Alfa 2-Globulina</td>
            <td>
              <input
                type="text"
                name="alfa2Globulina"
                value={data.alfa2Globulina}
                onChange={handleChange}
                placeholder="%"
              />
            </td>
            <td>7 - 13%</td>
          </tr>
          <tr>
            <td>Beta Globulina</td>
            <td>
              <input
                type="text"
                name="betaGlobulina"
                value={data.betaGlobulina}
                onChange={handleChange}
                placeholder="%"
              />
            </td>
            <td>8 - 14%</td>
          </tr>
          <tr>
            <td>Gama Globulina</td>
            <td>
              <input
                type="text"
                name="gamaGlobulina"
                value={data.gamaGlobulina}
                onChange={handleChange}
                placeholder="%"
              />
            </td>
            <td>12 - 22%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

EletroforeseProteinas.propTypes = {
  onDataChange: PropTypes.func.isRequired,
};

export default EletroforeseProteinas;
