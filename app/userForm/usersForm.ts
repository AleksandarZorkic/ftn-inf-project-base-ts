import { UserFormData } from "../models/userFormData.models.js"
import { UserService } from "../service/user.service.js"

const userService = new UserService();

function initializeForm(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const btn = document.querySelector('#submitBtn') as HTMLButtonElement;
    const tooltip = document.getElementById('submitTooltip')!;

    let hoverTimer: number;
    btn.addEventListener('mouseenter', () => {
        hoverTimer = window.setTimeout(() => {
            tooltip.classList.add('visible');
        }, 1500);
    });
    btn.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimer);
        tooltip.classList.remove('visible');
    });

    btn.addEventListener('click', submit)

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

function showTooltip(message: string, delay = 1500): void {
    const tooltip = document.getElementById('submitTooltip');
    if (!tooltip) return;

    tooltip.textContent = message;
    tooltip.classList.remove('visible');

    window.setTimeout(() => {
        tooltip.classList.add('visible');
        window.setTimeout(() => tooltip.classList.remove('visible'), 3000);
    }, delay);
}

function submit(): void {
    const username = (document.querySelector('#username') as HTMLInputElement).value.trim()
    const name = (document.querySelector('#name') as HTMLInputElement).value.trim()
    const surname = (document.querySelector('#surname') as HTMLInputElement).value.trim()
    const dateOfBirth = (document.querySelector('#dateOfBirth') as HTMLInputElement).value

    if (!username || !name || !surname || !dateOfBirth) {
        showTooltip('Sva cetiri polja su obavezna!', 0);
        return;
    }

    const btn = document.querySelector('#submitBtn') as HTMLButtonElement;
    btn.disabled = true;

    const spinner = document.getElementById('spinner')!;
    spinner.classList.remove('hidden');

    const errorDiv = document.getElementById('formError')!;
    errorDiv.textContent = '';

    const formData: UserFormData = {
        korisnickoIme: username, 
        ime: name, 
        prezime: surname, 
        datumRodjenja: dateOfBirth
    };

    const id = new URLSearchParams(window.location.search).get('id');
    const action = id ? userService.update(id, formData) : userService.add(formData);

    action
        .then(() => {
            spinner.classList.add('hidden');
            btn.disabled = false;
            showTooltip(
                id
                    ? 'Korisnik je uspesno azuriran.'
                    : 'Korisnik je uspesno dodat.'
                ,500);
            setTimeout(() => window.location.href = '../index.html', 1000);
        })
        .catch(error => {
            console.error(error);
            spinner.classList.add('hidden');
            btn.disabled = false;
            errorDiv.textContent = id
                ? 'Greska pri azuriranju. Pokusajte ponovo.'
                : 'Greska pri cuvanju. Pokusajte ponovo.';
        });
}

document.addEventListener("DOMContentLoaded", initializeForm)
