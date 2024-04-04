console.log("Hello, world")

const helloWorldDiv = document.getElementById("hello-world")

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