async function upvoteClickHandler(event) {
    event.preventDefault();
  
    //to obtain access to the post id, we are taking the URL and using.split to grab the post id number 
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];
      //make fetch request for posts/upvote route
      const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        //use our id variable to put into post_id value
        body: JSON.stringify({
          post_id: id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        document.location.reload();
      } else {
        alert(response.statusText);
      }
    }

  
  document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);
  