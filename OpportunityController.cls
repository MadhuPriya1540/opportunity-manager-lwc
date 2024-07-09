public with sharing class OpportunityController {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getAllOpportunities() {
        return [SELECT Id, Name, StageName, CloseDate FROM Opportunity];
    }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getClosedWonOpportunities() {
        return [SELECT Id, Name, StageName, CloseDate FROM Opportunity WHERE StageName = 'Closed Won'];
    }

    @AuraEnabled
    public static void deleteOpportunity(Id opportunityId) {
        delete [SELECT Id FROM Opportunity WHERE Id = :opportunityId];
    }
}
