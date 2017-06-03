function runSQL() {
  var sqlCMD = document.getElementById("sqlCMD").value;

  try {
    SQLParser.parse(sqlCMD);
    // TODO  submit a request

    var body = {
      "command":sqlCMD
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/analytics", true);
    xhr.send(JSON.stringify(body));
    xhr.onreadystatechange = processRequest;

    function processRequest(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        document.getElementById("sqlCMD").style.color = "green";
        var response = JSON.parse(xhr.responseText);
        var prettyResp = JSON.stringify(response, null, 2);
        document.getElementById("queryMessage").innerHTML = "";
        document.getElementById("queryResultsHeader").innerHTML = "Query: <span style='font-weight:normal;'>" + sqlCMD + "</span>";
        document.getElementById("queryResults").innerHTML = prettyResp;
        // addExportButton();
      }
      else if (xhr.readyState == 4 && xhr.status == 400) {
        var response = JSON.parse(xhr.responseText);
        document.getElementById("queryMessage").innerHTML = response["error"];
        document.getElementById("sqlCMD").style.color = "red";
        document.getElementById("sqlCMD").value = sqlCMD;

        document.getElementById("queryResultsHeader").innerHTML = "";
        document.getElementById("queryResults").innerHTML = "";
        // document.getElementById("exportDiv").innerHTML = "";
      }
    }
  }
  catch (err) {
      document.getElementById("sqlCMD").style.color = "red";
      document.getElementById("sqlCMD").value = sqlCMD;

      document.getElementById("queryResultsHeader").innerHTML = "";
      document.getElementById("queryResults").innerHTML = "";
      // document.getElementById("exportDiv").innerHTML = "";
  }
}

// function addExportButton() {
//   var childCount = document.getElementById("exportDiv").children.length;
//   if (childCount == 1 || childCount == 0) {
//     var element = document.createElement("button");
//     element.setAttribute("id", "exportButton")
//     // element.setAttribute("type", "button");
//     // element.setAttribute("class", "btn btn-primary");
//     // element.setAttribute("onclick", "exportResults()");
//     // element.innerHTML = "Export Results to CSV"
//
//     var exportDiv = document.getElementById("exportDiv");
//     exportDiv.appendChild(element);
//   }
// }

function exportResults() {
  var data = document.getElementById("queryResults").innerHTML;
  if(data == '')
      return;

  var query = document.getElementById("queryResultsHeader").innerHTML;

  JSONToCSVConvertor(data, "[ReportName]", query, true);
}

