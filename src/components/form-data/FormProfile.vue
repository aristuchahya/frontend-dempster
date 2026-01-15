<template>
  <div>
    <Card class="w-1/2 mt-4 mx-auto max-h-fit">
      <CardHeader>
        <CardTitle>Form Profile User</CardTitle>
        <CardDescription
          >Form ini digunakan untuk menambahkan informasi dari
          pengguna</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit" class="flex flex-col">
          <FormReuse name="nama" type="text" label="Nama Lengkap" />
          <SelectReuse
            name="jenis_kelamin"
            label="Jenis Kelamin"
            group-label="Jenis Kelamin"
            :options="['Laki-laki', 'Perempuan']"
          />
          <FormReuse name="umur" type="number" label="Umur" />
          <FormReuse name="whatsapp" type="text" label="Nomor Whatsapp" />
          <FormReuse name="alamat" type="text" label="Alamat Domisili" />
          <FormReuse name="nama_orangtua" type="text" label="Nama Orangtua" />
          <!-- <FormReuse name="noip" type="text" label="Nomor Ip" /> -->
          <FormReuse
            name="tanggal"
            type="date"
            label="Tanggal"
            placeholder="yyyy-mm-dd"
          />
          <FormReuse name="prodi" type="text" label="Program Studi" />
          <FormReuse name="semester" type="text" label="Semester" />
          <!-- <SelectReuse
            name="asuransi"
            label="Kepemilikan Asuransi"
            group-label="Kepemilikan Asuransi"
            :options="['Ada', 'Tidak Ada']"
          /> -->
          <Button
            type="submit"
            :disabled="isSubmitting"
            class="cursor-pointer mt-4 ml-auto"
          >
            <span v-if="isSubmitting" class="animate-spin mr-2">⏳</span>
            {{ isSubmitting ? "Memproses..." : "Submit" }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
<script setup lang="ts">
import useProfile from "@/service/profile";
import SelectReuse from "../select-data/SelectReuse.vue";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import FormReuse from "./FormReuse.vue";

const { onSubmit, isSubmitting } = useProfile();
</script>
