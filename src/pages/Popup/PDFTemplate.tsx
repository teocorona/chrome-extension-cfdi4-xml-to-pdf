import React, { FC } from 'react'
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { totalEnLetra } from './js/totalEnLetra'
import QRCode from 'qrcode'
import { styles } from './pdfStyles';
import { CfdiConcepto, CfdiProps } from './types';
import { formaDePago, metodoPago, regimenFiscal, usoDelCfdi, exportacion, objetoDeImpuesto, impuesto, meses, periodicidad } from './js/catalogs';
import { logo, author, creator, subject, title } from '../../assets/options'

const generateQR = async (qrStr: string) => {
  try {
    return await QRCode.toDataURL(qrStr)
  } catch (err) {
    console.error(err)
  }
}

// Create Document Component
const PDFTemplate = (xmlObj: CfdiProps, comment: string) => {
  const totalLetra = totalEnLetra(xmlObj.Total).toLowerCase() + 'MXN'
  const { Version, Folio, Fecha, Sello, FormaPago, NoCertificado, SubTotal, Descuento = 0.00,
    Moneda, TipoCambio, Total, TipoDeComprobante, Exportacion, MetodoPago, LugarExpedicion } = xmlObj
  const { Rfc, Nombre, RegimenFiscal } = xmlObj['cfdi:Emisor']
  const { Rfc: rRfc, Nombre: rNombre, DomicilioFiscalReceptor: rDomicilio, RegimenFiscalReceptor: rRegimenFiscal, UsoCFDI } = xmlObj['cfdi:Receptor']
  const { SelloSAT, Version: VersionT, UUID, FechaTimbrado, NoCertificadoSAT, RfcProvCertif } = xmlObj['cfdi:Complemento']['tfd:TimbreFiscalDigital']
  const CadenaOriginal = '||' + VersionT + '|' + UUID + '|' + FechaTimbrado + '|' + RfcProvCertif + '|' + Sello + '|' + NoCertificadoSAT + '||'
  const Sello8 = Sello.slice(-8)
  const TotalImpuestosTrasladados = xmlObj['cfdi:Impuestos'].TotalImpuestosTrasladados || 0.00
  // const TotalImpuestosRetenidos = xmlObj['cfdi:Impuestos'].TotalImpuestosRetenidos || '0.00'
  const conceptos = xmlObj['cfdi:Conceptos']['cfdi:Concepto']
  const cutSelloE = Sello.match(/.{1,115}/g);
  const cutSelloS = SelloSAT.match(/.{1,115}/g);
  const cutCadena = CadenaOriginal.match(/.{1,115}/g);
  const urlBase = 'https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx'
  const qrStr = `${urlBase}?id=${UUID}&re=${Rfc}&rr=${rRfc}&tt=${Total}&fe=${Sello8}`
  const qr = generateQR(qrStr)

  const options = { maximumFractionDigits: 2, minimumFractionDigits: 2 }

  let finalComment: string[]
  if (comment.length > 0) {
    finalComment = comment.split('??')
  } else {
    finalComment = []
  }

  let finalLogo = logo ? logo : 'logo.png'

  return (
    <Document
      title={`${title}F${xmlObj.Folio}`}
      author={author}
      subject={subject}
      creator={creator}
    >
      <Page size="LETTER" style={styles.page} wrap>
        <View style={styles.body}>

          <View style={styles.twoCols}>
            <View style={styles.logoRow1}>
              <Image src={finalLogo} style={styles.logo} />
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
              <Text>Lugar de expedición: {LugarExpedicion}</Text>
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
              <Text>Exportación: {exportacion.find(({ value }) => value === Exportacion)?.label || Exportacion} </Text>
              <Text>Moneda: {Moneda}</Text>
              <Text>Tipo de cambio: {TipoCambio}</Text>
            </View>
          </View>

          {(xmlObj['cfdi:InformacionGlobal']) ? (
            <View style={styles.twoCols}>
              <View style={styles.section}>
                <Text style={{ fontWeight: 'bold' }}>Información Global</Text>
                <Text>Año: {xmlObj['cfdi:InformacionGlobal'].Año}</Text>
                <Text>Mes: {meses.find(({ value }) => value === xmlObj['cfdi:InformacionGlobal'].Meses)?.label || xmlObj['cfdi:InformacionGlobal'].Meses}</Text>
              </View>
              <View style={styles.section}>
                <Text> </Text>
                <Text>Periodicidad: {periodicidad.find(({ value }) => value === xmlObj['cfdi:InformacionGlobal'].Periodicidad)?.label || xmlObj['cfdi:InformacionGlobal'].Periodicidad}</Text>
              </View>
            </View>
          ) : <></>
          }

          <Table conceptos={...conceptos} options={options} />

          <View style={styles.twoCols}>
            <View style={styles.sectionComment}>
              <Text><Text style={{ fontWeight: 'bold' }}>Total en letra: </Text>{totalLetra}</Text>
              {finalComment.length > 0 ? (
                <Text><Text style={{ fontWeight: 'bold' }}>{finalComment[0]}</Text>{finalComment[1]}</Text>
              ) : <></>}
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
              <Text style={{ fontWeight: 'bold', paddingTop: '7px' }}>Sello Digital del Emisor</Text>
              {cutSelloE?.map((sello, index) => (
                <Text key={index}>{sello}</Text>
              ))}
              <Text style={{ fontWeight: 'bold', paddingTop: '2px' }}>Sello Digital del SAT</Text>
              {cutSelloS?.map((sello, index) => (
                <Text key={index}>{sello}</Text>
              ))}
              <Text style={{ fontWeight: 'bold', paddingTop: '2px' }}>Cadena original del complemento de certificación digital del SAT</Text>
              {cutCadena?.map((sello, index) => (
                <Text key={index}>{sello}</Text>
              ))}
              <Text style={{ fontWeight: 'bold', paddingTop: '2px' }}>Este documento es una representacion impresa de un CFDI version {Version}</Text>
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
  conceptos: CfdiConcepto[];
  options: {
    maximumFractionDigits: number,
    minimumFractionDigits: number
  }
}
export const Table: FC<tableProps> = ({ conceptos, options }) => {
  return (
    <View style={styles.table}>
      <TableHeader />
      {(conceptos.length > 1) ?
        conceptos.map((concepto, index: number) => (
          <Row key={index} concepto={concepto} options={options} index={index} />
        ))
        :
        <Row key={0} concepto={conceptos} options={options} index={0} />
      }
    </View>
  )
}
interface tablerow {
  concepto: any;
  options: {
    maximumFractionDigits: number,
    minimumFractionDigits: number
  }
  index: number
}
export const Row: FC<tablerow> = ({ concepto, options, index }) => {
  return (
    <View style={(index % 2) === 0 || index === 0 ? styles.tableRow : styles.tableRowG} wrap={false}>
      <Text style={{ width: '7.5%', textAlign: 'center' }}>{concepto.ClaveProdServ}</Text>
      <Text style={{ width: '45.0%', textAlign: 'left' }}>{concepto.Descripcion}</Text>
      <Text style={{ width: '7.5%', textAlign: 'center' }}>{concepto.ClaveUnidad}</Text>
      <Text style={{ width: '7.5%', textAlign: 'center' }}>{new Intl.NumberFormat('es-Mx', options).format(concepto.Cantidad)}</Text>
      <Text style={{ width: '7.5%', textAlign: 'right' }}>{new Intl.NumberFormat('es-Mx', options).format(concepto.ValorUnitario)}</Text>
      <Text style={{ width: '7.5%', textAlign: 'right' }}>{new Intl.NumberFormat('es-Mx', options).format(concepto.Importe)}</Text>
      <View style={{ width: '12.0%', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
        <Text style={{ textAlign: 'right' }}>
          {new Intl.NumberFormat('es-Mx', options).format(concepto['cfdi:Impuestos']['cfdi:Traslados']['cfdi:Traslado'].Importe || 0)}
        </Text>
        <Text style={{ fontSize: '6px' }}>
          {objetoDeImpuesto.find(({ value }) => value === concepto.ObjetoImp)?.label || concepto.ObjetoImp}
        </Text>
        <Text style={{ fontSize: '6px' }}>
          {impuesto.find(({ value }) => value === concepto['cfdi:Impuestos']['cfdi:Traslados']['cfdi:Traslado'].Impuesto)?.label || concepto.ObjetoImp}
          {' '}
          {concepto['cfdi:Impuestos']['cfdi:Traslados']['cfdi:Traslado'].TasaOCuota}
          {' '}
          {concepto['cfdi:Impuestos']['cfdi:Traslados']['cfdi:Traslado'].TipoFactor}
        </Text>
      </View>
      <Text style={{ width: '7.5%', textAlign: 'right' }}>{new Intl.NumberFormat('es-Mx', options).format(concepto.Descuento || 0)}</Text>
    </View>
  )
}

export const TableHeader: FC = () => {
  return (
    <View style={styles.topRow} fixed>
      <Text style={{ fontWeight: 'bold', width: '7.5%' }}>Clave SAT</Text>
      <Text style={{ fontWeight: 'bold', width: '45.0%' }}>Concepto</Text>
      <Text style={{ fontWeight: 'bold', width: '7.5%' }}>Clave Ud.</Text>
      <Text style={{ fontWeight: 'bold', width: '7.5%' }}>Cantidad</Text>
      <Text style={{ fontWeight: 'bold', width: '7.5%' }}>Precio U.</Text>
      <Text style={{ fontWeight: 'bold', width: '7.5%' }}>Importe</Text>
      <Text style={{ fontWeight: 'bold', width: '10.0%' }}>Impuesto</Text>
      <Text style={{ fontWeight: 'bold', width: '7.5%' }}>Descuento</Text>
    </View>
  )
}



export default PDFTemplate