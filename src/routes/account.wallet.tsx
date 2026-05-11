import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/account/WalletPage";
export const Route = createFileRoute("/account/wallet")({ component: Page });
