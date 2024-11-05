import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PageWrapper from "@/components/Wrapper";
import { AuthWrapper } from "@/components/Wrapper/authwrapper";
import { AuthProvider } from "@/components/Wrapper/universalState";
import Provider from "@/components/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Farmers angadi",
  description: "Your local online market",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <AuthProvider>
            <AuthWrapper>
              <PageWrapper>{children}</PageWrapper>
            </AuthWrapper>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
