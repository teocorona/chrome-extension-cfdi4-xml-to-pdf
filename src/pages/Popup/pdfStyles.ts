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
    paddingHorizontal: '25px',
    paddingVertical: '35px',
    flexDirection: 'column',
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
  sectionComment: {
    padding: '10px',
    width: '100%',
    gap: '10px'
  },
  logoRow1: {
    padding: '5px',
    width: '8%'
  },
  logoRow2: {
    padding: '5px',
    width: '42%'
  },
  logoRow3: {
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
    // borderBottom: '1px solid #f2f2f2',
  },
  tableRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    padding: '3px',
    gap: '3px',
  },
  tableRowG: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
    padding: '3px',
    gap: '3px',
  },
  logo: {
    display: 'flex',
    width: '40px',
    height: '40px',
  },
  totals: {
    paddingLeft: '10px',
    paddingRight: '3px',
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'flex-end',
    textAlign: 'right',
    gap: '10px',
    paddingVertical: '10px',
  },
  sectionT: {
    justifyContent: 'flex-end',
    textAlign: 'right',
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  code: {
    fontSize: '7px',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    fontFamily: 'Roboto Mono',
    marginBottom: '20px'
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
  pageNumbers: {
    position: 'absolute',
    bottom: '-5px',
    left: 0,
    right: 0,
    textAlign: 'center'
  },
});