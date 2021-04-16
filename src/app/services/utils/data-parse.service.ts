import { Injectable } from '@angular/core';
import { GenericDataItem } from 'src/app/model/dataParseModel';


@Injectable()
export class DataParseService {


  //data for the generic info
  genericData : GenericDataItem;

  orderedQuestions = [];
  closedQuestionsData = [];
  tagsQuestionsData = [];
  checkboxQuestionsData = [];
  openQuestionsData = [];
  usersData = [];
  allQuestions = [];



  //data parsed for the charts
  constructor() { }

  initialDataParse(data: [any], questions:[any], filter) {
    this.orderedQuestions = questions;
    this.genericData = new GenericDataItem;

    this.closedQuestionsData = [];
    this.checkboxQuestionsData = [];
    this.openQuestionsData = [];
    this.tagsQuestionsData = [];
    this.usersData = [];
    this.allQuestions = [];

    //order data
    data.sort(function (a, b) { return a.order - b.order });


    for (let i = 0; i < data.length; i++) {
     let skip = false;

      //language filter
      if (filter != undefined && filter.languages != undefined) {
        let langIndex = filter.languages.findIndex(x => x.tag == data[i].language);
        if (langIndex != -1 && !filter.languages[langIndex].checked) {
          //continue;
          skip = true;
        }
      }

      //metadata
      if (filter != undefined && (filter.meta1 != undefined || filter.meta2 != undefined)) {
        let meta1Index = filter.meta1.findIndex(x => (x.meta == data[i].meta1 || x.meta == data[i].meta2));
        let meta2Index = filter.meta2.findIndex(x => (x.meta == data[i].meta2 || x.meta == data[i].meta2));

        if ((meta1Index != -1 && !filter.meta1[meta1Index].checked) 
         || (meta2Index != -1 && !filter.meta2[meta2Index].checked)) {
          //continue;
          skip = true;
        }
      }
      

      //unfinished filter
      if (filter != undefined && !filter.unfinished) {
        if(data[i].totalDuration == "unfinished"){
          skip = true;
          //continue;
        }
      }

      //no preview
      if(data[i].user == "preview"){
        //continue;
        skip = true;
      }

      if (data[i].session != "" && !skip) {
        this.manageGenericData(data[i]);
        this.manageUsersData(data[i]);
      }

      if (data[i].tag != "") {

        //check the scale 
        let valuesIndex = data.findIndex(x => x.value != data[i].value && x.questionId == data[i].questionId);
        if(valuesIndex != -1 || data[i].value != 0){
          this.manageTagsQuestionData(data[i], skip);
        }
        
      }

      if (data[i].questionType != "date" && data[i].questionType != "text" && data[i].questionType != "checkbox"
        && data[i].questionType != "url" && data[i].questionType != "email"
        && data[i].questionType != "time" && data[i].questionType != "number") {
        this.manageClosedQuestionData(data[i], skip);
      }

      if (data[i].questionType == "date" || data[i].questionType == "text"
        || data[i].questionType == "url" || data[i].questionType == "email"
        || data[i].questionType == "time" || data[i].questionType == "number") {
        this.manageOpenQuestionData(data[i], skip);
      }

      if (data[i].questionType == "checkbox") {
        this.manageCheckboxQuestionData(data[i], skip);
      }

    }
    this.allQuestions = [].concat(this.closedQuestionsData, this.checkboxQuestionsData, this.openQuestionsData);
    this.allQuestions.sort(function (a, b) { return a.depth - b.depth });

    return {
      generic: this.genericData,
      closed: this.closedQuestionsData,
      tags: this.tagsQuestionsData,
      checkbox: this.checkboxQuestionsData,
      open: this.openQuestionsData,
      users: this.usersData,
      all: this.allQuestions
    }
  }

  //parse intro section
  manageGenericData(data: any) {
    
    let indexLanguage = this.genericData.languages.findIndex(obj => (obj.tag == data.language));
    if (indexLanguage == -1) {
      let langTmp: any = this.getLanguageFromTag(data.language);
      langTmp.number = 1;
      langTmp.checked = true;
      this.genericData.languages.push(langTmp);
    }


    let indexSession = this.genericData.userSessionPairs.findIndex(obj => (obj.session == data.session));

    if (indexSession == -1) {
      //session not yet added

      if (indexLanguage != -1) {
        this.genericData.languages[indexLanguage].number += 1;
      }

      let indexUser = this.genericData.userSessionPairs.findIndex(obj => (obj.user == data.user));
      if (indexUser == -1) {
        this.genericData.totUsers++;
      }

      let completed = (data.totalDuration != "unfinished");
      if (!completed) { this.genericData.totUnfinished++; }

      this.genericData.totSessions++;

      this.genericData.userSessionPairs.push({
        user: data.user,
        session: data.session,
        completed: completed
      });

      this.genericData.times.push(data.time);
      this.genericData.durations.push(data.totalDuration);

      let splitData = data.date.split("-");

      this.genericData.dates.push(splitData[2] + "-" + splitData[1] + "-" + splitData[0]);
    }
  }

