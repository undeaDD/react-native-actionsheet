import React, { Component } from 'react';
import { TextStyle, ViewStyle } from 'react-native';

type Props = {
	options: string[];
	onPress: (index: number) => void;
	title?: string;
	message?: string;
	tintColor?: string;
	cancelButtonIndex?: number;
	destructiveButtonIndex?: number;
	theme?: "default" | "ios";
	/**
	 * Only for Android or ActionSheetCustom
	 */
	styles?: {
		titleBox?: ViewStyle,
		titleText?: TextStyle,

		messageBox?: ViewStyle,
		messageText?: TextStyle,

		buttonText?: TextStyle,
		buttonBox?: ViewStyle,
		cancelButtonBox?: ViewStyle,

		overlay?: TextStyle,
		wrapper?: ViewStyle,
		body?: ViewStyle,
	};
}

type ActionSheetProps = Props & {
	/**
	 * iOS only, change default theme
	 * @default system theme color
	 */
	userInterfaceStyle?: "light" | "dark"
}

export default class ActionSheet extends Component<ActionSheetProps> {
	public show: () => void;
}

type ActionSheetCustomProps = Props | {
	title?: string | React.ReactNode
	message?: string | React.ReactNode
	options: (string | React.ReactChild)[]
}

export class ActionSheetCustom extends Component<ActionSheetCustomProps> {
	public show: () => void;
}