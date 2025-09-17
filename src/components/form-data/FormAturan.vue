<template>
  <div>
    <Card class="w-1/2" id="card-form1">
      <CardHeader>
        <CardTitle>Form Aturan</CardTitle>
        <CardDescription
          >Form ini digunakan untuk menambahkan aturan baru</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit" class="flex flex-col">
          <FormReuse name="penyakit_code" type="text" label="Kode Penyakit" />
          <FormReuse name="gejala_code" type="text" label="Kode Gejala" />
          <FormReuse name="bobot" type="number" label="Bobot" />

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
    penyakit_code: z.string().min(1, "Kode Penyakit tidak boleh kosong"),
    gejala_code: z.string().min(1, "Kode Gejala tidak boleh kosong"),
    bobot: z
      .string()
      .regex(/^[0-9]*\.?[0-9]*$/, "Bobot harus angka")
      .transform((val) => (val === "" ? null : parseFloat(val)))
      .refine((val) => val !== null && val >= 0, {
        message: "Bobot minimal 0",
      }),
  })
);

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await api.post("/aturan", values);
    toast.success("aturan Berhasil Ditambahkan");
    resetForm();
    await router.push("/aturan");
  } catch (error) {
    toast.error("aturan Gagal Ditambahkan");
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
