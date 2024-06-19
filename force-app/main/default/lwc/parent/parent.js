import { LightningElement } from 'lwc';

export default class Parent extends LightningElement {
    selectedRequest;
    //historicClass = 'slds-col slds-size_1-of-1 disposition';


    
    handleRequestSelect(event) {
        this.selectedRequest = event.detail;
        this.historicClass = 'slds-col slds-size_8-of-12 disposition';
        
    }

    handleClose() {
        this.selectedRequest = null;
        //this.historicClass = 'slds-col slds-size_1-of-1 disposition';
    }
}