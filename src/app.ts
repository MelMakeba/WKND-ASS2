interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    city: string;
      };
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
  body: string;
}

interface ActionIcon {
  src: string;
  alt: string;
}

let currentUser: User | null = null;

const userDropdown = document.getElementById('user-dropdown') as HTMLSelectElement;
const postList = document.getElementById('post-list') as HTMLDivElement;
const commentList = document.getElementById('comment-list') as HTMLDivElement;

function renderUserInfo(userId: number): Promise<void> {
  return fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
    .then((response: Response) => response.json())
    .then((user: User) => {
      currentUser = user;
      
      const userInfoDiv = document.querySelector('.userinfo') as HTMLDivElement;
      userInfoDiv.innerHTML = ''; 

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
      
      userInfoDiv.appendChild(nameElement);
      userInfoDiv.appendChild(usernameElement);
      userInfoDiv.appendChild(websiteLink);
      userInfoDiv.appendChild(bioElement);
      userInfoDiv.appendChild(locationDiv);
      
      console.log(`User info updated for: ${user.name}`);
    })
    .catch((error: Error) => console.error('Error fetching user info:', error));
}

fetch('https://jsonplaceholder.typicode.com/users')
  .then((response: Response) => response.json())
  .then((users: User[]) => {
    users.forEach((user: User) => {
      const option = document.createElement('option');
      option.value = user.id.toString();
      option.textContent = user.name;
      userDropdown.appendChild(option);
    });
    userDropdown.value = '1'; 
    fetchPosts(1);
  })
  .catch((error: Error) => console.error('Error fetching users:', error));
  
function fetchPosts(userId: number): void {
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
  
  if (!currentUser) {
    console.error('No user data available');
    return;
  }
  
  posts.forEach((post: Post) => {
    const postElement = document.createElement('div');
    postElement.classList.add("postelements");
    postElement.setAttribute('data-post-id', post.id.toString());
    
    const imgdiv = document.createElement('div');
    imgdiv.className = 'imgdiv';
    
    const image = document.createElement('img');
    image.src = './assets/screenshot-2022-05-24-at-15-22-28.png'; 
    image.alt = 'User avatar';
    
    const userInfo = document.createElement('div');
    userInfo.className = 'icons';
    
    const userName = document.createElement('p');
    userName.className = 'paragraph';
    userName.textContent = currentUser ? currentUser.name : 'Unknown User'; 
    
    const verifyIcon = document.createElement('img');
    verifyIcon.src = './assets/verify.png';
    verifyIcon.alt = 'Verified';
    
    const twitterIcon = document.createElement('img');
    twitterIcon.src = './assets/twitter.png';
    twitterIcon.alt = 'Twitter';
    
    
    userInfo.appendChild(userName);
    userInfo.appendChild(verifyIcon);
    userInfo.appendChild(twitterIcon);
    imgdiv.appendChild(image);
    imgdiv.appendChild(userInfo);
    
    const postContent = document.createElement('div');
    
    const postTitle = document.createElement('h4');
    postTitle.textContent = post.title;
    
    const postBody = document.createElement('p');
    postBody.textContent = post.body;
    
    postContent.appendChild(postTitle);
    postContent.appendChild(postBody);
    
    const postActions = document.createElement('div');
    postActions.className = 'post-actions';
    
    const actionTypes = [
      { src: './assets/message.png', alt: 'Comment', count: '200' },
      { src: './assets/retweet.png', alt: 'Retweet', count: '200' },
      { src: './assets/heart.png', alt: 'Like', count: '200' }
    ];
    
    actionTypes.forEach(action => {
      const actionItem = document.createElement('div');
      actionItem.className = 'action-item';
      
      const iconImg = document.createElement('img');
      iconImg.src = action.src;
      iconImg.alt = action.alt;
      
      const countSpan = document.createElement('span');
      countSpan.textContent = action.count;
      
      actionItem.appendChild(iconImg);
      actionItem.appendChild(countSpan);
      postActions.appendChild(actionItem);
    });
    
    postElement.appendChild(imgdiv);
    postElement.appendChild(postContent);
    postElement.appendChild(postActions);
    
    postElement.addEventListener('click', () => fetchComments(post.id));
    postList.appendChild(postElement);
  });
}

function fetchComments(postId: number): void {
  fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
    .then((response: Response) => response.json())
    .then((comments: Comment[]) => {
      renderComments(comments, postId);
      
      renderInlineComments(comments, postId);
    })
    .catch((error: Error) => console.error('Error fetching comments:', error));
}

