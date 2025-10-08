import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartData, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

Chart.register(...registerables);

@Component({
  selector: 'app-grafico-categorias',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div>
    <h3>Saques por Categoria</h3>  
    <canvas [ngStyle]="{ width: size + 'px', height: size + 'px' }" baseChart
        [data]="dadosGraficoCategoria"
        [type]="'pie'">
      </canvas>
    </div>
  `,
  styles: [`
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    h3 {
      margin-bottom: 10px;
      color: #002d74;
    }
  `]
})
export class GraficoCategoriasComponent {
  @Input() dadosGraficoCategoria!: ChartData<'pie'>;
  @Input() size: number = 400;
}
