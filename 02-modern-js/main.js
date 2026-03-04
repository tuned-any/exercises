/**
 * Main entry point for the library management system
 * Demonstrates ES6 modules, async operations, and coordination of different modules
 */

import { books, filterBooksByStatus, groupBooksByGenre, bookTitleGenerator, createBookSummary } from './data.js';
import libraryManager, { LibraryManager, createBookFormatter, memoize } from './library.js';
import { displayStatistics, displayBooks, displaySearchResults, showBookAnalysis, formatAvailability } from './ui.js';

/**
 * TODO: Implement main application function and variable scoping demonstration
 */
async function runLibraryDemo() {
    console.log('🚀 Starting Library Management System Demo');
    console.log('='.repeat(50));

    try {
        // Handle case where default export might be null using logical OR
        const library = libraryManager || new LibraryManager(books);

        demonstrateScoping();

        // 1. Initial State Analysis
        displayStatistics(library.getStatistics());

        // 2. Filter and Grouping Demo
        console.log('\n📂 Grouping Books by Genre:');
        const grouped = groupBooksByGenre(library.books);
        grouped.forEach((genreBooks, genre) => {
            console.log(`[${genre}]: ${genreBooks.length} titles`);
        });

        // 3. Memoized Search Demo
        console.log('\n🔍 Testing Memoized Search:');
        const memoizedSearch = memoize(library.searchBooks.bind(library));
        const results = memoizedSearch({ genre: 'Programming' });
        displaySearchResults(results);

        // 4. Generator and Error Handling
        showGeneratorExample();
        demonstrateErrorHandling(library);

        // 5. Higher-Order Function Demo
        const summaryFormatter = createBookFormatter(createBookSummary);
        console.log('\n📝 Formatted Book Summaries:');
        console.log(summaryFormatter(library.books.slice(0, 2)));
        
    } catch (error) {
        console.error('Application error:', error.message);
    } finally {
        console.log('\n✅ Demo completed!');
    }
}

function demonstrateScoping() {
    console.log('\n🔍 === VARIABLE SCOPING DEMO ===');
    
    // Block Scoping
    if (true) {
        let blockScoped = "I am local to this block";
        const alsoBlockScoped = "Me too";
        var functionScoped = "I leak outside the block!";
    }
    
    try {
        console.log(functionScoped); // Works
        console.log(blockScoped);    // Throws ReferenceError
    } catch (e) {
        console.log('let/const variables are protected by block scoping.');
    }

    // Temporal Dead Zone (TDZ)
    try {
        console.log(tdzVar); 
        let tdzVar = "Will not reach here";
    } catch (e) {
        console.log('Temporal Dead Zone: Cannot access "let" before initialization.');
    }
}


/**
 * TODO: Implement error handling and generator demonstrations  
 */
function demonstrateErrorHandling(library) {
    console.log('\n⚠️  === ERROR HANDLING DEMO ===');
    
    // Testing safe property access with nullish coalescing
    const unknownBook = { title: "Phantom Book" };
    const status = unknownBook.availability?.status ?? "Status Unknown";
    console.log(`Safety check (Optional Chaining/Nullish): ${status}`);

    // Try/Catch block for invalid operations
    try {
        library.updateBook(null, { title: "New" });
    } catch (error) {
        console.log(`Caught expected error: ${error.message}`);
    }
}

function showGeneratorExample() {
    console.log('\n🔄 === GENERATOR DEMO ===');
    const titleGen = bookTitleGenerator(books);
    
    console.log('Iterating using generator:');
    for (const title of titleGen) {
        console.log(` -> ${title}`);
    }
}

/**
 * TODO: Start the application and demonstrate array destructuring
 */
console.log('\n📖 === DESTRUCTURING DEMO ===');
const [firstBook, secondBook, ...remainingBooks] = books;

console.log(`First Book: ${firstBook.title}`);
console.log(`Second Book: ${secondBook.title}`);
console.log(`Number of remaining books: ${remainingBooks.length}`);


// Start the application
runLibraryDemo();
