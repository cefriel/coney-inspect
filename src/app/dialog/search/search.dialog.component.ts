import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-search-dialog',
    templateUrl: './search.dialog.component.html'
})

export class SearchDialogComponent {

    conversations: any;
    projects: any;

    //search boxes
    titleValue = '';
    selectedStatus = "all";
    selectedProject = "all";

    filtersOpened = false;
    
    conversationsFound = true;

    initialConversations = [];
    noTitleConversations = [];

    constructor(public dialogRef: MatDialogRef<SearchDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {
        this.conversations = data.conversations;
        this.projects = data.projects;

        if (this.conversations.length == 0) { this.conversationsFound = false; } else { this.conversationsFound = true; }

        this.conversations.sort((a, b) => (a.conversationTitle > b.conversationTitle) ? 1 : -1);
        this.initialConversations = this.conversations;
    }

    conversationSelected(conversation) {
        this.dialogRef.close(conversation);
    }

    toggleFilters(){
        this.filtersOpened = !this.filtersOpened;
      }

    //ui update
    selectionChanged() {

        if (this.selectedProject !== undefined && this.selectedProject !== "" && this.selectedProject !== 'all') {
            this.noTitleConversations = this.initialConversations.filter(x => x.projectName.toLowerCase() == this.selectedProject.toLowerCase());
        } else {
            this.noTitleConversations = this.initialConversations;
        }

        if (this.selectedStatus !== undefined && this.selectedStatus !== "" && this.selectedStatus !== 'all') {
            this.noTitleConversations = this.noTitleConversations.filter(x => x.status.toLowerCase() == this.selectedStatus.toLowerCase());
        }

        this.conversations = this.noTitleConversations;
        this.titleSelectionChanged();

    }

    titleSelectionChanged() {

        if (this.titleValue !== "") {
            this.conversations = this.noTitleConversations.filter(x => x.conversationTitle.toLowerCase().includes(this.titleValue.toLowerCase()));
        } else {
            this.conversations = this.noTitleConversations;
        }

        this.conversationsFound = true;
        if (this.conversations.length == 0) {
            this.conversationsFound = false;
        }
    }



    discard() {
        this.dialogRef.close();
    }



}