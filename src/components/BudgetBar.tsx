/**
 * Animated horizontal bar showing remaining budget percentage.
 * Green when positive, red when negative.
 */
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing, FontSize, FontWeight } from '@/constants/theme';
import { formatCurrency } from '@/utils/helpers';

interface BudgetBarProps {
  budget: number;
  spent: number;
  remaining: number;
  currency: string;
  compact?: boolean;
}

export function BudgetBar({ budget, spent, remaining, currency, compact = false }: BudgetBarProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const isNegative = remaining < 0;
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  useEffect(() => {
    Animated.spring(animatedWidth, {
      toValue: percentage,
      useNativeDriver: false,
      tension: 50,
      friction: 9,
    }).start();
  }, [percentage, animatedWidth]);

  const barColor = isNegative ? Colors.negative : Colors.positive;
  const barBgColor = isNegative
    ? 'rgba(248, 113, 113, 0.15)'
    : 'rgba(74, 222, 128, 0.15)';

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={[styles.compactTrack, { backgroundColor: barBgColor }]}>
          <Animated.View
            style={[
              styles.compactFill,
              {
                backgroundColor: barColor,
                width: animatedWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Animated.Text
          style={[
            styles.remainingLabel,
            { color: barColor },
          ]}
        >
          Remaining
        </Animated.Text>
        <Animated.Text
          style={[
            styles.remainingAmount,
            { color: barColor },
          ]}
        >
          {formatCurrency(remaining, currency)}
        </Animated.Text>
      </View>

      <View style={[styles.track, { backgroundColor: barBgColor }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: barColor,
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Animated.Text style={[styles.statLabel, { color: Colors.textSecondary }]}>
            Budget
          </Animated.Text>
          <Animated.Text style={[styles.statValue, { color: Colors.textPrimary }]}>
            {formatCurrency(budget, currency)}
          </Animated.Text>
        </View>
        <View style={[styles.statItem, styles.statItemRight]}>
          <Animated.Text style={[styles.statLabel, { color: Colors.textSecondary }]}>
            Spent
          </Animated.Text>
          <Animated.Text style={[styles.statValue, { color: Colors.textPrimary }]}>
            {formatCurrency(spent, currency)}
          </Animated.Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  remainingLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  remainingAmount: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  track: {
    height: 8,
    borderRadius: BorderRadius.round,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: BorderRadius.round,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  statItem: {
    gap: 2,
  },
  statItemRight: {
    alignItems: 'flex-end',
  },
  statLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  // Compact styles for card view
  compactContainer: {
    paddingTop: Spacing.sm,
  },
  compactTrack: {
    height: 4,
    borderRadius: BorderRadius.round,
    overflow: 'hidden',
  },
  compactFill: {
    height: '100%',
    borderRadius: BorderRadius.round,
  },
});
