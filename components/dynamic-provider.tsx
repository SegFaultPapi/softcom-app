"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export function AppPrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["email", "google", "apple", "microsoft"],
        appearance: {
          theme: "light",
          accentColor: "#00c2e0",
          logo: "/SOFTCOM_LOGO.png",
          landingHeader: "Accede a tu cuenta",
          loginMessage: "Usa tu correo institucional o cuenta de Google.",
        },
        embeddedWallets: {
          createOnLogin: "all-users",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
