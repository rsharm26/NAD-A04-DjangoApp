const url = window.location.href + "data/"

const backBtn = document.getElementById('back-btn')
const updateBtn = document.getElementById('update-btn')
const deleteBtn = document.getElementById('delete-btn')

const spinnerBox = document.getElementById('spinner-box')

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

        spinnerBox.classList.add('not-visible')
    },

    error: function(error) {
        console.log(error)
    }
})