import { Acao, AcoesAPI } from './modelo/acoes';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import {
  tap,
  map
} from 'rxjs/operators';

// OBSERVABLES
// Fluxos de dados, vários valores.
// A Promise representa somente um valor.

@Injectable({
  providedIn: 'root'
})
export class AcoesService {

  constructor(private http: HttpClient) { }

  getAcoes(busca?: string) {
    const params = busca ? new HttpParams().append('valor', busca) : undefined;

    return this.http.get<AcoesAPI>(`${environment.api}/acoes`, { params }).pipe(

      // O que o Observable está recebendo?
      // tap: operação que não modifica o dado
      tap((dados) => {
        console.log('API', dados);
      }),

      // REQUISITO 1: mostrar as ações ordenadas por código
      // map: modifica o dado
      map((dados) => {
        // Aqui economizamos um:
        // pluck('payload') (extração de atributo)
        return dados.payload.sort((a, b) => this.ordenaPorCodigo(a, b))
      })

    );
  }

  private ordenaPorCodigo(a: Acao, b: Acao): number {
    if (a.codigo < b.codigo) {
      return -1;
    }
    else if (a.codigo > b.codigo) {
      return 1;
    }
    return 0;
  }

}
