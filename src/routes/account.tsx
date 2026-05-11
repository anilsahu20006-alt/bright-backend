import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Account";
export const Route = createFileRoute("/account")({ component: Page });
