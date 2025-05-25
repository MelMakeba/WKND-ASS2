const userDropdown = document.getElementById('user-dropdown');
const postList = document.getElementById('post-list');
const commentList = document.getElementById('comment-list');

//fetching user information
function renderUserInfo(userId) {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(response => response.json())
      .then(user => {
        const userInfoDiv = document.getElementById('.userinfo');
        userInfoDiv.innerHTML = '';
  
        const nameElement = document.createElement('p');
        nameElement.textContent = `Name: ${user.name}`;
  
        const usernameElement = document.createElement('p');
        usernameElement.textContent = `Username: ${user.username}`;
  
        const emailElement = document.createElement('p');
        emailElement.textContent = `Email: ${user.email}`;
  
        const cityElement = document.createElement('p');
        cityElement.textContent = `City: ${user.address.city}`;
  
        const websiteElement = document.createElement('p');
        websiteElement.textContent = `Website: ${user.website}`;
  
        userInfoDiv.appendChild(nameElement);
        userInfoDiv.appendChild(usernameElement);
        userInfoDiv.appendChild(emailElement);
        userInfoDiv.appendChild(cityElement);
        userInfoDiv.appendChild(websiteElement);
      })
      .catch(error => console.error('Error fetching user info:', error));
  }


// Fetch users and populate dropdown
fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => response.json())
  .then(users => {
    users.forEach(user => {
      const option = document.createElement('option');
      option.value = user.id;
      option.textContent = user.username;
      userDropdown.appendChild(option);

    });
    userDropdown.value = 1; 
    fetchPosts(1);
  })
  .catch(error => console.error('Error fetching users:', error));
  

function fetchPosts(userId) {
  fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
    .then(response => response.json())
    .then(posts => {
      renderPosts(posts);
      renderUserInfo(userId);//calling the render userInfo
      if (posts.length > 0) {
        fetchComments(posts[0].id); 
      }
    })
    .catch(error => console.error('Error fetching posts:', error));
}


function renderPosts(posts) {
  postList.innerHTML = '';
  posts.forEach(post => {
    
    const postElement = document.createElement('div');
    postElement.classList.add("postelements");
    const imgdiv = document.createElement('div');
    const paragraph = document.createElement('p');
    const favicons = document.createElement('div');
    const para = document.createElement('p');
    const posts = document.createElement('div');
    imgdiv.className = 'imgdiv';
    const image = document.createElement('img');
    image.src = 'https://sb.kaleidousercontent.com/67418/1672x1018/6463a5af0d/screenshot-2022-05-24-at-15-22-28.png';
    image.alt ='';
    para.className = ('paragraph')
    para.textContent=("Leanne Graham")
    favicons.className = ('icons')

    const icons = document.createElement('img')
    icons.src = 'assets/verify.png'
    icons.alt=''

    const icontw = document.createElement('img')
    icontw.src='assets/twitter.png'
    icontw.alt =''

    favicons.appendChild(para)
    favicons.appendChild(icons)
    favicons.appendChild(icontw)
    imgdiv.appendChild(image);
    imgdiv.appendChild(favicons)
    postElement.appendChild(imgdiv);
    paragraph.textContent = post.body;
    posts.appendChild(paragraph)
    postElement.appendChild(posts);

    postElement.addEventListener('click', () => fetchComments(post.id));
    postList.appendChild(postElement);
    postList.addEventListener('change', () => {
        
    })
  });
}


function fetchComments(postId) {
  fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
    .then(response => response.json())
    .then(comments => renderComments(comments))
    .catch(error => console.error('Error fetching comments:', error));
}


function renderComments(comments) {
    commentList.innerHTML = '';
    comments.forEach(comment => {
    const commentElement = document.createElement('div');
    commentElement.classList.add("contents");
    const imagediv = document.createElement('div');
    const param = document.createElement('p');
    const para = document.createElement('h5');
    param.className = ('paragraph2')
    para.textContent=comment.name;
    imagediv.className = 'imagediv';
    const img = document.createElement('img');
    img.src = 'https://sb.kaleidousercontent.com/67418/1672x1018/6463a5af0d/screenshot-2022-05-24-at-15-22-28.png';
    img.alt=''
    imagediv.appendChild(img);
    commentElement.appendChild(imagediv);
    param.textContent = comment.body;
    commentElement.appendChild(para);
    commentElement.appendChild(param);
    commentList.appendChild(commentElement);
  });
}


userDropdown.addEventListener('change', () => {
  const selectedUserId = parseInt(userDropdown.value);
  fetchPosts(selectedUserId);
});