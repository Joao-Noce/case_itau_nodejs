import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { LateralBarComponent } from "../../../../shared/components/lateral-bar/lateral-bar.component";
import { RegistroService } from "../../../../core/services/registro.service";
import { ChartData } from 'chart.js';
import { GraficoCategoriasComponent } from "../../../../core/utils/grafico.categorias.component";
import { CategoriaService } from "../../../../core/services/categorias.service";
import { GraficoSaldoMensalComponent } from "../../../../core/utils/grafico.saldo.component";
import { Router } from "@angular/router";

@Component({
    selector: 'app-dashboard',
    standalone: true,           //? componente independente
    imports: [CommonModule, ModalComponent, FormsModule, LateralBarComponent, GraficoCategoriasComponent, GraficoSaldoMensalComponent],    //? importa módulos usados no template
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
    cliente: any = null;
    registro: any = null;
    categoria: any = null;

    iniciais: any = null;

    carregando = true;

    ano: any = null;
    mes: any = null;

    registros: any[] = [];
    registrosFiltrados: any[] = [];

    filtroTipo: string = '';
    filtroCategoria: string = '';

    entradas: any[] = [];
    saidas: any[] = [];

    entradaTotal: any = 0;
    saidaTotal: any = 0;
    saldoFinal: any = 0;

    categorias: any[] = [];

    saldosMensais: any[] = [];
    saldoMesAtual: any = 0;

    mostrarModalAvisar = false;
    modalTitulo = '';
    modalMensagem = '';
    autoClose = 0;

    labelsGraficoCategoria: string[] = [];
    dadosGraficoCategoria: ChartData<'pie'> = { labels: [], datasets: [] };

    labelsGraficoSaldosMensais: string[] = [];
    dadosGraficoSaldosMensais: ChartData<'line'> = { labels: [], datasets: [] };

    mostrarModalAdicionarRegistro = false;
    mostrarModalAtualizarRegistro = false;
    mostrarModalRemoverRegistro = false;

    mostrarModalAdicionarCategoria = false;
    mostrarModalAtualizarCategoria = false;
    mostrarModalRemoverCategoria = false;

    formRegistro: any = {
        descricao: '',
        valor: 0,
        data: '',
        tipo: '',
        repeticao: 'NONE',
        parcela: 1,
        juros: 0,
        fkCategoria: 0
    };

    formCategoria: any = {
        nome: ''
    }
    clienteLogado: any = {};

    constructor(
        private categoriaService: CategoriaService,
        private registroService: RegistroService,
        private router: Router
    ) { }

    meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    mesAtualNome: any;

    ngOnInit(): void {
        const clienteStorage = localStorage.getItem('clienteLogado');
        if (clienteStorage) this.cliente = JSON.parse(clienteStorage);
        else this.router.navigate(['/Login']);

        const hoje = new Date();
        this.ano = hoje.getFullYear();
        this.mes = hoje.getMonth() + 1;

        this.iniciais = this.getIniciais();
        this.carregarRegistros();
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

    carregarRegistros() {
        this.registroService.buscarPorCliente(this.cliente.idCliente, this.ano, this.mes).subscribe({
            next: (data) => {
                this.registros = data.rows;
                this.registrosFiltrados = [...this.registros]
                this.filtrarRegistros();
                this.cliente.saldo = data.saldoAtual;
                this.entradaTotal = data.entradaTotal;
                this.saidaTotal = data.saidaTotal;
                this.saldoFinal = data.saldoFinal;

                this.entradas = this.registros.filter(fixo => fixo.tipo === 'entrada');
                this.saidas = this.registros.filter(fixo => fixo.tipo === 'saida');
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
                        backgroundColor: ['#FF6200', '#FFA366', '#002D74', '#005CAA', '#7AA5D2', '#F2C94C', '#E0E0E0']
                    }
                ]
            };
        });

        this.registroService.calcularSaldoMensal(this.cliente.idCliente, this.ano).subscribe((saldos: any[]) => {
            this.saldosMensais = saldos;
            this.mesAtualNome = this.meses[this.mes - 1];
            this.saldoMesAtual = this.saldosMensais.find(s => s.mes === this.mesAtualNome)?.saldo || 0;
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

    mesAnoString() {
        const mesFormatado = String(this.mes).padStart(2, '0');
        return `${this.ano}-${mesFormatado}`;
    }

    onMesAnoChange(event: any) {
        const [ano, mes] = event.target.value.split('-').map(Number);
        this.ano = ano;
        this.mes = mes;
        this.carregarRegistros();
        this.mesAtualNome = this.meses[this.mes - 1];
        this.saldoMesAtual = this.saldosMensais.find(s => s.mes === this.mesAtualNome)?.saldo || 0;
    }

    anteriorMes() {
        this.mes--;
        if (this.mes < 1) {
            this.mes = 12;
            this.ano--;
        }
        this.carregarRegistros();
        this.carregarGrafico();
    }

    proximoMes() {
        this.mes++;
        if (this.mes > 12) {
            this.mes = 1;
            this.ano++;
        }
        this.carregarRegistros();
        this.carregarGrafico();
    }

    filtrarRegistros() {
        this.registrosFiltrados = this.registros.filter(f => {
            const tipoOk = this.filtroTipo ? f.tipo === this.filtroTipo : true;
            const categoriaOk = this.filtroCategoria ? f.nomeCategoria === this.filtroCategoria : true;
            return tipoOk && categoriaOk;
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
        };

        this.registroService.adicionarRegistro(registroParaEnviar).subscribe({
            next: (data) => {
                this.modalTitulo = 'Sucesso!';
                this.modalMensagem = "Adicionar atualizado!";
                this.autoClose = 1500;
                this.abrirModalAlertar();

                this.registro = data;
                this.carregarRegistros();
                this.carregarGrafico();
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
                this.carregarRegistros();
                this.carregarGrafico();
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
                this.carregarRegistros();
                this.carregarGrafico();
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
                this.modalMensagem = "Categoria atualizada!";
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
                this.modalMensagem = "Categoria removida!";
                this.autoClose = 1500;
                this.abrirModalAlertar();

                this.categoria = null;
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
                mensagemErro = 'Este registro já foi criado.';
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