import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnChanges {
  @Input() titulo: string = '';
  @Input() mostrar: boolean = false;   // controla se o modal aparece
  @Input() mostrarCancelar: boolean = true; // opcional, mostrar botão cancelar
  @Input() autoCloseTime: number = 0;
  
  @Output() fechar = new EventEmitter<void>();  
  @Output() confirmar = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mostrar'] && this.mostrar && this.autoCloseTime > 0) {
        setTimeout(() => {
            this.onFechar();
        }, this.autoCloseTime);
    }
  }

  onFechar() {
    this.fechar.emit();
  }

  onConfirmar() {
    this.confirmar.emit();
  }
}
