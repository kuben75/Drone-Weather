class FormValidator {
    constructor(formSelector, messageSelector) {
        this.formElement = document.querySelector(formSelector);
        this.messageElement = document.querySelector(messageSelector);
        this.formElement.addEventListener('submit', this.handleSubmit.bind(this));
    }
    displayMessage(data, isSuccess) {
        this.messageElement.textContent = data.message;
        this.messageElement.style.color = isSuccess ? 'green' : 'red';
    }
    handleRedirect(redirectUrl, isRedirect, data) {
        isRedirect && redirectUrl ? window.location.href = redirectUrl || '/' : this.displayMessage(data, true);
    }
    handleSubmit(e) {
        e.preventDefault();
        const { action, redirecturl } = this.formElement.dataset;
        const isRedirect = this.formElement.getAttribute('data-redirect') === 'true';
        fetch(action, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: new FormData(this.formElement),
        }).then(response => response.json())
            .then((data) => {
            this.messageElement.textContent = '';
            if (data.status === 'success') {
                this.handleRedirect(redirecturl, isRedirect, data);
            }
            else if (data.status === '2fa_required') {
                window.location.href = 'php/enter_2fa.php';
            }
            else {
                this.displayMessage(data, false);
            }
        });
    }
}
new FormValidator('#form__validation', '.modal__error-text');
export {};
