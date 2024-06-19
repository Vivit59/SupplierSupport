trigger EmailTrigger on SupplierCase__c (after insert) {
    for (SupplierCase__c supplierCase : Trigger.new) {
        EmailService.sendConfirmationEmail(supplierCase);
    }
}