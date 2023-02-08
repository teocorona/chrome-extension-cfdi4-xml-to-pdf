export interface documentProps {
  title: string;
  author: string;
  subject: string;
  keywords?: string;
  creator: string;
}


export interface CfdiProps {
  "cfdi:Emisor": CfdiEmisor;
  "cfdi:Receptor": CfdiReceptor;
  "cfdi:Conceptos": CfdiConceptos;
  "cfdi:Impuestos": CfdiPropsCfdiImpuestos;
  "cfdi:Complemento": CfdiComplemento;
  Version: string;
  Serie: string;
  Descuento?: number;
  Folio: string;
  Fecha: string;
  Sello: string;
  FormaPago: string;
  NoCertificado: string;
  Certificado: string;
  SubTotal: number;
  Moneda: string;
  TipoCambio: string;
  Total: number;
  TipoDeComprobante: string;
  Exportacion: string;
  MetodoPago: string;
  LugarExpedicion: string;
  "xmlns:cfdi": string;
  "xsi:schemaLocation": string;
  "xmlns:xsi": string;
}

export interface CfdiComplemento {
  "tfd:TimbreFiscalDigital": TfdTimbreFiscalDigital;
}

export interface TfdTimbreFiscalDigital {
  "xmlns:xsi": string;
  "xsi:schemaLocation": string;
  Version: string;
  UUID: string;
  FechaTimbrado: string;
  RfcProvCertif: string;
  SelloCFD: string;
  NoCertificadoSAT: string;
  SelloSAT: string;
  "xmlns:tfd": string;
}

export interface CfdiConceptos {
  "cfdi:Concepto": CfdiConcepto[];
}

export interface CfdiConcepto {
  "cfdi:Impuestos": CfdiConceptoCfdiImpuestos;
  ClaveProdServ: string;
  Cantidad: number;
  ClaveUnidad: string;
  Unidad: string;
  Descripcion: string;
  ValorUnitario: number;
  Importe: number;
  ObjetoImp: string;
}

export interface CfdiConceptoCfdiImpuestos {
  "cfdi:Traslados": CfdiTraslados;
}

export interface CfdiTraslados {
  "cfdi:Traslado": CfdiTraslado;
}

export interface CfdiTraslado {
  Base: string;
  Impuesto: string;
  TipoFactor: string;
  TasaOCuota: string;
  Importe: string;
}

export interface CfdiEmisor {
  Rfc: string;
  Nombre: string;
  RegimenFiscal: string;
}

export interface CfdiPropsCfdiImpuestos {
  "cfdi:Traslados": CfdiTraslados;
  TotalImpuestosTrasladados?: number;
  TotalImpuestosRetenidos?: number;
}

export interface CfdiReceptor {
  Rfc: string;
  Nombre: string;
  DomicilioFiscalReceptor: string;
  RegimenFiscalReceptor: string;
  UsoCFDI: string;
}
