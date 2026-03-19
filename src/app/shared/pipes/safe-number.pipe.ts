import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeNumber',
   standalone: true
})
export class SafeNumberPipe implements PipeTransform {
  transform(value: any, format: string = '1.2-2'): string {
    if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
      return '0.00';
    }
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
}