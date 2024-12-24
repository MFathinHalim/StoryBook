import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import 'bootstrap/dist/css/bootstrap.css';
import "./globals.css";
import Footer from "@/components/Footer";

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
                <div className="d-flex flex-column min-vh-100">
                    {/* Bagian Konten */}
                    <main className="flex-grow-1">{children}</main>
                </div>
                {/* Footer */}
                <Footer />
            </body>
        </html>
    );
}
