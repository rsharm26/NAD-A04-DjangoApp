const postsBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner-box')
const loadBtn = document.getElementById('load-btn')
const endBox = document.getElementById('end-box')
const alertBox = document.getElementById('alert-box')

const postForm = document.getElementById('post-form')
const postTitle = document.getElementById('id_title')
const postBody = document.getElementById('id_body')
const csrf = document.getElementsByName('csrfmiddlewaretoken')

const url = window.location.href

// Basically the number of visible posts at a time (next n posts to display)
let visible = 3

// https://docs.djangoproject.com/en/5.0/howto/csrf/
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

const likeUnlikePosts = () => {
    const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-forms')]
    likeUnlikeForms.forEach(form => form.addEventListener('submit', e => {
        e.preventDefault()

        const clickedID = e.target.getAttribute('data-form-id')
        const clickedBtn = document.getElementById(`like-unlike-${clickedID}`);

        $.ajax({
            type: 'POST',
            url: "/like-unlike/",
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'pk': clickedID,
            },

            success: function(response) {
                console.log(response)
                clickedBtn.textContent = (response.liked ? "Unlike" : "Like") + ` (${response.count})`
            },

            error: function(error) {
                console.log(error)
            }
        })
    }))
}

// Executes per button click.
const getData = () => {
    $.ajax({
        type: 'GET',
        url: `/data/${visible}/`, // Update visible per click of "load more"
    
        success: function(response) {
            //console.log('success', response.data)
            setTimeout(() => {
                spinnerBox.classList.add('not-visible')
    
                response.data.forEach(element => {
                    postsBox.innerHTML += `
                        <div class="card mb-2">
                            <div class="card-body">
                                <h5 class="card-title">${element.title}</h5>
                                <p class="card-text">${element.body}</p>
                            </div>
    
                            <div class="card-footer">
                                <div class="row">
                                    <div class="col-3">
                                        <a href="${url}${element.id}" class="btn btn-primary">Details</a>
                                    </div>
    
                                    <div class="col-3">
                                    <form class="like-unlike-forms" data-form-id="${element.id}">
                                        <button href="#" class="btn btn-primary" id="like-unlike-${element.id}">${element.liked ? 'Unlike' : 'Like'} (${element.count})</button>
                                    </form>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    `
                });

                likeUnlikePosts()
            }, 250)

            if (response.size === 0) {
                endBox.textContent = "No posts found..."
            }

            if (response.size <= visible) {
                loadBtn.classList.add('not-visible')
                setTimeout(() => {
                    endBox.textContent = 'No more posts to load...'
                }, 500)
            }
        },
        error: function(error) {
            console.log("error", error)
        }
    })
}


loadBtn.addEventListener('click', () => {
    spinnerBox.classList.remove('not-visible')
    visible += 3
    getData()
})

postForm.addEventListener('submit', e => {
    e.preventDefault()

    $.ajax({
        type: 'POST',
        url: '',
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': postTitle.value,
            'body': postBody.value
        },

        success: function(response) {
            //console.log(response)
            postsBox.insertAdjacentHTML('afterbegin', `
                <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="card-title">${response.title}</h5>
                        <p class="card-text">${response.body}</p>
                    </div>

                    <div class="card-footer">
                        <div class="row">
                            <div class="col-3">
                                <a href="${url}${element.id}" class="btn btn-primary">Details</a>
                            </div>

                            <div class="col-3">
                            <form class="like-unlike-forms" data-form-id="${response.id}">
                                <button href="#" class="btn btn-primary" id="like-unlike-${response.id}">Like (0)</button>
                            </form>
                            </div>
                        </div> 
                    </div>
                </div>
            `)

            likeUnlikePosts();
            handleAlerts('success', 'New post added!')
            postForm.reset()
        },

        error: function(error) {
            console.log(error)
            handleAlerts('danger', 'Sorry, something went wrong :(')
        }
    })

    setTimeout(() => {
        $('#addPostModal').modal('hide')
    }, 50)
    
})

getData()