<template>
  <DialogReuse title="Edit Penyakit" description="Edit Penyakit">
    <template #trigger>
      <Button size="sm" variant="outline">Edit</Button>
    </template>
    <template #content>
      <form @submit.prevent="onSubmit">
        <FormReuse name="kd_penyakit" type="text" label="Kode Penyakit" />
        <FormReuse name="nama" type="text" label="Penyakit" />
        <FormReuse name="deskripsi" type="text" label="Deskripsi" />
        <FormReuse name="solusi" type="text" label="Solusi" />

        <DialogFooter class="mt-4">
          <Button type="submit" :disabled="isSubmitting" class="ml-auto">
            <span v-if="isSubmitting" class="animate-spin mr-2">⏳</span>
            {{ isSubmitting ? "Memproses..." : "Submit" }}
          </Button>
        </DialogFooter>
      </form>
    </template>
  </DialogReuse>
</template>
<script setup lang="ts">
import DialogReuse from "../form-data/DialogReuse.vue";
import FormReuse from "../form-data/FormReuse.vue";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { toTypedSchema } from "@vee-validate/zod";
import z from "zod";
import { useForm } from "vee-validate";
import api from "@/lib/axios";
import { toast } from "vue-sonner";
import type { Penyakit } from "@/types/penyakit";

const props = defineProps<{
  penyakit: Penyakit;
}>();

const emit = defineEmits(["updated"]);

const formSchema = toTypedSchema(
  z.object({
    kd_penyakit: z.string().optional(),
    nama: z.string().optional(),
    deskripsi: z.string().optional(),
    solusi: z.string().optional(),
  })
);

const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: {
    kd_penyakit: props.penyakit.kd_penyakit,
    nama: props.penyakit.nama,
    deskripsi: props.penyakit.deskripsi,
    solusi: props.penyakit.solusi,
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await api.patch(`/penyakit/${values.kd_penyakit}`, values);
    toast.success("Penyakit Berhasil Diupdate");
    resetForm();
    emit("updated");
  } catch (error) {
    toast.error("Penyakit Gagal Diupdate");
  }
});
</script>
<style></style>
