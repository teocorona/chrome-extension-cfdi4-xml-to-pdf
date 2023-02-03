
import React from 'react';
import { useState } from 'react';
import './Popup.css';
import { xmlToObj, setInvoiceValues } from './js/functions';




const Popup = () => {

  const fac = 1234
  const [error, setError] = useState('')
  const [xml, setXml] = useState('')
  const handleOnClickSearch = () => {
    setError('No se encontró el XML, o no se pudo crear el PDF.')
    setTimeout(() => {
      setError('')
    }, 5000);
  }

  const handleFileSelected = async (event) => {
    const reader = new FileReader()
    reader.onload = async (event) => {
      setXml(event.target.result)
    };
    reader.readAsText(event.target.files[0])
    // if (!reader) {
    //   setError('No se pudo abrir el explorador de archivos')
    //   setTimeout(() => {
    //     setError('')
    //   }, 5000)
    // }

  }


  const handleOnClickCreate = () => {
    console.log({ xml })
    const xmlObj = xmlToObj(xml, setError);
    const values = setInvoiceValues(xmlObj)
  }


  return (
    <div className="App">
      <header className="App-header">
        <div className='option'>
          <p>
            Factura: <b>{fac}</b>
          </p>
          <button onClick={handleOnClickSearch}
            title={`Busca un archivo XML en la carpeta Descargas que inicie con ${fac} y genera la version PDF de la factura`}
          >
            Buscar y Generar PDF
          </button>
        </div>
        <div className='line' />
        <div className='option'>
          <input id="fileInput" type="file" accept=".xml" onChange={handleFileSelected} />
        </div>
        <button onClick={handleOnClickCreate}>Generar PDF</button>
        {error.length > 0 &&
          <>
            <div className='error'>
              <p>{error}</p>
            </div>
          </>
        }
      </header>
    </div>
  );
};

export default Popup;
