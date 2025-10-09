import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ClienteService } from "../../../../core/services/cliente.service";
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { LateralBarComponent } from "../../../../shared/components/lateral-bar/lateral-bar.component";
import { RegistroService } from "../../../../core/services/registro.service";
import { ChartData } from 'chart.js';
import { GraficoCategoriasComponent } from "../../../../core/utils/grafico.categorias.component";
import { CategoriaService } from "../../../../core/services/categorias.service";
import { GraficoSaldoMensalComponent } from "../../../../core/utils/grafico.saldo.component";
import { Router } from "@angular/router";

@Component({
    selector: 'app-usuario',
    standalone: true,           //? componente independente
    imports: [CommonModule, ModalComponent, FormsModule, LateralBarComponent, GraficoCategoriasComponent, GraficoSaldoMensalComponent],
    templateUrl: './cliente.component.html',
    styleUrls: ['./cliente.component.scss']
})

export class ClienteComponent implements OnInit {
    cliente: any = null;
    registro: any = null;
    categoria: any = null;

    iniciais: any = null;

    carregando = true;

    tabela1Aberta = false;
    tabela2Aberta = false;

    menuAberto = false;

    ano: any;
    mes: any;

    mostrarModalAvisar = false;
    modalTitulo = '';
    modalMensagem = '';
    autoClose = 0;

    fixos: any[] = [];
    entradas: any[] = [];
    saidas: any[] = [];
    entradaTotal: any = 0;
    saidaTotal: any = 0;
    saldoFinal: any = 0;
    categorias: any[] = [];

    labelsGraficoCategoria: string[] = [];
    dadosGraficoCategoria: ChartData<'pie'> = { labels: [], datasets: [] };

    labelsGraficoSaldosMensais: string[] = [];
    dadosGraficoSaldosMensais: ChartData<'line'> = { labels: [], datasets: [] };

    mostrarModalAdicionarCliente = false;
    mostrarModalAtualizarCliente = false;
    mostrarModalRemoverCliente = false;

    mostrarModalAdicionarRegistro = false;
    mostrarModalAtualizarRegistro = false;
    mostrarModalRemoverRegistro = false;

    mostrarModalAdicionarCategoria = false;
    mostrarModalAtualizarCategoria = false;
    mostrarModalRemoverCategoria = false;

    formCliente: any = {
        nome: '',
        email: '',
        saldo: 0
    };

    formRegistro: any = {
        descricao: '',
        valor: 0,
        data: '',
        tipo: '',
        repeticao: '',
        fkCategoria: 0
    };

    formCategoria: any = {
        nome: ''
    }
    clienteLogado: any = {};

    constructor(
        private clienteService: ClienteService,
        private categoriaService: CategoriaService,
        private registroService: RegistroService,
        private router: Router
    ) { }

    ngOnInit(): void {
        const clienteStorage = localStorage.getItem('clienteLogado');
        if (clienteStorage) this.cliente = JSON.parse(clienteStorage);
        else this.router.navigate(['/Login']);

        const hoje = new Date();
        this.ano = hoje.getFullYear();
        this.mes = hoje.getMonth() + 1;

        this.iniciais = this.getIniciais();
        this.carregarFixos();
        this.carregarCategorias();
        this.carregarGrafico();
        this.carregando = false;
    }

    getIniciais() {
        const partesNome = this.cliente.nome.trim().split(' ');
        const primeiraLetra = partesNome[0]?.charAt(0).toUpperCase() || '';
        const ultimaLetra = partesNome[partesNome.length - 1]?.charAt(0).toUpperCase() || '';
        return primeiraLetra + ultimaLetra;
    }


    carregarFixos() {
        this.registroService.buscarFixosPorCliente(this.cliente.idCliente, this.ano, this.mes).subscribe({
            next: (data) => {
                this.fixos = data.rows;
                this.cliente.saldo = data.saldoAtual;
                this.entradaTotal = data.entradaTotal;
                this.saidaTotal = data.saidaTotal;
                this.saldoFinal = data.saldoFinal;

                this.entradas = this.fixos.filter(fixo => fixo.tipo === 'Deposito');
                this.saidas = this.fixos.filter(fixo => fixo.tipo === 'Saque');
            },
            error: (err) => {
                console.error("Erro ao buscar valores fixos: ", err);
            }
        })
    }

    carregarGrafico() {
        this.registroService.agruparPorCategoria(this.cliente.idCliente, this.ano, this.mes).subscribe((categorias: any[]) => {
            this.labelsGraficoCategoria = categorias.map(c => c.categoria);
            this.dadosGraficoCategoria = {
                labels: this.labelsGraficoCategoria,
                datasets: [
                    {
                        data: categorias.map(c => c.total),
                        backgroundColor: ['#4caf50', '#f44336', '#2196f3', '#ff9800', '#9c27b0', '#00bcd4']
                    }
                ]
            };
        });

        this.registroService.calcularSaldoMensal(this.cliente.idCliente, this.ano).subscribe((saldos: any[]) => {
            this.labelsGraficoSaldosMensais = saldos.map(s => s.mes);
            this.dadosGraficoSaldosMensais = {
                labels: this.labelsGraficoSaldosMensais,
                datasets: [
                    {
                        label: 'Saldo Mensal',
                        data: saldos.map(s => s.saldo),
                        fill: false,
                        borderColor: '#ff6200',
                        backgroundColor: '#ff6200',
                        tension: 0.3,
                        pointRadius: 5,
                        pointBackgroundColor: '#ff6200'
                    }
                ]
            }
        })
    }

