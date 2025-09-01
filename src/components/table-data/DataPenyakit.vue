<template>
  <div>
    <Card class="mt-4 w-4/5 mx-auto max-h-fit">
      <CardContent v-for="item in penyakit" :key="item.id">
        <CardTitle>{{ item.nama }}</CardTitle>
        <CardDescription class="mt-4"> {{ item.deskripsi }} </CardDescription>
      </CardContent>
      <CardFooter>
        <RouterLink to="/profile">
          <Button variant="default">Mulai Diagnosis</Button>
        </RouterLink>
      </CardFooter>
    </Card>
  </div>
</template>
<script setup lang="ts">
// import { ref } from "vue";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "../ui/card";

import usePenyakit from "@/service/penyakit";
// import { useForm } from "vee-validate";
// import api from "@/lib/axios";
// import { useUserStore } from "@/stores/user_store";
// import { toast } from "vue-sonner";

const { penyakit } = usePenyakit();
// const userStore = useUserStore();
// const userId = userStore.getUserId;

// const diagnosis = ref({} as any);
// const batch = ref({} as any);

// const fetchBatch = async () => {
//   try {
//     const batchId = await api.get(`/jawaban/${userId}/last_batch`)
//     batch.value = batchId
//     toast.success("Batch berhasil diambil")
//   } catch (error) {
//     toast.error("Batch gagal diambil")
//   }
// }

// fetchBatch()

// const { handleSubmit } = useForm({
//   initialValues: {
//     user_id: "",
//     batch_id : "",
//   },
// });

// const onSubmit = handleSubmit(async (values) => {
//   try {
//     await api.post("/jawaban/run_diagnosis". )
//   } catch (error) {

//   }
// })
</script>
<style></style>
