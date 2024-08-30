(() => {
    const validatelogin = () => {
        const formEl = document.querySelector('#form__validation')
        const errorMessage = document.querySelector('.modal__error-text')
        formEl.addEventListener('submit', (e) => {
            e.preventDefault()
            const form = new FormData(formEl)
            fetch('check2faLogin.php', {
                method: 'POST',
                body: form,
            }).then(response => response.json())
                .then(data => {
                    errorMessage.textContent = ''
                    if(data.status === 'success'){
                        errorMessage.textContent = data.message
                        errorMessage.style.color = 'green'
                        setTimeout(() => {
                            window.location.href = '../index.php'
                        }, 1000)
                    }else {
                        errorMessage.textContent = data.message
                        errorMessage.style.color = 'red'
                    }

                }).catch(e => console.error('Error:', e))
        })
    }
    validatelogin()
})()

