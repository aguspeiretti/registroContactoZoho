import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const EditableTable = ({ initialData, onTableDataChange }) => {
  const [data, setData] = useState(initialData);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    getFields();
  }, []);

  const getFields = (entrity) => {
    return new Promise(function (resolve, reject) {
      window.ZOHO.CRM.META.getFields({ Entity: "Recontactos" })
        .then(function (response) {
          setFields(response.fields);
          console.log(fields);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  };

  // funcion para traer los campos desplegables y filtrarlos

  const getFieldValues = (fields, apiName) => {
    const field = fields.find((item) => item.api_name === apiName);
    return field ? field.pick_list_values || [] : [];
  };
  const Estado_del_cliente = getFieldValues(fields, "Estado_del_cliente");
  const Peligro_respecto_a_baja = getFieldValues(
    fields,
    "Peligro_respecto_a_baja"
  );
  const A_la_espera_de = getFieldValues(fields, "A_la_espera_de");

  const optionsEstado_del_cliente = [
    "",
    "ENOJADO",
    "TRANQUILO",
    "APURADO",
    "NO COOPERA",
    "IMPORTANTE",
  ];

  const optionsPeligro_respecto_a_baja = [
    "",
    "BAJA/CAIDO",
    "EN CONTRA",
    "NO PUEDE PAGAR",
    "REACTIVA POR ENTREGAS",
    "REACTIVA SEGURO",
    "ESPERA REASIGNAR",
    "ESPERA PROFESIONAL",
    "ESPERA INFORMACIÓN",
    "ESPERA FEEDBACK",
    "ESPERANDO APTO",
    "NO TIENE SUPERVISOR",
  ];

  const optionsA_la_espera_de = [
    "",
    "Información cliente",
    "Respuesta cliente",
    "Pago",
    "Respuesta profesional",
    "Respuesta coordinación",
    "Ventas",
    "Feedback",
    "Reasignar",
    "Apto",
    "Elección de tema",
  ];

  function convertDateFormat(dateString) {
    // Dividir la fecha en sus partes (año, mes, día)
    if (!dateString) {
      return null;
    }
    const [year, month, day] = dateString.split("-");
    // Crear un objeto Date con el nuevo formato
    const formattedDate = new Date(year, month - 1, day);
    // Obtener los componentes de la fecha formateada

    // Formatear la fecha como DD/MM/YYYY
    return formattedDate;
  }
  const handleAddRow = () => {
    const newRow = {
      Fecha_reactivado: null,
      Fecha_recontacto: null,
      Estado_del_cliente: "",
      Estado: "Paralizado",
      Motivo_Situacion: "",
      A_la_espera_de: "",
      Peligro_respecto_a_baja: "",
      Fecha_del_paralizado: null,
    };
    setData([...data, newRow]);
    onTableDataChange([...data, newRow]);
  };
  const handleRemoveRow = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
    onTableDataChange(newData);
  };
  const handleChange = (e, index, key) => {
    const newData = [...data];
    newData[index][key] = e.target.value;
    setData(newData);
    onTableDataChange(newData);
  };
  const handleUTCDateChange = (date, key, index) => {
    const utcDate = date ? dayjs.utc(date).toDate() : null;
    handleDateChange(utcDate, key, index);
  };
  const handleDateChange = (date, key, index) => {
    const newData = [...data];
    if (date == null) {
      newData[index][key] = null;
    } else {
      // Crear una nueva fecha que tenga en cuenta la zona horaria del navegador
      const offset = date.getTimezoneOffset();
      const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
      newData[index][key] = adjustedDate.toISOString().slice(0, 10);
    }

    setData(newData);
    onTableDataChange(newData);
  };
  return (
    <div className="table-container">
      <table className="responsive-table">
        <thead>
          <tr>
            <th> </th>
            <th>Estado</th>
            <th>Fecha del Paralizado</th>
            <th>Fecha Reactivado</th>
            <th>A la Espera de</th>
            <th>Estado del Cliente</th>
            <th>Peligro respecto a Baja</th>
            <th>Fecha Recontacto</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <>
              <tr key={index}>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleRemoveRow(index)}
                  >
                    X
                  </button>
                </td>
                <td className="DateColumn">
                  <select
                    value={row.Estado}
                    onChange={(e) => handleChange(e, index, "Estado")}
                  >
                    <option value="Paralizado">Paralizado</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </td>
                <td>
                  <DatePicker
                    className="DateColumn"
                    selected={convertDateFormat(row.Fecha_del_paralizado)}
                    onChange={(date) =>
                      handleUTCDateChange(date, "Fecha_del_paralizado", index)
                    }
                    dateFormat="dd/MM/yyyy"
                  />
                </td>
                <td>
                  <DatePicker
                    className="DateColumn"
                    selected={convertDateFormat(row.Fecha_reactivado)}
                    onChange={(date) =>
                      handleUTCDateChange(date, "Fecha_reactivado", index)
                    }
                    dateFormat="dd/MM/yyyy"
                  />
                </td>
                <td>
                  <select
                    value={row.A_la_espera_de}
                    onChange={(e) => handleChange(e, index, "A_la_espera_de")}
                  >
                    {A_la_espera_de.map((tipo, index) => (
                      <option key={index} value={tipo.display_value}>
                        {tipo.display_value}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={row.Estado_del_cliente}
                    onChange={(e) =>
                      handleChange(e, index, "Estado_del_cliente")
                    }
                  >
                    {Estado_del_cliente.map((tipo, index) => (
                      <option key={index} value={tipo.display_value}>
                        {tipo.display_value}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={row.Peligro_respecto_a_baja}
                    onChange={(e) =>
                      handleChange(e, index, "Peligro_respecto_a_baja")
                    }
                  >
                    {Peligro_respecto_a_baja.map((tipo, index) => (
                      <option key={index} value={tipo.display_value}>
                        {tipo.display_value}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <DatePicker
                    className="DateColumn"
                    selected={convertDateFormat(row.Fecha_recontacto)}
                    onChange={(date) =>
                      handleDateChange(date, "Fecha_recontacto", index)
                    }
                    dateFormat="dd/MM/yyyy"
                  />
                </td>
              </tr>
              <tr>
                <tr className="motivo">
                  <th>Motivo Situación</th>
                </tr>
                <td colSpan="9" className="area">
                  <textarea
                    type="text"
                    value={row.Motivo_Situacion}
                    onChange={(e) => handleChange(e, index, "Motivo_Situacion")}
                    maxLength={250}
                    rows={2.5} // Establece el número de filas del textarea
                    placeholder="Ingrese los motivos..."
                  />
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
      <button className="add-button fila" onClick={handleAddRow}>
        Agregar Fila
      </button>
    </div>
  );
};

export default EditableTable;
