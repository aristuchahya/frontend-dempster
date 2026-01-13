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
  if (!result.value?.results?.length) {
    toast.error("Tidak ada hasil diagnosis untuk diunduh");
    return;
  }

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const marginX = 20;
  const contentWidth = pageWidth - marginX * 2;

  let y = 20;


  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text(
    "LAPORAN HASIL DIAGNOSIS KESEHATAN MENTAL",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  y += 10;
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Tanggal Cetak : ${new Date().toLocaleDateString("id-ID")}`, marginX, y);
  y += 6;
  pdf.text(`Nama Lengkap : ${profile.value?.nama ?? "-"}`, marginX, y);
  y += 6;
  pdf.text(`Umur         : ${profile.value?.umur ?? "-"}`, marginX, y);
  y += 6;
  pdf.text(`Jenis Kelamin: ${profile.value?.jenis_kelamin ?? "-"}`, marginX, y);
  y += 6;
  pdf.text(`Prodi        : ${profile.value?.prodi ?? "-"}`, marginX, y);

  y += 5;
  pdf.setLineWidth(0.5);
  pdf.line(marginX, y, pageWidth - marginX, y);
  y += 10;


  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("HASIL DIAGNOSIS", marginX, y);
  y += 8;


  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);

  result.value.results.forEach((item, index) => {
    // Page break
    if (y > 260) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFont("helvetica", "bold");
    pdf.text(`${index + 1}. ${item.category}`, marginX, y);
    y += 6;

    pdf.setFont("helvetica", "normal");
    pdf.text(`Tingkat   : ${item.level}`, marginX + 5, y);
    y += 5;
    pdf.text(`Gangguan  : ${item.disease}`, marginX + 5, y);
    y += 5;

    // Deskripsi
    const desc = pdf.splitTextToSize(
      `Deskripsi : ${item.description}`,
      contentWidth - 10
    );
    pdf.text(desc, marginX + 5, y);
    y += desc.length * 5 + 2;

    // Solusi
    const sol = pdf.splitTextToSize(
      `Solusi : ${item.solution}`,
      contentWidth - 10
    );
    pdf.text(sol, marginX + 5, y);
    y += sol.length * 5 + 6;

    pdf.setLineWidth(0.3);
    pdf.line(marginX, y, pageWidth - marginX, y);
    y += 8;
  });


  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(9);
    pdf.setTextColor(150);
    pdf.text(
      "Dicetak otomatis oleh Sistem Diagnosis Dempster-Shafer",
      pageWidth / 2,
      287,
      { align: "center" }
    );
  }

  pdf.save(`Hasil-Diagnosis-${profile.value?.nama ?? "User"}.pdf`);
};

onMounted(() => {
  fetchDiagnosis();
  fetchProfile();
});
</script>
<style></style>
