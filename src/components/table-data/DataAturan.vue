<template>
  <div class="p-4 w-1/2 m-auto">
    <div class="flex">
      <h1 class="text-xl font-bold mb-4">Daftar Aturan</h1>
      <router-link to="/form-product" class="ml-auto">
        <Button variant="default">Add</Button>
      </router-link>
    </div>
    <form class="mb-4 mt-2" @submit="submitFilter">
      <FormReuse name="search" type="search" placeholder="Cari Aturan..." />
    </form>

    <DataTable :columns="columns" :rows="aturan">
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <DialogProduct :product="row" />
          <Button
            size="sm"
            variant="destructive"
            @click="handleDelete(row.kode_ikan)"
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
import DataTable from "../DataTable.vue";

import FormReuse from "../form-data/FormReuse.vue";
import { Button } from "../ui/button";

import useAturan from "@/service/aturan";

const { aturan, columns, handleDelete, submitFilter, isSubmitting, onSubmit } =
  useAturan();
</script>
<style></style>
