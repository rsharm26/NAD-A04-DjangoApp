const url = window.location.href + "data/"

const backBtn = document.getElementById('back-btn')
const updateBtn = document.getElementById('update-btn')
const deleteBtn = document.getElementById('delete-btn')

const postBox = document.getElementById('post-box')
const spinnerBox = document.getElementById('spinner-box')

const titleInput = document.getElementById('id_title')
const bodyInput = document.getElementById('id_body')

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

        titleElement.setAttribute('class', 'mt-1')
        titleElement.setAttribute('class', 'mt-3')

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