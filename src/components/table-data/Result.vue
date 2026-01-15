<template>
  <div class="px-4 py-6">
    <Card class="max-w-4xl mx-auto shadow-md">
      
      <!-- HEADER -->
      <CardHeader class="relative text-center space-y-2">
        <CardTitle class="text-2xl font-bold">
          Hasil Diagnosis
        </CardTitle>
        <CardDescription>
          Ringkasan kondisi kesehatan mental berdasarkan assessment Anda
        </CardDescription>

        <Button
          @click="downloadPdf"
          class="absolute right-4 top-4"
          size="sm"
        >
          Download PDF
        </Button>
      </CardHeader>

      <CardContent class="space-y-8">

        <!-- RINGKASAN SKOR -->
        <section v-if="result?.scores.length">
          <h3 class="text-lg font-semibold text-center mb-4">
            Ringkasan Skor
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              v-for="s in result.scores"
              :key="s.category"
              class="rounded-xl border p-4 text-center bg-muted/40"
            >
              <p class="text-sm font-medium text-muted-foreground">
                {{ s.category }}
              </p>
              <p class="text-3xl font-bold mt-1">
                {{ s.final_score }}
              </p>
            </div>
          </div>
        </section>

        <!-- DETAIL DIAGNOSIS -->
        <section v-if="result?.results.length">
          <h3 class="text-lg font-semibold text-center mb-4">
            Rekomendasi & Saran
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="item in result.results"
              :key="item.category"
              class="rounded-xl border p-5 space-y-4 hover:shadow-sm transition"
            >
              <!-- HEADER -->
              <div class="text-center">
                <h4 class="font-semibold text-lg">
                  {{ item.category }}
                </h4>

                <p class="text-sm text-muted-foreground">
                  Tingkat:
                  <span class="font-medium">
                    {{ item.level }}
                  </span>
                </p>
              </div>

              <!-- SARAN -->
              <div class="text-sm leading-relaxed text-center">
                {{ item.solution }}
              </div>
            </div>
          </div>
          <div class="mt-2">
            <Button type="button"
            class="cursor-pointer mt-4 ml-auto"
            @click="clearSession">Kembali</Button>
          </div>
        </section>

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


// import { useUserStore } from "@/stores/user_store";
import api from "@/lib/axios";
import { toast } from "vue-sonner";
import { jsPDF } from "jspdf";
import type { Profile } from "@/types/profile";
import { useResultStore } from "@/stores/result";
import router from "@/router";
import { Button } from "../ui/button";





interface Score {
  category: string
  raw_score: number
  final_score: number
}

interface ResultItem {
  category: string
  level: string
  disease: string
  description: string
  solution: string
}

interface DiagnosisResponse {
  assessment_id: string
  scores: Score[]
  results: ResultItem[]
}
const userStore = useResultStore();
const userId = userStore.id

// const result = ref<Result | null>(null);
const result = ref<DiagnosisResponse | null>(null);
const profile = ref<Profile | null>(null);

// const userId = "b1lpqsd0pw"



const fetchDiagnosis = async () => {
  try {
    
    const resAssessment = await api.get(`/assesment/${userId}`)
    const assessment_id = resAssessment.data?.asessment_id
    console.log(assessment_id)

    if (!assessment_id) {
      throw new Error("Assessment ID not found")
    }

    
    const res = await api.get(`/assesment/diagnosis/${assessment_id}`)
    const data = res.data

    
    result.value = {
      assessment_id: data.assessment_id,
      scores: Array.isArray(data.scores) ? data.scores : [],
      results: Array.isArray(data.results) ? data.results : [],
    }

    toast.success("Berhasil mendapatkan hasil diagnosis")
  } catch (error) {
    console.error(error)
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



const getFinalScore = (category: string) => {
  return (
    result.value?.scores.find(
      (s) => s.category === category
    )?.final_score ?? "-"
  )
}

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

    pdf.setFont("helvetica", "normal")

    pdf.text(
    `Skor      : ${getFinalScore(item.category)}`,
    marginX + 5,
    y
  )
  y += 5

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
  fetchProfile();
  fetchDiagnosis();
});
</script>
<style></style>
