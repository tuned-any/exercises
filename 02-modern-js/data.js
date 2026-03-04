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
export const categoryDescriptions = new Map([
    ["Programming", "Books about programming languages and techniques"],
    ["Software Engineering", "Books about software design and architecture"]
]); // Map Replaced
const books = [
    { title: "Pair coding", author: "Martin Fowler" },
    { title: "The Authentic Programmer", author: "Amlow Pamty" },
    { title: "Complete Code", author: "Aturo R. Jackson" },     
    { title: "Code Alignment", author: "Stanley Munroe" }
    
];

export const uniqueAuthors = [...new Set(books.map(book => book.author))];

/**
 * TODO: Implement filterBooksByStatus and groupBooksByGenre functions
 * filterBooksByStatus: Use array filter method and optional chaining for availability
 */
const libraryBooks = [
    { title: "JavaScript: The Good Parts", genre: "Programming", availability: { status: "available" } },
    { title: "Complete Code", genre: "Software Engineering", availability: { status: "checked-out" } },
    { title: "Design Patterns", genre: "Software Engineering", availability: { status: "available" } },
    { title: "The Hobbit", genre: "Fantasy", availability: null }, // Testing optional chaining
    { title: "Eloquent JavaScript", genre: "Programming", availability: { status: "available" } }
];

    // Filter books by availability status, handle undefined availability
export const filterBooksByStatus = (books, status) => {
    return books.filter(book => book.availability?.status === status);
};


    // Group books into Map by genre

export const groupBooksByGenre = (books) => {
    const genreMap = new Map();

    books.forEach(book => {
        const genre = book.genre;

/**
 * TODO: Create generator function and book summary function
 * bookTitleGenerator: Generator that yields each book title using for...of
 */
export function* bookTitleGenerator(bookArray) {
    for (const book of bookArray) {
        yield book.title;
    }
}

/**
 * createBookSummary: Use destructuring and template literals for formatted output
 * Example: "The Clean Coder by Robert C. Martin (2011) - Available at A1-23"
 */

        // Sample Data
const libraryInventory = [
    { title: "The Clean Coder", author: "Robert C. Martin", year: 2011, location: "A1-23" }, 
    { title: "Pair coding", author: "Martin Fowler", year: 1999, location: "B2-10" },
    { title: "The Authentic Programmer", author: "Amlow Pamty", year: 1999, location: "C3-05" } 
];

    // Yield book titles one by one
export const createBookSummary = (book) => {
    // Destructuring properties from the book object
    const { title, author, year, location } = book;
    
    // Returning formatted string using template literals
    return `${title} by ${author} (${year}) - Available at ${location}`;
};
    
export function* bookTitleGenerator(books) {
    for (const book of books) {
        yield book.title;
    }
}

export function createBookSummary(book) {
    const { title, author, year, availability } = book;
    const locationInfo = availability?.location ? `Available at ${availability.location}` : "Location not specified";
    
    return `${title} by ${author} (${year}) - ${locationInfo}`;
}
