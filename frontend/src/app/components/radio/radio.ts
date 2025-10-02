import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-radio',
  imports: [CommonModule],
  templateUrl: './radio.html',
  styleUrl: './radio.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true
    }
  ]
})
export class RadioComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() value: any;
  @Input() name: string = '';
  @Input() disabled: boolean = false;
  @Input() id: string = `radio-${Math.random().toString(36).substr(2, 9)}`;
  @Output() valueChange = new EventEmitter<any>();

  selectedValue: any;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  get isChecked(): boolean {
    return this.selectedValue === this.value;
  }

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onRadioChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.selectedValue = this.value;
      this.onChange(this.selectedValue);
      this.onTouched();
      this.valueChange.emit(this.selectedValue);
    }
  }
}
