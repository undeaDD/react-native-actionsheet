import { StyleSheet } from 'react-native'
export const hairlineWidth = StyleSheet.hairlineWidth
export default {
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.4,
    backgroundColor: '#000'
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  body: {
    flex: 1,
    alignSelf: 'flex-end',
    backgroundColor: '#e5e5e5'
  },
  bodyIos: {
    flex: 1,
    alignSelf: 'flex-end',
    padding: 10,
  },
  titleBox: {
    paddingTop: 15,
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  titleText: {
    color: '#757575',
    fontSize: 14,
    textAlign: "center",
  },
  messageBox: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  messageText: {
    color: '#9a9a9a',
    fontSize: 12,
    textAlign: "center",
  },
  buttonBox: {
    height: 48,
    borderTopWidth: hairlineWidth,
    borderTopColor: "#bababa",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  buttonText: {
    fontSize: 18
  },
  cancelButtonBox: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  roundedBox: {
    borderRadius: 10,
    overflow: "hidden",
  },
}
