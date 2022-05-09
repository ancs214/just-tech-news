async function deleteFormHandler(event) {
    event.preventDefault();

    //to obtain access to the post id, we are taking the URL and using.split to grab the post id number 
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];

    //on btn click, get post id and send with delete request 
    const response = await fetch(`/api/posts/${id}`, {
      
      method: 'DELETE'
    });
  
    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
  }
  
  
  document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);