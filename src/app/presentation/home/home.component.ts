import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FeatureCard {
  title: string;
  description: string;
  tag: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly menuOpen = signal(false);

  readonly features: FeatureCard[] = [
    {
      tag: 'Busca',
      title: 'Jogos parecidos',
      description:
        'O pitch vira um embedding e a busca encontra jogos já lançados com descrição próxima da sua ideia.',
    },
    {
      tag: 'Reviews',
      title: 'Elogios e reclamações',
      description:
        'Temas recorrentes com prevalência, intervalo de confiança, jogos-exemplo e trechos literais.',
    },
    {
      tag: 'Random Forest',
      title: 'Fatores decisivos',
      description:
        'Quais temas mais aumentam ou reduzem a chance de uma review recomendar o jogo — associação, não previsão de vendas.',
    },
    {
      tag: 'Referência',
      title: 'Reviews mais úteis',
      description:
        'As reviews de referência de cada jogo parecido, com a resposta do desenvolvedor quando ela existe.',
    },
  ];

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
