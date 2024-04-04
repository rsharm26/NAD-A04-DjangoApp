console.log("Hello, world")

const helloWorldDiv = document.getElementById("hello-world")
const postsBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner-box')

$.ajax({
    type: 'GET',
    url: '/hello-world/',

    success: function(response) {
        console.log('success', response.text)
        helloWorldDiv.textContent = response.text
    },
    error: function(error) {
        console.log("error", error)
    }
})


$.ajax({
    type: 'GET',
    url: '/data/',

    success: function(response) {
        console.log('success', response.data)
        setTimeout(() => {
            spinnerBox.classList.add('not-visible')

            response.data.forEach(element => {
                postsBox.innerHTML += `
                    ${element.title} - <b>${element.body}</b><br>
                `
            });
        }, 1000)
    },
    error: function(error) {
        console.log("error", error)
    }
})