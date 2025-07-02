import type { Metadata } from "next";
import { type ReactNode } from "react";
import HeaderTitle  from "@/components/HeaderTitle";
import { ThirdwebProvider } from "thirdweb/react";


export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">

      <body>
        <ThirdwebProvider>
        <header><HeaderTitle /></header>
        {props.children}
        </ThirdwebProvider>
      </body>
      
    </html>
  );
}
