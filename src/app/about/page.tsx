"use client";
import React from "react";

export default function AboutUs() {
    return (
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h1 className="display-4">About Us</h1>
                <p className="lead">Learn more about the application and the guidelines for writing and publishing books.</p>
            </div>

            <section className="mb-5">
                <h2>About the Application</h2>
                <p>
                    This application was created by <strong><a href="https://mfathinhalim.github.io">M. Fathin Halim</a></strong> to provide a platform for users to explore, share, and publish stories. The tools used to build this application include:
                </p>
                <ul>
                    <li><strong>Next.js:</strong> A powerful React framework for server-side rendering and static site generation.</li>
                    <li><strong>MongoDB:</strong> A NoSQL database for managing and storing user and book data efficiently.</li>
                    <li><strong>Bootstrap:</strong> A CSS framework for creating responsive and modern user interfaces.</li>
                </ul>
            </section>

            <section>
                <h2>Guidelines for Writing and Publishing Books</h2>
                <ol>
                    <li>
                        <strong>Original Content:</strong> All submissions must be original work. Plagiarism or copying from other sources is strictly prohibited.
                    </li>
                    <li>
                        <strong>Respectful Language:</strong> Avoid using offensive, discriminatory, or inappropriate language in your content.
                    </li>
                    <li>
                        <strong>Formatting:</strong> Ensure your book is properly formatted, with clear titles, chapters, and paragraphs to enhance readability.
                    </li>
                    <li>
                        <strong>Relevant Topics:</strong> Books should be relevant to the platform's audience and adhere to community interests or standards.
                    </li>
                    <li>
                        <strong>Copyright Compliance:</strong> Do not include copyrighted material (e.g., images, text) without proper permission.
                    </li>
                    <li>
                        <strong>Accurate Tags:</strong> Use appropriate and descriptive tags to make your book easily discoverable by others.
                    </li>
                    <li>
                        <strong>Review Process:</strong> Submitted books may undergo a review process to ensure they comply with these guidelines before publication.
                    </li>
                    <li>
                        <strong>Community Guidelines:</strong> Ensure your content aligns with the platform's community guidelines and terms of service.
                    </li>
                </ol>
            </section>
        </div>
    );
}
