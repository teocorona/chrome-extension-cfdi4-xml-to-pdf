import React, { FC } from 'react'
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { totalEnLetra } from './js/totalEnLetra'
import QRCode from 'qrcode'
import { styles } from './pdfStyles';
import { CfdiConcepto, CfdiProps, documentProps } from './types';
import { formaDePago, metodoPago, regimenFiscal, usoDelCfdi } from './js/catalogs';

const generateQR = async (qrStr: string) => {
  try {
    return await QRCode.toDataURL(qrStr)
  } catch (err) {
    console.error(err)
  }
}

interface TemplateProps {
  xmlObj: CfdiProps,
  documentProps?: documentProps
}

// Create Document Component
const PDFTemplate = ({ xmlObj }: TemplateProps) => {
  const totalLetra = totalEnLetra(xmlObj.Total).toLowerCase() + 'MXN'
  const { Version, Folio, Fecha, Sello, FormaPago, NoCertificado, SubTotal, Descuento = 0.00,
    Moneda, TipoCambio, Total, TipoDeComprobante, Exportacion, MetodoPago, LugarExpedicion } = xmlObj
  const { Rfc, Nombre, RegimenFiscal } = xmlObj['cfdi:Emisor']
  const { Rfc: rRfc, Nombre: rNombre, DomicilioFiscalReceptor: rDomicilio, RegimenFiscalReceptor: rRegimenFiscal, UsoCFDI } = xmlObj['cfdi:Receptor']
  const { SelloSAT, Version: VersionT, UUID, FechaTimbrado, NoCertificadoSAT } = xmlObj['cfdi:Complemento']['tfd:TimbreFiscalDigital']
  const CadenaOriginal = '||' + VersionT + '|' + UUID + '|' + FechaTimbrado + '| ' + Sello + '|' + NoCertificadoSAT + '||'
  const Sello8 = Sello.slice(-8)
  const TotalImpuestosTrasladados = xmlObj['cfdi:Impuestos'].TotalImpuestosTrasladados || 0.00
  // const TotalImpuestosRetenidos = xmlObj['cfdi:Impuestos'].TotalImpuestosRetenidos || '0.00'
  const conceptos = xmlObj['cfdi:Conceptos']['cfdi:Concepto']
  const cutSelloE = Sello.match(/.{1,95}/g);
  const cutSelloS = SelloSAT.match(/.{1,95}/g);
  const cutCadena = CadenaOriginal.match(/.{1,95}/g);
  const urlBase = 'https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx'
  const qrStr = `${urlBase}?id=${UUID}&re=${Rfc}&rr=${rRfc}&tt=${Total}&fe=${Sello8}`
  const qr = generateQR(qrStr)

  const options = { maximumFractionDigits: 2, minimumFractionDigits: 2 }

  return (
    <Document
      title={'F' + xmlObj.Folio}
      author='GCI'
      subject='CFDI 4.0'
      creator='GCI'
    >
      <Page size="LETTER" style={styles.page} wrap>
        <View style={styles.body}>

          <View style={styles.twoCols}>
            <View style={styles.logoRow1}>
              <Image src='logogc.png' style={styles.logo} />
            </View>
            <View style={styles.logoRow2}>
              <Text style={{ fontWeight: 'bold' }}>Factura - {TipoDeComprobante === 'I' ? 'Ingreso' : ''}</Text>
              <Text>Folio: <Text style={{ color: 'red' }}>{Folio}</Text></Text>
              <Text>Fecha de emisión: {Fecha}</Text>
              <Text>Fecha de certificación: {FechaTimbrado}</Text>
            </View>
            <View style={styles.logoRow3}>
              <Text> </Text>
              <Text>Folio fiscal: {UUID}</Text>
              <Text>No. Certificado Digital: {NoCertificado}</Text>
              <Text>No. Certificado SAT: {NoCertificadoSAT}</Text>
            </View>
          </View>

          <View style={styles.twoCols}>
            <View style={styles.section}>
              <Text style={{ fontWeight: 'bold' }}>Emisor</Text>
              <Text>{Nombre}</Text>
              <Text>RFC: {Rfc}</Text>
              <Text>Régimen fiscal: {regimenFiscal.find(({ value }) => value === RegimenFiscal)?.label || RegimenFiscal}</Text>
              <Text>Código postal: {LugarExpedicion}</Text>
            </View>
            <View style={styles.section}>
              <Text style={{ fontWeight: 'bold' }}>Receptor </Text>
              <Text>{rNombre} </Text>
              <Text>RFC: {rRfc}</Text>
              <Text>Régimen fiscal: {regimenFiscal.find(({ value }) => value === rRegimenFiscal)?.label || rRegimenFiscal}</Text>
              <Text>Código postal: {rDomicilio}</Text>
            </View>
          </View>

          <View style={styles.twoCols}>
            <View style={styles.section}>
              <Text style={{ fontWeight: 'bold' }}>Datos del CFDI</Text>
              <Text>Uso del CFDI: {usoDelCfdi.find(({ value }) => value === UsoCFDI)?.label || UsoCFDI}</Text>
              <Text>Método de pago: {metodoPago.find(({ value }) => value === MetodoPago)?.label || MetodoPago}</Text>
              <Text>Forma de pago: {formaDePago.find(({ value }) => value === FormaPago)?.label || FormaPago}</Text>
            </View>
            <View style={styles.section}>
              <Text> </Text>
              <Text>Exportación: {Exportacion} </Text>
              <Text>Moneda: {Moneda}</Text>
              <Text>Tipo de cambio: {TipoCambio}</Text>
            </View>
          </View>


          <Table conceptos={...conceptos} options={options} />

          <View style={styles.twoCols}>
            <View style={styles.section}>
              <Text><Text style={{ fontWeight: 'bold' }}>Total en letra: </Text>{totalLetra}</Text>
            </View>
            <View style={styles.totals}>
              <View style={styles.sectionT}>
                <Text style={{ fontWeight: 'bold', textAlign: 'right' }}>Sub-total</Text>
                <Text style={{ fontWeight: 'bold' }}>Descuentos</Text>
                <Text style={{ fontWeight: 'bold' }}>IVA Trasladado</Text>
                <Text style={{ fontWeight: 'bold' }}>Total</Text>
              </View>
              <View style={styles.sectionT}>
                <Text>{new Intl.NumberFormat('es-Mx', options).format(SubTotal)}</Text>
                <Text>{new Intl.NumberFormat('es-Mx', options).format(Descuento)}</Text>
                <Text>{new Intl.NumberFormat('es-Mx', options).format(TotalImpuestosTrasladados)}</Text>
                <Text style={{ fontWeight: 'bold' }}>{new Intl.NumberFormat('es-Mx', options).format(Total)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.code} wrap={false}>
            <View style={styles.qr}>
              <Image src={qr} />
            </View>
            <View style={styles.sectionSello}>
              <Text style={{ fontWeight: 'bold', paddingTop: '10px' }}>Sello Digital del Emisor</Text>
              {cutSelloE?.map((sello, index) => (
                <Text key={index}>{sello}</Text>
              ))}
              <Text style={{ fontWeight: 'bold', paddingTop: '5px' }}>Sello Digital del SAT</Text>
              {cutSelloS?.map((sello, index) => (
                <Text key={index}>{sello}</Text>
              ))}
              <Text style={{ fontWeight: 'bold', paddingTop: '5px' }}>Cadena original del complemento de certificación digital del SAT</Text>
              {cutCadena?.map((sello, index) => (
                <Text key={index}>{sello}</Text>
              ))}
              <Text style={{ fontWeight: 'bold', paddingTop: '10px' }}>Este documento es una representacion impresa de un CFDI version {Version}</Text>
            </View>
          </View>

          <Text style={styles.pageNumbers} render={({ pageNumber, totalPages }) => { return (totalPages > 1 ? `Página ${pageNumber} de ${totalPages}` : '') }
          } fixed />

        </View>
      </Page>
    </Document>
  );
}

