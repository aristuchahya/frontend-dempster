<template>
  <div>
    <Card class="mt-4 w-1/2 mx-auto max-h-fit">
      <CardHeader class="text-center">
        <CardTitle>Hasil Diagnosis</CardTitle>
        <CardDescription class="mt-4"
          >Berikut hasil diagnosis anda
        </CardDescription>
        <button
          @click="downloadPdf"
          class="absolute right-4 top-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          Download PDF
        </button>
      </CardHeader>

      <CardContent>
        <div class="my-4">
          <BadgeCheck class="w-60 h-60 mx-auto" color="#08CB00" />
        </div>
        <!-- <Loader class="animate-spin" /> -->
        <div class="text-center my-4">
          <CardTitle>Gangguan Mental</CardTitle>
          <CardDescription class="mt-3">
            {{ result?.penyakit }}
          </CardDescription>
        </div>
        <div class="text-center my-4">
          <CardTitle>Skor</CardTitle>
          <CardDescription class="mt-3"> {{ result?.nilai }} </CardDescription>
        </div>
        <div class="text-center my-4">
          <CardTitle>Saran</CardTitle>
          <CardDescription class="mt-3"> {{ result?.solusi }} </CardDescription>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "../ui/card";

import { BadgeCheck } from "lucide-vue-next";
import { useUserStore } from "@/stores/user_store";
import api from "@/lib/axios";
import { toast } from "vue-sonner";
import { jsPDF } from "jspdf";


interface Result {
  penyakit: string;
  nilai: number;
  solusi: string;
}


const useStore = useUserStore();
const userId = useStore.getUserId;

const result = ref<Result | null>(null);

const fetchLastResult = async () => {
  try {
    const res = await api.get(`jawaban/diagnosis/${userId}/last`);
    result.value = res.data.result;
    toast.success("Berhasil mendapatkan hasil diagnosis");
  } catch (error) {
    toast.error("Gagal mendapatkan hasil diagnosis");
  }
};

const downloadPdf = () => {
  if (!result.value) {
    toast.error("Tidak ada hasil diagnosis untuk diunduh");
    return;
  }

  const pdf = new jsPDF("p", "mm", "a4");


  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text("Laporan Hasil Diagnosis Kesehatan Mental", 105, 20, { align: "center" });

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}`, 20, 30);
  pdf.text(`Nama Pengguna: ${useStore.getUsername || "User"}`, 20, 37);


  pdf.setLineWidth(0.5);
  pdf.line(20, 42, 190, 42);


  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Hasil Diagnosis", 20, 52);

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Gangguan Mental : ${result.value.penyakit}`, 25, 62);
  pdf.text(`Skor : ${result.value.nilai}`, 25, 70);


  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Saran / Rekomendasi", 20, 85);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);


  const text = pdf.splitTextToSize(result.value.solusi, 170);
  pdf.text(text, 25, 95);


  pdf.setFontSize(10);
  pdf.setTextColor(150);
  pdf.text("Dicetak otomatis oleh Sistem Diagnosis Dempster-Shafer", 105, 285, {
    align: "center",
  });


  pdf.save(`Hasil-Diagnosis-${result.value.penyakit}.pdf`);
};

onMounted(() => {
  fetchLastResult();
});
</script>
<style></style>
