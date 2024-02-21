import { Arabic } from '../text';
export class AppConstants {

    private static arabic: Arabic = new Arabic();

    public static SEARCH_BY_NAME = "NAME";
    public static SEARCH_BY_CODE = "CODE";
//   export enum PaymentTypeRequest{
//     CASH ='CASH', CREDIT='CREDIT' , INSTALLMENT='INSTALLMENT'
//   }

    private static translationMap = new Map<string, string>([
        ["Cant find Product", this.arabic.saleOrder.util.dynamicOrderMessage.CANT_FIND_PRODUCT],
        ["Quantity Not Enough In Stock", this.arabic.saleOrder.util.dynamicOrderMessage.QUANTITY_NOT_ENOUGH_IN_STOCK],
        ["Quantity in stock wil be alert quantity", this.arabic.saleOrder.util.dynamicOrderMessage.ALERT_QUANTITY],
        ["Product is Expired", this.arabic.saleOrder.util.dynamicOrderMessage.EXPIRED_PRODUCT],
        ["WHOLESALE", this.arabic.saleOrder.util.orderTypeSelection.wholesale],
        ["RETAIL", this.arabic.saleOrder.util.orderTypeSelection.retailseal],
        ["CASH", this.arabic.saleOrder.util.paymentTypeSelection.cash],
        ["CREDIT", this.arabic.saleOrder.util.paymentTypeSelection.oncredit],
        ["INSTALLMENT", this.arabic.saleOrder.util.paymentTypeSelection.installment],
    ]);

    public static translate(word: string): any {
        return this.translationMap.get(word);
    }
}
