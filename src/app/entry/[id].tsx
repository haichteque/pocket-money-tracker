/**
 * Entry Detail Screen — Shows all expenses for an entry with real-time
 * budget calculation and a remaining budget bar.
 */
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEntries } from '@/context/EntriesContext';
import { ExpenseRow } from '@/components/ExpenseRow';
import { BudgetBar } from '@/components/BudgetBar';
import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
  BorderRadius,
  Shadow,
} from '@/constants/theme';
import {
  formatCurrency,
  formatDate,
  getTotalExpenses,
  getRemainingBudget,
} from '@/utils/helpers';

export default function EntryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getEntry, addExpense, deleteExpense, deleteEntry } = useEntries();

  const [taskInput, setTaskInput] = useState('');
  const [costInput, setCostInput] = useState('');
  const taskInputRef = useRef<TextInput>(null);
  const costInputRef = useRef<TextInput>(null);
  const listRef = useRef<FlatList>(null);

  const scrollToBottom = useCallback(() => {
    // Small delay to let the keyboard finish animating before scrolling
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, []);

  const entry = getEntry(id ?? '');

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

  const spent = getTotalExpenses(entry.expenses);
  const remaining = getRemainingBudget(entry);

  const handleAddExpense = () => {
    const task = taskInput.trim();
    const cost = parseFloat(costInput);
    if (!task || isNaN(cost) || cost <= 0) return;

    addExpense(entry.id, task, cost);
    setTaskInput('');
    setCostInput('');
    taskInputRef.current?.focus();
  };

  const handleDeleteExpense = (expenseId: string) => {
    deleteExpense(entry.id, expenseId);
  };

  const handleDeleteEntry = () => {
    Alert.alert(
      'Delete Entry',
      `Are you sure you want to delete "${entry.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteEntry(entry.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {entry.title}
            </Text>
            <Text style={styles.headerDate}>{formatDate(entry.createdAt)}</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => router.push(`/edit/${entry.id}`)}
              style={styles.headerActionButton}
            >
              <Text style={styles.headerActionText}>Edit</Text>
            </Pressable>
            <Pressable
              onPress={handleDeleteEntry}
              style={styles.headerActionButton}
            >
              <Text style={[styles.headerActionText, { color: Colors.negative }]}>
                ✕
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Budget summary bar */}
        <View style={styles.budgetSection}>
          <BudgetBar
            budget={entry.budget}
            spent={spent}
            remaining={remaining}
            currency={entry.currency}
          />
        </View>

        {/* Expense list */}
        <FlatList
          ref={listRef}
          data={entry.expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ExpenseRow
              expense={item}
              currency={entry.currency}
              index={index}
              onDelete={handleDeleteExpense}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyExpenses}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyText}>No expenses yet</Text>
              <Text style={styles.emptySubtext}>
                Add your first expense below
              </Text>
            </View>
          }
          contentContainerStyle={
            entry.expenses.length === 0
              ? styles.emptyListContent
              : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        {/* Add expense input */}
        <View style={styles.addExpenseContainer}>
          <View style={styles.addExpenseInputs}>
            <TextInput
              ref={taskInputRef}
              style={[styles.expenseInput, styles.taskInput]}
              value={taskInput}
              onChangeText={setTaskInput}
              placeholder="Expense name"
              placeholderTextColor={Colors.textTertiary}
              returnKeyType="next"
              onFocus={scrollToBottom}
              onSubmitEditing={() => costInputRef.current?.focus()}
            />
            <TextInput
              ref={costInputRef}
              style={[styles.expenseInput, styles.costInput]}
              value={costInput}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9.]/g, '');
                setCostInput(cleaned);
              }}
              placeholder="Cost"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="numeric"
              returnKeyType="done"
              onFocus={scrollToBottom}
              onSubmitEditing={handleAddExpense}
            />
            <Pressable
              onPress={handleAddExpense}
              style={[
                styles.addButton,
                (!taskInput.trim() || !costInput) && styles.addButtonDisabled,
              ]}
              disabled={!taskInput.trim() || !costInput}
            >
              <Text style={styles.addButtonText}>+</Text>
            </Pressable>
          </View>
        </View>
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
  // Error state
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
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.sm,
    marginRight: Spacing.sm,
  },
  backArrow: {
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  headerDate: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headerActionButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  headerActionText: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  // Budget section
  budgetSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  // Expense list
  listContent: {
    paddingBottom: Spacing.lg,
  },
  emptyListContent: {
    flex: 1,
  },
  emptyExpenses: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.huge,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
  // Add expense
  addExpenseContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  addExpenseInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  expenseInput: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  taskInput: {
    flex: 2,
  },
  costInput: {
    flex: 1,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.sm,
  },
  addButtonDisabled: {
    backgroundColor: Colors.surfaceHighlight,
  },
  addButtonText: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.regular,
    color: Colors.white,
    marginTop: -1,
  },
});
