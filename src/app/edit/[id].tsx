/**
 * Edit Entry Screen — Modal for editing an existing entry's title, budget, and currency.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEntries } from '@/context/EntriesContext';
import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
  BorderRadius,
  CURRENCIES,
} from '@/constants/theme';

export default function EditEntryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getEntry, updateEntry } = useEntries();

  const entry = getEntry(id ?? '');

  const [title, setTitle] = useState(entry?.title ?? '');
  const [budget, setBudget] = useState(entry?.budget.toString() ?? '');
  const [currency, setCurrency] = useState(entry?.currency ?? 'PKR');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const selectedCurrency = CURRENCIES.find((c) => c.code === currency);
  const isValid = title.trim().length > 0 && parseFloat(budget) > 0;

  if (!entry) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Entry not found</Text>
          <Pressable onPress={() => router.back()} style={styles.errorButton}>
            <Text style={styles.errorButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleSave = () => {
    if (!isValid) return;
    updateEntry({
      ...entry,
      title: title.trim(),
      budget: parseFloat(budget),
      currency,
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Edit Entry</Text>
          <Pressable
            onPress={handleSave}
            disabled={!isValid}
            style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
          >
            <Text
              style={[
                styles.saveText,
                !isValid && styles.saveTextDisabled,
              ]}
            >
              Save
            </Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Entry Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Pocket money for July"
              placeholderTextColor={Colors.textTertiary}
              autoFocus
            />
          </View>

          {/* Budget input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Budget Amount</Text>
            <View style={styles.budgetRow}>
              <Pressable
                style={styles.currencySelector}
                onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
              >
                <Text style={styles.currencySymbol}>
                  {selectedCurrency?.symbol}
                </Text>
                <Text style={styles.currencyCode}>{currency}</Text>
                <Text style={styles.chevron}>▼</Text>
              </Pressable>
              <TextInput
                style={[styles.input, styles.budgetInput]}
                value={budget}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9.]/g, '');
                  setBudget(cleaned);
                }}
                placeholder="30000"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Currency picker */}
          {showCurrencyPicker && (
            <View style={styles.currencyList}>
              {CURRENCIES.map((cur) => (
                <Pressable
                  key={cur.code}
                  style={[
                    styles.currencyItem,
                    currency === cur.code && styles.currencyItemActive,
                  ]}
                  onPress={() => {
                    setCurrency(cur.code);
                    setShowCurrencyPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.currencyItemSymbol,
                      currency === cur.code && styles.currencyItemTextActive,
                    ]}
                  >
                    {cur.symbol}
                  </Text>
                  <View style={styles.currencyItemInfo}>
                    <Text
                      style={[
                        styles.currencyItemCode,
                        currency === cur.code && styles.currencyItemTextActive,
                      ]}
                    >
                      {cur.code}
                    </Text>
                    <Text style={styles.currencyItemName}>{cur.name}</Text>
                  </View>
                  {currency === cur.code && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </Pressable>
              ))}
            </View>
          )}

          {/* Info note */}
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              Changing the budget will recalculate the remaining balance for all
              existing expenses.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  errorButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  errorButtonText: {
    color: Colors.white,
    fontWeight: FontWeight.semibold,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.md,
  },
  backText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.surfaceElevated,
  },
  saveText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
  saveTextDisabled: {
    color: Colors.textTertiary,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  inputGroup: {
    marginBottom: Spacing.xxl,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  budgetRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  currencySelector: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  currencySymbol: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  currencyCode: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  chevron: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginLeft: 2,
  },
  budgetInput: {
    flex: 1,
  },
  currencyList: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xxl,
    overflow: 'hidden',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  currencyItemActive: {
    backgroundColor: Colors.surfaceElevated,
  },
  currencyItemSymbol: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    width: 36,
  },
  currencyItemInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  currencyItemCode: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  currencyItemName: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  currencyItemTextActive: {
    color: Colors.primary,
  },
  checkmark: {
    fontSize: FontSize.lg,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  infoIcon: {
    fontSize: FontSize.md,
  },
  infoText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
