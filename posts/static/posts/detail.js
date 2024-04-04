console.log("lolz...")

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
        console.log(response)
        spinnerBox.classList.add('not-visible')
    },

    error: function(error) {
        console.log(error)
    }
})