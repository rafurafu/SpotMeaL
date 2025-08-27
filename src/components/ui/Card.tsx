import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, shadows, borderRadius } from '../../utils/constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  shadow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 16,
  shadow = true,
}) => {
  return (
    <View
      style={[
        styles.card,
        shadow && styles.shadow,
        { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginHorizontal: 4,
    marginVertical: 2,
  },
  shadow: shadows.small,
});