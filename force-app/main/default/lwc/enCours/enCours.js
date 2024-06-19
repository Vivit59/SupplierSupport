import { LightningElement, wire } from 'lwc';
import getUserRequests from '@salesforce/apex/Historic.getUserRequests';

export default class EnCours extends LightningElement {
    
    limitedRequests;
    allRequests;
    isPopupOpen = false;
    hasMoreThanFiveRequests = false;

    @wire(getUserRequests)
    wiredRequests({ error, data }) {
        if (data) {
            // Filtrer les demandes avec le statut "non traité" ou "en cours"
            const filteredRequests = data.filter(request => 
                request.Statut__c === 'Non traité' || request.Statut__c === 'En cours'
            );
            // Trier les demandes par date descendante
            const sortedRequests = filteredRequests.sort((a, b) => new Date(b.SubmittedDate__c) - new Date(a.SubmittedDate__c));

            // Limiter à 5 demandes les plus récentes
            this.limitedRequests = sortedRequests.slice(0, 5).map(request => ({
                ...request,
                formattedDate: this.formatDate(request.SubmittedDate__c)
            }));

            /*// Appliquer le formatage de la date pour toutes les demandes
            this.requests = sortedRequests.map(request => {
                return {
                    ...request,
                    formattedDate: this.formatDate(request.SubmittedDate__c)
                };
            });*/

            // Déterminer s'il y a plus de 5 demandes
            this.hasMoreThanFiveRequests = sortedRequests.length > 5;

            // Stocker toutes les demandes pour la popup
            this.allRequests = sortedRequests.map(request => ({
                ...request,
                formattedDate: this.formatDate(request.SubmittedDate__c)
            }));

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

    handleViewAllClick() {
        this.isPopupOpen = true;
    }

    handleClosePopup() {
        this.isPopupOpen = false;
    }
    
}