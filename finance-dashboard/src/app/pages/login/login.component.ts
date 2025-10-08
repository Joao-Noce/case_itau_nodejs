import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ClienteService } from '../../core/services/cliente.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, ModalComponent],
    templateUrl: './login.component.html',
    styleUrls: ['../login/login.component.scss']
})
export class LoginComponent {
    email = '';
    nome = '';
    carregando = false;
    autenticado = false;

    mostrarModalAvisarLogin = false;
    modalTitulo = '';
    modalMensagem = '';
    autoClose = 0;
    //   senha = '';


    constructor(private router: Router, private clienteService: ClienteService) { }

    fazerLogin(form: any) {
        if (form.invalid) {
            Object.values(form.controls).forEach((control: any) => {
                control.markAsTouched();
            })
            return;
        }

        this.carregando = true;

        const clienteAutenticar = { nome: this.nome, email: this.email }

        this.clienteService.autenticarCliente(clienteAutenticar).subscribe({
            next: (data) => {
                this.carregando = false;
                localStorage.setItem('clienteLogado', JSON.stringify(data));

                this.modalTitulo = "Usuário Autenticado!";
                this.modalMensagem = `Bem vindo, ${this.nome}!`
                this.autoClose = 1500;
                this.abrirModalAutenticarCliente();

                setTimeout(() => {
                    this.irParaSite();
                }, 1500);
            },
            error: (err) => {
                console.error('❌ Erro ao Logar:', err);
                this.carregando = false;

                let mensagemErro = 'Erro inesperado. Tente novamente.';

                switch (err.status) {
                    case 400:
                        mensagemErro = 'Dados inválidos. Verifique os campos e tente novamente.';
                        break;
                    case 409:
                        mensagemErro = 'Este e-mail já está cadastrado.';
                        break;
                    case 404:
                        mensagemErro = 'Servidor não encontrado. Verifique a conexão.';
                        break;
                    case 500:
                        mensagemErro = 'Erro interno no servidor. Tente novamente mais tarde.';
                        break;
                }

                this.modalTitulo = 'Falha ao autenticar';
                this.modalMensagem = mensagemErro;
                this.autoClose = 1000;
                this.abrirModalAutenticarCliente();
            }
        })
    }

    abrirModalAutenticarCliente() {
    this.mostrarModalAvisarLogin = true;
  }

    irParaSite() {
        this.router.navigate(['/Dashboard']);
    }

    irParaCadastro() {
        this.router.navigate(['/Cadastro']);
    }
}
