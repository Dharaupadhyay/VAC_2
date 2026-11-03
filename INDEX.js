async function loadPost() { const response = await fetch(

'https://jsonplaceholder.typicode.com/posts/1'
);

console.log(response.status); // 200 console.log(response.ok); // true

const post = await response.json(); console.log(post.title);
}
loadPost();
console.log(loadPost());
