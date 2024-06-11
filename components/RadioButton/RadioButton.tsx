import React from "react";
import { View, TouchableOpacity } from "react-native";
import { colors } from "../../constants/colors";

type propsType = {
  value: number;
  selected: boolean;
  onSelect: (val: number | null) => void;
};

const CustomRadioButton = ({ value, selected, onSelect }: propsType) => {
  const handlePress = () => {
    if (selected) {
      onSelect(null);
    } else {
      onSelect(value);
    }
  };

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10,
      }}
      onPress={handlePress}
    >
      <View
        style={{
          height: 20,
          width: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: selected ? colors.primary : colors.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && (
          <View
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: colors.primary,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomRadioButton;
