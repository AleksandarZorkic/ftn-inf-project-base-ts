import { UserService } from "./service/user.service.js";
import type { User } from "./models/user.model.js";

const userService = new UserService();

function initialize(): void {
  const addBtn = document.getElementById('addBtn') as HTMLButtonElement | null;
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      window.location.href = 'userForm/userForm.html';
    });
  }
  loadUsers();
}

function loadUsers(): void {
  userService.getAll()
    .then((wrapper: { data: User[]; totalCount: number }) => {

      renderData(wrapper.data);
    })
    .catch(error => {
      console.error('Error loading users:', error instanceof Error ? error.message : String(error));
      const table = document.querySelector('table') as HTMLTableElement | null;
      if (table) table.style.display = 'none';
      alert('Error loading user. Please try again.');
    });
}

function renderData(data: User[]): void {
  const tbody  = document.querySelector('table tbody') as HTMLTableSectionElement | null;
  const thead  = document.querySelector('table thead') as HTMLTableSectionElement | null;
  const noData = document.getElementById('no-data-message') as HTMLParagraphElement | null;
  if (!tbody || !thead || !noData) return;

  tbody.innerHTML = '';
  if (data.length === 0) {
    thead.classList.add('hidden');
    noData.classList.remove('hidden');
    return;
  }

  thead.classList.remove('hidden');
  noData.classList.add('hidden');

  for (const korisnik of data) {
    const tr = document.createElement('tr');
    [
      korisnik.id.toString(),
      korisnik.korisnickoIme,
      korisnik.ime,
      korisnik.prezime,
      korisnik.datumRodjenja.split('T')[0]
    ].forEach(text => {
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    });
    const tdEdit = document.createElement('td');
    const btn = document.createElement('button');
    btn.textContent = 'Edit';
    btn.addEventListener('click', () => {
      window.location.href = `userForm/userForm.html?id=${korisnik.id}`;
    });
    tdEdit.appendChild(btn);
    tr.appendChild(tdEdit);
    tbody.appendChild(tr);

    const tdDelete = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.width = 'auto';

    deleteButton.onclick = function () {
        userService.delete(korisnik.id.toString())
            .then(() => {
                window.location.reload();
            })
            .catch(error => {
                console.error(error.status, error.text);
            });
    }
    tdDelete.appendChild(deleteButton)
    tr.appendChild(tdDelete)
  }
}

document.addEventListener('DOMContentLoaded', initialize);
