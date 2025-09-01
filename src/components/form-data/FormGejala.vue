<template>
  <div>
    <Card class="w-1/2" id="card-form1">
      <CardHeader>
        <CardTitle>Form Gejala</CardTitle>
        <CardDescription
          >Form ini digunakan untuk menambahkan gejala baru</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit" class="flex flex-col">
          <FormReuse name="kd_gejala" type="text" label="Kode Gejala" />
          <FormReuse name="nama" type="text" label="Gejala" />
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
import { useRouter } from "vue-router";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import FormReuse from "./FormReuse.vue";
import { toTypedSchema } from "@vee-validate/zod";
import z from "zod";
import { useForm } from "vee-validate";
import api from "@/lib/axios";
import { toast } from "vue-sonner";

const router = useRouter();

const formSchema = toTypedSchema(
  z.object({
    kd_gejala: z.string().min(1, "Kode Gejala tidak boleh kosong"),
    nama: z.string().min(1, "Gejala tidak boleh kosong"),
  })
);

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await api.post("/gejala", values);
    toast.success("Gejala Berhasil Ditambahkan");
    resetForm();
    await router.push("/gejala");
  } catch (error) {
    toast.error("Gejala Gagal Ditambahkan");
  }
});
</script>
<style>
#card-form1 {
  max-height: fit-content;
  margin-left: auto;
  margin-right: auto;
  margin-top: 12pt;
}
</style>
