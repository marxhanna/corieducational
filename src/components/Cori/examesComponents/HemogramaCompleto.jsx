// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types"; // Importando PropTypes
import "../../../styles/Cori/examesComponents/HemogramaCompleto.css";

const HemogramaCompleto = ({ onDataChange }) => {
  const [data, setData] = useState({
    // Leucograma
    leucocitosTotais: "",
    neutrofilos: "",
    segmentados: "",
    bastonetes: "",
    linfocitos: "",
    monocitos: "",
    eosinofilos: "",
    basofilos: "",
    // Eritrograma
    hemoglobina: "",
    hematocrito: "",
    hemacias: "",
    vcm: "",
    hcm: "",
    chcm: "",
    // Plaquetas
    plaquetas: "",
    vpm: "",
  });

  const handleChange = (e) => {
    const newData = { ...data, [e.target.name]: e.target.value };
    setData(newData);
    onDataChange("hemogramaCompleto", newData);
  };

  return (
    <div className="exam-container">
      <h3>Hemograma Completo</h3>
      <h4>Leucograma</h4>
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
            <td>Leucócitos totais</td>
            <td>
              <input
                type="text"
                name="leucocitosTotais"
                value={data.leucocitosTotais}
                onChange={handleChange}
              />
            </td>
            <td>4.000 - 10.000/mm³</td>
          </tr>
          <tr>
            <td>Neutrófilos</td>
            <td>
              <input
                type="text"
                name="neutrofilos"
                value={data.neutrofilos}
                onChange={handleChange}
              />
            </td>
            <td>40 - 70%</td>
          </tr>
          <tr>
            <td>Segmentados</td>
            <td>
              <input
                type="text"
                name="segmentados"
                value={data.segmentados}
                onChange={handleChange}
              />
            </td>
            <td>50 - 65%</td>
          </tr>
          <tr>
            <td>Bastonetes</td>
            <td>
              <input
                type="text"
                name="bastonetes"
                value={data.bastonetes}
                onChange={handleChange}
              />
            </td>
            <td>0 - 5%</td>
          </tr>
          <tr>
            <td>Linfócitos</td>
            <td>
              <input
                type="text"
                name="linfocitos"
                value={data.linfocitos}
                onChange={handleChange}
              />
            </td>
            <td>20 - 45%</td>
          </tr>
          <tr>
            <td>Monócitos</td>
            <td>
              <input
                type="text"
                name="monocitos"
                value={data.monocitos}
                onChange={handleChange}
              />
            </td>
            <td>2 - 10%</td>
          </tr>
          <tr>
            <td>Eosinófilos</td>
            <td>
              <input
                type="text"
                name="eosinofilos"
                value={data.eosinofilos}
                onChange={handleChange}
              />
            </td>
            <td>1 - 6%</td>
          </tr>
          <tr>
            <td>Basófilos</td>
            <td>
              <input
                type="text"
                name="basofilos"
                value={data.basofilos}
                onChange={handleChange}
              />
            </td>
            <td>0 - 2%</td>
          </tr>
        </tbody>
      </table>

      <h4>Eritrograma</h4>
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
            <td>Hemoglobina (Hb)</td>
            <td>
              <input
                type="text"
                name="hemoglobina"
                value={data.hemoglobina}
                onChange={handleChange}
              />
            </td>
            <td>13 - 17 g/dL</td>
          </tr>
          <tr>
            <td>Hematócrito (Ht)</td>
            <td>
              <input
                type="text"
                name="hematocrito"
                value={data.hematocrito}
                onChange={handleChange}
              />
            </td>
            <td>40 - 50%</td>
          </tr>
          <tr>
            <td>Hemácias</td>
            <td>
              <input
                type="text"
                name="hemacias"
                value={data.hemacias}
                onChange={handleChange}
              />
            </td>
            <td>4,5 - 6,0 milhões/mm³</td>
          </tr>
          <tr>
            <td>VCM</td>
            <td>
              <input
                type="text"
                name="vcm"
                value={data.vcm}
                onChange={handleChange}
              />
            </td>
            <td>80 - 100 fL</td>
          </tr>
          <tr>
            <td>HCM</td>
            <td>
              <input
                type="text"
                name="hcm"
                value={data.hcm}
                onChange={handleChange}
              />
            </td>
            <td>27 - 31 pg/célula</td>
          </tr>
          <tr>
            <td>CHCM</td>
            <td>
              <input
                type="text"
                name="chcm"
                value={data.chcm}
                onChange={handleChange}
              />
            </td>
            <td>32 - 36 g/dL</td>
          </tr>
        </tbody>
      </table>

      <h4>Plaquetas</h4>
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
            <td>Contagem de plaquetas</td>
            <td>
              <input
                type="text"
                name="plaquetas"
                value={data.plaquetas}
                onChange={handleChange}
              />
            </td>
            <td>150.000 - 450.000/mm³</td>
          </tr>
          <tr>
            <td>Volume plaquetário médio (VPM)</td>
            <td>
              <input
                type="text"
                name="vpm"
                value={data.vpm}
                onChange={handleChange}
              />
            </td>
            <td>7 - 11 fL</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// Adicionando a validação de props
HemogramaCompleto.propTypes = {
  onDataChange: PropTypes.func.isRequired,
};

export default HemogramaCompleto;
