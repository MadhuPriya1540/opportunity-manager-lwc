import { LightningElement, wire, track } from 'lwc';
import getAllOpportunities from '@salesforce/apex/OpportunityController.getAllOpportunities';
import getClosedWonOpportunities from '@salesforce/apex/OpportunityController.getClosedWonOpportunities';
import deleteOpportunity from '@salesforce/apex/OpportunityController.deleteOpportunity';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OpportunityManager extends LightningElement {
    @track allOpportunities;
    @track closedWonOpportunities;
    @track isModalOpen = false;
    @track isDeleteModalOpen = false;
    @track recordId;
    wiredOpportunitiesResult;
    wiredClosedWonResult;

    columns = [
        { label: 'Opportunity Name', fieldName: 'Name', editable: true },
        { label: 'Stage', fieldName: 'StageName', editable: true },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date', editable: true },
        { type: 'button-icon', typeAttributes: { iconName: 'utility:edit', name: 'edit', title: 'Edit' } },
        { type: 'button-icon', typeAttributes: { iconName: 'utility:delete', name: 'delete', title: 'Delete' } }
    ];

    @wire(getAllOpportunities)
    wiredOpportunities(result) {
        this.wiredOpportunitiesResult = result;
        if (result.data) {
            this.allOpportunities = result.data;
        } else if (result.error) {
            this.showToast('Error', 'Error loading opportunities', 'error');
        }
    }

    @wire(getClosedWonOpportunities)
    wiredClosedWon(result) {
        this.wiredClosedWonResult = result;
        if (result.data) {
            this.closedWonOpportunities = result.data;
        } else if (result.error) {
            this.showToast('Error', 'Error loading closed won opportunities', 'error');
        }
    }

    handleCreateNew() {
        this.isModalOpen = true;
        this.recordId = null;
    }

    handleSave(event) {
        // Handle inline edit save
        const fields = {};
        fields.Id = event.detail.draftValues[0].Id;
        fields[event.detail.draftValues[0].apiName] = event.detail.draftValues[0].value;

        // Call Apex method to update record
        // then refresh data tables
        refreshApex(this.wiredOpportunitiesResult);
        refreshApex(this.wiredClosedWonResult);
        this.showToast('Success', 'Opportunity updated successfully', 'success');
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'edit':
                this.recordId = row.Id;
                this.isModalOpen = true;
                break;
            case 'delete':
                this.recordId = row.Id;
                this.isDeleteModalOpen = true;
                break;
            default:
                break;
        }
    }

    handleCloseModal() {
        this.isModalOpen = false;
    }

    handleCloseDeleteModal() {
        this.isDeleteModalOpen = false;
    }

    handleConfirmDelete() {
        deleteOpportunity({ opportunityId: this.recordId })
            .then(() => {
                this.isDeleteModalOpen = false;
                refreshApex(this.wiredOpportunitiesResult);
                refreshApex(this.wiredClosedWonResult);
                this.showToast('Success', 'Opportunity deleted successfully', 'success');
            })
            .catch(error => {
                this.showToast('Error', 'Error deleting opportunity', 'error');
            });
    }

    handleSuccess(event) {
        this.showToast('Success', 'Opportunity created successfully', 'success');
        this.isModalOpen = false;
        refreshApex(this.wiredOpportunitiesResult);
        refreshApex(this.wiredClosedWonResult);
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}
