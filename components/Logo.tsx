import { Leaf } from "lucide-react"

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full p-2">
        <Leaf className="h-6 w-6 text-white" />
      </div>
      <span className="text-xl font-bold text-white">AgriMed Hub</span>
    </div>
  )
}
