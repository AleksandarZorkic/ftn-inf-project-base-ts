import { UserFormData } from "../models/userFormData.models.js"
import { UserService } from "../service/user.service.js"

const userService = new UserService()

function initializeForm(): void {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');

    const button = document.querySelector('#submitBtn')
    if (button) {
        button.addEventListener('click', submit)
    }

    if (id) {
        userService.getById(id)
            .then(user => {
                (document.querySelector('#username') as HTMLInputElement).value = user.korisnickoIme;
                (document.querySelector('#name') as HTMLInputElement).value = user.ime;
                (document.querySelector('#surname') as HTMLInputElement).value = user.prezime;
                (document.querySelector('#dateOfBirth') as HTMLInputElement).value = user.datumRodjenja;
            }).catch(error => {
                console.error(error.status, error.text);
            })
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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');

    if (id) {
        userService.update(id, formData)
        .then(() => {
            window.location.href = '../index.html'
        }).catch(error => {
            console.error(error.status, error.text);
        })
        
    } else {
        userService.add(formData)
        .then(() => {
            window.location.href = '../index.html'
        }).catch(error => {
            console.error(error.status, error.text);
        })
    } 
}

document.addEventListener("DOMContentLoaded", initializeForm)
