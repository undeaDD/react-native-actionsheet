import React from 'react'
import { Text, Dimensions, Modal, TouchableHighlight, Animated, Easing, LayoutChangeEvent, Appearance, StyleSheet } from 'react-native'
import * as utils from '../utils'
import styles2 from '../styles'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import ActionSheetUI from './ActionSheetUI'

class ActionSheet extends React.Component {
  static defaultProps = {
    disabledColor: '#A0A0A0',
    buttonUnderlayColor: '#A0A0A055',
    disabledIndexes: [],
    onPress: () => {},
    styles: {},
    useNativeDriver: true,
  }
	defaultOrientations = ["portrait", "landscape", "landscape-left", "landscape-right"]

  constructor (props) {
    super(props)
    this.state = {
      translateY: 0,
      scrollEnabled: false,
      visible: false,
      sheetAnim: new Animated.Value(1),
      sheetVisible: false,
			maxHeight: 0,
			isLandscape: false,
    }
  }

  show = () => {
    this.setState({visible: true}, () => {
      setTimeout(() => {
        this._showSheet()
      })
    })
  }

  hide = (index) => {
    this._hideSheet(() => {
      this.setState({
        visible: false,
        translateY: 0,
        scrollEnabled: false,
      }, () => {
        this.props.onPress(index)
      })
    })
  }

  _cancel = () => {
    const { cancelButtonIndex } = this.props
    // 保持和 ActionSheetIOS 一致，
    // 未设置 cancelButtonIndex 时，点击背景不隐藏 ActionSheet
    if (utils.isset(cancelButtonIndex)) {
      this.hide(cancelButtonIndex)
    }
  }

  _showSheet = () => {
    Animated.timing(this.state.sheetAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: this.props.useNativeDriver
    }).start()
  }

  _hideSheet (callback) {
    Animated.timing(this.state.sheetAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: this.props.useNativeDriver
    }).start(callback)
  }

  render () {
    const { visible } = this.state
    return (
      <Modal visible={visible}
        animationType='none'
        transparent
        supportedOrientations={this.props.supportedOrientations || this.defaultOrientations}
        onRequestClose={this._cancel}
        onOrientationChange={(e) => this.setState({ isLandscape: e.nativeEvent.orientation == "landscape" })}
      >
        <SafeAreaProvider style={{ flex: 1 }}>
          <ActionSheetUI {...this.props} onPress={this.hide} cancel={this._cancel} sheetAnim={this.state.sheetAnim} />
        </SafeAreaProvider>
      </Modal>
    )
  }
}


function getMergedStyles(styles) {
  const obj = {}
  Object.keys(styles2).forEach((key) => {
    const arr = [styles2[key]]
    if (styles[key]) {
      arr.push(styles[key])
    }
    obj[key] = arr
  })
  return obj
}

export default ActionSheet
