import { Injectable } from '@angular/core';


@Injectable()
export class IntroSectionService {


  constructor() { }


  parseDuration(rawDuration: [string]){
    var durationArray = [];
    var legendArray = [];
    var totalToComputeMean = 0;
    var mean= 0;
    var divider = "seconds";

    //always compute the seconds
    for(var i = 0; i<rawDuration.length; i++){
      var duration = 0;
      if(rawDuration[i] == "unfinished"){continue;}
      var numbers = rawDuration[i].split(":");
      duration = parseInt(numbers[2]) + parseInt(numbers[1])*60 + parseInt(numbers[0])*3600;
      durationArray.push(duration);
      totalToComputeMean+=duration;
    }
    if(durationArray.length == 0){
      return {
        durationChartData: [],
        durationChartLabels: [],
        measure: "none"
    }
    }

    mean = totalToComputeMean/(rawDuration.length);
    durationArray.sort(function(a, b){return a-b});
    var max = durationArray[durationArray.length-1];
    var sections = max/10;
    var totalPeopleArray = new Array(12).fill(0);

    for(var j = 0; j<durationArray.length; j++){
      for(var x = 0; x<=11; x++){
        if(durationArray[j] > (x*sections) && durationArray[j] <= ((x+1)*sections)){
          totalPeopleArray[x]++;
        }
      }
    }

    for(var x = 0; x<=11; x++){
      if(mean > 30 && mean < 1800){
        //display minute
        legendArray.push(""+((sections*x)/60).toFixed(2));
        divider = "minutes";
      } else if(mean > 1800){
        //hour
        legendArray.push(""+((sections*x)/3600).toFixed(2));
        divider = "hours";
      } else {
        //keep displaying the seconds
        legendArray.push(""+(sections*x).toFixed(2));
      }
    }

    return {
        durationChartData: totalPeopleArray,
        durationChartLabels: legendArray,
        measure: divider
    }
  }

  parseDates(rawDates: [string]){
      
    var datesChartData = [];
    var datesChartLabels = [];
    
    rawDates.sort();

    for(var i = 0; i<rawDates.length; i++) {
        if(!datesChartLabels.includes(rawDates[i])){
            datesChartLabels.push(rawDates[i]);
            datesChartData.push(1);
        } else {
            var index = datesChartLabels.indexOf(rawDates[i]);
            datesChartData[index]++;
        }
    }

    return {
        datesChartData: datesChartData,
        datesChartLabels: datesChartLabels
    }
  }

  parseTimes(rawTimes: [string]){
    var timesChartData = new Array(24).fill(0);
    var timesChartLabels = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", 
    "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
    

    for(var i = 0; i<rawTimes.length; i++) {
      
      var index = timesChartLabels.indexOf(rawTimes[i].split(":")[0]);
      timesChartData[index]++;
      
  }

    return {
      timesChartData: timesChartData,
      timesChartLabels: timesChartLabels
  }
  }
}