function renderInlineComments(comments: Comment[], postId: number): void {
  const isMobile = window.matchMedia("(max-width: 576px)").matches;
  
  if (!isMobile) return;
  
  const allPosts = document.querySelectorAll('.postelements');
  allPosts.forEach(post => post.classList.remove('active'));
  
  const oldInlineComments = document.querySelectorAll('.post-inline-comments');
  oldInlineComments.forEach(section => section.remove());
  
  const clickedPost = document.querySelector(`.postelements[data-post-id="${postId}"]`);
  if (!clickedPost) return;
  
  clickedPost.classList.add('active');
  
  const inlineComments = document.createElement('div');
  inlineComments.className = 'post-inline-comments active';
  
  const commentsHeading = document.createElement('h4');
  commentsHeading.textContent = `Comments (${comments.length})`;
  inlineComments.appendChild(commentsHeading);
  
  comments.forEach((comment: Comment) => {
    const commentElement = document.createElement('div');
    commentElement.classList.add("contents");
    
    const imagediv = document.createElement('div');
    imagediv.className = 'imagediv';
    
    const img = document.createElement('img');
    img.src = './assets/screenshot-2022-05-24-at-15-22-28.png';
    img.alt = 'Avatar';
    imagediv.appendChild(img);
    
    const commentName = document.createElement('h5');
    commentName.textContent = comment.name;
    
    const commentBody = document.createElement('p');
    commentBody.className = 'paragraph2';
    commentBody.textContent = comment.body;
    
    const commentActions = document.createElement('div');
    commentActions.className = 'comment-actions';
    
    const actionTypes = [
      { src: './assets/message.png', alt: 'Reply', count: '0' },
      { src: './assets/retweet.png', alt: 'Retweet', count: '0' },
      { src: './assets/heart.png', alt: 'Like', count: '0' }
    ];
    
    actionTypes.forEach(action => {
      const actionItem = document.createElement('div');
      actionItem.className = 'action-item';
      
      const iconImg = document.createElement('img');
      iconImg.src = action.src;
      iconImg.alt = action.alt;
      
      const countSpan = document.createElement('span');
      countSpan.textContent = action.count;
      
      actionItem.appendChild(iconImg);
      actionItem.appendChild(countSpan);
      commentActions.appendChild(actionItem);
    });
    
    commentElement.appendChild(imagediv);
    commentElement.appendChild(commentName);
    commentElement.appendChild(commentBody);
    commentElement.appendChild(commentActions);
    
    inlineComments.appendChild(commentElement);
  });
  
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.className = 'close-comments-btn';
  closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    inlineComments.remove();
    clickedPost.classList.remove('active');
  });
  
  inlineComments.appendChild(closeButton);
  clickedPost.after(inlineComments);
}

function renderComments(comments: Comment[], postId: number): void {
  commentList.innerHTML = '';
  
  if (!currentUser) {
    console.error('No user data available');
    return;
  }
  
  const commentsHeading = document.createElement('h3');
  commentsHeading.textContent = `Post ${postId} Comments `;
  commentList.appendChild(commentsHeading);
  
  comments.forEach((comment: Comment) => {
    const commentElement = document.createElement('div');
    commentElement.classList.add("contents");
    
    const imagediv = document.createElement('div');
    imagediv.className = 'imagediv';
    
    const img = document.createElement('img');
    img.src = './assets/screenshot-2022-05-24-at-15-22-28.png'; 
    img.alt = '';
    
    
    const param = document.createElement('p');
    param.className = 'paragraph2';
    param.textContent = comment.body;
    
    
    const commentActions = document.createElement('div');
    commentActions.className = 'comment-actions';
    
    const commentActionTypes = [
      { src: './assets/message.png', alt: 'Reply', count: '0' },
      { src: './assets/retweet.png', alt: 'Retweet', count: '0' },
      { src: './assets/heart.png', alt: 'Like', count: '0' }
    ];
    
    commentActionTypes.forEach(action => {
      const actionItem = document.createElement('div');
      actionItem.className = 'action-item';
      
      const iconImg = document.createElement('img');
      iconImg.src = action.src;
      iconImg.alt = action.alt;
      
      const countSpan = document.createElement('span');
      countSpan.textContent = action.count;
      
      actionItem.appendChild(iconImg);
      actionItem.appendChild(countSpan);
      commentActions.appendChild(actionItem);

    });
    
    imagediv.appendChild(img);
    commentElement.appendChild(imagediv);
    commentElement.appendChild(param);
    commentElement.appendChild(commentActions);
    commentList.appendChild(commentElement);
  });
}

userDropdown.addEventListener('change', () => {
  const selectedUserId = parseInt(userDropdown.value);
  fetchPosts(selectedUserId);
});

console.log("TypeScript is successfully compiled and running!");