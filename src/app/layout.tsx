import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import 'bootstrap/dist/css/bootstrap.css';
import "./globals.css";

export const metadata: Metadata = {
    title: "Storybook",
    description: "Where your story playing",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang='en'>
            <body>
                <Navbar />
                {children}
            </body>
        </html>
    );
}
