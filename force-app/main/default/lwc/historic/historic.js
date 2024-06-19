import { LightningElement, wire } from 'lwc';
import getUserRequests from '@salesforce/apex/Historic.getUserRequests';

//import Done from '@salesforce/staticResourcesUrl/Done';


export default class Historic extends LightningElement {
    requests;
    selectedTicket;
    isPanelOpen = false;
    historicClass='slds-col slds-size_1-of-1 disposition';

    @wire(getUserRequests)
    wiredRequests({ error, data }) {
        if (data) {
            console.log(JSON.stringify(data));
            this.requests = data.map(request => {
                return{
                    ...request,
                    formattedDate: this.formatDate(request.SubmittedDate__c)
                };
            });
        } else if (error) {
            this.requests = undefined;
            console.error(error);
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() +1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    handleTitleClick(event) {
        event.preventDefault();
        const caseId = event.currentTarget.dataset.id;
        this.selectedSupplierCase = this.requests.find(request => request.Id === caseId);
        this.isPanelOpen = true;
        this.historicClass= 'slds-col slds-size_8-of-12 disposition';
    }

    handleClosePanel() {
        this.isPanelOpen = false;
        this.selectedSupplierCase = null;
        this.historicClass='slds-col slds-size_1-of-1 disposition';
    }
}