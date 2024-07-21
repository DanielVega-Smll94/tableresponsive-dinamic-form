import { Component, OnInit, Input } from '@angular/core';
import { Product } from './product';
import { ProductService } from './productservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  products: Product[];

  cols: any[];
  form: FormGroup;
  jsonData: any = {
    name: 'John Doe',
    age: 30,
    email: 'john.doe@example.com',
    address_principal: {
      street: '123 Main St',
      city: 'Anytown',
      country: 'USA',
    },
  };
  requiredFields: string[] = [
    'name',
    'email',
    'address_principal.street',
    'address_principal.city',
  ];

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({});
    this.buildForm(this.jsonData);

    this.productService
      .getProductsSmall()
      .then((data) => (this.products = data));

    this.cols = [
      { field: 'code', header: 'Code' },
      { field: 'name', header: 'Name' },
      { field: 'category', header: 'Category' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'inventoryStatus', header: 'Status' },
      { field: 'rating', header: 'Rating' },
    ];
  }
  buildForm(data: any, parentKey: string = ''): void {
    Object.keys(data).forEach((key) => {
      const controlKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof data[key] === 'object' && data[key] !== null) {
        this.buildForm(data[key], controlKey);
      } else {
        const validators = this.requiredFields.includes(controlKey)
          ? [Validators.required]
          : [];

        this.form.addControl(
          controlKey,
          this.fb.control(data[key], validators)
          //Validators.required)
        );
      }
    });
  }
  isControlInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  isObject(value: any): boolean {
    return value !== null && typeof value === 'object';
  }

  objectKeys(value: any): string[] {
    return Object.keys(value);
  }
  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted', this.form.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
