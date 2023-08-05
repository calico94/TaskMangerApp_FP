//Reference:  https://gorhom.github.io/react-native-bottom-sheet/custom-background*/
import React from "react";

import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
const CustomBackground = ({style}) => {
    const { colors } = useTheme();
    return (
      <View
        style={[
          {
            backgroundColor: colors.customBackground,
            borderRadius: 15,
          },
          {...style},
        ]}
      />
    );
  };

export default CustomBackground;