    carregarCategorias() {
        this.categoriaService.listarCategoriasPorCliente(this.cliente.idCliente).subscribe({
            next: (data) => {
                this.categorias = data;
            },
            error: (err) => {
                console.error("Erro ao buscar categorias: ", err);
            }
        })
    }

    toggleTabela(num: number) {
        if (num === 1) this.tabela1Aberta = !this.tabela1Aberta;
        if (num === 2) this.tabela2Aberta = !this.tabela2Aberta;
    }

    toggleMenu() {
        this.menuAberto = !this.menuAberto;
    }


    logout() {
        window.location.href = '/login';
    }

    //? CLIENTE
    abrirModalAtualizarCliente() {
        this.formCliente = { ...this.cliente };
        this.mostrarModalAtualizarCliente = true;
    }

    confirmarAtualizarCliente() {
        this.clienteService.atualizarCliente(this.cliente.idCliente, this.formCliente).subscribe({
            next: (data) => {
                this.modalTitulo = 'Sucesso!';
                this.modalMensagem = "Conta atualizada!";
                this.autoClose = 1500;
                this.abrirModalAlertar();
                this.cliente = data;
                localStorage.setItem('clienteLogado', JSON.stringify(data));
                this.mostrarModalAtualizarCliente = false;
                this.iniciais = this.getIniciais();
            },
            error: (err) => {
                const mensagemErro = this.validarErro(err);
                console.error("Erro ao atualizar conta: ", err)
                this.modalTitulo = 'Erro ao atualizar conta!';
                this.modalMensagem = mensagemErro;
                this.autoClose = 1500;
                this.abrirModalAlertar();
            }
        });
    }

    abrirModalRemoverCliente() {
        this.mostrarModalRemoverCliente = true;
    }

    confirmarRemoverCliente() {
        this.clienteService.deletarCliente(this.cliente.id).subscribe({
            next: () => {
                this.modalTitulo = 'Sucesso!';
                this.modalMensagem = "Conta removida. Seus registros foram eliminados.";
                this.autoClose = 1500;
                this.abrirModalAlertar();
                //! LEVAR PARA LOGIN
                this.cliente = null;
                this.mostrarModalRemoverCliente = false;
            },
            error: (err) => {
                const mensagemErro = this.validarErro(err);
                console.error("Erro ao remover conta: ", err)
                this.modalTitulo = 'Erro ao remover conta!';
                this.modalMensagem = mensagemErro;
                this.autoClose = 1500;
                this.abrirModalAlertar();
            }
        });
    }

    //? REGISTRO

    abrirModalAdicionarRegistro() {
        this.registro = null;
        this.formRegistro = { ...this.registro };
        this.mostrarModalAdicionarRegistro = true;
    }

    confirmarAdicionarRegistro() {
        const registroParaEnviar = {
            ...this.formRegistro,
            fkCliente: this.cliente.idCliente,
            parcela: 1,
        };

        this.registroService.adicionarRegistro(registroParaEnviar).subscribe({
            next: (data) => {
                this.modalTitulo = 'Sucesso!';
                this.modalMensagem = "Registro adicionado!";
                this.autoClose = 1500;
                this.abrirModalAlertar();
                this.registro = data;
                this.carregarFixos();
                this.mostrarModalAdicionarRegistro = false;
            },
            error: (err) => {
                const mensagemErro = this.validarErro(err);
                console.error("Erro ao adicionar registro: ", err)
                this.modalTitulo = 'Erro ao adicionar registro!';
                this.modalMensagem = mensagemErro;
                this.autoClose = 1500;
                this.abrirModalAlertar();
            }
        });
    }

    abrirModalAtualizarRegistro(registro: any) {
        this.registro = registro;
        this.formRegistro = { ...this.registro };

        if (this.registro.data) {
            const data = new Date(this.registro.data);
            const ano = data.getFullYear();
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const dia = String(data.getDate()).padStart(2, '0');

            this.formRegistro.data = `${ano}-${mes}-${dia}`;
        }
        this.mostrarModalAtualizarRegistro = true;
    }

    confirmarAtualizarRegistro() {
        this.registroService.atualizarRegistro(this.registro.idRegistro, this.formRegistro).subscribe({
            next: (data) => {
                this.modalTitulo = 'Sucesso!';
                this.modalMensagem = "Registro atualizado!";
                this.autoClose = 1500;
                this.abrirModalAlertar();
                this.registro = data;
                this.carregarFixos();
                this.mostrarModalAtualizarRegistro = false;
            },
            error: (err) => {
                const mensagemErro = this.validarErro(err);
                console.error("Erro ao atualizar registro: ", err)
                this.modalTitulo = 'Erro ao atualizar registro!';
                this.modalMensagem = mensagemErro;
                this.autoClose = 1500;
                this.abrirModalAlertar();
            }
        });
    }

