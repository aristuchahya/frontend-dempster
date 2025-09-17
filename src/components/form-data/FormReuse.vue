<template>
  <div>
    <FormField v-slot="{ componentField }" :name="name">
      <FormItem>
        <FormLabel class="my-2">{{ label }}</FormLabel>
        <FormControl>
          <Input
            v-if="props.type === 'file'"
            type="file"
            :accept="props.accept"
            class="border rounded px-3 py-2 w-full"
            @change="(e: any) => componentField.onChange(e.target?.files?.[0] || null)"
          />
          <Input
            v-else-if="props.type === 'number'"
            type="text"
            inputmode="decimal"
            :placeholder="props.placeholder"
            :value="componentField.modelValue"
            @input="(e: any) => {
    const val = e.target.value;
    if (/^[0-9]*\.?[0-9]*$/.test(val)) {
      componentField.onChange(val === '' ? null : val);
    }
  }"
            class="py-2"
          />

          <Input
            v-else
            :type="props.type || 'text'"
            :placeholder="props.placeholder"
            v-bind="componentField"
            class="py-2"
          />
        </FormControl>
        <FormDescription v-if="description">{{
          props.description
        }}</FormDescription>
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
  FormMessage,
} from "../ui/form";
import FormLabel from "../ui/form/FormLabel.vue";
import { Input } from "../ui/input";

const props = defineProps<{
  name: string;
  label?: string;
  description?: string;
  type?: string;
  placeholder?: string;
  accept?: string;
}>();
</script>
<style lang=""></style>
