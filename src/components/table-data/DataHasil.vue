<template>
  <div class="p-4 w-1/2 m-auto">
    <h1 class="text-xl font-bold mb-4">Daftar Hasil</h1>
    
    <form class="mb-4 mt-2" @submit="submitFilter">
      <FormReuse name="search" type="search" placeholder="Cari Hasil..." />
    </form>

    <DataTable :columns="columns" :rows="hasil">
    </DataTable>

  </div>
</template>
<script setup lang="ts">

import DataTable from "../DataTable.vue";

import useHasil from "@/service/hasil";
import FormReuse from "../form-data/FormReuse.vue";

const {hasil, columns, submitFilter} = useHasil()

// const formatTanggal = (dateString: string) => {
//   return new Date(dateString).toLocaleDateString("id-ID", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   })
// }
</script>
<style></style>
