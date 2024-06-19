public with sharing class SupplierCaseController {
    @AuraEnabled
    public static String createSupplierCase(String typology, String category, String criticality, String title, String description) {
        SupplierCase__c newCase = new SupplierCase__c();
        newCase.CaseType__c = typology;
        newCase.Epic__c = category;
        newCase.Priority__c = criticality;
        newCase.Title__c = title;
        newCase.Description__c = description;
        newCase.SubmittedDate__c = System.now();
        newCase.Statut__c = 'Non traité';


        try {
            insert newCase;
            return newCase.Id;
        } catch (Exception e) {
            throw new AuraHandledException('Erreur lors de la création du SupplierCase : ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void linkFilesToCase(Id caseId, List<Id> contentDocumentIds) {
    
        List<ContentDocumentLink> contentDocumentLinks = new List<ContentDocumentLink>();
        for (Id contentDocumentId : contentDocumentIds) {
            
            ContentDocumentLink cdl = new ContentDocumentLink();
            cdl.ContentDocumentId = contentDocumentId;
            cdl.LinkedEntityId = caseId;
            cdl.ShareType = 'V';
            cdl.Visibility = 'AllUsers';
            contentDocumentLinks.add(cdl);
        }
    
        try {
            insert contentDocumentLinks;
        } catch (Exception e) {
            throw new AuraHandledException('Erreur lors de la liaison des fichiers : ' + e.getMessage());
        }
    }
}
