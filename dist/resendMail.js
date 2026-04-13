"use strict";
class MailSender {
    constructor() {
        this.appInit();
    }
    resendEmail() {
        const resendEmailLink = document.querySelector("#resend-email-link");
        resendEmailLink === null || resendEmailLink === void 0 ? void 0 : resendEmailLink.addEventListener('click', this.HandleResendEmail.bind(this));
    }
    HandleResendEmail(e) {
        e.preventDefault();
        const email = e.target.dataset.email;
        fetch('../../php/recovery/forgot-password.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(({ email: email }))
        }).then(response => response.json());
    }
    appInit() {
        document.addEventListener("DOMContentLoaded", () => this.resendEmail());
    }
}
new MailSender();
