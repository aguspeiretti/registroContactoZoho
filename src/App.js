/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import React, { useState, useEffect } from "react";
import NuevoComponente from "./components/NuevoComponente";
import Swal from "sweetalert2";

function App(data) {
  const module = data.data.Entity;
  const registerID = data.data.EntityId;
  const [tableData, setTableData] = useState([]);
  const [inputValues, setInputValues] = useState({
    Name: "",
    Recontactos: [],
  });
  const [estatus, setStatus] = useState({
    pendiente: "No",
    paralizado: "No",
    reasignado: "No",
  });

  useEffect(() => {
    window.ZOHO.CRM.UI.Resize({ height: "100%", width: "100%" })
      .then(function (data) {
        console.log(data);
      })
      .catch(function (error) {
        console.error("Error al redimensionar:", error);
      });

    window.ZOHO.CRM.API.getRecord({
      Entity: module,
      RecordID: registerID,
    }).then(function (e) {
      var register = e.data[0];

      setStatus(() => ({
        pendiente: register.Pendiente_en_coord || "No",
        paralizado: register.Paralizado_en_coord || "No",
        reasignado: register.Reasignando || "No",
      }));

      setInputValues(() => ({
        Name: register.Name,
        Recontactos: register.Recontactos,
      }));
      console.log(register.Recontactos);
      if (register.Recontactos.length == 0) {
        setInputValues(() => ({
          Name: register.Name,
          Recontactos: [
            {
              Fecha_reactivado: null,
              Fecha_recontacto: null,
              Estado_del_cliente: "",
              Estado: "",
              Motivo_Situacion: "",
              A_la_espera_de: "",
              Peligro_respecto_a_baja: "",
              Fecha_del_paralizado: null,
            },
          ],
        }));
      }
    });
  }, []);

  const handleTableData = (data) => {
    // Aquí puedes hacer lo que quieras con los datos de la tabla, como enviarlos a una API, guardarlos en el estado, etc.
    console.log("Datos de la tabla:", data);
    setTableData(data);
  };
  function convertDateFormatZoho(dateString) {
    if (!dateString) {
      return;
    }
    const [day, month, year] = dateString.split("/");
    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);
    return formattedDate;
  }
  const handleGuardarAvanzar = () => {
    const tablaFormatted = tableData.map((item) => ({
      ...item,
      Fecha_del_paralizado: convertDateFormatZoho(item.Fecha_del_paralizado),
      Fecha_recontacto: convertDateFormatZoho(item.Fecha_recontacto),
      Fecha_reactivado: convertDateFormatZoho(item.Fecha_reactivado),
    }));
    console.log(tablaFormatted);
    setTableData(tablaFormatted);

    var estado = 0;
    var fechaVacia = 0;
    var camposObligatoriosVacios = 0;
    var estadoCliente = 0;
    var peligro = 0;

    tableData.forEach((row) => {
      if (!row.Fecha_del_paralizado) {
        fechaVacia = 1;
      }
      if (row.Estado === "-None-") {
        estado = 1;
      }
      if (row.Estado_del_cliente === "-None-") {
        estadoCliente = 1;
      }
      if (row.Peligro_respecto_a_baja === "-None-") {
        peligro = 1;
      }
      if (!row.Motivo_Situacion) {
        camposObligatoriosVacios = 1;
      }
    });

    if (estado) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El estado no puede ser '-None-'",
      });
      return;
    }
    if (estadoCliente) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El estado del cliente no puede ser '-None-'",
      });
      return;
    }
    if (peligro) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El estado de peligro respecto a la baja no puede ser '-None-'",
      });
      return;
    }
    if (fechaVacia) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Cargue la fecha del paralizado / pendiente",
      });
      return;
    }
    if (camposObligatoriosVacios) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "el campo 'Motivo Situación' no puede estar vacío.",
      });
      return;
    }
    if (tableData.length !== 0) {
      var config = {
        Entity: module,
        APIData: {
          id: registerID,
          Recontactos: tableData,
        },
      };
      window.ZOHO.CRM.API.updateRecord(config).then(function (data) {
        console.log(data);
      });

      window.ZOHO.CRM.BLUEPRINT.proceed();
    } else {
      alert("No hay datos para guardar. Debe completar el formulario.");
    }
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    const tablaFormatted = tableData.map((item) => ({
      ...item,
      Fecha_del_paralizado: convertDateFormatZoho(item.Fecha_del_paralizado),
      Fecha_recontacto: convertDateFormatZoho(item.Fecha_recontacto),
      Fecha_reactivado: convertDateFormatZoho(item.Fecha_reactivado),
    }));
    console.log(tablaFormatted);
    setTableData(tablaFormatted);

    var estado = 0;
    var fechaVacia = 0;
    var camposObligatoriosVacios = 0;
    var estadoCliente = 0;
    var peligro = 0;

    tableData.forEach((row) => {
      if (!row.Fecha_del_paralizado) {
        fechaVacia = 1;
      }
      if (row.Estado === "-None-") {
        estado = 1;
      }
      if (row.Estado_del_cliente === "-None-") {
        estadoCliente = 1;
      }
      if (row.Peligro_respecto_a_baja === "-None-") {
        peligro = 1;
      }
      if (!row.Motivo_Situacion) {
        camposObligatoriosVacios = 1;
      }
    });

    if (estado) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El estado no puede ser '-None-'",
      });
      return;
    }
    if (estadoCliente) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El estado del cliente no puede ser '-None-'",
      });
      return;
    }
    if (peligro) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El estado de peligro respecto a la baja no puede ser '-None-'",
      });
      return;
    }
    if (fechaVacia) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Cargue la fecha del paralizado / pendiente",
      });
      return;
    }
    if (camposObligatoriosVacios) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "el campo 'Motivo Situación' no puede estar vacío.",
      });
      return;
    }
    if (tableData.length !== 0) {
      var config = {
        Entity: module,
        APIData: {
          id: registerID,
          Recontactos: tableData,
        },
      };
      window.ZOHO.CRM.API.updateRecord(config).then(function (data) {
        console.log(data);
      });
      window.ZOHO.CRM.UI.Popup.closeReload().then(function (data) {
        console.log(data);
      });
    } else {
      alert("No hay datos para guardar. Debe completar el formulario.");
    }
  };
  const handleCancelar = () => {
    // Aquí puedes hacer lo que quieras con los datos de la tabla, como enviarlos a una API, guardarlos en el estado, etc.
    window.ZOHO.CRM.UI.Popup.close().then(function (data) {
      console.log(data);
    });
  };
  //

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-title">
          <div className="title">
            <p>Complete registro recontacto: REF: </p>
            <p className="ref">{inputValues.Name}</p>
            <div className="status">
              {estatus.pendiente === "SI" ? (
                <p className="alerta">Pendiente en coordinacion</p>
              ) : null}
              {estatus.paralizado === "SI" ? (
                <p className="alerta">Paralizado en coordinacion</p>
              ) : null}
              {estatus.reasignado === "SI" ? (
                <p className="alerta">Reasignando</p>
              ) : null}
            </div>
          </div>

          <div className="button-container ">
            <button
              className="custom-button no-guardar"
              onClick={handleCancelar}
            >
              No guardar
            </button>
            <button
              className="custom-button guardar-cerrar"
              onClick={handleGuardar}
            >
              Guardar y cerrar
            </button>
            <button
              className="custom-button guardar-avanzar"
              onClick={handleGuardarAvanzar}
            >
              Guardar y avanzar
            </button>
          </div>
        </div>
      </header>
      <main>
        {inputValues.Recontactos.length > 0 && (
          <NuevoComponente
            estatus={estatus}
            initialData={inputValues.Recontactos}
            onTableDataChange={handleTableData}
          />
        )}
      </main>
    </div>
  );
}

export default App;
