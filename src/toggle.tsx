import React from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  COLOR_DEFAULT,
  DefaultReactNativeToggleElementProps,
  DefaultThumbChildrenProps,
  ToggleStyles,
  ToggleThumbButtonStyles,
  ToogleTrackBarStyles,
} from "./constants";
import { useTitleTextColor, useToggleValue } from "./hooks";
import { ReactNativeToggleElementProps, ThumbChildrenProps } from "./types";

const ThumbChildren = ({
    toggleValue,
    activeColor,
    inActiveColor,
    title,
    placement,
    children,
    disabled,
    disabledTitleStyle,
  }: ThumbChildrenProps = DefaultThumbChildrenProps) => {

  if (children) {
    return <View>{children}</View>;
  }

  const titleTextColor = useTitleTextColor(
    toggleValue,
    activeColor,
    inActiveColor,
    title,
    placement
  );

  if (titleTextColor) {
    const { textColor } = titleTextColor;

    const textStyle = StyleSheet.flatten([
      {
        color: textColor,
      },
      disabled && disabledTitleStyle,
    ]);

    return <Text style={textStyle}>{title}</Text>;
  }

  return null;
};

const ReactNativeToggleElement = ({
    value,
    leftComponent,
    rightComponent,
    thumbActiveComponent,
    thumbInActiveComponent,
    trackBar,
    thumbButton,
    containerStyle,
    trackBarStyle,
    disabledStyle,
    disabledTitleStyle,
    disabled,
    thumbStyle,
    leftTitle,
    rightTitle,
    animationDuration,
    onPress,
  }: ReactNativeToggleElementProps = DefaultReactNativeToggleElementProps) => {
  const { toggleValue, handlePress, handleLongPress, fadeAnim } =
    useToggleValue(value, thumbButton, trackBar, animationDuration, onPress);

  const trackBarBackgroundColor = () => {
    let {
      activeBackgroundColor,
      inActiveBackgroundColor,
      borderInActiveColor,
      borderActiveColor,
    } = trackBar;

    activeBackgroundColor =
      activeBackgroundColor ?? COLOR_DEFAULT.trackActiveBg;
    inActiveBackgroundColor =
      inActiveBackgroundColor ?? COLOR_DEFAULT.trackInActiveBg;

    borderActiveColor = borderActiveColor ?? COLOR_DEFAULT.borderColor;
    borderInActiveColor = borderInActiveColor ?? COLOR_DEFAULT.borderColor;

    const style = {
      backgroundColor: toggleValue
        ? activeBackgroundColor
        : inActiveBackgroundColor,
      borderColor: toggleValue ? borderActiveColor : borderInActiveColor,
    };

    return style;
  };

  const thumbButtonBackgroundColor = () => {
    let activeBg = "";
    let inActiveBg = "";

    const { activeBackgroundColor, inActiveBackgroundColor } = thumbButton;

    activeBg = activeBackgroundColor ?? COLOR_DEFAULT.thumbActive;
    inActiveBg = inActiveBackgroundColor ?? COLOR_DEFAULT.thumbInActive;

    return toggleValue ? activeBg : inActiveBg;
  };

  return (
    <View style={StyleSheet.flatten([ToggleStyles.container, containerStyle])}>
      <TouchableOpacity
        activeOpacity={1}
        testID="ToggleButton"
        onPress={() => handlePress()}
        onLongPress={() => handleLongPress()}
        disabled={disabled}
      >
        <View
          testID="TrackBar"
          style={StyleSheet.flatten([
            ToogleTrackBarStyles.trackBar(trackBar),
            trackBarBackgroundColor(),
            trackBarStyle,
            disabled && disabledStyle,
          ])}
        >
          <View
            testID="ThumbButtonLeft"
            style={StyleSheet.flatten([
              ToggleStyles.thumbPosition,
              ToggleStyles.thumbLeft,
              ToggleThumbButtonStyles.thumbButton(
                thumbButton,
                trackBar.borderWidth
              ),
            ])}
          >
            <ThumbChildren
              toggleValue={toggleValue}
              activeColor={thumbButton.activeBackgroundColor ?? DefaultThumbChildrenProps.activeColor}
              inActiveColor={thumbButton.inActiveBackgroundColor ?? DefaultThumbChildrenProps.inActiveColor}
              disabled={disabled}
              disabledTitleStyle={disabledTitleStyle}
              title={leftTitle}
              placement="left"
            >
              {leftComponent}
            </ThumbChildren>
          </View>
          <Animated.View
            testID="ThumbButton"
            style={StyleSheet.flatten([
              {
                transform: [{ translateX: fadeAnim }],
                zIndex: -1,
                backgroundColor: thumbButtonBackgroundColor(),
              },
              ToggleStyles.thumbAnimatedPosition,
              ToggleThumbButtonStyles.thumbButton(
                thumbButton,
                trackBar.borderWidth
              ),
              thumbStyle,
            ])}
          >
            {toggleValue ? thumbActiveComponent : thumbInActiveComponent}
          </Animated.View>
          <View
            testID="ThumbButtonRight"
            style={StyleSheet.flatten([
              ToggleStyles.thumbPosition,
              ToggleStyles.thumbRight,
              ToggleThumbButtonStyles.thumbButton(
                thumbButton,
                trackBar.borderWidth
              ),
            ])}
          >
            <ThumbChildren
              toggleValue={toggleValue}
              activeColor={thumbButton.activeColor ?? DefaultThumbChildrenProps.activeColor}
              inActiveColor={thumbButton.inActiveColor ?? DefaultThumbChildrenProps.inActiveColor}
              disabled={disabled}
              disabledTitleStyle={disabledTitleStyle}
              title={rightTitle}
              placement="right"
            >
              {rightComponent}
            </ThumbChildren>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ReactNativeToggleElement;
