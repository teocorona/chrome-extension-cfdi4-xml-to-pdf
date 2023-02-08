
import React from 'react';
import { useState } from 'react';
import './Popup.css';
import { xmlToObj } from './js/functions';
import PDFTemplate from './PDFTemplate'
import { PDFDownloadLink } from '@react-pdf/renderer';
// import PDFPreview from './PDFPreview'


const Popup = () => {
  const [error, setError] = useState('')
  const [xmlObj, setXmlObj] = useState(undefined)

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
        <input id="fileInput" type="file" accept=".xml" onChange={handleFileSelected} />
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
            {/* <PDFPreview xmlObj={xmlObj['cfdi:Comprobante']} /> */}
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
