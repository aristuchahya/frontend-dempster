<template>
  <div class="p-4 w-1/2 m-auto">
    
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

const {hasil, columns, submitFilter} = useHasil()
</script>
<style></style>
