<template>
  <div class="p-4 w-1/2 m-auto">
    <div class="flex">
      <h1 class="text-xl font-bold mb-4">Daftar Gejala</h1>
      <router-link to="/form-gejala" class="ml-auto">
        <Button variant="default">Add</Button>
      </router-link>
    </div>
    <form class="mb-4 mt-2" @submit="submitFilter">
      <FormReuse name="search" type="search" placeholder="Cari Gejala..." />
    </form>

    <DataTable :columns="columns" :rows="gejala">
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <DialogGejala :gejala="row" />
          <Button
            size="sm"
            variant="destructive"
            @click="handleDelete(row.kd_gejala)"
          >
            Delete
          </Button>
        </div>
      </template>
    </DataTable>

    <form @submit="onSubmit" class="w-40 space-y-6 ml-auto">
      <FormReuse name="file" type="file" accept=".xls, .xlsx" />

      <Button type="submit" :disabled="isSubmitting" class="cursor-pointer">
        <span v-if="isSubmitting" class="animate-spin mr-2">⏳</span>
        {{ isSubmitting ? "Memproses..." : "Submit" }}
      </Button>
    </form>
  </div>
</template>
<script setup lang="ts">
import useGejala from "@/service/gejala";
import DataTable from "../DataTable.vue";
import FormReuse from "../form-data/FormReuse.vue";
import { Button } from "../ui/button";
import DialogGejala from "../dialog-edit/DialogGejala.vue";

const { columns, gejala, handleDelete, submitFilter, isSubmitting, onSubmit } =
  useGejala();
</script>
<style></style>
