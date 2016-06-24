//declaring variables so globally accessible
//use navigator.userAgent to sense client-side userAgent header contents
//and encodeURIComponent method of JS to convert the huge string returned into URL-ready string
var uAgent = encodeURIComponent(navigator.userAgent);
//creates an Imm. Executable function to contain everything and make the event listener for click live
$(function() {
  //JQuery event listener for button click on button element in index
        $('button').on('click', function(){

                // clear content from the document.content div section in index file if it's not the first time it's been clicked
                $('.content').empty();

                // add spinner to indicate something is happening
                $('<i class="fa fa-refresh fa-spin"/>').appendTo('.content');

                // get selected value in selector drop down in index and take the text value from the drop down box
                // create new variable using the string stored in optionSelected to be plugged into API URL format
                var industry = $('select option:selected').text();
                console.log(industry);//this was for testing purposes

                //within the scope of button click still...
                //we trigger the .getJSON method of the JQuery library to submit a call to Glassdoor's API URL
                //The first argument submitted to the .getJSON method is the URL string, and we add in the variables industry, uip, and uAgent
                //this is because Glassdoor's API requires certain items and formatting within request URL submissions

                $.getJSON("https://api.glassdoor.com/api/api.htm?v=1&format=json&callback=?&t.p=70977&t.k=e5CNsNJMxw7&action=employers&q=" + industry + "&userip=" + uip + "&useragent=" + uAgent, function(data) {
                  //unfortunately, their API limits each JSON object returned to 10 objects/the first page of results on their site
                  //I attempted to iterate using both recursion and a standard for loop
                  //this did not work due the fact that the AJAX calls were not complete but the loops would continue and it would break the code when it would try to reference an unreturned JSON object
                  //I did try to use $.when and .done methods and the deferred methods available in the JQuery library, but for some reason, it would still break at about 6 API calls, and would only every load
                  //about 4 pages worth of results into the ul element list
                  //due to time for final deadline, I got an error free version that returns the first 10 results for several industries, and I will have to solve the AJAX call delay issue another day.
                      // do all this on successful call
                      // create an empty array to stuff the JSON items into
                        var items = [],
                        $ul;
                        //this is the JQuery equivalent of the for loop. It loops through each employer object in the array returned and pushes it to the items array to be added to the ul tag in index later
                        $.each(data.response.employers, function (employerArrayNumber, value) {
                               var employerName = value.name;
                               var ceoName = value.ceo.name;
                               var featuredPros = value.featuredReview.pros;
                               var featuredCons = value.featuredReview.cons;
                               //iterate through the returned data and build a list
                               items.push('<li id="' + employerArrayNumber + '"><span class="name"><strong> Company: </strong>' + employerName + '</span><br><span class="ceoName"><strong> CEO: </strong>' + ceoName + '</span><br><span class="pros"> From Featured Review: <br><strong>Pros: </strong>"' + featuredPros + '"</span><br><span class="cons"> <Strong>Cons: </strong>"' + featuredCons + '"</span><br><br></li>');
                           });
          // if no items were returned then add a message to that effect
         if (items.length < 1) {
             items.push('<li>No results, try again!</li>');
         }

         // remove spinner
         $('.fa-spin').remove();

         // append list to page
         $ul = $('<ul />').appendTo('.content');

         //append list items to list
         //this is what makes them appear on the page
         $ul.append(items);
     });
 });
});
