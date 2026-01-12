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
        
        <div
        v-for="item in result?.results"
        class="border rounded-lg p-4 my-4"
        >
          <div class="text-center my-2">
            <CardTitle>{{ item.category }}</CardTitle>
            <CardDescription class="mt-1 text-sm">
              Tingkat: <strong>{{ item.level }}</strong>
            </CardDescription>
          </div>

          <div class="text-center my-4">
          <CardTitle>Gangguan Mental</CardTitle>
          <CardDescription class="mt-3">
            {{ item.disease }}
          </CardDescription>
        </div>

        <div class="text-center my-4">
          <CardTitle>Deskripsi</CardTitle>
          <CardDescription class="mt-3"> {{ item.description}} </CardDescription>
        </div>
        <div class="text-center my-4">
          <CardTitle>Saran</CardTitle>
          <CardDescription class="mt-3"> {{ item.solution }} </CardDescription>
        </div>
        </div>
        <div>
          <Button
            type="button"
            class="cursor-pointer mt-4 ml-auto"
            @click="clearSession"
          >
            Kembali
          </Button>
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
// import { useUserStore } from "@/stores/user_store";
import api from "@/lib/axios";
import { toast } from "vue-sonner";
import { jsPDF } from "jspdf";
import type { Profile } from "@/types/profile";
import { useResultStore } from "@/stores/result";
import router from "@/router";
import { Button } from "../ui/button";



// interface Result {
//   disease_name: string;
//   score: number;
//   level: string;
//   solution: string;
// }

interface Score {
  "category": string;
  "final_score": number;
}


interface Result {
  "category": string;
  "level": string;
  "disease": string;
  "description": string;
  "solution": string;
}

interface Results {
  "assesment_id": string
  "score": Score[]
  "results": Result[]
}

const userStore = useResultStore();
const userId = userStore.id

// const result = ref<Result | null>(null);
const result = ref<Results | null>(null);
const profile = ref<Profile | null>(null);

// const userId = "b1lpqsd0pw"

const fetchDiagnosis = async () => {
  try {
    const res_asessment = await api.get(`/assesment/${userId}`)
    const assesment_id = res_asessment.data?.asessment_id
    if (!assesment_id) throw new Error("Assesment ID not found")

    const res = await api.get(`/assesment/diagnosis/${assesment_id}`)

    result.value = res.data

    toast.success("Berhasil mendapatkan hasil diagnosis")


  } catch (error) {
    toast.error("Gagal mendapatkan hasil diagnosis")
  }
}

const fetchProfile = async () => {
  try {
    const user = await api.get(`/assesment/profile/${userId}`)
    profile.value = user.data?.data
    toast.success("Berhasil mendapatkan profile")
  } catch (error) {
    toast.error("Gagal mendapatkan profile")
  }
}

const clearSession = async () => {
  try {
    userStore.clear()
    router.push("/dashboard")
  } catch (error) {
    console.log(error)
  }
}


// const fetchLastResult = async () => {
//   try {
//     // const res = await api.get(`jawaban/diagnosis/${userId}/last`);
//     const res = await api.get(`diagnosis/get_result/${userId}`)
//     result.value = res.data.best_match;
//     toast.success("Berhasil mendapatkan hasil diagnosis");
//   } catch (error) {
//     toast.error("Gagal mendapatkan hasil diagnosis");
//   }
// };

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
  pdf.text(`Nama Lengkap: ${profile.value?.nama || "User"}`, 20, 37);
  pdf.text(`Umur: ${profile.value?.umur || "User"}`, 20, 44);
  pdf.text(`Jenis Kelamin: ${profile.value?.jenis_kelamin || "User"}`, 20, 51);
  pdf.text(`Prodi: ${profile.value?.prodi || "User"}`, 20, 58);


  pdf.setLineWidth(0.5);
  pdf.line(20, 42, 190, 42);

  let y = 25;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Hasil Diagnosis", 20, 52);
  y += 10;

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");

  result.value?.results?.forEach((item, index) => {
  pdf.setFontSize(12);
  pdf.text(`${index + 1}. ${item.category}`, 25, y);
  y += 8;

  pdf.setFontSize(10);
  pdf.text(`Tingkat   : ${item.level}`, 30, y); y += 6;
  pdf.text(`Gangguan  : ${item.disease}`, 30, y); y += 6;

  const descLines = pdf.splitTextToSize(
    `Deskripsi : ${item.description}`,
    155
  );
  pdf.text(descLines, 30, y);
  y += descLines.length * 6;

  const solLines = pdf.splitTextToSize(
    `Solusi : ${item.solution}`,
    155
  );
  pdf.text(solLines, 30, y);
  y += solLines.length * 6 + 8;

  pdf.line(25, y, 185, y);
  y += 8;

  // auto page break
  if (y > 270) {
    pdf.addPage();
    y = 25;
  }
});


  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Saran / Rekomendasi", 20, 85);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);


  // const text = pdf.splitTextToSize(result.value.solution, 170);
  // pdf.text(text, 25, 95);


  pdf.setFontSize(10);
  pdf.setTextColor(150);
  pdf.text("Dicetak otomatis oleh Sistem Diagnosis Dempster-Shafer", 105, 285, {
    align: "center",
  });


  pdf.save(`Hasil-Diagnosis-${result.value.results[0].category}.pdf`);
};

onMounted(() => {
  fetchDiagnosis();
  fetchProfile();
});
</script>
<style></style>
