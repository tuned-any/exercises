/**
 * Data module for library management system
 * Demonstrates modern JavaScript data structures and manipulation
 */

// Sample book data
export const books = [
    {
        id: 1,
        title: "The Cean Coder",
        author: "Robert C. Martin",
        year: 2011,
        genre: "Programming",
        availability: { status: "available", location: "A1-23" }
    },
    {
        id: 2,
        title: "You Don't Know JS",
        author: "Kyle Simpson",
        year: 2014,
        genre: "Programming",
        availability: { status: "checked_out", dueDate: "2024-12-01" }
    },
    {
        id: 3,
        title: "Design Patterns",
        author: "Gang of Four",
        year: 1994,
        genre: "Software Engineering"
        // Note: availability is intentionally missing for some books
    },
    {
        id: 4,
        title: "Clean Architecture",
        author: "Robert C. Martin",
        year: 2017,
        genre: "Programming",
        availability: { status: "available", location: "A2-15" }
    }
];

// TODO: Create a Map for book categories and a Set for unique authors
// Map: "Programming" -> "Books about programming languages and techniques"
//      "Software Engineering" -> "Books about software design and architecture"
// Set: Extract all unique author names from the books array using spread operator
export const categoryDescriptions = null; // Replace with your Map
export const uniqueAuthors = null; // Replace with your Set

/**
 * TODO: Implement filterBooksByStatus and groupBooksByGenre functions
 * filterBooksByStatus: Use array filter method and optional chaining for availability
 * groupBooksByGenre: Return Map with genre as key, array of books as value
 */
export function filterBooksByStatus(bookArray, status) {
    // Filter books by availability status, handle undefined availability
}

export function groupBooksByGenre(bookArray) {
    // Group books into Map by genre
}

/**
 * TODO: Create generator function and book summary function
 * bookTitleGenerator: Generator that yields each book title using for...of
 * createBookSummary: Use destructuring and template literals for formatted output
 * Example: "The Clean Coder by Robert C. Martin (2011) - Available at A1-23"
 */
export function* bookTitleGenerator(bookArray) {
    // Yield book titles one by one
}

export function createBookSummary(book) {
    // Destructure book properties and create formatted summary
}