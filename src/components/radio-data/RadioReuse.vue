<!-- <template>
  <div>
    <FormField v-slot="{ componentField }" :type="type" :name="name">
      <FormItem class="space-y-3 my-4">
        <FormLabel v-if="label">{{ label }}</FormLabel>

        <FormControl>
          <RadioGroup
            :class="containerClass"
            v-bind="componentField"
            :model-value="modelValue"
            @update:modelValue="$emit('update:modelValue', $event)"
          >
            <FormItem
              v-for="option in options"
              :key="option.value"
              :class="itemClass"
            >
              <FormControl>
                <RadioGroupItem
                  :value="option.value"
                  :disabled="option.disabled"
                />
              </FormControl>
              <FormLabel :class="labelClass">
                {{ option.label }}
              </FormLabel>
            </FormItem>
          </RadioGroup>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </div>
</template>
<script setup lang="ts">
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface Props {
  name: string;
  label?: string;
  options: RadioOption[];
  modelValue?: string | number;
  type?: string;
  containerClass?: string;
  itemClass?: string;
  labelClass?: string;
}

const {
  name,
  label,
  options,
  type = "radio",
  containerClass = "flex flex-col space-y-1",
  itemClass = "flex items-center space-y-0 gap-x-3",
  labelClass = "font-normal",
} = defineProps<Props>();

defineEmits(["update:modelValue"]);
</script>
<style></style> -->

<template>
  <div class="space-y-3 my-4">
    <p class="font-medium">{{ label }}</p>

    <RadioGroup v-model="internalValue" class="space-y-2">
      <div
        v-for="option in options"
        :key="option.id"
        class="flex items-center gap-x-3"
      >
        <RadioGroupItem :value="option.id" />
        <span>{{ option.label }}</span>
      </div>
    </RadioGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

const props = defineProps<{
  label: string
  options: {
    id: string
    label: string
  }[]
  modelValue?: string
}>()

const emit = defineEmits(["update:modelValue"])

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
})
</script>


