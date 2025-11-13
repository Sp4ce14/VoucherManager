import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { VoucherService } from "./services/VoucherService";
import { OrderModel } from "./models/OrderModel";
import { Directive, OnInit } from "@angular/core";

@Directive()

export abstract class VoucherBase implements OnInit {
  public voucherForm: FormGroup;
  private _item: AbstractControl | null;
  private _price: AbstractControl | null;
  private _quantity: AbstractControl | null;
  public editPressed: boolean = false;
  private indexForUpdatingItem: number;
  public items: OrderModel[] = [];


  constructor(public formBuilder: FormBuilder, public voucherService: VoucherService) {
    this.voucherForm = this.formBuilder.group({
      date: '',
      customer: '',
      item: '',
      price: '',
      quantity: ''
    })
    this._item = this.voucherForm.get('item');
    this._quantity = this.voucherForm.get('quantity');
    this._price = this.voucherForm.get('price');
  }

  abstract ngOnInit(): void;

  formInit(): void {
    
  }

  public addItem(): void {
    if (this._item?.value && this._quantity?.value && this._price?.value) {
      this.items.push({
        item: this._item.value,
        quantity: this._quantity.value,
        price: this._price.value
      })
      this._item.reset();
      this._quantity.reset();
      this._price.reset();
    }
    console.log(this.items);
    console.log(this._item);
  }

  public editItem(index: number): void {
    this.voucherForm.patchValue({
      item: this.items[index].item,
      quantity: this.items[index].quantity,
      price: this.items[index].price
    })
    this.editPressed = true;
    this.indexForUpdatingItem = index;
  }

  public updateItem(): void {
    this.items[this.indexForUpdatingItem].item = this._item?.value;
    this.items[this.indexForUpdatingItem].quantity = this._quantity?.value;
    this.items[this.indexForUpdatingItem].price = this._price?.value;
    this.editPressed = false;
    this._item?.reset();
    this._quantity?.reset();
    this._price?.reset();
  }

  public deleteItem(index: number): void {
    this.items.splice(index, 1);
  }

  abstract saveVoucher(): void;
  
}