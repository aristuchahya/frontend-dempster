<template>
  <div>
    <FormField v-slot="{ componentField }" :name="name">
      <FormItem>
        <FormLabel class="my-2">{{ label }}</FormLabel>

        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="props.placeholder" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup v-if="groupLabel" :label="groupLabel">
              <SelectItem
                v-for="option in options"
                :key="getOptionValue(option)"
                :value="getOptionValue(option)"
                :disabled="getOptionDisabled(option)"
              >
                {{ getOptionLabel(option) }}
              </SelectItem>
            </SelectGroup>
            <template v-else>
              <SelectItem
                v-for="option in options"
                :key="getOptionValue(option)"
                :value="getOptionValue(option)"
                :disabled="getOptionDisabled(option)"
              >
                {{ getOptionLabel(option) }}
              </SelectItem>
            </template>
          </SelectContent>
        </Select>
        <FormDescription v-if="description">
          {{ description }}
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
  </div>
</template>
<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type SelectOption =
  | string
  | number
  | {
      value: string | number;
      label: string;
      disabled?: boolean;
    };

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  options: SelectOption[];
  disabled?: boolean;
  groupLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Select an option...",
  disabled: false,
});

const getOptionValue = (option: SelectOption): string => {
  if (typeof option === "string" || typeof option === "number") {
    return String(option);
  }
  return String(option.value);
};

const getOptionLabel = (option: SelectOption): string => {
  if (typeof option === "string" || typeof option === "number") {
    return String(option);
  }
  return option.label;
};

const getOptionDisabled = (option: SelectOption): boolean => {
  if (typeof option === "string" || typeof option === "number") {
    return false;
  }
  return option.disabled || false;
};
</script>
<style></style>
