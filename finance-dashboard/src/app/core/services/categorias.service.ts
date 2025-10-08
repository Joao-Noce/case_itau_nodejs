import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root' // assim o Angular já injeta globalmente
})
export class CategoriaService {
    private apiUrlCategorias = 'http://localhost:8080/categorias';

    constructor(private http: HttpClient) { }

    adicionarCategoria(categoria: any): Observable<any> {
        return this.http.post(this.apiUrlCategorias, categoria);
    }

    buscarFixosPorCliente(id: number): Observable<any> {
        return this.http.get(`${this.apiUrlCategorias}/fixos?fkCliente=${id}`);
    }

    deletarCategoria(idCategoria: number, fkCliente: {}): Observable<void> {
        return this.http.delete<void>(`${this.apiUrlCategorias}/${idCategoria}`, {
            body: fkCliente
    });
    }

    atualizarCategoria(id: number, categoria: any): Observable<any> {
        return this.http.put(`${this.apiUrlCategorias}/${id}`, categoria);
    }

    listarCategoriasPorCliente(id: number): Observable<any> {
        return this.http.get(`${this.apiUrlCategorias}?fkCliente=${id}`);
    }
}