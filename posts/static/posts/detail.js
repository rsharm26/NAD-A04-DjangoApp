const url = window.location.href + "data/"
const updateUrl = window.location.href + "update/"
const deleteUrl = window.location.href + "delete/"

const backBtn = document.getElementById('back-btn')
const updateBtn = document.getElementById('update-btn')
const deleteBtn = document.getElementById('delete-btn')

const postBox = document.getElementById('post-box')
const spinnerBox = document.getElementById('spinner-box')
const alertBox = document.getElementById('alert-box')

const titleInput = document.getElementById('id_title')
const bodyInput = document.getElementById('id_body')

const updateForm = document.getElementById('update-form')
const deleteForm = document.getElementById('delete-form')

const csrf = document.getElementsByName('csrfmiddlewaretoken')

backBtn.addEventListener('click', () => {
    history.back()
})


$.ajax({
    type: 'GET',
    url: url,

    success: function(response) {
        //console.log(response)
        const data = response.data

        if (data.logged_in === data.author) {
            updateBtn.classList.remove('not-visible')
            deleteBtn.classList.remove('not-visible')
        }

        const titleElement = document.createElement('h3')
        const bodyElement = document.createElement('p')

        titleElement.setAttribute('id', 'title')
        bodyElement.setAttribute('id', 'body')
        titleElement.setAttribute('class', 'mt-1')
        bodyElement.setAttribute('class', 'mt-3')

        titleElement.textContent = data.title
        bodyElement.textContent = data.body

        postBox.appendChild(titleElement)
        postBox.appendChild(bodyElement)

        titleInput.value = data.title
        bodyInput.value = data.body
        spinnerBox.classList.add('not-visible')
    },

    error: function(error) {
        console.log(error)
    }
})

updateForm.addEventListener('submit', e => {
    e.preventDefault()

    $.ajax({
        type: 'POST',
        url: updateUrl,
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': titleInput.value,
            'body': bodyInput.value
        },

        success: function(response) {
            //console.log(response)
            handleAlerts('success', 'Post has been updated')
            title.textContent = response.title
            body.textContent = response.body
        },

        error: function(error) {
            handleAlerts('danger', 'Sorry, something went wrong :(')
            console.log(error)
        }
    })
})