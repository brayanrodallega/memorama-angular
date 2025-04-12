import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-temporizador',
  standalone: true,
  imports: [CommonModule],
  // Se cambia el template para multiplicar por 1000
  template: `<div class="temporizador">⏱️ {{ tiempo * 1000 | date:'mm:ss':'+0000' }}</div>`,
  styleUrls: ['./temporizador.component.scss']
})
export class TemporizadorComponent {
  @Input() tiempo!: number;
}