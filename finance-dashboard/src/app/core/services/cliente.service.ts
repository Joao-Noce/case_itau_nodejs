import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root' // assim o Angular já injeta globalmente
})
export class ClienteService {
    private apiUrlClientes = 'http://localhost:8080/clientes';

    constructor(private http: HttpClient) { }

    buscarCliente(id: number): Observable<any> {
        return this.http.get(`${this.apiUrlClientes}/${id}`);
    }

    listarClientes(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrlClientes);
    }

    criarCliente(cliente: any): Observable<any> {
        return this.http.post(this.apiUrlClientes, cliente);
    }

    atualizarCliente(id: number, cliente: any): Observable<any> {
        return this.http.put(`${this.apiUrlClientes}/${id}`, cliente);
    }

    deletarCliente(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrlClientes}/${id}`);
    }

    autenticarCliente(cliente: any): Observable<any> {
        return this.http.post(`${this.apiUrlClientes}/autenticar`, cliente);
    }
}
