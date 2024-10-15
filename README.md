# Storybook - Next.js Application

## Description

Storybook is a Next.js application that allows users to create, view, edit, and share notes with friends using unique codes. The project integrates **Storybook** for UI component development and testing, enabling an efficient development workflow. 

## Getting Started

### Prerequisites
Ensure the following are installed on your system:
- Node.js and npm (or yarn)
- Basic understanding of **Next.js**, **React**, and **TypeScript**

### Installation
1. Clone the repository.
2. Run `npm install` or `yarn` to install dependencies.
3. Use `http://localhost:3000` as the default local development URL.

### Storybook

**Storybook** provides a visual interface for creating and testing UI components in isolation. Components can be found in the `src/stories` directory.

To start developing with **Storybook**:
1. Run `npm run storybook` (or `yarn storybook`).
2. Create or modify stories in the `src/stories` directory.
3. Changes will automatically reflect in the Storybook UI.

### Development Server

To run the full Next.js application (including backend APIs) for development purposes:
1. Run `npm run dev` (or `yarn dev`).
2. The app will be accessible at `http://localhost:3000`.

## Backend Controllers (WIP)

The following outlines the planned backend API controllers and their key functions. These are under development and may be updated.

### `controllers/book.ts`

- **postBook(bookData)**: Creates a new book, returning its ID.
- **editBook(bookId, bookData)**: Updates an existing book, returning its ID.
- **deleteBook(bookId)**: Deletes a book and returns a status `200`.
- **getBook(bookId)**: Retrieves a book by its ID and returns a `bookType` object.
- **addComment(bookId, commentData)**: Adds a comment to the book, returns status `200`.
- **getBooksByUserId(userId)**: Retrieves all books associated with the user.

### `controllers/comment.ts`

- **addComment(bookId, commentData)**: (Implemented in `controllers/book.ts`) Adds a comment.
- **upvoteComment(commentId)**: Increments or decrements upvote count, returns a boolean.
- **getComments(bookId)**: Retrieves all comments for a specific book, optionally sorted by upvotes.

### `controllers/userType.ts`

- **login(username, password)**: Authenticates a user and returns an access token.
- **signup(userData)**: Registers a new user, returning a token or confirmation.
- **editUser(userId, userData)**: Updates a user’s details.
- **getMinimalUserData(userId)**: Retrieves minimal user information for UI.

## Project Status

This project is currently under development. The to-do list for the controllers serves as a guide for backend API functionality. Contributions are welcome!

## Contribution

We welcome all contributions to improve the project. Feel free to submit pull requests, report issues, or offer suggestions.
