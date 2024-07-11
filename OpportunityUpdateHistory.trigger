trigger OpportunityUpdateHistory on Opportunity (before insert, before update) {

    if (Trigger.isBefore) {
        if (Trigger.isInsert) {
            OpportunityUpdateHistoryHandler.handleBeforeInsert(Trigger.new);
        }

        if (Trigger.isUpdate) {
            OpportunityUpdateHistoryHandler.handleBeforeUpdate(Trigger.oldMap, Trigger.new);
        }
    }
}