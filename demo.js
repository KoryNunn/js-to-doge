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