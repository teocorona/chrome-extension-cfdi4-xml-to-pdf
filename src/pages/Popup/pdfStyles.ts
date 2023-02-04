import { StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Roboto', fonts: [
    { src: './Roboto-Light.ttf' }, // font-style: normal, font-weight: normal
    { src: './Roboto-Medium.ttf', fontWeight: 'bold' },
  ]
});
Font.register({
  family: 'Roboto Mono', fonts: [
    { src: './RobotoMono-Light.ttf' }, // font-style: normal, font-weight: normal
    { src: './RobotoMono-Medium.ttf', fontWeight: 'bold' },
  ]
});
export const styles = StyleSheet.create({
  page: {
    marginHorizontal: '20px',
    marginVertical: '30px',
    flexDirection: 'row',
    backgroundColor: '#fff',
    color: '#000',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    fontSize: '9px',
    width: '563px',
    textAlign: 'left',
    alignItems: 'center',
    fontFamily: 'Roboto'
  },
  section: {
    padding: '5px',
    width: '50%'
  },
  twoCols: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',

  },
  table: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  topRow: {
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    padding: '5px',
    gap: '3px',
    backgroundColor: '#d9d9d9',
  },
  tableRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderTop: 'solid',
    padding: '3px',
    gap: '3px',
  },
  tableRowG: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderTop: 'solid',
    backgroundColor: '#f2f2f2',
    padding: '3px',
    gap: '3px',
  },
  logo: {
    display: 'flex',
    width: '200px',
    height: '100px',
  },
  totals: {
    paddingLeft: '10px',
    paddingRight: '3px',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    textAlign: 'right',
    gap: '10px',
  },
  sectionT: {
    justifyContent: 'flex-end',
    textAlign: 'right',
    alignItems: 'flex-end'
  },
  code: {
    fontSize: '7px',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    fontFamily: 'Roboto Mono',
  },
  qr: {
    width: '163px',
    height: '163px',
  },
  sectionSello: {
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
  },
});