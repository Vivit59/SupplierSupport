import { LightningElement,api } from 'lwc';

export default class TicketDetail extends LightningElement {
    @api supplierCase;

    handleClose() {
        this.dispatchEvent(new CustomEvent('close'));
    }
}