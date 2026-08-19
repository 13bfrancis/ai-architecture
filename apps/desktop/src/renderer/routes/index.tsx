import { createFileRoute } from "@tanstack/react-router";
import { IntroShell } from "../components/intro-shell";

export const Route = createFileRoute("/")({
  component: IntroShell,
});
