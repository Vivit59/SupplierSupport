public with sharing class Historic {
    @AuraEnabled(cacheable=true)
    public static List<SupplierCase__c> getUserRequests() {
        String userId = UserInfo.getUserId();
        return [
            SELECT Id, Title__c, CaseType__c, Epic__c, Priority__c, Statut__c, SubmittedDate__c,Statut_Logo__c, Criticite_Logo__c, Typologie_Logo__c,Epic_Logo__c
            FROM SupplierCase__c 
            WHERE CreatedById = :userId
            ORDER BY SubmittedDate__c DESC
        ];
    }
}