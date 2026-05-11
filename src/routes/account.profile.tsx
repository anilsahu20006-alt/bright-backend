import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/account/Profile";
export const Route = createFileRoute("/account/profile")({ component: Page });
