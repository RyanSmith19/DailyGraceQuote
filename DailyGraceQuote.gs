function sendDailyQuoteEmail() {
  var url = 'https://gracequotes.org/';
  
  var response = UrlFetchApp.fetch(url);
  var content = response.getContentText();
  
  var quotePattern = /<div class="pcw-quote-wrap[^>]*>([\s\S]*?)<\/div>/i;
  var quoteMatches = content.match(quotePattern);
  
 if (quoteMatches && quoteMatches[1]) {
    var decoded = htmlDecode(quoteMatches[1].replace(/<[^>]+>/g, '').trim());
    
    var split = splitQuoteAndAuthor(decoded)
    var quote = split.quote;
    var author = split.author;

    // Logger.log("Quote:\n")
    // Logger.log(quote);
    // Logger.log("Author:\n")
    // Logger.log(author);


    var recipients = ['lifewithryans@gmail.com'];
    var subject = 'Grace Quote of the Day';
    var body = quote + "\n-" + author;
    for(var i=0; i<recipients.length; i++) {
      // Logger.log("Email sent")
      MailApp.sendEmail(recipients[i], subject, body);
    }
  } else {
    Logger.log('The quote of the day could not be found.');
  }
}

function htmlDecode(input) {
  var entityMap = {
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&nbsp;': ' ',
    '&#39;': "'",
    '&rsquo;': '’',
    '&#8217;': '’'
  };
  
  for (var entity in entityMap) {
    var character = entityMap[entity];
    var regex = new RegExp(entity, 'g');
    input = input.replace(regex, character);
  }
  return input;
}

function splitQuoteAndAuthor(text) {
  var pattern = /\n\s+/;
  
  var parts = text.split(pattern);
  if (parts.length === 2) {
    var quote = parts[0].trim();
    var author = parts[1].trim();
    return { quote: quote, author: author };
  } else {
    Logger.log('The text format is not as expected.');
    return null;
  }
}

function createTrigger() {
  ScriptApp.newTrigger('sendDailyQuoteEmail')
      .timeBased()
      .everyDays(1)
      .atHour(8) // Set the hour you prefer
      .create();
}
