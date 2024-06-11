import { TextInput, TextInputProps } from "react-native-paper";
import { useState } from "react";
import { KeyboardTypeOptions, ViewStyle } from "react-native";
import { colors } from "../../constants/colors";

interface InputProps extends TextInputProps {
  placeholder?: string;
  value: string;
  state?: any;
  useLine?: boolean;
  line?: number;
  isPassword?: boolean;
  style?: ViewStyle;
  radius?: number;
  disabled?: boolean;
  keyboard?: KeyboardTypeOptions;
  length?: number;
  hasIcon?: boolean;
  Icon?: React.ReactNode;
  leftComponent?: React.ReactNode;
}

export const Input = (props: InputProps) => {
  const [action, setAction] = useState(false);
  const toggleIcon = () => setAction((state) => !state);

  return (
    <TextInput
    {...props}
    placeholder={props.placeholder}
    mode="outlined"
    disabled={props.disabled}
    underlineColor="red"
    outlineColor={colors.inputBorder}
    activeOutlineColor={colors.primary + "99"}
    activeUnderlineColor="#00000000"
    onChangeText={props.state}
    secureTextEntry={props.isPassword && !action}
    value={props.value}
    maxLength={props.length}
    selectionColor={colors.primary + "cc"}
    multiline={props.useLine}
    numberOfLines={props.line}
    placeholderTextColor="#667085"
    keyboardType={props.keyboard}
         outlineStyle={{
        borderRadius: props.radius || 8,
      }}
    style={
      props.style || {
        color: colors.primary,
        backgroundColor: colors.inputBackground,
      }
    }
    right={
      props.isPassword ? (
        <TextInput.Icon
          icon={action ? "eye-off" : "eye"}
          onPress={toggleIcon}
          color="#000"
          size={20}
        />
      ) : undefined
    }
    left={
      props.hasIcon && props.Icon ? (
        <TextInput.Icon icon={() => props.Icon} size={20} color="#667085" />
      ) : undefined
    }
  />
  );
};