interface tableProps {
  conceptos: CfdiConcepto[]
  options: any
}

export const Table: FC<tableProps> = ({ conceptos, options }) => {
  return (
    <View style={styles.table}>
      <View style={styles.topRow} fixed>
        <Text style={{ fontWeight: 'bold', width: '10%' }}>Clave SAT</Text>
        <Text style={{ fontWeight: 'bold', width: '50%' }}>Concepto</Text>
        <Text style={{ fontWeight: 'bold', width: '10%' }}>Clave Ud.</Text>
        <Text style={{ fontWeight: 'bold', width: '10%' }}>Cantidad</Text>
        <Text style={{ fontWeight: 'bold', width: '10%' }}>Precio Unit.</Text>
        <Text style={{ fontWeight: 'bold', width: '10%' }}>Importe</Text>
      </View>
      {conceptos.map((concepto, index: number) => (
        <View style={(index % 2) === 0 || index === 0 ? styles.tableRow : styles.tableRowG} key={index} wrap={false}>
          <Text style={{ width: '10%', textAlign: 'center' }}>{concepto.ClaveProdServ}</Text>
          <Text style={{ width: '50%', textAlign: 'left' }}>{concepto.Descripcion}</Text>
          <Text style={{ width: '10%', textAlign: 'center' }}>{concepto.ClaveUnidad}</Text>
          <Text style={{ width: '10%', textAlign: 'center' }}>{new Intl.NumberFormat('es-Mx', options).format(concepto.Cantidad)}</Text>
          <Text style={{ width: '10%', textAlign: 'right' }}>{new Intl.NumberFormat('es-Mx', options).format(concepto.ValorUnitario)}</Text>
          <Text style={{ width: '10%', textAlign: 'right' }}>{new Intl.NumberFormat('es-Mx', options).format(concepto.Importe)}</Text>
        </View>
      ))}

    </View>
  )
}



export default PDFTemplate