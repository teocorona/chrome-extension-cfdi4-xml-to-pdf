
import React from 'react';
import { useState } from 'react';
import './Popup.css';
import { xmlToObj } from './js/functions';
import PDFTemplate from './PDFTemplate'
import PDFPreview from './PDFPreview'
import { PDFDownloadLink } from '@react-pdf/renderer';


const Popup = () => {
  // const fac = 1234
  const [error, setError] = useState('')
  const [xmlObj, setXmlObj] = useState(undefined)
  // const handleOnClickSearch = () => {
  //   setError('No se encontró el XML, o no se pudo crear el PDF.')
  //   setTimeout(() => {
  //     setError('')
  //   }, 5000);
  // }

  const handleFileSelected = async (event) => {
    const reader = new FileReader()
    reader.onload = async (event) => {
      const xml = (event.target.result)
      setXmlObj(xmlToObj(xml, setError))
    };
    reader.readAsText(event.target.files[0])
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* <div className='option'>
          <p>
            Factura: <b>{fac}</b>
          </p>
          <button onClick={handleOnClickSearch}
            title={`Busca un archivo XML en la carpeta Descargas que inicie con ${fac} y genera la version PDF de la factura`}
          >
            Buscar y Generar PDF
          </button>
        </div> */}
        {/* <div className='line' /> */}
        {/* <div className='option'> */}
        <input id="fileInput" type="file" accept=".xml" onChange={handleFileSelected} />
        {/* </div> */}
        {xmlObj &&
          <>
            <PDFDownloadLink
              document={<PDFTemplate xmlObj={xmlObj['cfdi:Comprobante']} />}
              fileName={'F' + xmlObj['cfdi:Comprobante'].Folio || 'Nueva Factura'}
              className='download'
            >
              {({ blob, url, loading, error }) =>
                loading ? "Cargando..." : "Descargar PDF"
              }
            </PDFDownloadLink>
            <PDFPreview xmlObj={xmlObj['cfdi:Comprobante']} />
          </>
        }
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
