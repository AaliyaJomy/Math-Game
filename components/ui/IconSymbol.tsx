import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'plus.circle.fill': 'add-circle',
  'minus.circle.fill': 'remove-circle',
  'xmark.circle.fill': 'cancel',
  'puzzlepiece.fill': 'extension',
  'person.crop.circle.fill': 'account-circle',
  'message.circle': 'chat', 
} as const;

export type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const materialName = MAPPING[name];

  if (!materialName) {
    if (__DEV__) {
      console.warn(`IconSymbol: '${name}' not found in MAPPING`);
    }
    return (
      <MaterialIcons
        name="help-outline" // fallback icon
        size={size}
        color="gray"
        style={style}
      />
    );
  }

  return (
    <MaterialIcons
      name={materialName}
      size={size}
      color={color}
      style={style}
    />
  );
}
