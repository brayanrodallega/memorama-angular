import { Component, Input } from '@angular/core';
import { Carta } from '../../models/carta.model';
import { JuegoService } from '../../services/juego.service';

@Component({
  selector: 'app-carta',
  standalone: true,
  imports: [],
  templateUrl: './carta.component.html',
  styleUrls: ['./carta.component.scss']
})
export class CartaComponent {
  @Input() carta!: Carta;
  constructor(private juego: JuegoService) {}
  alVoltear() { this.juego.voltear(this.carta); }
}