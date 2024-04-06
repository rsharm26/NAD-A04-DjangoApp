const postsBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner-box')
const loadBtn = document.getElementById('load-btn')
const endBox = document.getElementById('end-box')
const alertBox = document.getElementById('alert-box')

const postForm = document.getElementById('post-form')
const postTitle = document.getElementById('id_title')
const postBody = document.getElementById('id_body')
const csrf = document.getElementsByName('csrfmiddlewaretoken')

const saveBtn = document.getElementById('save-btn')
const closeBtns = [...document.getElementsByClassName('add-modal-close')]
const dropzone = document.getElementById('my-dz')

const url = window.location.href

// Basically the number of visible posts at a time (next n posts to display)
let visible = 3

let newPostID = null

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

const deleted = localStorage.getItem('title')
if (deleted) {
    handleAlerts('danger', `Deleted "${deleted}"`)
    localStorage.clear()
}

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
                        <div class="container">
                            <div class="row mb-5">
                                <div class="col-lg-10">
                                    <div class="card" style="background: rgb(80, 80, 80, .15);">
                                        <a href="${url}${element.id}" class="btn">
                                            <div class="card-body">
                                                <h4 class="card-title">${element.title}</h4>
                                                <p class="card-text">${element.body}</p>
                                            </div>
                                        </a>
                                    </div>
                                </div>

                                <div class="col-lg-2 d-flex align-items-center justify-content-center">
                                    <form class="like-unlike-forms" data-form-id="${element.id}">
                                        <button href="#" class="btn btn-dark" id="like-unlike-${element.id}">${element.liked ? 'Unlike' : 'Like'} (${element.count})</button>
                                     </form>
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
            newPostID = response.id
            postsBox.insertAdjacentHTML('afterbegin', `
                <div class="container">
                    <div class="row mb-5">
                        <div class="col-lg-10">
                            <div class="card" style="background: rgb(80, 80, 80, .15);">
                                <a href="${url}${response.id}" class="btn">
                                    <div class="card-body">
                                        <h4 class="card-title">${response.title}</h4>
                                        <p class="card-text">${response.body}</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div class="col-lg-2 d-flex align-items-center justify-content-center">
                            <form class="like-unlike-forms" data-form-id="${response.id}">
                                <button href="#" class="btn btn-dark" id="like-unlike-${response.id}">Like (0)</button>
                            </form>
                        </div>
                    </div>
                </div>
            `)

            likeUnlikePosts();
            handleAlerts('success', 'New post added!')
            dropzone.classList.remove('not-visible')
        },

        error: function(error) {
            console.log(error)
            handleAlerts('danger', 'Sorry, something went wrong :(')
        }
    })
})


closeBtns.forEach(btn => btn.addEventListener('click', () => {
    postForm.reset()

    if (!dropzone.classList.contains('not-visible')) {
        dropzone.classList.add('not-visible')
    }

    const myDropzone = Dropzone.forElement("#my-dz")
    myDropzone.removeAllFiles(true)
}))

Dropzone.autoDiscover = false
const myDropzone = new Dropzone('#my-dz', {
    url: 'upload/',
    init: function() {
        this.on('sending', function(file, xhr, formData) {
            formData.append('csrfmiddlewaretoken', csrf)
            formData.append('new_post_id', newPostID)
        })
    },
    maxFiles: 3,
    maxFilesSize: 4,
    acceptedFiles: '.png, .jpg, .jpeg'
})

getData()