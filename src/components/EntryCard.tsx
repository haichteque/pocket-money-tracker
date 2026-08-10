/**
 * Entry card component for the home screen list.
 * Displays entry summary with mini budget bar.
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';
import { BudgetBar } from '@/components/BudgetBar';
import type { Entry } from '@/types';
import {
  formatCurrency,
  formatDate,
  getTotalExpenses,
  getRemainingBudget,
} from '@/utils/helpers';

interface EntryCardProps {
  entry: Entry;
  onPress: () => void;
}

export function EntryCard({ entry, onPress }: EntryCardProps) {
  const spent = getTotalExpenses(entry.expenses);
  const remaining = getRemainingBudget(entry);
  const isNegative = remaining < 0;
  const expenseCount = entry.expenses.length;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {entry.title}
          </Text>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isNegative ? Colors.negative : Colors.positive },
            ]}
          />
        </View>
        <Text style={styles.date}>{formatDate(entry.createdAt)}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Budget</Text>
          <Text style={styles.statValue}>
            {formatCurrency(entry.budget, entry.currency)}
          </Text>
        </View>
        <View style={[styles.stat, styles.statRight]}>
          <Text style={styles.statLabel}>Remaining</Text>
          <Text
            style={[
              styles.statValue,
              { color: isNegative ? Colors.negative : Colors.positive },
            ]}
          >
            {formatCurrency(remaining, entry.currency)}
          </Text>
        </View>
      </View>

      <BudgetBar
        budget={entry.budget}
        spent={spent}
        remaining={remaining}
        currency={entry.currency}
        compact
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {expenseCount} {expenseCount === 1 ? 'expense' : 'expenses'}
        </Text>
        <Text style={styles.footerChevron}>→</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  cardPressed: {
    backgroundColor: Colors.surfaceElevated,
    transform: [{ scale: 0.98 }],
  },
  header: {
    marginBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  date: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    gap: 2,
  },
  statRight: {
    alignItems: 'flex-end',
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerText: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  footerChevron: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
});
