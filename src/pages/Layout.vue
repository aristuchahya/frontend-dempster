<template>
  <SidebarProvider>
    <SidebarApp />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <div class="flex flex-1 items-center justify-end">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div class="flex flex-col leading-tight ml-3">
            <strong>{{ username }}</strong>
          </div>
        </div>
      </header>

      <div class="flex flex-1 flex-col gap-4 p-4 pt-0 mt-2">
        <router-view
          class="min-h-[100vh] flex-1 rounded-xl md:min-h-min"
          :key="$route.fullPath"
        />
        <Toaster position="bottom-right" />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
<script setup lang="ts">
import SidebarApp from "@/components/SidebarApp.vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useUserStore } from "@/stores/user_store";
import { onMounted, ref } from "vue";
import "vue-sonner/style.css";

const useAuth = useUserStore();

const username = ref("");
console.log(useAuth.getUsername);

onMounted(() => {
  username.value = useAuth.getUsername;
  if (!username.value) {
    username.value = "Guest";
  }
});
</script>
<style lang=""></style>
