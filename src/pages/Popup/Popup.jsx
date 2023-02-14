
import React from 'react';
import { useState } from 'react';
import './Popup.css';
import { xmlToObj } from './js/functions';
import PDFTemplate from './PDFTemplate'
import { pdf } from '@react-pdf/renderer';
// import { get, set } from 'idb-keyval'


const Popup = () => {
  const [error, setError] = useState('')
  const [xml, setXml] = useState(undefined)
  const [xmlObj, setXmlObj] = useState(undefined)
  // const [dir, setDir] = useState('...')

  const handleFileSelected = async () => {
    let fileHandle;
    [fileHandle] = await window.showOpenFilePicker({
      startIn: 'downloads'
    });
    const xmlFile = await fileHandle.getFile();
    const contents = await xmlFile.text();
    setXml(contents)
    setXmlObj(xmlToObj(contents, setError))

  }

  const saveXml = async (handle) => {
    const writable = await handle.createWritable();
    await writable.write(xml);
    await writable.close();
    return handle;
  }

  const savePdf = async (handle) => {
    const writable = await handle.createWritable();
    await writable.write(await pdf(PDFTemplate(xmlObj['cfdi:Comprobante'])).toBlob());
    await writable.close();
    return handle;
  }

  const handleSave = async () => {
    try {
      console.log(xmlObj)
      const name = `F${xmlObj['cfdi:Comprobante'].Folio}`
      // const directory = await get('directory');
      // if (!directory) {
      //   await setHandleDir(true);
      // }
      console.log(name)
      const directory = await window.showDirectoryPicker();
      console.log(directory)
      const xmlFileHandle = await directory.getFileHandle(`${name}.xml`, { create: true });
      const pdfFileHandle = await directory.getFileHandle(`${name}.pdf`, { create: true });

      await savePdf(pdfFileHandle);
      await saveXml(xmlFileHandle);

      return;
    } catch (err) {
      alert(err.name, err.message);
    }
  }

  const setHandleDir = async (reset) => {
    try {
      // const value = 123
      const directory = await window.showDirectoryPicker();
      chrome.storage.local.set({ directory }).then(() => {
        alert("Value is set to " + directory);
      });
      chrome.storage.local.get(["directory"]).then((result) => {
        alert("Value currently is " + result.directory);
        return result.directory
      });
      return;
    } catch (error) {
      alert(error.name, error.message);
    }
  }

  // useEffect(() => {
  //   (async () => {
  //     const dirHandler = await get('directory');
  //     if (dirHandler) {
  //       setDir(dirHandler.name)
  //     }
  //   })();
  // }, [])

  return (
    <div className="App">
      <header className="App-header">
        <div className='option'>
          <button onClick={handleFileSelected}>
            Seleccionar XML
          </button>
          <button onClick={setHandleDir} className='directory'>
            📁 &nbsp;&nbsp;
            /
          </button>
        </div>
        {xmlObj &&
          <div className='option'>
            <button onClick={handleSave}>
              Descargar XML y PDF
            </button>
            <p>
              Folio: {xmlObj['cfdi:Comprobante'].Folio}
            </p>
          </div>
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
