<template>
  <FormField v-slot="{ value, handleChange }" :name="name">
    <FormItem>
      <div v-if="label || description" class="mb-4">
        <FormLabel v-if="label" class="text-base">
          {{ label }}
        </FormLabel>
        <FormDescription v-if="description">
          {{ description }}
        </FormDescription>
      </div>

      <div
        v-for="item in items"
        :key="getItemKey(item)"
        :class="itemClass"
        class="flex flex-row items-start space-x-3 space-y-0"
      >
        <FormControl>
          <Checkbox
            :model-value="
              Array.isArray(value) ? value.includes(getItemValue(item)) : false
            "
            @update:model-value="
              (checked) =>
                handleCheckboxChange(
                  checked,
                  getItemValue(item),
                  value,
                  handleChange
                )
            "
            :disabled="getItemDisabled(item) || disabled"
          />
        </FormControl>
        <div class="grid gap-1.5 leading-none">
          <FormLabel
            :class="labelClass"
            class="font-normal cursor-pointer"
            @click="toggleItem(getItemValue(item), value, handleChange)"
          >
            {{ getItemLabel(item) }}
          </FormLabel>
          <FormDescription
            v-if="getItemDescription(item)"
            :class="itemDescriptionClass"
            class="text-sm"
          >
            {{ getItemDescription(item) }}
          </FormDescription>
        </div>
      </div>

      <FormMessage />
    </FormItem>
  </FormField>
</template>
<script setup lang="ts">
import { Checkbox } from "../ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

type CheckboxItem =
  | string
  | number
  | {
      id?: string | number;
      value?: string | number;
      label: string;
      description?: string;
      disabled?: boolean;
    };

interface Props {
  name: string;
  label?: string;
  description?: string;
  items: CheckboxItem[];
  disabled?: boolean;
  itemClass?: string;
  labelClass?: string;
  itemDescriptionClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  itemClass: "",
  labelClass: "",
  itemDescriptionClass: "",
});

// Handle checkbox change
const handleCheckboxChange = (
  checked: boolean | string,
  itemValue: string,
  currentValue: string[] | undefined,
  handleChange: (value: string[]) => void
) => {
  const currentArray = currentValue || [];

  if (checked) {
    // Add item if checked and not already in array
    if (!currentArray.includes(itemValue)) {
      handleChange([...currentArray, itemValue]);
    }
  } else {
    // Remove item if unchecked
    handleChange(currentArray.filter((item) => item !== itemValue));
  }
};

// Handle label click to toggle checkbox
const toggleItem = (
  itemValue: string,
  currentValue: string[] | undefined,
  handleChange: (value: string[]) => void
) => {
  const currentArray = currentValue || [];
  const isCurrentlyChecked = currentArray.includes(itemValue);

  handleCheckboxChange(
    !isCurrentlyChecked,
    itemValue,
    currentValue,
    handleChange
  );
};

// Helper functions to handle different item formats
const getItemKey = (item: CheckboxItem): string => {
  if (typeof item === "string" || typeof item === "number") {
    return String(item);
  }
  return String(item.id || item.value || item.label);
};

const getItemValue = (item: CheckboxItem): string => {
  if (typeof item === "string" || typeof item === "number") {
    return String(item);
  }
  return String(item.value || item.id || item.label);
};

const getItemLabel = (item: CheckboxItem): string => {
  if (typeof item === "string" || typeof item === "number") {
    return String(item);
  }
  return item.label;
};

const getItemDescription = (item: CheckboxItem): string | undefined => {
  if (typeof item === "string" || typeof item === "number") {
    return undefined;
  }
  return item.description;
};

const getItemDisabled = (item: CheckboxItem): boolean => {
  if (typeof item === "string" || typeof item === "number") {
    return false;
  }
  return item.disabled || false;
};
</script>
<style></style>