    abrirModalRemoverRegistro(registro: any) {
        this.registro = registro;
        this.mostrarModalRemoverRegistro = true;
    }

    confirmarRemoverRegistro() {
        this.registroService.deletarRegistro(this.registro.idRegistro).subscribe({
            next: () => {
                this.modalTitulo = 'Sucesso!';
                this.modalMensagem = "Registro removido!";
                this.autoClose = 1500;
                this.abrirModalAlertar();
                this.registro = null;
                this.carregarFixos();
                this.mostrarModalRemoverRegistro = false;
            },
            error: (err) => {
                const mensagemErro = this.validarErro(err);
                console.error("Erro ao remover registro: ", err)
                this.modalTitulo = 'Erro ao remover registro!';
                this.modalMensagem = mensagemErro;
                this.autoClose = 1500;
                this.abrirModalAlertar();
            }
        });
    }

    //? CATEGORIA
    abrirModalAdicionarCategoria() {
        this.categoria = null;
        this.formCategoria = { ...this.categoria };
        this.mostrarModalAdicionarCategoria = true;
    }

    confirmarAdicionarCategoria() {
        const categoriaParaEnviar = {
            ...this.formCategoria,
            fkCliente: this.cliente.idCliente
        };
        this.categoriaService.adicionarCategoria(categoriaParaEnviar).subscribe({
            next: (data) => {
                this.modalTitulo = 'Sucesso!';
                this.modalMensagem = "Categoria adicionada!";
                this.autoClose = 1500;
                this.abrirModalAlertar();
                this.categoria = data;
                this.carregarCategorias();
                this.carregarGrafico();
                this.mostrarModalAdicionarCategoria = false;
            },
            error: (err) => {
                const mensagemErro = this.validarErro(err);
                console.error("Erro ao adicionar categoria: ", err)
                this.modalTitulo = 'Erro ao adicionar categoria!';
                this.modalMensagem = mensagemErro;
                this.autoClose = 1500;
                this.abrirModalAlertar();
            }
        });
    }

    abrirModalAtualizarCategoria(categoria: any) {
        this.categoria = categoria;
        this.formCategoria = { ...this.categoria };
        this.mostrarModalAtualizarCategoria = true;
    }

    confirmarAtualizarCategoria() {
        const categoriaParaEnviar = {
            ...this.formCategoria,
            fkCliente: this.cliente.idCliente
        };
        this.categoriaService.atualizarCategoria(this.categoria.idCategoria, categoriaParaEnviar).subscribe({
            next: (data) => {
                this.modalTitulo = 'Sucesso!';
                this.modalMensagem = "Categoria atualizada!";
                this.autoClose = 1500;
                this.abrirModalAlertar();
                this.categoria = data;
                this.carregarCategorias();
                this.carregarGrafico();
                this.mostrarModalAtualizarCategoria = false;
            },
            error: (err) => {
                const mensagemErro = this.validarErro(err);
                console.error("Erro ao atualizar categoria: ", err)
                this.modalTitulo = 'Erro ao atualizar categoria!';
                this.modalMensagem = mensagemErro;
                this.autoClose = 1500;
                this.abrirModalAlertar();
            }
        });
    }

    abrirModalRemoverCategoria(categoria: any) {
        this.categoria = categoria;
        this.mostrarModalRemoverCategoria = true;
    }

    confirmarRemoverCategoria() {
        this.categoriaService.deletarCategoria(this.categoria.idCategoria, { fkCliente: this.cliente.idCliente }).subscribe({
            next: () => {
                this.modalTitulo = 'Sucesso!';
                this.modalMensagem = "Categoria deletado!";
                this.autoClose = 1500;
                this.abrirModalAlertar();
                this.carregarCategorias();
                this.carregarGrafico();
                this.mostrarModalRemoverCategoria = false;
            },
            error: (err) => {
                const mensagemErro = this.validarErro(err);
                console.error("Erro ao remover categoria: ", err)
                this.modalTitulo = 'Erro ao remover categoria!';
                this.modalMensagem = mensagemErro;
                this.autoClose = 1500;
                this.abrirModalAlertar();
            }
        });

    }

    abrirModalAlertar() {
        this.mostrarModalAvisar = true;
    }

    validarErro(err: any) {
        let mensagemErro = 'Erro inesperado. Tente novamente.';

        switch (err.status) {
            case 400:
                mensagemErro = 'Dados inválidos. Verifique os campos e tente novamente.';
                break;
            case 409:
                mensagemErro = 'Esta categoria já foi criada.';
                break;
            case 404:
                mensagemErro = 'Servidor não encontrado. Verifique a conexão.';
                break;
            case 500:
                mensagemErro = 'Erro interno no servidor. Tente novamente mais tarde.';
                break;
        }
        return mensagemErro;
    }
}