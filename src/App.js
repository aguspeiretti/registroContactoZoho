import "./App.css";
import React, { useState, useEffect } from "react";
import EditableTable from "./components/EditableTable";

function App(data) {
  const module = data.data.Entity;
  const registerID = data.data.EntityId;
  const [tableData, setTableData] = useState([]);
  const [inputValues, setInputValues] = useState({
    Name: "",
    Recontactos: [],
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
      setInputValues(() => ({
        Name: register.Name,
        Recontactos: register.Recontactos,
      }));
      console.log(register.Recontactos);
      if (register.Recontactos.length == 0) {
        setInputValues(() => ({
          Recontactos: [
            {
              Fecha_reactivado: null,
              Fecha_recontacto: null,
              Estado_del_cliente: "",
              Estado: "Paralizado",
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
      ...item, // Copiar todas las propiedades del objeto original
      Fecha_del_paralizado: convertDateFormatZoho(item.Fecha_del_paralizado),
      Fecha_recontacto: convertDateFormatZoho(item.Fecha_recontacto),
      Fecha_reactivado: convertDateFormatZoho(item.Fecha_reactivado),
    }));
    console.log(tablaFormatted);
    setTableData(tablaFormatted);
    var fechaVacia = 0;
    // Aquí puedes hacer lo que quieras con los datos de la tabla, como enviarlos a una API, guardarlos en el estado, etc.
    tableData.forEach((row, index) => {
      // Verificar si el campo `Fecha_del_paralizado` está presente o no en la fila actual
      if (!row.Fecha_del_paralizado) {
        // Si no está presente, puedes realizar alguna acción, como mostrar una alerta

        fechaVacia = 1;
        return;
      }
    });
    if (fechaVacia) {
      alert("Cargue la fecha del paralizado / pendiente");
      return;
    }
    if (tableData.length != 0) {
      var config = {
        Entity: module,
        APIData: {
          id: registerID,
          Recontactos: tableData,
        },
        //Trigger:["workflow"]
      };
      window.ZOHO.CRM.API.updateRecord(config).then(function (data) {
        console.log(data);
      });

      window.ZOHO.CRM.BLUEPRINT.proceed();
    } else {
      alert("No hay datos para guardar. Debe completar el formulario.");
    }
  };
  const handleGuardar = () => {
    const tablaFormatted = tableData.map((item) => ({
      ...item, // Copiar todas las propiedades del objeto original
      Fecha_del_paralizado: convertDateFormatZoho(item.Fecha_del_paralizado),
      Fecha_recontacto: convertDateFormatZoho(item.Fecha_recontacto),
      Fecha_reactivado: convertDateFormatZoho(item.Fecha_reactivado),
    }));
    console.log(tablaFormatted);
    setTableData(tablaFormatted);

    var fechaVacia = 0;
    // Aquí puedes hacer lo que quieras con los datos de la tabla, como enviarlos a una API, guardarlos en el estado, etc.
    tableData.forEach((row, index) => {
      // Verificar si el campo `Fecha_del_paralizado` está presente o no en la fila actual
      if (!row.Fecha_del_paralizado) {
        // Si no está presente, puedes realizar alguna acción, como mostrar una alerta
        fechaVacia = 1;
        return;
      }
    });
    if (fechaVacia) {
      alert("Cargue la fecha del paralizado / pendiente");
      return;
    }
    if (tableData.length != 0) {
      var config = {
        Entity: module,
        APIData: {
          id: registerID,
          Recontactos: tableData,
        },
        //Trigger:["workflow"]
      };
      window.ZOHO.CRM.API.updateRecord(config).then(function (data) {
        console.log(data);
      });
      window.ZOHO.CRM.UI.Popup.closeReload().then(function (data) {
        console.log(data);
      });
    } else {
      alert("No hay datos para guardar. Debe completar el formulario.");
      return;
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
          </div>
          <div className="button-container ">
            <button className="custom-button" onClick={handleGuardarAvanzar}>
              Guardar y avanzar
            </button>
            <button className="custom-button" onClick={handleGuardar}>
              Solo guardar
            </button>
            <button className="custom-button" onClick={handleCancelar}>
              No guardar
            </button>
          </div>
        </div>
        {inputValues.Recontactos.length > 0 && (
          <EditableTable
            initialData={inputValues.Recontactos}
            onTableDataChange={handleTableData}
          />
        )}
      </header>
    </div>
  );
}

export default App;
