<template>
  <div>
    <Card class="mt-4 w-1/2 mx-auto max-h-fit">
      <CardContent>
        <!-- <Loader class="animate-spin" /> -->
        <div class="text-center my-4">
          <CardTitle>Klik untuk melakukan diagnosis</CardTitle>
        </div>
        <div v-if="isLoading" class="flex justify-center my-4">
          <p class="mr-2">Melakukan Diagnosis</p>
          <Loader class="animate-spin w-6 h-6 text-gray-500" />
        </div>
        <form @submit.prevent="onSubmit">
          <div class="text-center">
            <Button variant="default" :disabled="isLoading">Diagnosis</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
<script setup lang="ts">
// import { BadgeCheck } from "lucide-vue-next";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useUserStore } from "@/stores/user_store";
import { onMounted, ref } from "vue";
import api from "@/lib/axios";
import { toast } from "vue-sonner";
import router from "@/router";
import { Loader } from "lucide-vue-next";

interface Payload {
  user_id: string;
  batch_id: string;
}

interface Batch {
  batch_id: string;
}

const isLoading = ref(false);
const useStore = useUserStore();
const userId = useStore.getUserId;
console.log(userId);

const batch = ref<Batch | null>(null);

const fetchBatch = async () => {
  try {
    const res = await api.get(`/jawaban/${userId}/last_batch`);
    batch.value = res.data;
    console.log(batch.value);

    toast.success("Berhasil mendapat batch_id");
  } catch (error) {
    toast.error("Gagal mengambil batch_id");
  }
};

onMounted(() => {
  fetchBatch();
});

const onSubmit = async () => {
  if (!userId) {
    toast.error("User ID tidak ditemukan");
    return;
  }

  if (!batch.value || !batch.value.batch_id) {
    toast.error("Batch ID tidak tersedia");
    return;
  }

  isLoading.value = true;
  try {
    const payload: Payload = {
      user_id: userId,
      batch_id: batch.value.batch_id,
    };

    await api.post(`/jawaban/run_diagnosis`, payload);
    toast.success("Berhasil menjalankan diagnosis");
    router.push("/result");
  } catch (error) {
    toast.error("Gagal menjalankan diagnosis");
  } finally {
    isLoading.value = false;
  }
};
</script>
<style></style>
