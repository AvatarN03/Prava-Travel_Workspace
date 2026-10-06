import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In or Sign Up",
  description:
    "Access your Prava travel workspace. Plan multi-day itineraries, organize stays, track expenses, and explore with structured AI assistance.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