  //parse multiple choice questions
  manageClosedQuestionData(data: any, skip: boolean) {
    //Question part
    let indexQuestion = this.closedQuestionsData.findIndex(obj => (obj.id == data.questionId));
    let indexOrder = this.orderedQuestions.findIndex(x => x.neo4jId == data.questionId);
    
    let depth = 999;
    if(indexOrder!=-1){
      depth = this.orderedQuestions[indexOrder].depth;
    }
    
    if (indexQuestion == -1) {
      let singleClosedQuestion = {
        id: data.questionId,
        type: data.questionType,
        text: data.question,
        tag: data.tag,
        depth: depth,
        answers: []
      }
      this.closedQuestionsData.push(singleClosedQuestion);
      indexQuestion = this.closedQuestionsData.length - 1;
    }

    //ANSWER part
    let answered = 0;
    if (data.session != "" && !skip) { answered++; }

    let indexAnswer = this.closedQuestionsData[indexQuestion].answers.findIndex(obj => (obj.order == data.order));
    let textToDisplay = data.option;
    if (data.text == "") { textToDisplay = data.value; }

    if (indexAnswer == -1) {
      let singleAnswer = {
        text: textToDisplay,
        order: data.order,
        value: parseInt(data.value),
        totalAnswers: answered
      }
      this.closedQuestionsData[indexQuestion].answers.push(singleAnswer);
      indexAnswer = this.closedQuestionsData[indexQuestion].answers.length - 1;
    } else {
      this.closedQuestionsData[indexQuestion].answers[indexAnswer].totalAnswers += answered;
    }
  }

  //parse multiple choice questions
  manageTagsQuestionData(data: any, skip:boolean) {

    //Tags part
    let tagIndex = this.tagsQuestionsData.findIndex(x => x.tag == data.tag);
    if (tagIndex == -1) {
      let tag = {
        tag: data.tag,
        questions: [{
          question: data.question,
          questionId: data.questionId,
          max: 0,
          min: 999
        }],
        answers: []
      }
      this.tagsQuestionsData.push(tag);
      tagIndex = this.tagsQuestionsData.length - 1;
    }

    let questionIndex = this.tagsQuestionsData[tagIndex].questions.findIndex(x => x.questionId == data.questionId);

    if(questionIndex == -1){
      let question = {
        question: data.question,
        questionId: data.questionId,
        max: 0,
        min: 999
      }
      this.tagsQuestionsData[tagIndex].questions.push(question);
      questionIndex = this.tagsQuestionsData[tagIndex].questions.length - 1;
    }

    if (parseInt(data.value) < this.tagsQuestionsData[tagIndex].questions[questionIndex].min) {
      this.tagsQuestionsData[tagIndex].questions[questionIndex].min = parseInt(data.value)
    }
    if (parseInt(data.value) > this.tagsQuestionsData[tagIndex].questions[questionIndex].max) {
      this.tagsQuestionsData[tagIndex].questions[questionIndex].max = parseInt(data.value)
    }


    //ANSWER part
    let answered = 0;
    if (data.session != "" && !skip) { answered++; }

    let indexAnswer = this.tagsQuestionsData[tagIndex].answers.findIndex(obj => (obj.value == data.value));


    if (indexAnswer == -1) {
      let singleAnswer = {
        value: parseInt(data.value),
        totalAnswers: answered
      }
      this.tagsQuestionsData[tagIndex].answers.push(singleAnswer);
      indexAnswer = this.tagsQuestionsData[tagIndex].answers.length - 1;
    } else {
      this.tagsQuestionsData[tagIndex].answers[indexAnswer].totalAnswers += answered;
    }
  }

  //parse checkboxes questions
  manageCheckboxQuestionData(data: any, skip: boolean) {

    //Question part
    let indexQuestion = this.checkboxQuestionsData.findIndex(obj => (obj.id == data.questionId));
    let indexOrder = this.orderedQuestions.findIndex(x => x.neo4jId == data.questionId);
    let depth = this.orderedQuestions[indexOrder].depth;
    if (indexQuestion == -1) {
      let singleCheckboxQuestion = {
        id: data.questionId,
        type: data.questionType,
        text: data.question,
        tag: data.tag,
        sessions: [data.session],
        depth: depth,
        answers: [],
        freeAnswerLabel: "",
        freeAnswers: []
      }
      this.checkboxQuestionsData.push(singleCheckboxQuestion);
      indexQuestion = this.checkboxQuestionsData.length - 1;
    } else {
      //add user if the answer wasn't previoutly recorded
      let indexUser = this.checkboxQuestionsData[indexQuestion].sessions.findIndex(obj => (obj == data.session));
      if (indexUser == -1) {
        this.checkboxQuestionsData[indexQuestion].sessions.push(data.session);
      }
    }

    //ANSWER part
    let answered = 0;
    if (data.session != "" && !skip) { answered++; }
    let indexAnswer = this.checkboxQuestionsData[indexQuestion].answers.findIndex(obj => (obj.text == data.option));


    if (indexAnswer == -1) {
      let singleAnswer = {
        text: data.option,
        value: data.value,
        totalAnswers: answered
      }
      this.checkboxQuestionsData[indexQuestion].answers.push(singleAnswer);
      indexAnswer = this.checkboxQuestionsData[indexQuestion].answers.length - 1;
    } else {
      this.checkboxQuestionsData[indexQuestion].answers[indexAnswer].totalAnswers += answered;
    }

    //add open answer if any
    if (data.freeAnswer != undefined && data.freeAnswer != "") {
      this.checkboxQuestionsData[indexQuestion].freeAnswerLabel = data.option;
      this.checkboxQuestionsData[indexQuestion].freeAnswers.push(data.freeAnswer);
    }

  }

