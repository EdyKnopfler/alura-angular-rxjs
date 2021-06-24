import { merge, Observable } from 'rxjs';
import { AcoesService } from './acoes.service';
import { Acoes } from './modelo/acoes';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, tap, filter, distinctUntilChanged } from 'rxjs/operators';

const ESPERA_DIGITACAO = 500;

@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent implements OnInit {
  acoesInput = new FormControl();

  // $: convenção da comunidade para Observable
  acoes$: Observable<Acoes>;
  constructor(private service: AcoesService) {}

  ngOnInit() {
    const fluxoInicial$: Observable<Acoes> = this.service.getAcoes().pipe(
      tap(() => console.log('fluxo inicial obtendo todas as ações'))
    );

    // Verificando o fluxo de digitação :)
    const filtroInput$: Observable<any> = this.acoesInput.valueChanges.pipe(
      // Não vamos metralhar o servidor!
      // Operadores de filtro: podem bloquear o avanço do fluxo

      // Mínimo de 3 caracteres digitados
      filter((busca) => busca.length >= 3 || !busca.length),

      // Tempo mínimo entre buscas
      debounceTime(ESPERA_DIGITACAO),

      // Descarta iguais: "alur", "alu", "alur"...
      // A comparação é sempre com o valor anterior
      // Útil para usar com debounceTime :)
      distinctUntilChanged(),

      tap(() => console.log('fluxo de entrada realizando busca')),

      // switchMap: muda o fluxo para outro Observable
      switchMap((busca) => this.service.getAcoes(busca)),
    );

    // merge: combina fluxos
    // primeiro temos o inicial com todas, depois quando digitamos no campo
    // acionamos o do input :)
    this.acoes$ = merge(fluxoInicial$, filtroInput$);
  }

}
