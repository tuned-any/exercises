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
export const categoryDescriptions = new Map([
    ["Programming", "Books about programming languages and techniques"],
    ["Software Engineering", "Books about software design and architecture"]
]);

// Extract unique authors using map to get names, then Set to filter, then spread into array
export const uniqueAuthors = [...new Set(books.map(book => book.author))];



/**
 * TODO: Implement filterBooksByStatus and groupBooksByGenre functions
 * filterBooksByStatus: Use array filter method and optional chaining for availability
 */
export function filterBooksByStatus(bookArray, status) {
    return bookArray.filter(book => book.availability?.status === status);
}



/**
 * groupBooksByGenre: Return Map with genre as key, array of books as value
 */
export function groupBooksByGenre(bookArray) {
    const genreMap = new Map();
    
    for (const book of bookArray) {
        if (!genreMap.has(book.genre)) {
            genreMap.set(book.genre, []);
        }
        genreMap.get(book.genre).push(book);
    }
    
    return genreMap;
}

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
export function createBookSummary(book) {
    const { title, author, year, availability } = book;
    const locationInfo = availability?.location ? `Available at ${availability.location}` : "Location not specified";
    
    return `${title} by ${author} (${year}) - ${locationInfo}`;
}