  manageOpenQuestionData(data: any, skip: boolean) {
    if (data.user == "") {
      return;
    }

    //Question part
    let indexQuestion = this.openQuestionsData.findIndex(obj => (obj.id == data.questionId));
    let indexOrder = this.orderedQuestions.findIndex(x => x.neo4jId == data.questionId);
    let depth = 999;
    if(indexOrder!=-1){
      depth = this.orderedQuestions[indexOrder].depth;
    }
    
    
    if (indexQuestion == -1) {
      let singleOpenQuestion = {
        id: data.questionId,
        type: data.questionType,
        text: data.question,
        tag: data.tag,
        depth: depth,
        answers: []
      }
      this.openQuestionsData.push(singleOpenQuestion);
      indexQuestion = this.openQuestionsData.length - 1;
    }

    if(skip){return;}

    //ANSWER part
    let openAnswer = {
      text: data.freeAnswer,
      language: this.getLanguageFromTag(data.language).lang
    }
    
    this.openQuestionsData[indexQuestion].answers.push(openAnswer);
  }

  //for the users view
  manageUsersData(data) {
    let indexUser = this.usersData.findIndex(obj => (obj.session == data.session));
    if (indexUser == -1) {
      let singleUser = {
        user: data.user,
        session: data.session,
        meta1: data.meta1,
        meta2: data.meta2,
        date: data.date,
        duration: data.totalDuration,
        language: this.getLanguageFromTag(data.language).lang,
        answers: []
      }
      this.usersData.push(singleUser);
      indexUser = this.usersData.length - 1;
    }

    //check the answer
    let textToDisplay = data.freeAnswer;
    if (textToDisplay == "") {
      textToDisplay = data.option;
    }
    if (textToDisplay == "") {
      textToDisplay = data.value;
    }

    let indexAnswer = this.usersData[indexUser].answers.findIndex(obj => (obj.questionId == data.questionId));
    if (data.questionType == 'checkbox' && indexAnswer != -1) {
      this.usersData[indexUser].answers[indexAnswer].text += ",," + textToDisplay;
    } else {
      let userAnswer = {
        questionId: data.questionId,
        question: data.question,
        text: textToDisplay,
        type: data.questionType,
        tag: data.tag,
        points: data.points,
        value: data.value,
        time: data.time
      }
      this.usersData[indexUser].answers.push(userAnswer);
    }
  }

  //TODO manage overview data 

  getLanguageFromTag(tag: string) {
    let languages = [{ lang: "Afrikaans", tag: "af" }, { lang: "Albanian ", tag: "sp" }, { lang: "Arabic", tag: "ar" }, { lang: "Basque", tag: "eu" },
    { lang: "Byelorussian ", tag: "be" }, { lang: "български език", tag: "bg" }, { lang: "Català", tag: "va" }, { lang: "Hrvatski", tag: "hr" }, { lang: "Čeština", tag: "cs" },
    { lang: "Dansk", tag: "da" }, { lang: "Dutch", tag: "nl" }, { lang: "English", tag: "en" }, { lang: "Esperanto", tag: "eo" }, { lang: "Eesti", tag: "et" },
    { lang: "Suomi", tag: "fi" }, { lang: "Faronese", tag: "fo" }, { lang: "Français", tag: "fr" },
    { lang: "Galego", tag: "gl" }, { lang: "Deutsch", tag: "de" }, { lang: "Ελληνικά", tag: "el" }, { lang: "עברית", tag: "he" }, { lang: "Magyar", tag: "hu" },
    { lang: "Icelandic", tag: "is" }, { lang: "Italiano", tag: "it" }, { lang: "Irish", tag: "ga" }, { lang: "Japanese", tag: "ja" }, { lang: "Korean", tag: "ko" },
    { lang: "Latviešu", tag: "lv" }, { lang: "Mакедонски", tag: "mk" }, { lang: "Malti", tag: "mt" }, { lang: "Norsk", tag: "nb" },
    { lang: "Polski", tag: "pl" }, { lang: "Português", tag: "pt" }, { lang: "Română", tag: "ro" },
    { lang: "Русский", tag: "ru" }, { lang: "Scottish", tag: "gd" }, { lang: "Slovenčina", tag: "sk" }, { lang: "Slovenščina", tag: "sl" },
    { lang: "Српски", tag: "sr" }, { lang: "Español", tag: "es" }, { lang: "Svenska", tag: "sv" }, { lang: "Türkçe", tag: "tr" }, { lang: "Українська", tag: "uk" }];

    let index = languages.findIndex(x => x.tag == tag);
    return languages[index];
  }
}