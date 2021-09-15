import React, { useCallback, useMemo, useState } from 'react'
import { Text, View, Dimensions, Modal, TouchableHighlight, Animated, ScrollView, Easing, LayoutChangeEvent, Appearance, StyleSheet, Platform, useWindowDimensions } from 'react-native'
import { SafeAreaView, useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context'
import BlurView from '../BlurView'
import styles2 from '../styles'
import * as utils from '../utils'

const getBorderTopStyle = (darkMode) => {
	return {
		borderTopColor: darkMode ? "#fff5" : "#0005",
		borderTopWidth: StyleSheet.hairlineWidth,
	}
}
const WARN_COLOR = '#FF3B30'
const Button = React.memo(({ buttonTitle, index, darkMode, onPress, styles, ...props }) => {
	const { buttonUnderlayColor, cancelButtonIndex, destructiveButtonIndex, disabledIndexes, disabledColor } = props
	const tintColor = props.tintColor || (darkMode ? "#4793FF" : "#007AFF")
	let fontColor = destructiveButtonIndex === index ? WARN_COLOR : tintColor
	const isCancel = cancelButtonIndex === index
	const buttonBoxStyle = isCancel ? styles.cancelButtonBox : styles.buttonBox
	const isDisabled = disabledIndexes.indexOf(index) !== -1
	if (isDisabled) {
		fontColor = disabledColor
	}
	return (
		<TouchableHighlight
			key={index}
			activeOpacity={1}
			underlayColor={darkMode ? "#fff3" : "#00000015"}
			style={[buttonBoxStyle, !(index == 0 || (cancelButtonIndex == 0 && index == 1)) && getBorderTopStyle(darkMode)]}
			onPress={() => onPress(index)}
			disabled={isDisabled}
		>
			{React.isValidElement(buttonTitle) ? buttonTitle : (
				<Text style={[isCancel ? styles.cancelButtonText : styles.buttonText, {color: fontColor}]}>{buttonTitle}</Text>
			)}
		</TouchableHighlight>
	)
})

const ActionSheetUI = ({ styles: providedStyles, ...props }) => {
	const styles = useMemo(() => {
		return getMergedStyles(providedStyles)
	}, [providedStyles])
	const { top, bottom } = useSafeAreaInsets()
	const { width: deviceWidth, height: deviceHeight } = useWindowDimensions()

	const height = deviceHeight - top - bottom
	
	const isLandscape = deviceWidth > deviceHeight
	const maxHeight = Math.round(isLandscape ? height - 1 : height * 0.95)

	const [scrollEnabled, setScrollEnabled] = useState(false)
	const [translateY, setTranslateY] = useState(0)

	const onLayout = useCallback((e) => {
		let translateY = e.nativeEvent.layout.height
		const scrollEnabled = translateY >= maxHeight
		if(scrollEnabled) {
			translateY = maxHeight
		}
		setTranslateY(translateY)
		setScrollEnabled(scrollEnabled)
	}, [maxHeight])

	const iosStyle = props.theme ? props.theme == "ios" : Platform.OS == "ios"
  const boxStyle = iosStyle ? styles.roundedBox : {}
	const darkMode = (props.userInterfaceStyle || Appearance.getColorScheme()) == "dark"

	const textColor = darkMode ? styles.textDarkTheme : styles.textLightTheme
	return (
		<>
			<Animated.Text
				style={[styles.overlay, {
					opacity: props.sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [0.48, 0] }),
				}]}
				onPress={props.cancel}
			/>
		<SafeAreaView style={{ flex: 1, backgroundColor: "transparent", flexDirection: "row" }}>
		<Animated.View
			style={[
				iosStyle ? styles.bodyIos : (darkMode ? styles.bodyDark : styles.body),
				{
					paddingBottom: bottom > 0 ? 0 : undefined,
					opacity: translateY ? 1 : 0,
					maxWidth: isLandscape ? 320 : "auto",
					maxHeight: maxHeight + 1,
					height: scrollEnabled ? maxHeight : null,
					marginLeft: "auto",
					marginRight: "auto",
					transform: [{
						translateY: props.sheetAnim.interpolate({
							inputRange: [0, 1],
							outputRange: [0, translateY],
						})
					}]
				},
			]}
			onLayout={onLayout}
		>
			<BlurView
				style={[
					boxStyle,
					scrollEnabled ? { flex: 1 } : {},
					{ flexDirection: "column" },
					Platform.OS == "ios" ? {
						backgroundColor: darkMode ? "#DCDCDE55" : "#fffb",
					} : {
						backgroundColor: darkMode ? "#2C2C2E" : "#fff",
					},
				]}
				blurType={darkMode ? "prominent" : "light"}
				blurAmount={30}

				//expo-blur props
				intensity={100}
				tint={darkMode ? "dark" : "light"}
			>
				{!!props.title && (
					<View style={styles.titleBox}>
						{React.isValidElement(props.title) ? props.title : (
							<Text style={[styles.titleText, textColor]}>{props.title}</Text>
						)}
					</View>
				)}
				{!!props.message && (
					<View style={styles.messageBox}>
						{React.isValidElement(props.message) ? props.message : (
							<Text style={[styles.messageText, textColor]}>{props.message}</Text>
						)}
					</View>
				)}
				<View style={getBorderTopStyle(darkMode)} />
				<ScrollView indicatorStyle={darkMode ? "white" : "black"} scrollEnabled={scrollEnabled} style={scrollEnabled ? { flex: 1 } : {}}>
					{props.options.map((title, index) => {
						return props.cancelButtonIndex === index ? null : (
							<Button
								key={index}
								buttonTitle={title}
								index={index}
								darkMode={darkMode}
								{...props}
								styles={styles}
							/>
						)
					})}
				</ScrollView>
			</BlurView>
			<View style={[boxStyle, { marginTop: 8, backgroundColor: darkMode ? "#2C2C2E" : "#fff" }]}>
				{utils.isset(props.cancelButtonIndex) && (
					<Button
						buttonTitle={props.options[props.cancelButtonIndex]}
						index={props.cancelButtonIndex}
						darkMode={darkMode}
						{...props}
						styles={styles}
					/>
				)}
			</View>
		</Animated.View>
		</SafeAreaView>
		</>
	)
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

export default React.memo(ActionSheetUI)