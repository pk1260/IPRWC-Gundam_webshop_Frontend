export class CartItem {
  constructor(
    public id: string,
    public productId: string, // Add this line
    public name: string,
    public price: number,
    public quantity: number
  ) {}
}
