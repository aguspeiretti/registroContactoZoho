/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "./nuevoComponente.css";
dayjs.extend(utc);

const NuevoComponente = ({ initialData, onTableDataChange, estatus }) => {
  const [data, setData] = useState(initialData);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    getFields();
  }, []);

  // funcion para traer los campos desplegables y filtrarlos
  const getFields = (entrity) => {
    return new Promise(function (resolve, reject) {
      window.ZOHO.CRM.META.getFields({ Entity: "Recontactos" })
        .then(function (response) {
          setFields(response.fields);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  };
  const getFieldValues = (fields, apiName) => {
    const field = fields.find((item) => item.api_name === apiName);
    return field ? field.pick_list_values || [] : [];
  };
  const Estado = getFieldValues(fields, "Estado");
  const Estado_del_cliente = getFieldValues(fields, "Estado_del_cliente");
  const Peligro_respecto_a_baja = getFieldValues(
    fields,
    "Peligro_respecto_a_baja"
  );
  const A_la_espera_de = getFieldValues(fields, "A_la_espera_de");

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
      Estado_del_cliente: "-None-",
      Estado: "-None-",
      Motivo_Situacion: "",
      A_la_espera_de: "",
      Peligro_respecto_a_baja: "-None-",
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
    console.log(data);

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
    <div className="container-principal">
      <div className="cpntainer-secundario">
        {data.map((row, index) => (
          <div className="card">
            <button
              className="delete-button"
              onClick={() => handleRemoveRow(index)}
            >
              Eliminar
            </button>
            <div className="estado campos">
              <label htmlFor="">Estado</label>
              <select
                value={row.Estado}
                onChange={(e) => handleChange(e, index, "Estado")}
              >
                {Estado.map((tipo, index) => (
                  <option key={index} value={tipo.display_value}>
                    {tipo.display_value}
                  </option>
                ))}
              </select>
            </div>
            <div className="campos">
              <label htmlFor="">Fecha Paralizado</label>
              <DatePicker
                className="DateColumn"
                selected={convertDateFormat(row.Fecha_del_paralizado)}
                onChange={(date) =>
                  handleUTCDateChange(date, "Fecha_del_paralizado", index)
                }
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div className="campos">
              <label htmlFor="">Fecha Reactivado</label>
              <DatePicker
                className="DateColumn"
                selected={convertDateFormat(row.Fecha_reactivado)}
                onChange={(date) =>
                  handleUTCDateChange(date, "Fecha_reactivado", index)
                }
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div className="campos">
              <label htmlFor="">Estado del cliente</label>
              <select
                value={row.Estado_del_cliente}
                onChange={(e) => handleChange(e, index, "Estado_del_cliente")}
              >
                {Estado_del_cliente.map((tipo, index) => (
                  <option key={index} value={tipo.display_value}>
                    {tipo.display_value}
                  </option>
                ))}
              </select>
            </div>

            <div className="campos">
              <label htmlFor="">Fecha recontacto</label>
              <DatePicker
                className="DateColumn"
                selected={convertDateFormat(row.Fecha_recontacto)}
                onChange={(date) =>
                  handleDateChange(date, "Fecha_recontacto", index)
                }
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div className="campos peligro">
              <label htmlFor="">Peligro respecto a baja</label>
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
            </div>
            <div className="campos motivo">
              <label htmlFor="">Motivo situacion</label>
              <textarea
                className="textArea"
                type="text"
                value={row.Motivo_Situacion}
                onChange={(e) => handleChange(e, index, "Motivo_Situacion")}
                maxLength={1900}
                placeholder="Ingrese los motivos..."
              />
            </div>
          </div>
        ))}
      </div>
      <button className="add-button fila" onClick={handleAddRow}>
        +
      </button>
    </div>
  );
};

export default NuevoComponente;
