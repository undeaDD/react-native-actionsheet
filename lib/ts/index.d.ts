import { Component } from 'react';

interface Props {
  options: (string | React.ReactNode)[];
  onPress: (index: number) => void;
  title?: string;
  message?: string;
  tintColor?: string;
  cancelButtonIndex?: number;
  destructiveButtonIndex?: number;
  styles?: object;
	/**
	 * iOS only, change default theme
	 * @default system theme color
	 */
	userInterfaceStyle?: "light" | "dark"
}

export default class ActionSheet extends Component<Props> {
  public show: () => void;
}
