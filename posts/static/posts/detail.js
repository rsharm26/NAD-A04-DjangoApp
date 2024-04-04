console.log("lolz...")

const backBtn = document.getElementById('back-btn')
const updateBtn = document.getElementById('update-btn')
const deleteBtn = document.getElementById('delete-btn')

backBtn.addEventListener('click', () => {
    history.back()
})