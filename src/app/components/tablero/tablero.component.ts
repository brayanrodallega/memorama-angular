import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartaComponent } from '../carta/carta.component';
import { JuegoService } from '../../services/juego.service';

@Component({
  selector: 'app-tablero',
  standalone: true,
  imports: [CommonModule, CartaComponent],
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss'],
  providers: [JuegoService]
})
export class TableroComponent implements OnInit {
  cartas: any;
  turno: any;
  puntaje: any;
  tiempo: any;
  scoreboard: any = [];
  dosJugadores = false;

  @Output() reiniciar = new EventEmitter<void>();

  constructor(public juego: JuegoService) {}

  ngOnInit() {
    // Se inicia el juego con la configuración definida previamente.
    this.nuevoJuego(this.juego.mode === 2);
    // Se refresca la partida cada segundo.
    setInterval(() => {
      this.refrescar();
      if (this.juego.mode === 1) {
        this.scoreboard = this.juego.obtenerScoreboard();
      }
    }, 1000);
  }

  nuevoJuego(dos: boolean) {
    this.dosJugadores = dos;
    this.juego.iniciarJuego(dos);
    this.refrescar();
  }

  refrescar() {
    this.cartas = this.juego.obtenerCartas();
    this.turno = this.juego.obtenerTurno();
    this.puntaje = this.juego.obtenerPuntaje();
    this.tiempo = this.juego.obtenerTiempo();
  }

  reiniciarPartida() {
    this.juego.iniciarJuego(this.juego.mode === 2);
    this.refrescar();
  }

  volver() {
    this.reiniciar.emit();
  }
}
