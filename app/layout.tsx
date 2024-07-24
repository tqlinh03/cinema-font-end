import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "./lib/utils";
import { StoreProvider } from "@/app/components/store-provider";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { LayoutApp } from "./components/layout-app";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <StoreProvider>
      <html lang="en">
        <body  className={cn(
          inter.className,
        )}>
           <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
          <AntdRegistry>
            {/* <LayoutApp> */}
              {children}
            {/* </LayoutApp> */}
          </AntdRegistry>
        </body>
      </html>
    </StoreProvider>
  );
}
