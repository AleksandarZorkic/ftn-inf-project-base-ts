import { User } from "../models/user.model.js";
import { UserFormData} from "../models/userFormData.models.js";


export class UserService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = 'http://localhost:39538/api/users'
    }

    getAll(page = 1, pageSize = 100): Promise<{ data: User[]; totalCount: number}> {
        const url = `${this.apiUrl}?page=${page}&pageSize=${pageSize}`;
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    const text = response.text();
                    throw { status: response.status, message: text};
                }
                return response.json() as Promise<{data: User[]; totalCount: number}>
            });
        }

    add(formData: UserFormData): Promise<User> {
        return fetch(this.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })
        .then(response => {
            if(!response.ok) {
                throw {status: response.status, message: response.text}
            }
            return response.json()
        })
        .then((user: User) => {
            return user;
        })
        .catch(error => {
            console.error('Error:', error.status)
            throw error
        })
    }
}