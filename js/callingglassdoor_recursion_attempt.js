//declaring variables so globally accessible
//use navigator.userAgent to sense client-side userAgent header contents
//and encodeURIComponent method of JS to convert the huge string returned into URL-ready string
var uAgent = encodeURIComponent(navigator.userAgent);
var pageCounter = 0;
//JQuery event listener for button click on button element in index
$(function() {
        $('button').on('click', function(){

                // clear content from the document.content div section in index file
                $('.content').empty();

                // add spinner to indicate something is happening
                $('<i class="fa fa-refresh fa-spin"/>').appendTo('.content');

                // get selected value in selector drop down in index and take the text value from the drop down box
                // create new variable using the string stored in optionSelected to be plugged into API URL format
                var industry = $('select option:selected').text();
                console.log(industry);

                //within the scope of button click still...
                //we trigger the .getJSON method of the JQuery library to submit a call to Glassdoor's API URL
                //The first argument submitted to the .getJSON method is the URL string, and we add in the variables industry, uip, and uAgent
                //this is because Glassdoor's API requires certain items and formatting within request URL submissions
                function fetchPageNumber () {
                  return $.getJSON("http://api.glassdoor.com/api/api.htm?v=1&format=json&callback=?&t.p=70977&t.k=e5CNsNJMxw7&action=employers&q=" + industry + "&userip=" + uip + "&useragent=" + uAgent, function(data) {
                  var x = data;
                  console.log(x);
                  });
                };
                $.when(fetchPageNumber())
                  .done(function(data) {
                      // do all this on success
                        var items = [],
                        $ul;
                        pageCounter = data.response.totalNumberOfPages;
                        console.log(pageCounter);
                        console.log("this line is being printed");

                        function buildFullList () {
                              console.log("inside buildFullList");
                              console.log(pageCounter);
                              var i = 1;
                              runThePageCall();
                              function runThePageCall (i) {
                                  if (i == undefined) {
                                    i = 1;
                                  };
                                  console.log("I'm inside runThePageCall with i value: " + i)
                                  return $.getJSON("http://api.glassdoor.com/api/api.htm?v=1&format=json&callback=?&t.p=70977&t.k=e5CNsNJMxw7&action=employers&pn=" + i + "&q=" + industry + "&userip=" + uip + "&useragent=" + uAgent, function (data) {
                                    console.log(data);
                                    buildList();
                                  });

                                };
                              function buildList () {
                                $.when(runThePageCall(i))
                                .done(function(data) {
                                     $.each(data.response.employers, function (employerArrayNumber, value) {
                                         var employerName = value.name;
                                         var ceoName = value.ceo.name;
                                         var featuredPros = value.featuredReview.pros;
                                         var featuredCons = value.featuredReview.cons;
                                         //iterate through the returned data and build a list
                                         items.push('<li id="' + employerArrayNumber + 'iequals' + i + '"><span class="name"><strong> Company: </strong>' + employerName + '</span><br><span class="ceoName"><strong> CEO: </strong>' + ceoName + '</span><br><span class="pros"> From Featured Review: <br><strong>Pros: </strong>"' + featuredPros + '"</span><br><span class="cons"> <Strong>Cons: </strong>"' + featuredCons + '"</span><br><br></li>');
                                         console.log("x");
                                         console.log("items length is " + items.length);
                                     });
                                     console.log("completed page " + i);
                                     console.log("right after completing that page, the array length for items is " + items.length);
                                     if (i <= pageCounter) {
                                          console.log("we should now run the next api call");
                                          console.log(items);
                                          i += 1;
                                          console.log("we should now runThePageCall using i value: " + i);
                                          return (runThePageCall(i));
                                        } else {
                                           console.log("when is this printing");
                                           if (items.length < 1) {
                                               items.push('<li>No results, try again!</li>');
                                           };

                                           // remove spinner
                                           $('.fa-spin').remove();

                                           // append list to page
                                           $ul = $('<ul />').appendTo('.content');

                                           //append list items to list
                                           $ul.append(items);
                                        };
                                 });
                               };

                          };

                                       // if no items were returned then add a message to that effect

                      });
                });
        });
});
