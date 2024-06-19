public with sharing class EmailService {
    public static void sendConfirmationEmail(SupplierCase__c supplierCase) {
        // Obtenir l'email de l'utilisateur actuel
        User currentUser = [SELECT Email FROM User WHERE Id = :UserInfo.getUserId()];
        
        // Préparer le contenu de l'email
        String emailBody = 'Bonjour, ' +
            '\n\nVotre demande a été reçue avec les détails suivants : ' +
            '\n\nTitre : ' + supplierCase.Title__c +
            '\nTypologie : ' + supplierCase.CaseType__c +
            '\nCatégorie : ' + supplierCase.Epic__c +
            '\nCriticité : ' + supplierCase.Priority__c +
            '\nDescription : ' + supplierCase.Description__c +
            '\n\nMerci de votre demande.' +
            '\n\nCordialement, ' +
            '\nL\'équipe de support';

        // Créer l'email
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new String[] { currentUser.Email });
        email.setSubject('Confirmation de votre demande');
        email.setPlainTextBody(emailBody);

        // Ajouter les pièces jointes
        List<Messaging.EmailFileAttachment> attachments = new List<Messaging.EmailFileAttachment>();
            // Récupérer les liens des documents
        List<ContentDocumentLink> contentDocumentLinks = [
            SELECT ContentDocumentId 
            FROM ContentDocumentLink 
            WHERE LinkedEntityId = :supplierCase.Id
        ];
            //Récupérer la version la plus récente de chaque document
        for (ContentDocumentLink cdl : contentDocumentLinks) {
            ContentVersion contentVersion = [
                SELECT Title, VersionData 
                FROM ContentVersion 
                WHERE ContentDocumentId = :cdl.ContentDocumentId 
                ORDER BY VersionNumber DESC 
                LIMIT 1
            ];

            Messaging.EmailFileAttachment attachment = new Messaging.EmailFileAttachment();
            attachment.setFileName(contentVersion.Title);
            attachment.setBody(contentVersion.VersionData);
            attachments.add(attachment);
        }

        if (!attachments.isEmpty()) {
            email.setFileAttachments(attachments);
        }

        // Envoyer l'email
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
    }
}