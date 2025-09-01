<template>
  <div>
    <Card class="mt-4 w-1/2 mx-auto max-h-fit">
      <CardHeader class="text-center">
        <CardTitle>Hasil Diagnosis</CardTitle>
        <CardDescription class="mt-4"
          >Berikut hasil diagnosis anda
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div class="my-4">
          <BadgeCheck class="w-60 h-60 mx-auto" color="#08CB00" />
        </div>
        <!-- <Loader class="animate-spin" /> -->
        <div class="text-center my-4">
          <CardTitle>Gangguan Mental</CardTitle>
          <CardDescription class="mt-3">
            {{ result?.penyakit }}
          </CardDescription>
        </div>
        <div class="text-center my-4">
          <CardTitle>Skor</CardTitle>
          <CardDescription class="mt-3"> {{ result?.nilai }} </CardDescription>
        </div>
        <div class="text-center my-4">
          <CardTitle>Saran</CardTitle>
          <CardDescription class="mt-3"> {{ result?.solusi }} </CardDescription>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "../ui/card";

import { BadgeCheck } from "lucide-vue-next";
import { useUserStore } from "@/stores/user_store";
import api from "@/lib/axios";
import { toast } from "vue-sonner";

interface Result {
  penyakit: string;
  nilai: number;
  solusi: string;
}

const useStore = useUserStore();
const userId = useStore.getUserId;

const result = ref<Result | null>(null);

const fetchLastResult = async () => {
  try {
    const res = await api.get(`jawaban/diagnosis/${userId}/last`);
    result.value = res.data.result;
    toast.success("Berhasil mendapatkan hasil diagnosis");
  } catch (error) {
    toast.error("Gagal mendapatkan hasil diagnosis");
  }
};

onMounted(() => {
  fetchLastResult();
});
</script>
<style></style>
