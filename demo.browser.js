;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var toDoge = require('./'),
    crel = require('crel');

function getCaret(el) {
  if (el.selectionStart) {
    return el.selectionStart;
  } else if (document.selection) {
    el.focus();

    var r = document.selection.createRange();
    if (r == null) {
      return 0;
    }

    var re = el.createTextRange(),
        rc = re.duplicate();
    re.moveToBookmark(r.getBookmark());
    rc.setEndPoint('EndToStart', re);

    return rc.text.length;
  }
  return 0;
}

window.onload = function(){
    var input = crel('textarea'),
        output = crel('textarea');

    input.addEventListener('keydown', function(event){
        if(event.which === 9){
            event.preventDefault();
            var position = getCaret(input);
            input.value = input.value.slice(0, position) + '    ' + input.value.slice(position);
            input.setSelectionRange(position+4,position+4);
        }
    });

    function inputToOutput(){
        toDoge(input.value, function(error, doge){
            output.value = doge;
        });
    }

    input.addEventListener('keyup', inputToOutput);

    crel(document.body,
        input,
        output
    );

    //sample
    input.value = '// such doge\n function doge(thing)\n{\n    return thing;\n}';
    inputToOutput();
};
},{"./":3,"crel":2}],2:[function(require,module,exports){
//Copyright (C) 2012 Kory Nunn

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/*

    This code is not formatted for readability, but rather run-speed and to assist compilers.

    However, the code's intention should be transparent.

    *** IE SUPPORT ***

    If you require this library to work in IE7, add the following after declaring crel.

    var testDiv = document.createElement('div'),
        testLabel = document.createElement('label');

    testDiv.setAttribute('class', 'a');
    testDiv['className'] !== 'a' ? crel.attrMap['class'] = 'className':undefined;
    testDiv.setAttribute('name','a');
    testDiv['name'] !== 'a' ? crel.attrMap['name'] = function(element, value){
        element.id = value;
    }:undefined;


    testLabel.setAttribute('for', 'a');
    testLabel['htmlFor'] !== 'a' ? crel.attrMap['for'] = 'htmlFor':undefined;



*/

(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.crel = factory();
    }
}(this, function () {
    // based on http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
    var isNode = typeof Node === 'object'
        ? function (object) { return object instanceof Node; }
        : function (object) {
            return object
                && typeof object === 'object'
                && typeof object.nodeType === 'number'
                && typeof object.nodeName === 'string';
        };
    var isArray = function(a){ return a instanceof Array; };
    var appendChild = function(element, child) {
      if(!isNode(child)){
          child = document.createTextNode(child);
      }
      element.appendChild(child);
    };


    function crel(){
        var document = window.document,
            args = arguments, //Note: assigned to a variable to assist compilers. Saves about 40 bytes in closure compiler. Has negligable effect on performance.
            element = args[0],
            child,
            settings = args[1],
            childIndex = 2,
            argumentsLength = args.length,
            attributeMap = crel.attrMap;

        element = isNode(element) ? element : document.createElement(element);
        // shortcut
        if(argumentsLength === 1){
            return element;
        }

        if(typeof settings !== 'object' || isNode(settings) || isArray(settings)) {
            --childIndex;
            settings = null;
        }

        // shortcut if there is only one child that is a string
        if((argumentsLength - childIndex) === 1 && typeof args[childIndex] === 'string' && element.textContent !== undefined){
            element.textContent = args[childIndex];
        }else{
            for(; childIndex < argumentsLength; ++childIndex){
                child = args[childIndex];

                if(child == null){
                    continue;
                }

                if (isArray(child)) {
                  for (var i=0; i < child.length; ++i) {
                    appendChild(element, child[i]);
                  }
                } else {
                  appendChild(element, child);
                }
            }
        }

        for(var key in settings){
            if(!attributeMap[key]){
                element.setAttribute(key, settings[key]);
            }else{
                var attr = crel.attrMap[key];
                if(typeof attr === 'function'){
                    attr(element, settings[key]);
                }else{
                    element.setAttribute(attr, settings[key]);
                }
            }
        }

        return element;
    }

    // Used for mapping one kind of attribute to the supported version of that in bad browsers.
    // String referenced so that compilers maintain the property name.
    crel['attrMap'] = {};

    // String referenced so that compilers maintain the property name.
    crel["isNode"] = isNode;

    return crel;
}));

},{}],3:[function(require,module,exports){
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
},{}]},{},[1])
;
