import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../../core/services/cliente.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './cadastro.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class CadastroComponent {
  nome = '';
  email = '';
  senha = '';
  carregando = false;
  cadastrado = false;

  mostrarModalAvisarCadastro = false;
  modalTitulo = '';
  modalMensagem = '';
  autoClose = 0;

  constructor(private router: Router, private usuarioService: ClienteService) {}

  cadastrar(form: any) {
    if (form.invalid) {
      Object.values(form.controls).forEach((control: any) => {
        control.markAsTouched();
      });
      return;
    }

    this.carregando = true;

    const usuarioCadastrar = { nome: this.nome, email: this.email };

    this.usuarioService.criarCliente(usuarioCadastrar).subscribe({
      next: (data) => {
        this.carregando = false;
        this.modalTitulo = 'Usuário cadastrado!';
        this.modalMensagem = `Bem-vindo, ${this.nome}! Você será redirecionado ao login.`;
        this.autoClose = 1500;
        this.abrirModalAvisarCadastro();

        setTimeout(() => this.irParaLogin(), 1500);
      },
      error: (err) => {
        console.error('❌ Erro ao cadastrar:', err);
        this.carregando = false;

        let mensagemErro = 'Erro inesperado. Tente novamente.';

        switch (err.status) {
          case 400:
            mensagemErro = 'Dados inválidos. Verifique os campos e tente novamente.';
            break;
          case 404:
            mensagemErro = 'Conta não cadastrada.';
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

        // abre modal de erro
        this.modalTitulo = 'Falha no cadastro';
        this.modalMensagem = mensagemErro;
        this.autoClose = 1500;
        this.abrirModalAvisarCadastro();
      }
    });
  }

    abrirModalAvisarCadastro() {
      this.mostrarModalAvisarCadastro = true;
    }

  irParaLogin() {
    this.router.navigate(['/login']);
  }
}
