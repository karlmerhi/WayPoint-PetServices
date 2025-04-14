import React from 'react';
import {
  StyleSheet,
  ViewProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './ThemedText';

interface CardBaseProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  elevation?: 'none' | 'small' | 'medium' | 'large';
  footer?: React.ReactNode;
  headerRight?: React.ReactNode;
}

interface TouchableCardProps extends CardBaseProps, TouchableOpacityProps {
  onPress: () => void;
}

interface StaticCardProps extends CardBaseProps, ViewProps {
  onPress?: never;
}

export type CardProps = TouchableCardProps | StaticCardProps;

export function Card({
  children,
  title,
  subtitle,
  elevation = 'small',
  footer,
  headerRight,
  style,
  onPress,
  ...rest
}: CardProps) {
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'placeholderText');

  const Container = onPress ? TouchableOpacity : View;

  // Get shadow style based on elevation prop
  const getShadowStyle = () => {
    switch (elevation) {
      case 'none':
        return {};
      case 'small':
        return styles.shadowSmall;
      case 'medium':
        return styles.shadowMedium;
      case 'large':
        return styles.shadowLarge;
      default:
        return styles.shadowSmall;
    }
  };

  return (
    <Container
      style={[
        styles.card,
        { backgroundColor: cardColor },
        getShadowStyle(),
        style,
      ]}
      {...(onPress && { onPress })}
      {...rest}
    >
      {(title || headerRight) && (
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            {title && (
              <ThemedText
                type="defaultSemiBold"
                style={styles.title}
              >
                {title}
              </ThemedText>
            )}
            {subtitle && (
              <ThemedText
                style={[styles.subtitle, { color: secondaryTextColor }]}
              >
                {subtitle}
              </ThemedText>
            )}
          </View>
          {headerRight && <View>{headerRight}</View>}
        </View>
      )}
      
      <View style={[styles.content, { paddingTop: title ? 0 : 16 }]}>{children}</View>
      
      {footer && <View style={styles.footer}>{footer}</View>}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    margin: 8,
  },
  shadowSmall: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  shadowMedium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  shadowLarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  content: {
    padding: 16,
    paddingTop: 16,
  },
  footer: {
    padding: 16,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
}); 