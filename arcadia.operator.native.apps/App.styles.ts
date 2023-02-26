import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  controls: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    flexGrow: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    color: '#000000',
  },
  btnRefresh: {
    backgroundColor: '#00ff00',
    color: '#ffffff'
  },
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});
