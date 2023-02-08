import { XMLParser } from 'fast-xml-parser';

export const xmlToObj = (xml: string, setError: (s: string) => void) => {
  const options = {
    ignoreAttributes: false,
    alwaysCreateTextNode: true,
    attributeNamePrefix: ""
  };
  const parser = new XMLParser(options);
  const xmlObj = parser.parse(xml);
  if (!xmlObj) {
    setError('Error en el XML')
    setTimeout(() => {
      setError('')
    }, 5000);
  }
  return xmlObj
}

