import { UserFormData } from "../models/userFormData.models.js"
import { UserService } from "../service/user.service.js"

const userService = new UserService()

function initializeForm(): void {
    const button = document.querySelector('#submitBtn')
    if (button) {
        button.addEventListener('click', submit)
    }
}

function submit(): void {
    const username = (document.querySelector('#username') as HTMLInputElement).value.trim()
    const name = (document.querySelector('#name') as HTMLInputElement).value.trim()
    const surname = (document.querySelector('#surname') as HTMLInputElement).value.trim()
    const dateOfBirth = (document.querySelector('#dateOfBirth') as HTMLInputElement).value

    if (!username || !name || !surname || !dateOfBirth) {
        alert('All four fileds are required!');
        return
    }

    const formData: UserFormData = {korisnickoIme: username, ime: name, prezime: surname, datumRodjenja: dateOfBirth}

    userService.add(formData)
        .then(() => {
            window.location.href = '../index.html'
        }).catch(error => {
            console.error(error.status, error.text);
        })
}

document.addEventListener("DOMContentLoaded", initializeForm)
