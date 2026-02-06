/**
 * Library management module demonstrating modern JavaScript features
 */

import { books, categoryDescriptions, uniqueAuthors, filterBooksByStatus, groupBooksByGenre } from './data.js';

/**
 * LibraryManager class demonstrating modern JavaScript class features
 */
export class LibraryManager {
    #statistics = {}; // Private field for storing statistics

    constructor(initialBooks = []) {
        this.books = [...initialBooks]; // Shallow copy using spread
        this.#updateStatistics();
    }

    /**
     * Add multiple books using rest parameters and update statistics
     */
    addBooks(...newBooks) {
        // Use spread operator to merge new books into the current collection
        this.books = [...this.books, ...newBooks];
        this.#updateStatistics();
    }

    /**
     * Search with destructuring and optional chaining
     */
    searchBooks({ title, author, genre } = {}, caseSensitive = false) {
        return this.books.filter(book => {
            const matches = (field, search) => {
                if (!search) return true;
                const val = field ?? ""; // Nullish coalescing for safety
                return caseSensitive 
                    ? val.includes(search) 
                    : val.toLowerCase().includes(search.toLowerCase());
            };

            // Using optional chaining and destructuring logic
            return matches(book.title, title) &&
                   matches(book.author, author) &&
                   matches(book.genre, genre);
        });
    }

    /**
     * Return computed statistics object
     */
    getStatistics() {
        // Return a copy of the private field to prevent external mutation
        return { ...this.#statistics };
    }

    /**
     * Update book properties using logical assignment operators
     */
    updateBook(book, updates) {
        if (!book || !updates) return;

        // Logical nullish assignment: set only if current value is null or undefined
        book.genre ??= updates.genre;

        // Logical OR assignment: set if current value is "falsy" (e.g., empty string)
        book.title ||= updates.title;

        // Example of logical AND assignment: update location only if availability already exists
        book.availability &&= { ...book.availability, ...updates.availability };

        this.#updateStatistics();
        return book;
    }

    /**
     * Calculate statistics and store in private field
     */
    #updateStatistics() {
        this.#statistics = {
            total: this.books.length,
            available: this.books.filter(book => book.availability?.status === 'available').length,
            checkedOut: this.books.filter(book => book.availability?.status === 'checked_out').length
        };
    }
}

/**
 * Higher-order function: returns a function that applies a formatter to an array
 */
export const createBookFormatter = (formatter) => {
    return (bookArray) => bookArray.map(book => formatter(book));
};

/**
 * Memoization: uses a Map to cache expensive function results
 */
export const memoize = (fn) => {
    const cache = new Map();
    
    return (...args) => {
        // Create a cache key from arguments
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
};

// Export default library instance
export default new LibraryManager(books);
