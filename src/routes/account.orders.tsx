import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/account/Orders";
export const Route = createFileRoute("/account/orders")({ component: Page });
