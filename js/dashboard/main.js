(() => {
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
        initSPA()
        loadContent('./php/spa/panel.php')
    })
})()
