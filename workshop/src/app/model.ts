export interface LineItems{
    lineName: string
    lineQty: number
    linePrice: number
}

export interface PurchaseOrder{
    name: string
    address: string
    email: string
    delivery: Date
    rush: boolean
    lineItems: LineItems []

}