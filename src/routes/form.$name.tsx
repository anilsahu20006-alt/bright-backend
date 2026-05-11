import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/FormDetail";
export const Route = createFileRoute("/form/$name")({ component: Page });
