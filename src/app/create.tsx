/**
 * Create Entry Screen — Modal for creating a new budget entry.
 * Inputs: title, budget amount, and currency selector.
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
import { useRouter } from 'expo-router';
import { useEntries } from '@/context/EntriesContext';
import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
  BorderRadius,
  CURRENCIES,
} from '@/constants/theme';

export default function CreateEntryScreen() {
  const router = useRouter();
  const { addEntry } = useEntries();

  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('PKR');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const selectedCurrency = CURRENCIES.find((c) => c.code === currency);
  const isValid = title.trim().length > 0 && parseFloat(budget) > 0;

  const handleCreate = () => {
    if (!isValid) return;
    const entry = addEntry(title.trim(), parseFloat(budget), currency);
    router.replace(`/entry/${entry.id}`);
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
          <Text style={styles.headerTitle}>New Entry</Text>
          <Pressable
            onPress={handleCreate}
            disabled={!isValid}
            style={[styles.createButton, !isValid && styles.createButtonDisabled]}
          >
            <Text
              style={[
                styles.createText,
                !isValid && styles.createTextDisabled,
              ]}
            >
              Create
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
              returnKeyType="next"
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
                  // Allow only numbers and decimal points
                  const cleaned = text.replace(/[^0-9.]/g, '');
                  setBudget(cleaned);
                }}
                placeholder="30000"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="numeric"
                returnKeyType="done"
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

          {/* Preview */}
          {isValid && (
            <View style={styles.previewCard}>
              <Text style={styles.previewLabel}>Preview</Text>
              <Text style={styles.previewTitle}>{title}</Text>
              <Text style={styles.previewBudget}>
                {selectedCurrency?.symbol}{' '}
                {parseFloat(budget).toLocaleString('en-US')}
              </Text>
            </View>
          )}
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
  createButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  createButtonDisabled: {
    backgroundColor: Colors.surfaceElevated,
  },
  createText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
  createTextDisabled: {
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
  previewCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginTop: Spacing.md,
  },
  previewLabel: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  previewTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  previewBudget: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.positive,
  },
});
