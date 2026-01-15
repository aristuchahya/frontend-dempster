<template>
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">Login</h1>
          <p class="text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div class="grid gap-4">
          <form @submit="onSubmit">
            <div class="grid gap-2">
              <FormReuse
                name="username"
                type="text"
                label="Username"
                placeholder="risttt"
              />
            </div>
            <div class="grid gap-2">
              <FormReuse
                name="password"
                type="password"
                label="Password"
                placeholder="*******"
              />
            </div>
            <Button
              type="submit"
              :disabled="isSubmitting"
              class="w-full cursor-pointer mt-2"
            >
              <span v-if="isSubmitting" class="animate-spin mr-2">⏳</span>
              {{ isSubmitting ? "Memproses..." : "Login" }}
            </Button>
          </form>
        </div>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <!-- <a href="#" class="underline">
            Sign up
          </a> -->
          <router-link to="/register" class="underline"> Sign up </router-link>
        </div>
        <div class="mt-1 text-center text-sm">
          Back to home?
          <router-link to="/dashboard" class="underline"> Home </router-link>
        </div>
      </div>
    </div>

    <div class="hidden lg:block">
      <div class="h-full w-full max-h-screen">
        <img
          src="https://i.pinimg.com/736x/a5/c9/a0/a5c9a08c54203c95f78d61decd458213.jpg"
          alt="Image"
          class="w-full h-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import FormReuse from "@/components/form-data/FormReuse.vue";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useUserStore } from "@/stores/user_store";

import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import * as z from "zod";

const router = useRouter();
const useAuth = useUserStore();

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(1, "Username tidak boleh kosong"),
    password: z.string().min(1, "Password tidak boleh kosong"),
  })
);

const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(
  async (values) => {
    try {
      const res = await api.post("/auth/login", values);
      const { token, user } = res.data;

      useAuth.setAuth(token, user);

      // console.log("sudah klik");
      // sessionStorage.setItem("token", token);
      // sessionStorage.setItem("user", JSON.stringify(user));

      toast.success("Login Berhasil");
      if (user.role == "admin") {
        await router.push("/gejala");
      } else {
        await router.push("/profile");
      }
      resetForm();
    } catch (error) {
      toast.error("Login Gagal");
    }
  },
  (e) => {
    console.log(e);
  }
);
</script>
<style lang=""></style>
