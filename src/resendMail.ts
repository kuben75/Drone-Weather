
class MailSender {
    constructor() {
        this.appInit()
    }
    resendEmail ():void {
        const resendEmailLink = document.querySelector("#resend-email-link") as HTMLElement
        resendEmailLink?.addEventListener('click', this.HandleResendEmail.bind(this))
    }
     private HandleResendEmail (e: Event):void {
        e.preventDefault()
            const email = (e.target as HTMLElement).dataset.email as string
            fetch('../../php/recovery/forgot-password.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(({email:email}))
            }).then(response => response.json())
    }
    appInit () {
        document.addEventListener("DOMContentLoaded", () => this.resendEmail())
    }
}

new MailSender()