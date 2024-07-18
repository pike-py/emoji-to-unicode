const express = require('express');
const { getConfig } = require('./configLoader');
const bodyParser = require('body-parser');
const emojiRegex = require('emoji-regex');
const app = express();
const regex = emojiRegex();
const uni1="\\U000"
const uni2="\\u"



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


// Function to convert emoji to Unicode
const emojiToUnicode = (text) => {

    const config = getConfig();
    const pattern=config.regexPatterns.customEmojiPattern;

    for (const match of text.matchAll(regex)) {
      const emoji = match[0];
      let code = getUnicode([...emoji].map(e => e.codePointAt(0).toString(16)).join(`-`))

      text= text.replace(emoji,code);
    }

    for (const match of text.matchAll(pattern)) {

      const emoji = match[0];
      let code =getUnicode([...emoji].map(e => e.codePointAt(0).toString(16)).join(`-`))

      text= text.replace(emoji,code);
    }

    return text;

}

function getUnicode(input){
  const array=input.split("-")
  let code="";
  for(const element of array){
      code=code.concat(getPrefix(element))
  }
  return code;
}

function getPrefix(input){
    if(input.length>4)
      return uni1.concat(input)
    else return uni2.concat(input.padStart(4,"0"))
  }


const getPort = () => {
    const config = getConfig();
    return config.port || 3000;
};


app.post('/convert', (req, res) => {
    const { text } = req.body;
    const convertedText = emojiToUnicode(text);
    res.json({ convertedText });
});

app.listen(getPort(), () => {
    console.log(`Server is running on port ${getPort()}`);
});
