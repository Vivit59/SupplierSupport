import { LightningElement, api } from 'lwc';
import createSupplierCase from '@salesforce/apex/SupplierCaseController.createSupplierCase';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import linkFilesToCase from '@salesforce/apex/SupplierCaseController.linkFilesToCase';

export default class SupplierCase extends LightningElement {
    // Options pour le groupe de typologie
    typologyOptions = [
        { label: 'Faq', value: 'faq', isChecked : true },
        { label: 'Anomalie', value: 'anomalie' },
        { label: 'Assistance', value: 'assistance' }
    ];

    selectedTypology = 'faq';


    handleTypologyChange(event){
        this.selectedTypology = event.target.value;
        this.typologyOptions.forEach(item => {
            if (item.value == event.target.value){
                item.isChecked = true;
            }else{
                item.isChecked = false;
            }
        });

        // Afficher les champs de criticité et de téléchargement de fichier pour 'anomalie' et 'assistance'
        this.showCriticalityAndFileUpload = this.selectedTypology === 'anomalie' || this.selectedTypology === 'assistance';
    }


    // Options pour la pickList catégorie
    categoryOptions = [
        { label: 'Factures', value: 'factures' },
        { label: 'Déclarations', value: 'déclarations' },
        { label: 'Bibliothèque', value: 'bibliothèque' },
        { label: 'Autre', value: 'autre' }
    ];

    handleCategoryChange(event){
        this.selectedCategory = event.detail.value;
    }

    // Options pour le groupe de criticité
    criticalityOptions = [
        { label: 'Faible', value: 'faible', isChecked : true },
        { label: 'Moyenne', value: 'moyenne' },
        { label: 'Forte', value: 'forte' }
    ];

    selectedCriticality = 'faible';
    showCriticalityAndFileUpload = false;

    handleCriticalityChange(event){
        this.selectedCriticality = event.target.value;
        this.criticalityOptions.forEach(item => {
            item.isChecked = item.value === this.selectedCriticality;
        })
    }

    title='';
    handleTitleChange(event){
        this.title = event.target.value;
    }

    richText = '';
    handleRichTextChange(event) {
        this.richText = event.target.value;
    }

    @api
    recordId;
    uploadedFiles = [];

    get acceptedFormats() {
        return ['.pdf', '.png', '.jpg', '.jpeg'];
    }

    handleUploadFinished(event) {
        // Obtenir la liste des fichiers téléchargés
    const uploadedFiles = event.detail.files;

    // Stocker les IDs des fichiers téléchargés
    this.uploadedFiles = uploadedFiles.map(file => file.documentId);
    }

    async handleSubmit() {
        try{
            const result = await createSupplierCase({ 
                typology: this.selectedTypology,
                category: this.selectedCategory,
                criticality: this.selectedCriticality,
                title: this.title,
                description: this.richText 
        });

         this.recordId = result;
         this.dispatchEvent(new ShowToastEvent({
                title: 'Succès',
                message: 'Le SupplierCase a été créé avec succès. ID: ' + result,
                variant: 'success'
            }));

            await linkFilesToCase({ 
                caseId: this.recordId, 
                contentDocumentIds: this.uploadedFiles 
            });

            this.dispatchEvent(new ShowToastEvent({
                title: 'Succès',
                message: 'Les fichiers ont été liés avec succès.',
                variant: 'success'
            }));
        } catch(error) {
            let errorMessage = 'Erreur inconnue';

            if (error && error.body && error.body.message) {
                errorMessage = error.body.message;
            } else if (error && error.message) {
                errorMessage = error.message;
            }

            this.dispatchEvent(new ShowToastEvent({
                title: 'Erreur',
                message: 'Erreur lors de la création du SupplierCase: ' + errorMessage,
                variant: 'error'
            }));
            console.error('Error creating SupplierCase:', error);
        }
    }

}