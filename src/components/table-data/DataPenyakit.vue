<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="flex items-center justify-between px-6 py-4 border-b">
      <h1 class="text-lg font-semibold">Sistem Diagnosis</h1>

      <RouterLink to="/login">
        <Button variant="ghost" class="text-sm">
          Login Admin
        </Button>
      </RouterLink>
    </header>

    <!-- Content -->
    <main class="flex-1">
      <Card class="mt-10 w-4/5 mx-auto max-h-fit">
        <CardContent
          v-for="item in penyakitData"
          :key="item.code"
          class="space-y-2"
        >
          <CardTitle>{{ item.name }}</CardTitle>
          <CardDescription class="mt-2">
            {{ item.description }}
          </CardDescription>
        </CardContent>

        <CardFooter class="flex justify-end">
          <RouterLink to="/create-user">
            <Button variant="default">
              Mulai Diagnosis
            </Button>
          </RouterLink>
        </CardFooter>
      </Card>
    </main>
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


const {penyakitData } = usePenyakit();

</script>
<style></style>
