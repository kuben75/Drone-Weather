import {ApiResponse} from './spa'


class FormValidator {
    private formElement: HTMLFormElement
    private messageElement: HTMLFormElement
constructor(formSelector: string, messageSelector: string) {
    this.formElement = document.querySelector(formSelector) as HTMLFormElement
    this.messageElement = document.querySelector(messageSelector) as HTMLFormElement
    this.formElement.addEventListener('submit', this.handleSubmit.bind(this))
}
private displayMessage(data: ApiResponse, isSuccess: boolean): void{
        this.messageElement.textContent = data.message
        this.messageElement.style.color = isSuccess ? 'green' : 'red'
}
private handleRedirect(redirectUrl: string | undefined, isRedirect: boolean, data: ApiResponse): void {
        isRedirect && redirectUrl ? window.location.href = redirectUrl || '/' : this.displayMessage(data, true)
}
private handleSubmit(e: Event): void{
       e.preventDefault()
    const {action, redirecturl} = this.formElement.dataset as {action: string, redirecturl: string}
    const isRedirect = this.formElement.getAttribute('data-redirect') === 'true'
    fetch(action as string, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: new FormData(this.formElement),
    }).then(response => response.json())
        .then((data: ApiResponse ) => {
            this.messageElement.textContent = ''
            if (data.status === 'success') {
                this.handleRedirect(redirecturl, isRedirect, data);
            } else if (data.status === '2fa_required') {
                window.location.href = 'php/enter_2fa.php'
            } else {
                this.displayMessage(data, false);
            }
        })
}
}
new FormValidator('#form__validation', '.modal__error-text')
