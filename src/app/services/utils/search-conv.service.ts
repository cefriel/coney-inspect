import { BackendService } from '../backend.service';
import { Injectable, Output, Component, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

/**
 * This service takes care of the initial conversation-search request with an 
 * observable that contains the relevant conversations and projects
 */
@Injectable()
export class SearchConvService {

    data: any = {};
    public results$ = new BehaviorSubject<any>({});

    constructor(private backend: BackendService) { }

    public conversationGatheringComplete(success, err, conversations, projects): Observable<any> {

        //output data setup
        this.data.success = true;
        this.data.err = err;
        this.data.projects = projects;
        this.data.conversations = conversations;

        this.results$.next(this.data);
        return this.results$.asObservable();
    }

    getConversations() {

        let endpoint = '/create/searchConversation?status=published';
        let conversations = [];
        let projects = [];
        let success = false;
        this.backend.getRequest(endpoint).subscribe(json => {

            var tmpConv = JSON.parse(json);

            for (var z = 0; z < tmpConv.length; z++) {
                if (tmpConv[z].status != "saved") { //just another check, should be ok in the API
                    conversations.push(tmpConv[z]);
                }
            }

            if (conversations.length > 0) {
                success = true;
                projects = this.getProjects(conversations);
            } else {
                var err = "No conversations found";
            }
            
            this.conversationGatheringComplete(success, err, conversations, projects);

        }, err => {

            console.error(err);
            this.conversationGatheringComplete(success, err, conversations, projects);

        });
    }

    getProjects(conversations) {
        let searchProjects = ["all"];
        for (var i = 0; i < conversations.length; i++) {
            var pr = conversations[i].projectName;
            if (!searchProjects.includes(pr)) {
                searchProjects.push(pr);
            }
        }
        return searchProjects;
    }
}
