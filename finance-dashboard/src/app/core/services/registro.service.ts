import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root' // assim o Angular já injeta globalmente
})
export class RegistroService {
    private apiUrlRegistros = 'http://localhost:8080/registros';

    constructor(private http: HttpClient) { }

    adicionarRegistro(registro: any): Observable<any> {
        return this.http.post(this.apiUrlRegistros, registro);
    }

    buscarFixosPorCliente(id: number, ano: number, mes: number): Observable<any> {
        return this.http.get(`${this.apiUrlRegistros}/fixos?fkCliente=${id}&ano=${ano}&mes=${mes}`);
    }

    buscarPorCliente(id: number, ano: number, mes: number): Observable<any> {
        return this.http.get(`${this.apiUrlRegistros}?fkCliente=${id}&ano=${ano}&mes=${mes}`);
    }

    deletarRegistro(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrlRegistros}/${id}`);
    }

    atualizarRegistro(id: number, registro: any): Observable<any> {
        return this.http.put(`${this.apiUrlRegistros}/${id}`, registro);
    }

    agruparPorCategoria(id: number, ano: number, mes: number): Observable<any> {
        return this.http.get(`${this.apiUrlRegistros}/categorias?fkCliente=${id}&ano=${ano}&mes=${mes}`);
    }

    calcularSaldoMensal(id: number, ano: number): Observable<any> {
        return this.http.get(`${this.apiUrlRegistros}/mensal?fkCliente=${id}&ano=${ano}`);
    }
}
