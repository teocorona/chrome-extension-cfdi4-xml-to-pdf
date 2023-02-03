import { XMLParser } from 'fast-xml-parser';
import { totalEnLetra } from './totalEnLetra';

export const xmlToObj = (xml: string, setError: (s: string) => void) => {
  const parser = new XMLParser();
  const xmlObj = parser.parse(xml);
  if (!xmlObj['cdfi:Comprobante']) {
    setError('Error en el XML')
    setTimeout(() => {
      setError('')
    }, 5000);
  }
  return xmlObj
}

export const setInvoiceValues = (xmlObj: any) => {
  const totalLetra = totalEnLetra(xmlObj.Total).toLowerCase() + 'MXN'
  const { UUID } = xmlObj['cfdi:Complemento']['tfd:TimbreFiscalDigital']
  const { Rfc } = xmlObj['cfdi:Emisor']
  const { Rfc: rRfc } = xmlObj['cfdi:Receptor']
  const { Total, Sello } = xmlObj
  const Sello8 = Sello.slice(-8)
  const urlBase = 'https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx'
  const qrStr = `${urlBase}?id=${UUID}&re=${Rfc}&rr=${rRfc}&tt=${Total}&fe=${Sello8}`
  // const logo = 'data:image/png;base64,' + fs.readFileSync('./misc/logo.png', {encoding: 'base64'}) || '';
  const logo = './logo.png';

  const options = { "format": "Letter", "border": "0px", "localUrlAccess": true, "base": `file://${__dirname}/`, };
}