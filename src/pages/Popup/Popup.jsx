
import React from 'react';
import { useState } from 'react';
import './Popup.css';
import { xmlToObj } from './js/functions';
import PDFTemplate from './PDFTemplate'
import { pdf } from '@react-pdf/renderer';

const Popup = () => {
  const [error, setError] = useState('')
  const [xml, setXml] = useState(undefined)
  const [xmlObj, setXmlObj] = useState(undefined)

  const handleFileSelected = async (event) => {
    const reader = new FileReader()
    reader.onload = async (event) => {
      setXml(event.target.result)
      setXmlObj(xmlToObj(event.target.result, setError))
    };
    reader.readAsText(event.target.files[0])
  }

  const saveXml = async () => {
    const handle2 = await window.showSaveFilePicker({
      suggestedName: `F${xmlObj['cfdi:Comprobante'].Folio}`,
      types: [{
        accept: { 'text/xml': ['.xml'] },
      }],
    });
    const writable2 = await handle2.createWritable();
    await writable2.write(xml);
    await writable2.close();
    return handle2;
  }

  const savePdf = async () => {
    const handle = await window.showSaveFilePicker({
      suggestedName: `F${xmlObj['cfdi:Comprobante'].Folio}`,
      types: [{
        accept: { 'application/pdf': ['.pdf'] },
      }],
    });
    const writable = await handle.createWritable();
    await writable.write(await pdf(PDFTemplate(xmlObj['cfdi:Comprobante'])).toBlob());
    await writable.close();
    return handle;
  }

  const handleSave = async () => {
    try {
      console.log(xmlObj)
      await savePdf();
      await saveXml();
    } catch (err) {
      console.error(err.name, err.message);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <input id="fileInput" type="file" accept=".xml" onChange={handleFileSelected} />
        {xmlObj &&
          <>
            <button onClick={handleSave}>
              Descargar XML y PDF
            </button>
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
