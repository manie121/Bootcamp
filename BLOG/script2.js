document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const postForm = document.getElementById('post-form');
    const postsSection = document.getElementById('posts');
    const logoutButton = document.getElementById('logout');

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful. Please log in.');
            window.location.href = 'login2.html';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                alert('Login successful');
                localStorage.setItem('loggedInUser', username);
                window.location.href = 'blog.html';
            } else {
                alert('Invalid credentials');
            }
        });
    }

    if (postForm) {
        postForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('post-title').value;
            const content = document.getElementById('post-content').value;

            const posts = JSON.parse(localStorage.getItem('posts')) || [];
            const loggedInUser = localStorage.getItem('loggedInUser');
            if (loggedInUser) {
                posts.push({ id: Date.now().toString(), title, content, author: loggedInUser });
                localStorage.setItem('posts', JSON.stringify(posts));
                document.getElementById('post-title').value = '';
                document.getElementById('post-content').value = '';
                loadPosts();
            } else {
                alert('You must be logged in to create a post.');
                window.location.href = 'login2.html';
            }
        });

        loadPosts();
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'login2.html';
        });
    }

    function loadPosts() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) { 
            const posts = JSON.parse(localStorage.getItem('posts')) || [];
            const userPosts = posts.filter(post => post.author === loggedInUser);
            postsSection.innerHTML = userPosts.map(post => `
                <div class="post">
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <button onclick="editPost('${post.id}')">Edit</button>
                    <button onclick="deletePost('${post.id}')">Delete</button>
                </div>
            `).join('');
        } else {
            postsSection.innerHTML = '<p>Please log in to view and create posts.</p>';
        }
    }
});

function editPost(id) {
    const posts = JSON.parse(localStorage.getItem('posts'));
    const post = posts.find(p => p.id === id);

    const newTitle = prompt('Enter new title:', post.title);
    const newContent = prompt('Enter new content:', post.content);

    if (newTitle && newContent) {
        post.title = newTitle;
        post.content = newContent;
        localStorage.setItem('posts', JSON.stringify(posts));
        location.reload();
    }
}

function deletePost(id) {
    let posts = JSON.parse(localStorage.getItem('posts'));
    posts = posts.filter(p => p.id !== id);
    localStorage.setItem('posts', JSON.stringify(posts));
    location.reload();
}