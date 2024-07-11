public class OpportunityUpdateHistoryHandler {
    public static void handleBeforeInsert(List<Opportunity> newList) {
        String currentUserName = UserInfo.getName();
        String currentDate = DateTime.now().format('yyyy-MM-dd HH:mm:ss');

        for (Opportunity opp : newList) {
            opp.Update_History__c = 'New record is created by ' + currentUserName + ' on ' + currentDate;
        }
    }

    public static void handleBeforeUpdate(Map<Id, Opportunity> oldMap, List<Opportunity> newList) {
        String currentUserName = UserInfo.getName();
        String currentDate = DateTime.now().format('yyyy-MM-dd HH:mm:ss');

        for (Opportunity opp : newList) {
            Opportunity oldOpp = oldMap.get(opp.Id);
            List<String> updatedFields = new List<String>();

            for (SObjectField field : Schema.SObjectType.Opportunity.fields.getMap().values()) {
                String fieldName = field.getDescribe().getName();
                if (opp.get(fieldName) != oldOpp.get(fieldName)) {
                    updatedFields.add(fieldName);
                }
            }

            if (!updatedFields.isEmpty()) {
                String updates = String.join(updatedFields, ', ') + ' updated by ' + currentUserName + ' on ' + currentDate;
                if (opp.Update_History__c != null) {
                    opp.Update_History__c += '\n' + updates;
                } else {
                    opp.Update_History__c = updates;
                }
            }
        }
    }
}
