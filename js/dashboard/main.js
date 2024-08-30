(()=> {
    document.addEventListener("DOMContentLoaded", () => {
        const elements = document.querySelectorAll(".nav__item")
        elements.forEach(el => {
            el.addEventListener("click", () => {
                elements.forEach(item => item.classList.remove("active"))
                el.classList.add("active")
            })
        })

        function loadContent(url) {
            fetch(url)
                .then(response => response.text())
                .then(data => {
                    document.querySelector('.dashboard').innerHTML = data
                    initSPA()
                    initFormListener()
                })
                .catch(error => console.error('Error:', error))
        }

        function initSPA() {
            document.querySelectorAll('.spa').forEach(el => {
                el.addEventListener('click', function (e) {
                    const url = this.dataset.url
                    const logouturl = this.dataset.logouturl
                    const header = this.dataset.header

                    if (logouturl) {
                        window.location.href = logouturl
                        return
                    } else if (header) {
                        window.location.href = header
                        return
                    } else if (url) {
                        e.preventDefault()
                        loadContent(url)
                    }
                })
            })
        }

        function initFormListener() {
            const form = document.querySelector("#window__form")
            if (form) {
                console.log("form istnieje")
                form.addEventListener('submit', function (e) {
                    e.preventDefault()
                    const formData = new FormData(this)
                    const errorMessage = document.querySelector('.modal__error-text')
                    fetch('php/validate_f2a.php', {
                        method: 'POST',
                        body: formData,
                    })
                        .then(response => {
                            return response.json()
                        })
                        .then(data => {
                            errorMessage.textContent = ''
                            if (data.status === 'success') {
                                errorMessage.style.color = 'green'
                                errorMessage.textContent = data.message
                                setTimeout(() => {
                                    window.location.reload()
                                }, 3000)
                            } else {
                                errorMessage.style.color = 'red'
                                errorMessage.textContent = data.message
                            }
                        })
                        .catch(e => {
                            console.error(`Error: ${e}`)
                        })
                })
            } else {
                console.log("form nie istnieje")
            }
        }
        initSPA()
        loadContent('./php/spa/panel.php')
    })

})()


