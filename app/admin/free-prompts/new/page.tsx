import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdminAccess } from "@/lib/auth/admin";
import { FreePromptForm } from "@/components/admin/FreePromptForm";
export default async function NewFreePromptPage() { await requireAdminAccess("/admin/free-prompts/new"); return <div className="mx-auto w-full max-w-[1100px]"><Link href="/admin/free-prompts" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Prompt miễn phí</Link><h1 className="mt-4 text-2xl font-extrabold text-white">Thêm Prompt</h1><div className="mt-6"><FreePromptForm/></div></div>; }
