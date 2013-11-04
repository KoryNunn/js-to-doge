var stringTerminal = "'";

function randomSpaces(canNewline){
    var dogePauses = ' ';
    for(var i = 0; i < Math.random()*100; i++){
        var whitespace = ' ';
        if(canNewline !== false && 8 < Math.random()*12){
            whitespace = '\n'
        }
        dogePauses += whitespace;
    }
    return dogePauses;
}

function dogeify(words){
    var result = '';

    words = words.split(' ');

    for(var i = 0; i < words.length; i+=2) {
        result += words[i] + ' ' + (words[i+1] || '');
        result += randomSpaces();
    }

    return randomSpaces(false) + result.trim();
}

function isIdentifier(substring){
    var valid = /^[$A-Z_][0-9A-Z_$]*/i,
        possibleIdentifier = substring.match(valid);

    if (possibleIdentifier && possibleIdentifier.index === 0) {
        return possibleIdentifier[0];
    }
}

function createKeywordTokeniser(keyword, replacement){
    return function(substring){
        substring = isIdentifier(substring);
        if (substring === keyword) {
            return {
                doge: replacement,
                length: keyword.length
            };
        }
    };
}

function createGenericTokeniser(keyword, replacement){
    return function(substring){
        if(substring.indexOf(keyword) === 0){
            return {
                doge: replacement || keyword,
                length: keyword.length
            };
        }
    };
}

var syntax = [
    createGenericTokeniser('//', 'shh'),
    function(substring){
        var specials = {
            'NaN': Number.NaN,
            '-NaN': Number.NaN,
            'Infinity': Infinity,
            '-Infinity': -Infinity
        };
        for (var key in specials) {
            if (substring.slice(0, key.length) === key) {
                return new Token(this, key, key.length);
            }
        }

        var valids = '0123456789-.Eex',
            index = 0;

        while (valids.indexOf(substring.charAt(index)||null) >= 0 && ++index) {}

        if (index > 0) {
            var result = substring.slice(0, index);
            if(isNaN(parseFloat(result))){
                return;
            }
            return {
                doge: result,
                length: index
            };
        }

        return;
    },
    function(substring){
        if(substring.charAt(0) === '\n'){
            return {
                doge: randomSpaces(),
                length: 1
            };
        }
    },
    function(substring){
        var i = 0;
        while (i < substring.length && substring.charAt(i).trim() === '') {
            i++;
        }
        if(i){
            return {
                doge: substring.slice(0, i),
                length: i
            };
        }
    },
    function (substring) {
        if (substring.charAt(0) === stringTerminal) {
            var index = 0,
            escapes = 0;

            while (substring.charAt(++index) !== stringTerminal)
            {
               if(index >= substring.length){
                       throw "Unclosed " + this.name;
               }
               if(substring.charAt(index) === '\\' && substring.charAt(index+1) === stringTerminal) {
                       substring = substring.slice(0, index) + substring.slice(index + 1);
                       escapes++;
               }
            }

            return {
                doge: substring.slice(0, index+1),
                length: index + escapes + 1
            };
        }
    },
    createGenericTokeniser('console.log', 'console.loge'),
    createKeywordTokeniser('function', 'such'),
    createKeywordTokeniser('var', 'very'),
    createKeywordTokeniser('for', 'much'),
    createKeywordTokeniser('while', 'many'),
    createKeywordTokeniser('if', 'rly'),
    createGenericTokeniser(/;$/g, ' '),
    createGenericTokeniser(';', 'next'),
    createGenericTokeniser('===', 'is'),
    createGenericTokeniser('!==', 'not'),
    createGenericTokeniser('=', 'as'),
    createGenericTokeniser('||', 'or'),
    createGenericTokeniser('&&', 'and'),
    createGenericTokeniser('<', 'lesser'),
    createGenericTokeniser('>', 'greater'),
    createGenericTokeniser('.'),
    createGenericTokeniser(':'),
    createGenericTokeniser(', ', ' '),
    createGenericTokeniser(',', ' '),
    createGenericTokeniser('+=', 'more'),
    createGenericTokeniser('-=', 'less'),
    createGenericTokeniser('+'),
    createGenericTokeniser('(', ' much '),
    createGenericTokeniser(') ', ' '),
    createGenericTokeniser(')', ' '),
    createGenericTokeniser('{', ' '),
    createGenericTokeniser('}', 'wow'),
    createGenericTokeniser('['),
    createGenericTokeniser(']'),
    function(substring){
        substring = isIdentifier(substring);
        if (substring) {
            return {
                doge: substring,
                length: substring.length
            };
        }
    }
];

module.exports = function toDoge(js, callback){
    var doge = '',
        error;
    while(js.length){
        var passed = false;

        for(var i = 0; i < syntax.length; i++) {
            var result = syntax[i](js);
            if(result){
                passed = true;
                doge += result.doge;
                js = js.slice(result.length);
            }
        }
        if(!passed){
            error = dogeify('such error much confuse wow:') + ' ' + js.slice(0, 50);
            break;
        }
    }
    callback(error, !error && doge);
}