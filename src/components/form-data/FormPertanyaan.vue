<template>
  <div>
    <Card class="w-4/5 mt-4 mx-auto max-h-fit">
      <CardHeader>
        <CardTitle>Form Pernyataan Diagnosis</CardTitle>
        <CardDescription
          >Form ini digunakan untuk menjawab pertanyaan
          diagnosis</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form @submit.prevent="submitAnswer" class="flex flex-col">
          <div v-for="(item, index) in gejala" :key="item.kd_gejala">
            <RadioReuse
              :name="`gejala_${item.kd_gejala}`"
              :label="item.nama"
              :options="options"
              :model-value="answers[index].nilai"
              @update:modelValue="(val) => (answers[index].nilai = Number(val))"
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
import RadioReuse from "../radio-data/RadioReuse.vue";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useUserStore } from "@/stores/user_store";

import { ref, watch } from "vue";

import { useRouter } from "vue-router";
import api from "@/lib/axios";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import useGejala from "@/service/gejala";

// Interface definitions
interface AnswerItems {
  gejala_code: string;
  nilai: number;
}

interface AnswerBatch {
  user_id: string;
  batch_id: string | null;
  items: AnswerItems[];
}

interface RadioOptions {
  value: string | number;
  label: string;
  disabled?: boolean;
}

const userStore = useUserStore();
const userId = userStore.getUserId;
const router = useRouter();
const { gejala } = useGejala();

const answers = ref<AnswerItems[]>([]);

watch(
  gejala,
  (newVal) => {
    if (newVal && newVal.length) {
      answers.value = newVal.map((g) => ({
        gejala_code: g.kd_gejala,
        nilai: 0,
      }));
    }
  },
  { immediate: true }
);

const error = ref<string | null>(null);
const success = ref(false);

const options: RadioOptions[] = [
  {
    value: 1,
    label: "Tidak Sama Sekali",
  },
  {
    value: 2,
    label: "Kadang-Kadang",
  },
  {
    value: 3,
    label: "Biasa",
  },
  {
    value: 4,
    label: "Sering",
  },
  {
    value: 5,
    label: "Selalu",
  },
];

const { isSubmitting } = useForm();

const submitAnswer = async () => {
  try {
    const payload: AnswerBatch = {
      user_id: userId,
      batch_id: null,
      items: answers.value,
    };

    console.log("Payload:", payload);

    await api.post("/jawaban/batch", payload);

    success.value = true;
    toast.success("Jawaban berhasil dikirim");
    setTimeout(() => {
      router.push("/process");
    }, 2000);
  } catch (err) {
    error.value = "Gagal mengirim jawaban";
  }
};
</script>
<style></style>
