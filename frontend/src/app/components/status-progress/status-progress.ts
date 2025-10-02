import { Component, Input } from '@angular/core';

interface Status {
  label: string;
  value: boolean;
  editOption?: {
    label: string;
    action: () => void;
  };
}

@Component({
  selector: 'app-status-progress',
  imports: [],
  templateUrl: './status-progress.html',
  styleUrl: './status-progress.scss'
})
export class StatusProgress {
  @Input() statuses: Status[] = [];

  isActive(index: number): boolean {
    if (index === 0) {
      return !this.statuses[0].value;
    }

    const previousCompleted = this.statuses[index - 1]?.value || false;
    const currentCompleted = this.statuses[index]?.value || false;

    return previousCompleted && !currentCompleted;
  }
}
