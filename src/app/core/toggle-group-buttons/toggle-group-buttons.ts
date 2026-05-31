import {
  Component,
  Input,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'toggle-group-buttons',
  standalone: true,
  templateUrl: './toggle-group-buttons.html',
  styleUrl: './toggle-group-buttons.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleGroupButtons),
      multi: true
    }
  ]
})
export class ToggleGroupButtons implements ControlValueAccessor {
  @Input() options: any[] = [];

  @Input() optionValue?: string;
  @Input() optionLabel?: string;

  value: any[] = [];

  private onChange = (_: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.value = value ?? [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  getValue(option: any) {
    return this.optionValue
      ? option[this.optionValue]
      : option;
  }

  getLabel(option: any) {
    return this.optionLabel
      ? option[this.optionLabel]
      : option;
  }

  isSelected(option: any): boolean {
    return this.value.includes(this.getValue(option));
  }

  toggle(option: any) {
    const value = this.getValue(option);

    if (this.value.includes(value)) {
      this.value = this.value.filter(v => v !== value);
    } else {
      this.value = [...this.value, value];
    }

    this.onChange(this.value);
    this.onTouched();
  }
}
