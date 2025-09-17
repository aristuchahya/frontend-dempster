<template>
  <div class="p-4 w-1/2 m-auto">
    <div class="flex">
      <h1 class="text-xl font-bold mb-4">Daftar Penyakit</h1>
      <router-link to="/form-penyakit" class="ml-auto">
        <Button variant="default">Add</Button>
      </router-link>
    </div>
    <form class="mb-4 mt-2" @submit="submitFilter">
      <FormReuse name="search" type="search" placeholder="Cari Penyakit..." />
    </form>

    <DataTable :columns="columns" :rows="penyakit_col">
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <DialogPenyakit :penyakit="row" />
          <Button
            size="sm"
            variant="destructive"
            @click="handleDelete(row.kd_penyakit)"
          >
            Delete
          </Button>
        </div>
      </template>
    </DataTable>
  </div>
</template>
<script setup lang="ts">
import usePenyakit from "@/service/penyakit";
import DataTable from "../DataTable.vue";
import FormReuse from "../form-data/FormReuse.vue";
import { Button } from "../ui/button";
import DialogPenyakit from "../dialog-edit/DialogPenyakit.vue";

const { penyakit_col, columns, handleDelete, submitFilter } = usePenyakit();
</script>
<style></style>