// SOURCE: http://jsfiddle.net/hybrid13i/JXrwM/
function JSONToCSVConvertor(JSONData, ReportTitle, Query, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line

    CSV += ReportTitle + '\r\n' + Query + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "CheeseDiaryReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ----------------------------------------------------------------------------
// SOURCE: https://raw.githubusercontent.com/forward/sql-parser/master/browser/sql-parser.js
(function(root) {
  var SQLParser = function() {
    function require(path){ return require[path]; }
    require['./lexer'] = new function() {
  var exports = this;
  // Generated by CoffeeScript 1.8.0
(function() {
  var Lexer;

  Lexer = (function() {
    var BOOLEAN, DBLSTRING, LITERAL, MATH, MATH_MULTI, NUMBER, PARAMETER, SEPARATOR, SQL_BETWEENS, SQL_CONDITIONALS, SQL_FUNCTIONS, SQL_OPERATORS, SQL_SORT_ORDERS, STAR, STRING, SUB_SELECT_OP, SUB_SELECT_UNARY_OP, WHITESPACE;

    function Lexer(sql, opts) {
      var bytesConsumed, i;
      if (opts == null) {
        opts = {};
      }
      this.sql = sql;
      this.preserveWhitespace = opts.preserveWhitespace || false;
      this.tokens = [];
      this.currentLine = 1;
      i = 0;
      while (this.chunk = sql.slice(i)) {
        bytesConsumed = this.keywordToken() || this.starToken() || this.booleanToken() || this.functionToken() || this.windowExtension() || this.sortOrderToken() || this.seperatorToken() || this.operatorToken() || this.mathToken() || this.dotToken() || this.conditionalToken() || this.betweenToken() || this.subSelectOpToken() || this.subSelectUnaryOpToken() || this.numberToken() || this.stringToken() || this.parameterToken() || this.parensToken() || this.whitespaceToken() || this.literalToken();
        if (bytesConsumed < 1) {
          throw new Error("NOTHING CONSUMED: Stopped at - '" + (this.chunk.slice(0, 30)) + "'");
        }
        i += bytesConsumed;
      }
      this.token('EOF', '');
      this.postProcess();
    }

    Lexer.prototype.postProcess = function() {
      var i, next_token, token, _i, _len, _ref, _results;
      _ref = this.tokens;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        token = _ref[i];
        if (token[0] === 'STAR') {
          next_token = this.tokens[i + 1];
          if (!(next_token[0] === 'SEPARATOR' || next_token[0] === 'FROM')) {
            _results.push(token[0] = 'MATH_MULTI');
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Lexer.prototype.token = function(name, value) {
      return this.tokens.push([name, value, this.currentLine]);
    };

    Lexer.prototype.tokenizeFromRegex = function(name, regex, part, lengthPart, output) {
      var match, partMatch;
      if (part == null) {
        part = 0;
      }
      if (lengthPart == null) {
        lengthPart = part;
      }
      if (output == null) {
        output = true;
      }
      if (!(match = regex.exec(this.chunk))) {
        return 0;
      }
      partMatch = match[part];
      if (output) {
        this.token(name, partMatch);
      }
      return match[lengthPart].length;
    };

    Lexer.prototype.tokenizeFromWord = function(name, word) {
      var match, matcher;
      if (word == null) {
        word = name;
      }
      word = this.regexEscape(word);
      matcher = /^\w+$/.test(word) ? new RegExp("^(" + word + ")\\b", 'ig') : new RegExp("^(" + word + ")", 'ig');
      match = matcher.exec(this.chunk);
      if (!match) {
        return 0;
      }
      this.token(name, match[1]);
      return match[1].length;
    };

    Lexer.prototype.tokenizeFromList = function(name, list) {
      var entry, ret, _i, _len;
      ret = 0;
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        entry = list[_i];
        ret = this.tokenizeFromWord(name, entry);
        if (ret > 0) {
          break;
        }
      }
      return ret;
    };

    Lexer.prototype.keywordToken = function() {
      return this.tokenizeFromWord('SELECT') || this.tokenizeFromWord('DISTINCT') || this.tokenizeFromWord('FROM') || this.tokenizeFromWord('WHERE') || this.tokenizeFromWord('GROUP') || this.tokenizeFromWord('ORDER') || this.tokenizeFromWord('BY') || this.tokenizeFromWord('HAVING') || this.tokenizeFromWord('LIMIT') || this.tokenizeFromWord('JOIN') || this.tokenizeFromWord('LEFT') || this.tokenizeFromWord('RIGHT') || this.tokenizeFromWord('INNER') || this.tokenizeFromWord('OUTER') || this.tokenizeFromWord('ON') || this.tokenizeFromWord('AS') || this.tokenizeFromWord('UNION') || this.tokenizeFromWord('ALL') || this.tokenizeFromWord('LIMIT') || this.tokenizeFromWord('OFFSET') || this.tokenizeFromWord('FETCH') || this.tokenizeFromWord('ROW') || this.tokenizeFromWord('ROWS') || this.tokenizeFromWord('ONLY') || this.tokenizeFromWord('NEXT') || this.tokenizeFromWord('FIRST');
    };

    Lexer.prototype.dotToken = function() {
      return this.tokenizeFromWord('DOT', '.');
    };

    Lexer.prototype.operatorToken = function() {
      return this.tokenizeFromList('OPERATOR', SQL_OPERATORS);
    };

    Lexer.prototype.mathToken = function() {
      return this.tokenizeFromList('MATH', MATH) || this.tokenizeFromList('MATH_MULTI', MATH_MULTI);
    };

    Lexer.prototype.conditionalToken = function() {
      return this.tokenizeFromList('CONDITIONAL', SQL_CONDITIONALS);
    };

    Lexer.prototype.betweenToken = function() {
      return this.tokenizeFromList('BETWEEN', SQL_BETWEENS);
    };

    Lexer.prototype.subSelectOpToken = function() {
      return this.tokenizeFromList('SUB_SELECT_OP', SUB_SELECT_OP);
    };

    Lexer.prototype.subSelectUnaryOpToken = function() {
      return this.tokenizeFromList('SUB_SELECT_UNARY_OP', SUB_SELECT_UNARY_OP);
    };

    Lexer.prototype.functionToken = function() {
      return this.tokenizeFromList('FUNCTION', SQL_FUNCTIONS);
    };

    Lexer.prototype.sortOrderToken = function() {
      return this.tokenizeFromList('DIRECTION', SQL_SORT_ORDERS);
    };

    Lexer.prototype.booleanToken = function() {
      return this.tokenizeFromList('BOOLEAN', BOOLEAN);
    };

    Lexer.prototype.starToken = function() {
      return this.tokenizeFromRegex('STAR', STAR);
    };

    Lexer.prototype.seperatorToken = function() {
      return this.tokenizeFromRegex('SEPARATOR', SEPARATOR);
    };

    Lexer.prototype.literalToken = function() {
      return this.tokenizeFromRegex('LITERAL', LITERAL, 1, 0);
    };

    Lexer.prototype.numberToken = function() {
      return this.tokenizeFromRegex('NUMBER', NUMBER);
    };

    Lexer.prototype.parameterToken = function() {
      return this.tokenizeFromRegex('PARAMETER', PARAMETER);
    };

    Lexer.prototype.stringToken = function() {
      return this.tokenizeFromRegex('STRING', STRING, 1, 0) || this.tokenizeFromRegex('DBLSTRING', DBLSTRING, 1, 0);
    };

    Lexer.prototype.parensToken = function() {
      return this.tokenizeFromRegex('LEFT_PAREN', /^\(/) || this.tokenizeFromRegex('RIGHT_PAREN', /^\)/);
    };

    Lexer.prototype.windowExtension = function() {
      var match;
      match = /^\.(win):(length|time)/i.exec(this.chunk);
      if (!match) {
        return 0;
      }
      this.token('WINDOW', match[1]);
      this.token('WINDOW_FUNCTION', match[2]);
      return match[0].length;
    };

    Lexer.prototype.whitespaceToken = function() {
      var match, newlines, partMatch;
      if (!(match = WHITESPACE.exec(this.chunk))) {
        return 0;
      }
      partMatch = match[0];
      newlines = partMatch.replace(/[^\n]/, '').length;
      this.currentLine += newlines;
      if (this.preserveWhitespace) {
        this.token(name, partMatch);
      }
      return partMatch.length;
    };

    Lexer.prototype.regexEscape = function(str) {
      return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    SQL_FUNCTIONS = ['AVG', 'COUNT', 'MIN', 'MAX', 'SUM'];

    SQL_SORT_ORDERS = ['ASC', 'DESC'];

    SQL_OPERATORS = ['=', '!=', '>=', '>', '<=', '<>', '<', 'LIKE', 'IS NOT', 'IS'];

    SUB_SELECT_OP = ['IN', 'NOT IN', 'ANY', 'ALL', 'SOME'];

    SUB_SELECT_UNARY_OP = ['EXISTS'];

    SQL_CONDITIONALS = ['AND', 'OR'];

    SQL_BETWEENS = ['BETWEEN', 'NOT BETWEEN'];

    BOOLEAN = ['TRUE', 'FALSE', 'NULL'];

    MATH = ['+', '-'];

    MATH_MULTI = ['/', '*'];

    STAR = /^\*/;

    SEPARATOR = /^,/;

    WHITESPACE = /^[ \n\r]+/;

    LITERAL = /^`?([a-z_][a-z0-9_]{0,})`?/i;

    PARAMETER = /^\$[0-9]+/;

    NUMBER = /^[0-9]+(\.[0-9]+)?/;

    STRING = /^'([^\\']*(?:\\.[^\\']*)*)'/;

    DBLSTRING = /^"([^\\"]*(?:\\.[^\\"]*)*)"/;

    return Lexer;

  })();

  exports.tokenize = function(sql, opts) {
    return (new Lexer(sql, opts)).tokens;
  };

}).call(this);

};require['./compiled_parser'] = new function() {
  var exports = this;
  /* parser generated by jison 0.4.15 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,8],$V1=[5,26],$V2=[1,14],$V3=[1,13],$V4=[5,26,31,42],$V5=[1,17],$V6=[5,26,31,42,45,62],$V7=[1,27],$V8=[1,29],$V9=[1,39],$Va=[1,43],$Vb=[1,44],$Vc=[1,40],$Vd=[1,41],$Ve=[1,38],$Vf=[1,42],$Vg=[1,25],$Vh=[5,26,31],$Vi=[5,26,31,42,45],$Vj=[1,56],$Vk=[18,43],$Vl=[1,59],$Vm=[1,60],$Vn=[1,61],$Vo=[1,62],$Vp=[1,63],$Vq=[5,18,23,26,31,34,37,38,41,42,43,45,62,64,65,66,67,68,70],$Vr=[5,18,23,26,31,34,37,38,41,42,43,44,45,51,62,64,65,66,67,68,70,71],$Vs=[1,69],$Vt=[2,83],$Vu=[1,83],$Vv=[1,84],$Vw=[1,102],$Vx=[5,26,31,42,43,44],$Vy=[1,110],$Vz=[5,26,31,42,43,45,64],$VA=[5,26,31,41,42,45,62],$VB=[1,113],$VC=[1,114],$VD=[1,115],$VE=[5,26,31,34,35,37,38,41,42,45,62],$VF=[5,18,23,26,31,34,37,38,41,42,43,45,62,64,70],$VG=[5,26,31,34,37,38,41,42,45,62],$VH=[5,26,31,42,56,58];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"Root":3,"Query":4,"EOF":5,"SelectQuery":6,"Unions":7,"SelectWithLimitQuery":8,"BasicSelectQuery":9,"Select":10,"OrderClause":11,"GroupClause":12,"LimitClause":13,"SelectClause":14,"WhereClause":15,"SELECT":16,"Fields":17,"FROM":18,"Table":19,"DISTINCT":20,"Joins":21,"Literal":22,"AS":23,"LEFT_PAREN":24,"List":25,"RIGHT_PAREN":26,"WINDOW":27,"WINDOW_FUNCTION":28,"Number":29,"Union":30,"UNION":31,"ALL":32,"Join":33,"JOIN":34,"ON":35,"Expression":36,"LEFT":37,"RIGHT":38,"INNER":39,"OUTER":40,"WHERE":41,"LIMIT":42,"SEPARATOR":43,"OFFSET":44,"ORDER":45,"BY":46,"OrderArgs":47,"OffsetClause":48,"OrderArg":49,"Value":50,"DIRECTION":51,"OffsetRows":52,"FetchClause":53,"ROW":54,"ROWS":55,"FETCH":56,"FIRST":57,"ONLY":58,"NEXT":59,"GroupBasicClause":60,"HavingClause":61,"GROUP":62,"ArgumentList":63,"HAVING":64,"MATH":65,"MATH_MULTI":66,"OPERATOR":67,"BETWEEN":68,"BetweenExpression":69,"CONDITIONAL":70,"SUB_SELECT_OP":71,"SubSelectExpression":72,"SUB_SELECT_UNARY_OP":73,"String":74,"Function":75,"UserFunction":76,"Boolean":77,"Parameter":78,"NUMBER":79,"BOOLEAN":80,"PARAMETER":81,"STRING":82,"DBLSTRING":83,"LITERAL":84,"DOT":85,"FUNCTION":86,"AggregateArgumentList":87,"Field":88,"STAR":89,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",16:"SELECT",18:"FROM",20:"DISTINCT",23:"AS",24:"LEFT_PAREN",26:"RIGHT_PAREN",27:"WINDOW",28:"WINDOW_FUNCTION",31:"UNION",32:"ALL",34:"JOIN",35:"ON",37:"LEFT",38:"RIGHT",39:"INNER",40:"OUTER",41:"WHERE",42:"LIMIT",43:"SEPARATOR",44:"OFFSET",45:"ORDER",46:"BY",51:"DIRECTION",54:"ROW",55:"ROWS",56:"FETCH",57:"FIRST",58:"ONLY",59:"NEXT",62:"GROUP",64:"HAVING",65:"MATH",66:"MATH_MULTI",67:"OPERATOR",68:"BETWEEN",70:"CONDITIONAL",71:"SUB_SELECT_OP",73:"SUB_SELECT_UNARY_OP",79:"NUMBER",80:"BOOLEAN",81:"PARAMETER",82:"STRING",83:"DBLSTRING",84:"LITERAL",85:"DOT",86:"FUNCTION",89:"STAR"},
productions_: [0,[3,2],[4,1],[4,2],[6,1],[6,1],[9,1],[9,2],[9,2],[9,3],[8,2],[10,1],[10,2],[14,4],[14,5],[14,5],[14,6],[19,1],[19,2],[19,3],[19,3],[19,3],[19,4],[19,6],[7,1],[7,2],[30,2],[30,3],[21,1],[21,2],[33,4],[33,5],[33,5],[33,6],[33,6],[33,6],[33,6],[15,2],[13,2],[13,4],[13,4],[11,3],[11,4],[47,1],[47,3],[49,1],[49,2],[48,2],[48,3],[52,2],[52,2],[53,4],[53,4],[12,1],[12,2],[60,3],[61,2],[36,3],[36,3],[36,3],[36,3],[36,3],[36,3],[36,5],[36,3],[36,2],[36,1],[36,1],[69,3],[72,3],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[25,1],[29,1],[77,1],[78,1],[74,1],[74,1],[22,1],[22,3],[75,4],[76,3],[76,4],[87,1],[87,2],[63,1],[63,3],[17,1],[17,3],[88,1],[88,1],[88,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
return this.$ = $$[$0-1];
break;
case 2: case 4: case 5: case 6: case 11: case 53: case 66: case 67: case 70: case 71: case 72: case 73: case 74: case 75: case 76:
this.$ = $$[$0];
break;
case 3:
this.$ = (function () {
        $$[$0-1].unions = $$[$0];
        return $$[$0-1];
      }());
break;
case 7:
this.$ = (function () {
        $$[$0-1].order = $$[$0];
        return $$[$0-1];
      }());
break;
case 8:
this.$ = (function () {
        $$[$0-1].group = $$[$0];
        return $$[$0-1];
      }());
break;
case 9:
this.$ = (function () {
        $$[$0-2].group = $$[$0-1];
        $$[$0-2].order = $$[$0];
        return $$[$0-2];
      }());
break;
case 10:
this.$ = (function () {
        $$[$0-1].limit = $$[$0];
        return $$[$0-1];
      }());
break;
case 12:
this.$ = (function () {
        $$[$0-1].where = $$[$0];
        return $$[$0-1];
      }());
break;
case 13:
this.$ = new yy.Select($$[$0-2], $$[$0], false);
break;
case 14:
this.$ = new yy.Select($$[$0-2], $$[$0], true);
break;
case 15:
this.$ = new yy.Select($$[$0-3], $$[$0-1], false, $$[$0]);
break;
case 16:
this.$ = new yy.Select($$[$0-3], $$[$0-1], true, $$[$0]);
break;
case 17:
this.$ = new yy.Table($$[$0]);
break;
case 18:
this.$ = new yy.Table($$[$0-1], $$[$0]);
break;
case 19:
this.$ = new yy.Table($$[$0-2], $$[$0]);
break;
case 20: case 49: case 50: case 51: case 52: case 57:
this.$ = $$[$0-1];
break;
case 21: case 69:
this.$ = new yy.SubSelect($$[$0-1]);
break;
case 22:
this.$ = new yy.SubSelect($$[$0-2], $$[$0]);
break;
case 23:
this.$ = new yy.Table($$[$0-5], null, $$[$0-4], $$[$0-3], $$[$0-1]);
break;
case 24: case 28: case 43: case 90: case 92:
this.$ = [$$[$0]];
break;
case 25:
this.$ = $$[$0-1].concat($$[$01]);
break;
case 26:
this.$ = new yy.Union($$[$0]);
break;
case 27:
this.$ = new yy.Union($$[$0], true);
break;
case 29:
this.$ = $$[$0-1].concat($$[$0]);
break;
case 30:
this.$ = new yy.Join($$[$0-2], $$[$0]);
break;
case 31:
this.$ = new yy.Join($$[$0-2], $$[$0], 'LEFT');
break;
case 32:
this.$ = new yy.Join($$[$0-2], $$[$0], 'RIGHT');
break;
case 33:
this.$ = new yy.Join($$[$0-2], $$[$0], 'LEFT', 'INNER');
break;
case 34:
this.$ = new yy.Join($$[$0-2], $$[$0], 'RIGHT', 'INNER');
break;
case 35:
this.$ = new yy.Join($$[$0-2], $$[$0], 'LEFT', 'OUTER');
break;
case 36:
this.$ = new yy.Join($$[$0-2], $$[$0], 'RIGHT', 'OUTER');
break;
case 37:
this.$ = new yy.Where($$[$0]);
break;
case 38:
this.$ = new yy.Limit($$[$0]);
break;
case 39:
this.$ = new yy.Limit($$[$0], $$[$0-2]);
break;
case 40:
this.$ = new yy.Limit($$[$0-2], $$[$0]);
break;
case 41:
this.$ = new yy.Order($$[$0]);
break;
case 42:
this.$ = new yy.Order($$[$0-1], $$[$0]);
break;
case 44: case 91: case 93:
this.$ = $$[$0-2].concat($$[$0]);
break;
case 45:
this.$ = new yy.OrderArgument($$[$0], 'ASC');
break;
case 46:
this.$ = new yy.OrderArgument($$[$0-1], $$[$0]);
break;
case 47:
this.$ = new yy.Offset($$[$0]);
break;
case 48:
this.$ = new yy.Offset($$[$0-1], $$[$0]);
break;
case 54:
this.$ = (function () {
        $$[$0-1].having = $$[$0];
        return $$[$0-1];
      }());
break;
case 55:
this.$ = new yy.Group($$[$0]);
break;
case 56:
this.$ = new yy.Having($$[$0]);
break;
case 58: case 59: case 60: case 61: case 62: case 64:
this.$ = new yy.Op($$[$0-1], $$[$0-2], $$[$0]);
break;
case 63:
this.$ = new yy.Op($$[$0-3], $$[$0-4], $$[$0-1]);
break;
case 65:
this.$ = new yy.UnaryOp($$[$0-1], $$[$0]);
break;
case 68:
this.$ = new yy.BetweenOp([$$[$0-2], $$[$0]]);
break;
case 77:
this.$ = new yy.ListValue($$[$0]);
break;
case 78:
this.$ = new yy.NumberValue($$[$0]);
break;
case 79:
this.$ = new yy.BooleanValue($$[$0]);
break;
case 80:
this.$ = new yy.ParameterValue($$[$0]);
break;
case 81:
this.$ = new yy.StringValue($$[$0], "'");
break;
case 82:
this.$ = new yy.StringValue($$[$0], '"');
break;
case 83:
this.$ = new yy.LiteralValue($$[$0]);
break;
case 84:
this.$ = new yy.LiteralValue($$[$0-2], $$[$0]);
break;
case 85:
this.$ = new yy.FunctionValue($$[$0-3], $$[$0-1]);
break;
case 86:
this.$ = new yy.FunctionValue($$[$0-2], null, true);
break;
case 87:
this.$ = new yy.FunctionValue($$[$0-3], $$[$0-1], true);
break;
case 88:
this.$ = new yy.ArgumentListValue($$[$0]);
break;
case 89:
this.$ = new yy.ArgumentListValue($$[$0], true);
break;
case 94:
this.$ = new yy.Star();
break;
case 95:
this.$ = new yy.Field($$[$0]);
break;
case 96:
this.$ = new yy.Field($$[$0-2], $$[$0]);
break;
}
},
table: [{3:1,4:2,6:3,8:4,9:5,10:6,14:7,16:$V0},{1:[3]},{5:[1,9]},o($V1,[2,2],{7:10,13:11,30:12,31:$V2,42:$V3}),o($V4,[2,4]),o($V4,[2,5]),o($V4,[2,6],{11:15,12:16,60:18,45:$V5,62:[1,19]}),o($V6,[2,11],{15:20,41:[1,21]}),{17:22,20:[1,23],22:31,24:$V7,29:32,36:26,50:28,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf,88:24,89:$Vg},{1:[2,1]},o($V1,[2,3],{30:45,31:$V2}),o($V4,[2,10]),o($Vh,[2,24]),{29:46,79:$V9},{6:47,8:4,9:5,10:6,14:7,16:$V0,32:[1,48]},o($V4,[2,7]),o($V4,[2,8],{11:49,45:$V5}),{46:[1,50]},o($Vi,[2,53],{61:51,64:[1,52]}),{46:[1,53]},o($V6,[2,12]),{22:31,24:$V7,29:32,36:54,50:28,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},{18:[1,55],43:$Vj},{17:57,22:31,24:$V7,29:32,36:26,50:28,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf,88:24,89:$Vg},o($Vk,[2,92]),o($Vk,[2,94]),o($Vk,[2,95],{23:[1,58],65:$Vl,66:$Vm,67:$Vn,68:$Vo,70:$Vp}),{4:65,6:3,8:4,9:5,10:6,14:7,16:$V0,22:31,24:$V7,29:32,36:64,50:28,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},o($Vq,[2,67],{71:[1,66]}),{24:[1,68],72:67},o($Vq,[2,66]),o($Vr,[2,70],{85:$Vs}),o($Vr,[2,71]),o($Vr,[2,72]),o($Vr,[2,73]),o($Vr,[2,74]),o($Vr,[2,75]),o($Vr,[2,76]),o([5,18,23,26,31,34,37,38,41,42,43,44,45,51,62,64,65,66,67,68,70,71,85],$Vt,{24:[1,70]}),o([5,18,23,26,31,34,37,38,41,42,43,44,45,51,54,55,62,64,65,66,67,68,70,71],[2,78]),o($Vr,[2,81]),o($Vr,[2,82]),{24:[1,71]},o($Vr,[2,79]),o($Vr,[2,80]),o($Vh,[2,25]),o($V4,[2,38],{43:[1,72],44:[1,73]}),o($Vh,[2,26],{13:11,42:$V3}),{6:74,8:4,9:5,10:6,14:7,16:$V0},o($V4,[2,9]),{22:31,29:32,47:75,49:76,50:77,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},o($Vi,[2,54]),{22:31,24:$V7,29:32,36:78,50:28,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},{22:31,24:$V7,29:32,36:80,50:28,63:79,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},o($V6,[2,37],{65:$Vl,66:$Vm,67:$Vn,68:$Vo,70:$Vp}),{19:81,22:82,24:$Vu,84:$Vv},{22:31,24:$V7,29:32,36:26,50:28,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf,88:85,89:$Vg},{18:[1,86],43:$Vj},{22:87,84:$Vv},{22:31,24:$V7,29:32,36:88,50:28,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},{22:31,24:$V7,29:32,36:89,50:28,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},{22:31,24:$V7,29:32,36:90,50:28,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},{22:31,24:$V7,29:32,36:92,50:28,69:91,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},{22:31,24:$V7,29:32,36:93,50:28,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},{26:[1,94],65:$Vl,66:$Vm,67:$Vn,68:$Vo,70:$Vp},{26:[1,95]},{24:[1,96],72:97},o($Vq,[2,65]),{4:65,6:3,8:4,9:5,10:6,14:7,16:$V0},{84:[1,98]},{20:$Vw,22:31,24:$V7,26:[1,99],29:32,36:80,50:28,63:101,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf,87:100},{20:$Vw,22:31,24:$V7,29:32,36:80,50:28,63:101,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf,87:103},{29:104,79:$V9},{29:105,79:$V9},o($Vh,[2,27],{13:11,42:$V3}),o($V4,[2,41],{48:106,43:[1,107],44:[1,108]}),o($Vx,[2,43]),o($Vx,[2,45],{51:[1,109]}),o($Vi,[2,56],{65:$Vl,66:$Vm,67:$Vn,68:$Vo,70:$Vp}),o([5,26,31,42,45,64],[2,55],{43:$Vy}),o($Vz,[2,90],{65:$Vl,66:$Vm,67:$Vn,68:$Vo,70:$Vp}),o($VA,[2,13],{21:111,33:112,34:$VB,37:$VC,38:$VD}),o($VE,[2,17],{22:116,23:[1,117],27:[1,118],84:$Vv,85:$Vs}),{4:120,6:3,8:4,9:5,10:6,14:7,16:$V0,22:31,24:$V7,25:119,29:32,36:80,50:28,63:121,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},o([5,18,23,26,27,31,34,35,37,38,41,42,43,45,62,84,85],$Vt),o($Vk,[2,93]),{19:122,22:82,24:$Vu,84:$Vv},o($Vk,[2,96],{85:$Vs}),o([5,18,23,26,31,34,37,38,41,42,43,45,62,64,65,67,70],[2,58],{66:$Vm,68:$Vo}),o([5,18,23,26,31,34,37,38,41,42,43,45,62,64,65,66,67,70],[2,59],{68:$Vo}),o([5,18,23,26,31,34,37,38,41,42,43,45,62,64,67,70],[2,60],{65:$Vl,66:$Vm,68:$Vo}),o($Vq,[2,61]),{65:$Vl,66:$Vm,67:$Vn,68:$Vo,70:[1,123]},o($VF,[2,62],{65:$Vl,66:$Vm,67:$Vn,68:$Vo}),o($Vq,[2,57]),o($Vq,[2,69]),{4:65,6:3,8:4,9:5,10:6,14:7,16:$V0,22:31,24:$V7,25:124,29:32,36:80,50:28,63:121,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},o($Vq,[2,64]),o([5,18,23,26,27,31,34,35,37,38,41,42,43,44,45,51,62,64,65,66,67,68,70,71,84,85],[2,84]),o($Vr,[2,86]),{26:[1,125]},{26:[2,88],43:$Vy},{22:31,24:$V7,29:32,36:80,50:28,63:126,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},{26:[1,127]},o($V4,[2,39]),o($V4,[2,40]),o($V4,[2,42]),{22:31,29:32,49:128,50:77,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},{29:130,52:129,79:$V9},o($Vx,[2,46]),{22:31,29:32,50:131,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},o($VA,[2,15],{33:132,34:$VB,37:$VC,38:$VD}),o($VG,[2,28]),{19:133,22:82,24:$Vu,84:$Vv},{34:[1,134],39:[1,135],40:[1,136]},{34:[1,137],39:[1,138],40:[1,139]},o($VE,[2,18],{85:$Vs}),{22:140,84:$Vv},{28:[1,141]},{26:[1,142]},{26:[1,143]},{26:[2,77],43:$Vy},o($VA,[2,14],{33:112,21:144,34:$VB,37:$VC,38:$VD}),{22:31,24:$V7,29:32,36:145,50:28,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},{26:[1,146]},o($Vr,[2,87]),{26:[2,89],43:$Vy},o($Vr,[2,85]),o($Vx,[2,44]),o($V4,[2,47],{53:147,56:[1,148]}),{54:[1,149],55:[1,150]},o($Vz,[2,91]),o($VG,[2,29]),{35:[1,151]},{19:152,22:82,24:$Vu,84:$Vv},{34:[1,153]},{34:[1,154]},{19:155,22:82,24:$Vu,84:$Vv},{34:[1,156]},{34:[1,157]},o($VE,[2,19],{85:$Vs}),{24:[1,158]},o($VE,[2,20]),o($VE,[2,21],{22:159,84:$Vv}),o($VA,[2,16],{33:132,34:$VB,37:$VC,38:$VD}),o($VF,[2,68],{65:$Vl,66:$Vm,67:$Vn,68:$Vo}),o($Vq,[2,63]),o($V4,[2,48]),{57:[1,160],59:[1,161]},o($VH,[2,49]),o($VH,[2,50]),{22:31,24:$V7,29:32,36:162,50:28,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},{35:[1,163]},{19:164,22:82,24:$Vu,84:$Vv},{19:165,22:82,24:$Vu,84:$Vv},{35:[1,166]},{19:167,22:82,24:$Vu,84:$Vv},{19:168,22:82,24:$Vu,84:$Vv},{29:169,79:$V9},o($VE,[2,22],{85:$Vs}),{29:130,52:170,79:$V9},{29:130,52:171,79:$V9},o($VG,[2,30],{65:$Vl,66:$Vm,67:$Vn,68:$Vo,70:$Vp}),{22:31,24:$V7,29:32,36:172,50:28,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},{35:[1,173]},{35:[1,174]},{22:31,24:$V7,29:32,36:175,50:28,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},{35:[1,176]},{35:[1,177]},{26:[1,178]},{58:[1,179]},{58:[1,180]},o($VG,[2,31],{65:$Vl,66:$Vm,67:$Vn,68:$Vo,70:$Vp}),{22:31,24:$V7,29:32,36:181,50:28,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},{22:31,24:$V7,29:32,36:182,50:28,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},o($VG,[2,32],{65:$Vl,66:$Vm,67:$Vn,68:$Vo,70:$Vp}),{22:31,24:$V7,29:32,36:183,50:28,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},{22:31,24:$V7,29:32,36:184,50:28,72:30,73:$V8,74:33,75:34,76:35,77:36,78:37,79:$V9,80:$Va,81:$Vb,82:$Vc,83:$Vd,84:$Ve,86:$Vf},o($VE,[2,23]),o($V4,[2,51]),o($V4,[2,52]),o($VG,[2,33],{65:$Vl,66:$Vm,67:$Vn,68:$Vo,70:$Vp}),o($VG,[2,35],{65:$Vl,66:$Vm,67:$Vn,68:$Vo,70:$Vp}),o($VG,[2,34],{65:$Vl,66:$Vm,67:$Vn,68:$Vo,70:$Vp}),o($VG,[2,36],{65:$Vl,66:$Vm,67:$Vn,68:$Vo,70:$Vp})],
defaultActions: {9:[2,1]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        function lex() {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
};require['./nodes'] = new function() {
  var exports = this;
  // Generated by CoffeeScript 1.8.0
(function() {
  var ArgumentListValue, BetweenOp, Field, FunctionValue, Group, Having, Join, Limit, ListValue, LiteralValue, Offset, Op, Order, OrderArgument, ParameterValue, Select, Star, StringValue, SubSelect, Table, UnaryOp, Union, Where, indent;

  indent = function(str) {
    var line;
    return ((function() {
      var _i, _len, _ref, _results;
      _ref = str.split("\n");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        _results.push("  " + line);
      }
      return _results;
    })()).join("\n");
  };

  exports.Select = Select = (function() {
    function Select(fields, source, distinct, joins, unions) {
      this.fields = fields;
      this.source = source;
      this.distinct = distinct != null ? distinct : false;
      this.joins = joins != null ? joins : [];
      this.unions = unions != null ? unions : [];
      this.order = null;
      this.group = null;
      this.where = null;
      this.limit = null;
    }

    Select.prototype.toString = function() {
      var join, ret, union, _i, _j, _len, _len1, _ref, _ref1;
      ret = ["SELECT " + (this.fields.join(', '))];
      ret.push(indent("FROM " + this.source));
      _ref = this.joins;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        join = _ref[_i];
        ret.push(indent(join.toString()));
      }
      if (this.where) {
        ret.push(indent(this.where.toString()));
      }
      if (this.group) {
        ret.push(indent(this.group.toString()));
      }
      if (this.order) {
        ret.push(indent(this.order.toString()));
      }
      if (this.limit) {
        ret.push(indent(this.limit.toString()));
      }
      _ref1 = this.unions;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        union = _ref1[_j];
        ret.push(union.toString());
      }
      return ret.join("\n");
    };

    return Select;

  })();

  exports.SubSelect = SubSelect = (function() {
    function SubSelect(select, name) {
      this.select = select;
      this.name = name != null ? name : null;
      null;
    }

    SubSelect.prototype.toString = function() {
      var ret;
      ret = [];
      ret.push('(');
      ret.push(indent(this.select.toString()));
      ret.push(this.name ? ") " + (this.name.toString()) : ")");
      return ret.join("\n");
    };

    return SubSelect;

  })();

  exports.Join = Join = (function() {
    function Join(right, conditions, side, mode) {
      this.right = right;
      this.conditions = conditions != null ? conditions : null;
      this.side = side != null ? side : null;
      this.mode = mode != null ? mode : null;
      null;
    }

    Join.prototype.toString = function() {
      var ret;
      ret = '';
      if (this.side != null) {
        ret += "" + this.side + " ";
      }
      if (this.mode != null) {
        ret += "" + this.mode + " ";
      }
      return ret + ("JOIN " + this.right + "\n") + indent("ON " + this.conditions);
    };

    return Join;

  })();

  exports.Union = Union = (function() {
    function Union(query, all) {
      this.query = query;
      this.all = all != null ? all : false;
      null;
    }

    Union.prototype.toString = function() {
      var all;
      all = this.all ? ' ALL' : '';
      return "UNION" + all + "\n" + (this.query.toString());
    };

    return Union;

  })();

  exports.LiteralValue = LiteralValue = (function() {
    function LiteralValue(value, value2) {
      this.value = value;
      this.value2 = value2 != null ? value2 : null;
      if (this.value2) {
        this.nested = true;
        this.values = this.value.values;
        this.values.push(value2);
      } else {
        this.nested = false;
        this.values = [this.value];
      }
    }

    LiteralValue.prototype.toString = function() {
      return "`" + (this.values.join('.')) + "`";
    };

    return LiteralValue;

  })();

  exports.StringValue = StringValue = (function() {
    function StringValue(value, quoteType) {
      this.value = value;
      this.quoteType = quoteType != null ? quoteType : "''";
      null;
    }

    StringValue.prototype.toString = function() {
      return "" + this.quoteType + this.value + this.quoteType;
    };

    return StringValue;

  })();

  exports.NumberValue = LiteralValue = (function() {
    function LiteralValue(value) {
      this.value = Number(value);
    }

    LiteralValue.prototype.toString = function() {
      return this.value.toString();
    };

    return LiteralValue;

  })();

  exports.ListValue = ListValue = (function() {
    function ListValue(value) {
      this.value = value;
    }

    ListValue.prototype.toString = function() {
      return "(" + (this.value.join(', ')) + ")";
    };

    return ListValue;

  })();

  exports.ParameterValue = ParameterValue = (function() {
    function ParameterValue(value) {
      this.value = value;
      this.index = parseInt(value.substr(1), 10) - 1;
    }

    ParameterValue.prototype.toString = function() {
      return "" + this.value;
    };

    return ParameterValue;

  })();

  exports.ArgumentListValue = ArgumentListValue = (function() {
    function ArgumentListValue(value, distinct) {
      this.value = value;
      this.distinct = distinct != null ? distinct : false;
      null;
    }

    ArgumentListValue.prototype.toString = function() {
      if (this.distinct) {
        return "DISTINCT " + (this.value.join(', '));
      } else {
        return "" + (this.value.join(', '));
      }
    };

    return ArgumentListValue;

  })();

  exports.BooleanValue = LiteralValue = (function() {
    function LiteralValue(value) {
      this.value = (function() {
        switch (value.toLowerCase()) {
          case 'true':
            return true;
          case 'false':
            return false;
          default:
            return null;
        }
      })();
    }

    LiteralValue.prototype.toString = function() {
      if (this.value != null) {
        return this.value.toString().toUpperCase();
      } else {
        return 'NULL';
      }
    };

    return LiteralValue;

  })();

  exports.FunctionValue = FunctionValue = (function() {
    function FunctionValue(name, _arguments, udf) {
      this.name = name;
      this["arguments"] = _arguments != null ? _arguments : null;
      this.udf = udf != null ? udf : false;
      null;
    }

    FunctionValue.prototype.toString = function() {
      if (this["arguments"]) {
        return "" + (this.name.toUpperCase()) + "(" + (this["arguments"].toString()) + ")";
      } else {
        return "" + (this.name.toUpperCase()) + "()";
      }
    };

    return FunctionValue;

  })();

  exports.Order = Order = (function() {
    function Order(orderings, offset) {
      this.orderings = orderings;
      this.offset = offset;
    }

    Order.prototype.toString = function() {
      return ("ORDER BY " + (this.orderings.join(', '))) + (this.offset ? "\n" + this.offset.toString() : "");
    };

    return Order;

  })();

  exports.OrderArgument = OrderArgument = (function() {
    function OrderArgument(value, direction) {
      this.value = value;
      this.direction = direction != null ? direction : 'ASC';
      null;
    }

    OrderArgument.prototype.toString = function() {
      return "" + this.value + " " + this.direction;
    };

    return OrderArgument;

  })();

  exports.Offset = Offset = (function() {
    function Offset(row_count, limit) {
      this.row_count = row_count;
      this.limit = limit;
      null;
    }

    Offset.prototype.toString = function() {
      return ("OFFSET " + this.row_count + " ROWS") + (this.limit ? "\nFETCH NEXT " + this.limit + " ROWS ONLY" : "");
    };

    return Offset;

  })();

  exports.Limit = Limit = (function() {
    function Limit(value, offset) {
      this.value = value;
      this.offset = offset;
      null;
    }

    Limit.prototype.toString = function() {
      return ("LIMIT " + this.value) + (this.offset ? "\nOFFSET " + this.offset : "");
    };

    return Limit;

  })();

  exports.Table = Table = (function() {
    function Table(name, alias, win, winFn, winArg) {
      this.name = name;
      this.alias = alias != null ? alias : null;
      this.win = win != null ? win : null;
      this.winFn = winFn != null ? winFn : null;
      this.winArg = winArg != null ? winArg : null;
      null;
    }

    Table.prototype.toString = function() {
      if (this.win) {
        return "" + this.name + "." + this.win + ":" + this.winFn + "(" + this.winArg + ")";
      } else if (this.alias) {
        return "" + this.name + " AS " + this.alias;
      } else {
        return this.name.toString();
      }
    };

    return Table;

  })();

  exports.Group = Group = (function() {
    function Group(fields) {
      this.fields = fields;
      this.having = null;
    }

    Group.prototype.toString = function() {
      var ret;
      ret = ["GROUP BY " + (this.fields.join(', '))];
      if (this.having) {
        ret.push(this.having.toString());
      }
      return ret.join("\n");
    };

    return Group;

  })();

  exports.Where = Where = (function() {
    function Where(conditions) {
      this.conditions = conditions;
      null;
    }

    Where.prototype.toString = function() {
      return "WHERE " + this.conditions;
    };

    return Where;

  })();

  exports.Having = Having = (function() {
    function Having(conditions) {
      this.conditions = conditions;
      null;
    }

    Having.prototype.toString = function() {
      return "HAVING " + this.conditions;
    };

    return Having;

  })();

  exports.Op = Op = (function() {
    function Op(operation, left, right) {
      this.operation = operation;
      this.left = left;
      this.right = right;
      null;
    }

    Op.prototype.toString = function() {
      return "(" + this.left + " " + (this.operation.toUpperCase()) + " " + this.right + ")";
    };

    return Op;

  })();

  exports.UnaryOp = UnaryOp = (function() {
    function UnaryOp(operator, operand) {
      this.operator = operator;
      this.operand = operand;
      null;
    }

    UnaryOp.prototype.toString = function() {
      return "(" + (this.operator.toUpperCase()) + " " + this.operand + ")";
    };

    return UnaryOp;

  })();

  exports.BetweenOp = BetweenOp = (function() {
    function BetweenOp(value) {
      this.value = value;
      null;
    }

    BetweenOp.prototype.toString = function() {
      return "" + (this.value.join(' AND '));
    };

    return BetweenOp;

  })();

  exports.Field = Field = (function() {
    function Field(field, name) {
      this.field = field;
      this.name = name != null ? name : null;
      null;
    }

    Field.prototype.toString = function() {
      if (this.name) {
        return "" + this.field + " AS " + this.name;
      } else {
        return this.field.toString();
      }
    };

    return Field;

  })();

  exports.Star = Star = (function() {
    function Star() {
      null;
    }

    Star.prototype.toString = function() {
      return '*';
    };

    Star.prototype.star = true;

    return Star;

  })();

}).call(this);

};require['./parser'] = new function() {
  var exports = this;
  // Generated by CoffeeScript 1.8.0
(function() {
  var buildParser;

  buildParser = function() {
    var parser;
    parser = require('./compiled_parser').parser;
    parser.lexer = {
      lex: function() {
        var tag, _ref;
        _ref = this.tokens[this.pos++] || [''], tag = _ref[0], this.yytext = _ref[1], this.yylineno = _ref[2];
        return tag;
      },
      setInput: function(tokens) {
        this.tokens = tokens;
        return this.pos = 0;
      },
      upcomingInput: function() {
        return "";
      }
    };
    parser.yy = require('./nodes');
    return parser;
  };

  exports.parser = buildParser();

  exports.parse = function(str) {
    return buildParser().parse(str);
  };

}).call(this);

};require['./sql_parser'] = new function() {
  var exports = this;
  // Generated by CoffeeScript 1.8.0
(function() {
  exports.lexer = require('./lexer');

  exports.parser = require('./parser');

  exports.nodes = require('./nodes');

  exports.parse = function(sql) {
    return exports.parser.parse(exports.lexer.tokenize(sql));
  };

}).call(this);

};
    return require['./sql_parser']
  }();

  if(typeof define === 'function' && define.amd) {
    define(function() { return SQLParser });
  } else { root.SQLParser = SQLParser }
}(this));
