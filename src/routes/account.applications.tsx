import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/account/Applications";
export const Route = createFileRoute("/account/applications")({ component: Page });
