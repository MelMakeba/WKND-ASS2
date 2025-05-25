// Define interfaces for API data types
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

interface ActionIcon {
  src: string;
  alt: string;
}

// Global variable to store current user data
let currentUser: User | null = null;

// DOM element references with proper type annotations
const userDropdown = document.getElementById('user-dropdown') as HTMLSelectElement;
const postList = document.getElementById('post-list') as HTMLDivElement;
const commentList = document.getElementById('comment-list') as HTMLDivElement;

// Fetching user information
function renderUserInfo(userId: number): Promise<void> {
  return fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
    .then((response: Response) => response.json())
    .then((user: User) => {
      // Store current user globally
      currentUser = user;
      
      const userInfoDiv = document.querySelector('.userinfo') as HTMLDivElement;
      userInfoDiv.innerHTML = ''; // Clear previous content

      // Create profile elements
      const nameElement = document.createElement('h5');
      nameElement.textContent = user.name;

      const usernameElement = document.createElement('p');
      usernameElement.textContent = `@${user.username}`;

      const websiteLink = document.createElement('a');
      websiteLink.href = `https://${user.website}`;
      websiteLink.textContent = user.website;
      
      const bioElement = document.createElement('p');
      bioElement.textContent = user.company.catchPhrase;
      
      const locationDiv = document.createElement('div');
      locationDiv.className = 'location';
      
      const locationIcon = document.createElement('img');
      locationIcon.src = './assets/location.png';
      locationIcon.alt = 'location icon';
      
      const locationText = document.createElement('p');
      locationText.textContent = user.address.city;
      
      locationDiv.appendChild(locationIcon);
      locationDiv.appendChild(locationText);
      
      // Append all elements to the user info div
      userInfoDiv.appendChild(nameElement);
      userInfoDiv.appendChild(usernameElement);
      userInfoDiv.appendChild(websiteLink);
      userInfoDiv.appendChild(bioElement);
      userInfoDiv.appendChild(locationDiv);
      
      console.log(`User info updated for: ${user.name}`);
    })
    .catch((error: Error) => console.error('Error fetching user info:', error));
}

// Fetch users and populate dropdown
fetch('https://jsonplaceholder.typicode.com/users')
  .then((response: Response) => response.json())
  .then((users: User[]) => {
    users.forEach((user: User) => {
      const option = document.createElement('option');
      option.value = user.id.toString();
      option.textContent = user.username;
      userDropdown.appendChild(option);
    });
    userDropdown.value = '1'; 
    fetchPosts(1);
  })
  .catch((error: Error) => console.error('Error fetching users:', error));
  
function fetchPosts(userId: number): void {
  // First fetch user info to ensure currentUser is updated
  renderUserInfo(userId)
    .then(() => {
      return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    })
    .then((response: Response) => response.json())
    .then((posts: Post[]) => {
      renderPosts(posts);
      if (posts.length > 0) {
        fetchComments(posts[0].id); 
      }
    })
    .catch((error: Error) => console.error('Error fetching posts:', error));
}

function renderPosts(posts: Post[]): void {
  postList.innerHTML = '';
  
  // Make sure we have user data
  if (!currentUser) {
    console.error('No user data available');
    return;
  }
  
  posts.forEach((post: Post) => {
    const postElement = document.createElement('div');
    postElement.classList.add("postelements");
    
    // Create post header with user info
    const imgdiv = document.createElement('div');
    imgdiv.className = 'imgdiv';
    
    // User avatar
    const image = document.createElement('img');
    image.src = './assets/screenshot-2022-05-24-at-15-22-28.png'; // Use local assets
    image.alt = 'User avatar';
    
    // User info with verified icon
    const userInfo = document.createElement('div');
    userInfo.className = 'icons';
    
    const userName = document.createElement('p');
    userName.className = 'paragraph';
    userName.textContent = currentUser ? currentUser.name : 'Unknown User'; // Use current user name or fallback
    
    const verifyIcon = document.createElement('img');
    verifyIcon.src = './assets/verify.png';
    verifyIcon.alt = 'Verified';
    
    const twitterIcon = document.createElement('img');
    twitterIcon.src = './assets/twitter.png';
    twitterIcon.alt = 'Twitter';
    
    // Assemble post header
    userInfo.appendChild(userName);
    userInfo.appendChild(verifyIcon);
    userInfo.appendChild(twitterIcon);
    imgdiv.appendChild(image);
    imgdiv.appendChild(userInfo);
    
    // Post content
    const postContent = document.createElement('div');
    
    const postTitle = document.createElement('h4');
    postTitle.textContent = post.title;
    
    const postBody = document.createElement('p');
    postBody.textContent = post.body;
    
    postContent.appendChild(postTitle);
    postContent.appendChild(postBody);
    
    // Post actions
    const postActions = document.createElement('div');
    postActions.className = 'post-actions';
    
    // Add comment, retweet, and like icons
    const actionIcons: ActionIcon[] = [
      { src: './assets/message.png', alt: 'Comment' },
      { src: './assets/retweet.png', alt: 'Retweet' },
      { src: './assets/heart.png', alt: 'Like' }
    ];
    
    actionIcons.forEach((icon: ActionIcon) => {
      const iconImg = document.createElement('img');
      iconImg.src = icon.src;
      iconImg.alt = icon.alt;
      postActions.appendChild(iconImg);
    });
    
    // Assemble the post
    postElement.appendChild(imgdiv);
    postElement.appendChild(postContent);
    postElement.appendChild(postActions);
    
    // Add click event to show comments
    postElement.addEventListener('click', () => fetchComments(post.id));
    postList.appendChild(postElement);
  });
}

function fetchComments(postId: number): void {
  fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
    .then((response: Response) => response.json())
    .then((comments: Comment[]) => renderComments(comments))
    .catch((error: Error) => console.error('Error fetching comments:', error));
}

function renderComments(comments: Comment[]): void {
  commentList.innerHTML = '';
  
  // Make sure we have user data
  if (!currentUser) {
    console.error('No user data available');
    return;
  }
  
  comments.forEach((comment: Comment) => {
    const commentElement = document.createElement('div');
    commentElement.classList.add("contents");
    
    const imagediv = document.createElement('div');
    imagediv.className = 'imagediv';
    
    const img = document.createElement('img');
    img.src = './assets/screenshot-2022-05-24-at-15-22-28.png'; // Use local asset instead of remote URL
    img.alt = '';
    
    // Include user info in the comment
    const commentHeader = document.createElement('div');
    commentHeader.className = 'comment-header';
    
    const commentUserName = document.createElement('h5');
    commentUserName.textContent = currentUser ? currentUser.name : 'Unknown User'; // Use current user name or fallback
    
    const commentUserEmail = document.createElement('small');
    commentUserEmail.textContent = currentUser ? `@${currentUser.username}` : 'Unknown User';
    commentUserEmail.style.color = '#657786';
    
    const param = document.createElement('p');
    param.className = 'paragraph2';
    param.textContent = comment.body;
    
    imagediv.appendChild(img);
    commentElement.appendChild(imagediv);
    commentElement.appendChild(commentUserName);
    commentElement.appendChild(commentUserEmail);
    commentElement.appendChild(param);
    
    commentList.appendChild(commentElement);
  });
}

userDropdown.addEventListener('change', () => {
  const selectedUserId = parseInt(userDropdown.value);
  fetchPosts(selectedUserId);
});

// Debug message to verify TypeScript is working
console.log("TypeScript is successfully compiled and running!");