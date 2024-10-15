README.md

Project Name: Storybook

Description

This Next.js application allows you to create, view, edit, and share notes with your friends using unique codes. It utilizes Storybook for efficient UI component development and testing.

Getting Started

Prerequisites:
Node.js and npm (or yarn) installed on your system.
Basic understanding of Next.js, React, and TypeScript.

Use code with caution.

Install Dependencies:
Bash
npm install  # or yarn install
Use code with caution.

Run Storybook:
Bash
npm run storybook  # or yarn storybook
Use code with caution.

This will start Storybook development server, typically accessible at http://localhost:3007 by default.
Storybook

Storybook provides a visual interface for creating and testing your UI components in isolation. You can find the Storybook components under the src/stories directory. To develop within Storybook:

Run npm run storybook (or yarn storybook) as mentioned above.
Create or modify stories within the src/stories directory.
Changes in stories will reflect automatically in the Storybook UI.
Development Server

To run the full Next.js application for development purposes (including backend APIs):

Run npm run dev (or yarn dev).
The application will typically be accessible at http://localhost:3000 by default.
Notes on Controllers' To-Do List (WIP):

The provided to-do list offers a roadmap for the backend API development. Here's an overview of functionalities to implement (specific implementation details might vary depending on your chosen backend framework and database):

controllers/book.ts

postBook(bookData): Creates a new book and returns its ID for redirection or other use.
editBook(bookId, bookData): Updates an existing book and returns its ID for redirection or other use.
deleteBook(bookId): Deletes a book and returns a 200 status code for redirection or frontend confirmation.
getBook(bookId): Retrieves a book by its ID and returns a bookType object for display.
addComment(bookId, commentData): Adds a comment to a specific book and returns a 200 status code for frontend handling.
getBooksByUserId(userId): Fetches all books associated with a specific user and returns an array of bookType objects.
controllers/comment.ts

addComment(bookId, commentData): (implemented in controllers/book.ts) Adds a comment to a book.
upvoteComment(commentId): Increments or decrements the upvote count of a comment based on user logic and returns a boolean indicating the change (true for increased upvote, false for decreased).
getComments(bookId): Retrieves all comments for a specific book, potentially sorted by upvote count (implementation details depend on database support).
controllers/userType.ts

login(username, password): Authenticates a user and returns an access token and other relevant user data upon successful login.
signup(userData): Registers a new user and returns an access token or other confirmation information.
editUser(userId, userData): Updates an existing user's details.
getMinimalUserData(userId): Retrieves minimal user data (username, name, profile picture) for UI purposes.
Project Status

This project is currently under development. The to-do list for the controllers serves as a guide for backend API functionality. Feel free to contribute to the project and help further develop it.

Contribution

We welcome contributions to this project! 