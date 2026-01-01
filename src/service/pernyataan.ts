import api from "@/lib/axios";
import { useUserStore } from "@/stores/user_store";
import type { Pernyataan } from "@/types/pernyataan";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

export default function usePernyataan() {
const statements = ref([] as Pernyataan[])
const answerByStatement = ref<Record<string, any[]>>({})
const selectedAnswers = ref<Record<string, string>>({})
const result = ref(null)
const isLoading = ref(false)
const router = useRouter()

const userStore = useUserStore()
const userId = userStore.getUserId

// const userId = "rwlo13hekz"


const fetchStatements = async () => {
try {
    const res = await api.get("/diagnosis/get_statements")
    statements.value = res.data
} catch (error) {
    toast.error("Data pernyataan gagal diambil")
}
}


const fetchAnswers = async () => {
try {
    const res = await api.get("/diagnosis/get_answers")

    const grouped: Record<string, any[]> = {}

    for (const ans of res.data) {
    if (!grouped[ans.statement_id]) {
        grouped[ans.statement_id] = []
    }
    grouped[ans.statement_id].push(ans)
    }

    answerByStatement.value = grouped
} catch (error) {
    toast.error("Data pilihan jawaban gagal diambil")
}
}

const submitDiagnosis = async () => {
try {
    isLoading.value = true

    const payload = {
    user_id: userId,
    answers: selectedAnswers.value
    }

    const res = await api.post("/diagnosis/get_diagnosis", payload)
    result.value = res.data

    toast.success("Berhasil mendapatkan hasil diagnosis")
    setTimeout(() => {
        router.push("/result")
    })
} catch (error) {
    toast.error("Gagal mendapatkan hasil diagnosis")
} finally {
    isLoading.value = false
}
}


onMounted(async () => {
isLoading.value = true
await Promise.all([fetchStatements(), fetchAnswers()])
isLoading.value = false
})


return {
statements,
answerByStatement,
selectedAnswers,
result,
isLoading,
submitDiagnosis
}
}