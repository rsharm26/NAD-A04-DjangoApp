const postsBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner-box')
const loadBtn = document.getElementById('load-btn')
const endBox = document.getElementById('end-box')

// Basically the number of visible posts at a time (next n posts to display)
let visible = 3

// Executes per button click.
const getData = () => {
    $.ajax({
        type: 'GET',
        url: `/data/${visible}/`, // Update visible per click of "load more"
    
        success: function(response) {
            console.log('success', response.data)
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
                                    <div class="col-2">
                                        <a href="#" class="btn btn-primary">Details</a>
                                    </div>
    
                                    <div class="col-2">
                                        <a href="#" class="btn btn-primary">Like</a>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    `
                });
            }, 500)

            if (response.size === 0) {
                endBox.textContent = "No posts found..."
            }

            if (response.size <= visible) {
                loadBtn.classList.add('not-visible')
                endBox.textContent = 'No more posts to load...'
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

getData()