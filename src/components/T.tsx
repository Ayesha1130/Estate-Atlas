"use client";
import { useLang } from "@/lib/i18n";
export default function T({ k }: { k: string }) { return <>{useLang().t(k)}</>; }
