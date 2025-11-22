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


const { penyakit } = usePenyakit();

</script>
<style></style>
