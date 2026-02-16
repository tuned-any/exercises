// Select elements
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

// Function to add a new item
addBtn.addEventListener('click', () => {
    const itemText = input.value.trim();
    
    if (itemText !== "") {
        // Create the list item structure
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${itemText}</span>
            <button class="remove-btn">Remove</button>
        `;
        
        // Append to the parent <ul>
        todoList.appendChild(li);
        
        // Clear input field
        input.value = '';
    }
});

// EVENT DELEGATION: Handle remove clicks on the parent <ul>
todoList.addEventListener('click', (event) => {
    // Check if the clicked element is a remove button
    if (event.target.classList.contains('remove-btn')) {
        const itemToRemove = event.target.parentElement;
        todoList.removeChild(itemToRemove);
    }
});


// Exercise B

 

        // ============================================
        // Step 1: getUser & getPost Functions
        // ============================================
        
        function getUser(id) {
            return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch user');
                    return response.json();
                })
                .catch(error => {
                    console.warn('Using demo data due to:', error.message);
                    return demoUser;
                });
        }

        function getPosts(userId) {
            return fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch posts');
                    return response.json();
                })
                .catch(error => {
                    console.warn('Using demo data due to:', error.message);
                    return demoPosts;
                });
        }

        // ============================================
        // Step 2: Promise Chaining Approach
        // ============================================
        
        function fetchWithPromises() {
            let userData;
            
            getUser(1)
                .then(user => {
                    userData = user;
                    console.log('User Name:', user.name);
                    return getPosts(1);
                })
                .then(posts => {
                    console.log('Post Titles:', posts.map(post => post.title));
                    displayResults(userData, posts);
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('results').innerHTML = 
                        `<div class="error">Error: ${error.message}</div>`;
                });
        }

        // ============================================
        // Step 3: Async/Await Approach
        // ============================================
        
        async function fetchWithAsync() {
            try {
                const user = await getUser(1);
                console.log('User Name:', user.name);
                
                const posts = await getPosts(1);
                console.log('Post Titles:', posts.map(post => post.title));
                
                displayResults(user, posts);
                
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('results').innerHTML = 
                    `<div class="error">Error: ${error.message}</div>`;
            }
        }

        // ============================================
        // Step 4: Display in DOM
        // ============================================
        
        function displayResults(user, posts) {
            const resultsDiv = document.getElementById('results');
            
            resultsDiv.innerHTML = `
                <div class="user-info">
                    <h2>${user.name}</h2>
                    <p><strong>Email:</strong> ${user.email}</p>
                </div>
                
                <div>
                    <h3>Posts:</h3>
                    <ul>
                        ${posts.map(post => `<li>${post.title}</li>`).join('')}
                    </ul>
                </div>
            `;

        }
