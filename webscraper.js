var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var express = require('express');
var urlparse = require('url-parse');
var regArr= [];
var obj ={};
obj.t_rows = [];


var url = "http://www.fallingrain.com/world/JM/";

request(url, function(error, response, body){
  if(error){
     console.error("Error with the url request");
  }

  var $ = cheerio.load(body);

  $('ul a').each(function(){
    var region = $(this).attr('href');
    console.log("region: ", region);
    regArr.push(region);
 });
    
    appendLink(regArr);
   
});


  function getTables(body){

      var $ = cheerio.load(body);

      var t_rows = [];
      var $header = $("th");
      console.log("header: ", $header.text());
      var h_content = $header.text();

      if(h_content){
        $("tbody tr").each(function(index){
          var cell = $(this).find("td");

          t_rows[index]={}; //undefined object

          cell.each(function(cellIndex){
            t_rows[index][$($header[cellIndex]).html()] = $(this).html();
          });
        });

      }else{
        console.log("going deeper");
        deeper(body);
      }
    return t_rows;
  }


  function deeper(body){
    console.log('digging deeper');
    var regArr = [];
    var $ = cheerio.load(body);
    $('a').each(function(){
        var address = $(this).attr('href');
        regArr.push(address);
   });

    console.log(regArr);
    appendLink(regArr);

  }



  function appendLink(regArr){
    regArr.forEach(function(index){
    var links = "http://www.fallingrain.com" + index ;

    request(links, function(error, response, body){
      if(error){
         console.error("Error with the other url request");
      }else{
        console.log("link: ", links);
        obj.t_rows.push(getTables(body));
      }
    })
      
   

      fs.exists('Data.json',function(exists){
        if(exists){
          fs.appendFile('Data.json', JSON.stringify(obj, null, 4), function(error){
            //console.log('File successfully appended! - Check your project directory for the Data.json file');

          })
        } else{
          fs.writeFile('Data.json', JSON.stringify(obj, null, 4), function(error){
            //console.log('File successfully written! - Check your project directory for the Data.json file'); 

          })
        }  

      })

   });

  }

 


    
   


 

