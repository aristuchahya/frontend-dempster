<template>
  <div>
    <div v-if="isLoading">Memuat Data</div>
    <!-- <pre>{{ selectedAnswers }}</pre> -->


    <Card class="w-4/5 mt-4 mx-auto max-h-fit">
      <CardHeader>
        <CardTitle>Form Pernyataan Diagnosis</CardTitle>
        <CardDescription
          >Form ini digunakan untuk menjawab pertanyaan
          diagnosis</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form @submit.prevent="submitDiagnosis" class="flex flex-col">
          <div v-for="item in statements" :key="item.id">
            <RadioReuse
              :label="item.text"
              :options="answerByStatement[item.id] || []"
              :model-value="selectedAnswers[item.code] ?? null"
              @update:modelValue="val => selectedAnswers[item.code] = val"
            />
          </div>
          <Button
            type="submit"
            :disabled="isSubmitting"
            class="cursor-pointer mt-4 ml-auto"
          >
            <span v-if="isSubmitting" class="animate-spin mr-2">⏳</span>
            {{ isSubmitting ? "Memproses..." : "Submit" }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
<script setup lang="ts">
import usePernyataan from '@/service/pernyataan';
import RadioReuse from '../radio-data/RadioReuse.vue';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useForm } from 'vee-validate';

const {submitDiagnosis, answerByStatement, isLoading, selectedAnswers, statements} = usePernyataan()
const { isSubmitting } = useForm();


</script>