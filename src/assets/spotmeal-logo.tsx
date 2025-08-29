import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Text } from 'react-native-svg';

interface SpotMealLogoProps {
  size?: number;
}

export const SpotMealLogo: React.FC<SpotMealLogoProps> = ({ size = 120 }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size * 0.8} viewBox="0 0 200 160">
        {/* Circular border */}
        <Circle
          cx="100"
          cy="80"
          r="70"
          fill="none"
          stroke="#1B4A4A"
          strokeWidth="8"
        />
        
        {/* Fork */}
        <Path
          d="M70 40 L70 60 L68 60 L68 120 L72 120 L72 60 L70 60 Z M65 40 L65 55 M70 40 L70 55 M75 40 L75 55"
          fill="#1B4A4A"
          stroke="#1B4A4A"
          strokeWidth="2"
        />
        
        {/* Spoon */}
        <Path
          d="M130 40 C135 40 140 45 140 50 C140 55 135 60 130 60 C125 60 120 55 120 50 C120 45 125 40 130 40 Z M130 60 L130 120 L134 120 L134 60"
          fill="#1B4A4A"
          stroke="#1B4A4A"
          strokeWidth="1"
        />
        
        {/* SPOTMEAL Text */}
        <Text
          x="100"
          y="145"
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="#1B4A4A"
          fontFamily="Arial, sans-serif"
        >
          SPOTMEAL
        </Text>
      </Svg>
    </View>
  );
};