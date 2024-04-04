console.log("Hello, world")

const helloWorldDiv = document.getElementById("hello-world")
const postsBox = document.getElementById('posts-box')

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

        response.data.forEach(element => {
            postsBox.innerHTML += `
                ${element.title} - <b>${element.body}</b><br>
            `
        });
    },
    error: function(error) {
        console.log("error", error)
    }
})