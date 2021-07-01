import React from 'react'
import { Text, View, Dimensions, Modal, TouchableHighlight, Animated, ScrollView, Easing, SafeAreaView, LayoutChangeEvent } from 'react-native'
import * as utils from './utils'
import styles2 from './styles'

const WARN_COLOR = '#FF3B30'
const MAX_HEIGHT = Dimensions.get('window').height * 0.7

class ActionSheet extends React.Component {
  static defaultProps = {
    tintColor: '#007AFF',
    disabledColor: '#A0A0A0',
    buttonUnderlayColor: '#F4F4F4',
    disabledIndexes: [],
    onPress: () => {},
    styles: {},
    useNativeDriver: true,
    theme: "default",
  }

  onLayout = (e: LayoutChangeEvent) => {
    let translateY = e.nativeEvent.layout.height
    let scrollEnabled = translateY > MAX_HEIGHT
    if (scrollEnabled) {
      translateY = MAX_HEIGHT
    }
    this.setState({
      translateY,
      scrollEnabled,
    })
  }

  constructor (props) {
    super(props)

    this.state = {
      translateY: 0,
      scrollEnabled: false,
      visible: false,
      sheetAnim: new Animated.Value(1),
      sheetVisible: false,
    }
  }

  show = () => {
    this.setState({visible: true}, () => {
      this._showSheet()
    })
  }

  hide = (index) => {
    this._hideSheet(() => {
      this.setState({visible: false}, () => {
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

  _renderTitle () {
    const { title, styles } = this.props
    const mergedStyles = getMergedStyles(styles)
    if (!title) return null
    return (
      <View style={mergedStyles.titleBox}>
        {React.isValidElement(title) ? title : (
          <Text style={mergedStyles.titleText}>{title}</Text>
        )}
      </View>
    )
  }

  _renderMessage () {
    const { message, styles } = this.props
    const mergedStyles = getMergedStyles(styles)
    if (!message) return null
    return (
      <View style={mergedStyles.messageBox}>
        {React.isValidElement(message) ? message : (
          <Text style={mergedStyles.messageText}>{message}</Text>
        )}
      </View>
    )
  }

  _renderCancelButton () {
    const { options, cancelButtonIndex } = this.props
    if (!utils.isset(cancelButtonIndex)) return null
    return this._createButton(options[cancelButtonIndex], cancelButtonIndex)
  }

  _createButton (title, index) {
    const styles = getMergedStyles(this.props.styles)
    const { buttonUnderlayColor, cancelButtonIndex, destructiveButtonIndex, disabledIndexes, tintColor, disabledColor } = this.props
    const fontColor = destructiveButtonIndex === index ? WARN_COLOR : tintColor
    const buttonBoxStyle = cancelButtonIndex === index ? styles.cancelButtonBox : styles.buttonBox
    const isDisabled = disabledIndexes.indexOf(index) !== -1
    if (isDisabled) {
      fontColor = disabledColor
    }
    return (
      <TouchableHighlight
        key={index}
        activeOpacity={1}
        underlayColor={buttonUnderlayColor}
        style={buttonBoxStyle}
        onPress={() => this.hide(index)}
        disabled={isDisabled}
      >
        {React.isValidElement(title) ? title : (
          <Text style={[styles.buttonText, {color: fontColor}]}>{title}</Text>
        )}
      </TouchableHighlight>
    )
  }

  _renderOptions () {
    const { cancelButtonIndex } = this.props
    return this.props.options.map((title, index) => {
      return cancelButtonIndex === index ? null : this._createButton(title, index)
    })
  }

  render () {
    const styles = getMergedStyles(this.props.styles)
    const iosStyle = this.props.theme == "ios"
    const boxStyle = iosStyle ? styles.roundedBox : {}
    const { visible, sheetAnim, scrollEnabled, translateY } = this.state
    return (
      <Modal visible={visible}
        animationType='none'
        transparent
        onRequestClose={this._cancel}
      >
        <SafeAreaView style={[styles.wrapper]}>
          <Text
            style={[styles.overlay]}
            onPress={this._cancel}
          />
          <Animated.View
            style={[
              iosStyle ? styles.bodyIos : styles.body,
              { opacity: translateY ? 1 : 0,  transform: [{ translateY: sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [0, translateY] }) }] }
            ]}
            onLayout={this.onLayout}
          >
            <View style={boxStyle}>
              {this._renderTitle()}
              {this._renderMessage()}
              <ScrollView scrollEnabled={scrollEnabled}>{this._renderOptions()}</ScrollView>
            </View>
            <View style={[boxStyle, { marginTop: 6, height: 50 }]}>
              {this._renderCancelButton()}
            </View>
          </Animated.View>
        </SafeAreaView>
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
