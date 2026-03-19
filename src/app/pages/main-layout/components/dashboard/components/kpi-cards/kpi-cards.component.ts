import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCardComponent } from '../../../../../../shared/kpi-card/kpi-card.component';
import { KpiData } from '../../../../../../core/interfaces/dashboard.interface';
import { SafeNumberPipe } from '../../../../../../shared/pipes/safe-number.pipe';
@Component({
  selector: 'app-kpi-cards',
  standalone: true,
  imports: [CommonModule, KpiCardComponent,SafeNumberPipe],
  templateUrl: './kpi-cards.component.html',
  styleUrls: ['./kpi-cards.component.scss'],
  
})
export class KpiCardsComponent {
  @Input() data!: KpiData;
  @Input() role: string = 'Guest';
}