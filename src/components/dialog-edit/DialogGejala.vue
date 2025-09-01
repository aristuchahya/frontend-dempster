<template>
  <DialogReuse title="Edit Gejala" description="Edit Produk">
    <template #trigger>
      <Button size="sm" variant="outline">Edit</Button>
    </template>
    <template #content>
      <form @submit.prevent="onSubmit">
        <FormReuse name="kd_gejala" type="text" label="Kode Gejala" />
        <FormReuse name="nama" type="text" label="Gejala" />

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
import type { Gejala } from "@/types/gejala";
import DialogReuse from "../form-data/DialogReuse.vue";
import FormReuse from "../form-data/FormReuse.vue";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { toTypedSchema } from "@vee-validate/zod";
import z from "zod";
import { useForm } from "vee-validate";
import api from "@/lib/axios";
import { toast } from "vue-sonner";

const props = defineProps<{
  gejala: Gejala;
}>();

const emit = defineEmits(["updated"]);

const formSchema = toTypedSchema(
  z.object({
    kd_gejala: z.string(),
    nama: z.string().optional(),
  })
);

const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: {
    kd_gejala: props.gejala.kd_gejala,
    nama: props.gejala.nama,
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await api.patch(`/gejala?kode=${values.kd_gejala}`, values);
    toast.success("Gejala Berhasil Diupdate");
    resetForm();
    emit("updated");
  } catch (error) {
    toast.error("Gejala Gagal Diupdate");
  }
});
</script>
<style></style>
