import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PurchaseOrder } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  private fb = inject(FormBuilder)

  protected form!: FormGroup
  protected cart!: FormArray

  ngOnInit(){
    this.form = this.createForm()
  }

  //push form group (line itemyg) into cart array
  protected addToCart(){
    this.cart.push(this.createLineItem())
  }

  //delete from cart
  protected deleteFromCart(idx: number){
    console.info('>>> idx: ', idx)
    this.cart.removeAt(idx)
  }

  //process on submit
  protected processForm(): void{
    const values: PurchaseOrder = this.form.value
    console.info('>>> value info: ', values)
  }


  //additional validation
  protected invalid(): boolean{
    return this.form.invalid || this.cart.controls.length <= 0
  }


  protected isCtrlInvalid(ctrlName: string): boolean{
    return !!this.form.get(ctrlName)?.invalid
  }


  //returns empty input group representing 1 lineitem
  private createLineItem(): FormGroup{
    return this.fb.group({
      lineName: this.fb.control<string>('', [Validators.required]),
      lineQty: this.fb.control<number>(0, [Validators.min(1)]),
      linePrice: this.fb.control<number>(0, [Validators.min(0.1)])
    })

  }



  private createForm(): FormGroup{
    this.cart = this.fb.array([])
    return this.fb.group({
      name: this.fb.control<string>('', [Validators.required]),
      address: this.fb.control<string>('', [Validators.required]),
      email: this.fb.control<string>('', [Validators.email, Validators.required]),
      delivery: this.fb.control<string>('', [Validators.required]),
      rush: this.fb.control<boolean>(false),

      lineItems: this.cart

    })

  }





}
