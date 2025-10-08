import { Component, Input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-grafico-saldo-mensal',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div>
      <h3>Saldo acumulado por mês</h3>
      <canvas baseChart
        [data]="dadosGraficoSaldo"
        [options]="opcoes"
        [type]="tipo">
      </canvas>
    </div>
  `,
  styles: [`
    div {
    display: flex;
    flex-direction: column;
    }
    h3 {
      margin-bottom: 10px;
      color: #002d74;
    }
  `]
})
export class GraficoSaldoMensalComponent {
  @Input() dadosGraficoSaldo!: ChartData<'line'>;

  tipo: ChartType = 'line';

  opcoes: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Mês' },
        grid: { display: false }
      },
      y: {
        title: { display: true, text: 'Saldo (R$)' },
        beginAtZero: true
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `R$ ${context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        }
      }
    },
    elements: {
      line: {
        borderColor: '#ff6200',
        borderWidth: 3,
        tension: 0.4
      },
      point: {
        radius: 5,
        backgroundColor: '#ff6200'
      }
    }
  };
}
