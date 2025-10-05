import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import 'bootstrap/dist/css/bootstrap.css';
import "./globals.css";
import '@fortawesome/fontawesome-svg-core/styles.css';

export const metadata: Metadata = {
    twitter: {
      card: 'summary_large_image',
      title: 'Story Book',
      description: 'the place where your story is written',
      images: "https://ik.imagekit.io/9hpbqscxd/SG/image-86.jpg?updatedAt=1705798245623",
    },
    icons: {
        icon: "https://ik.imagekit.io/9hpbqscxd/SG/image-86.jpg?updatedAt=1705798245623", // Menentukan ikon favicon
    },
    title: "Story Book"
  }

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang='en'>
            <body>
                <Navbar />
                <main>{children}</main>
            </body>
        </html>
    );
}
