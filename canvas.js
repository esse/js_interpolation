var canvas;
var context;
var clickX = new Array();
var clickY = new Array();
var paint;
var onePixel;
var d;
var imageObj;
var drawed = false;
  
function prepareCanvas()
{
  context = document.getElementById('canvas').getContext("2d");
  onePixel = context.createImageData(1,1);
  d = onePixel.data;
  d[0]   = 255;
  d[1]   = 0;
  d[2]   = 0;
  d[3]   = 255;
  onePixel.data = d;
  
  imageObj = new Image();

  imageObj.onload = function() {
    context.drawImage(imageObj, 0, 0);
  };
  imageObj.src = 'knee.png'
	
	function addClick(x, y, _)
  {
    clickX.push(x);
    clickY.push(y);
    drawPoint(x, y);
  }
  
  $('#canvas').mousedown(function(e){
     var mouseX = e.pageX - this.offsetLeft;
     var mouseY = e.pageY - this.offsetTop;
     
     addClick(mouseX, mouseY);
   });

   var paint;
}

function setPixel(x,y) {
  context.putImageData(onePixel, x, y);
}

function drawPoint(x,y) {
  setPixel(x-1, y-1);
  setPixel(x-1, y);
  setPixel(x-1, y+1);
  setPixel(x, y-1)
  setPixel(x, y+1);
  setPixel(x, y);
	setPixel(x+1, y+1);
  setPixel(x+1, y-1);
	setPixel(x+1, y);
}

function redraw(){
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	context.drawImage(imageObj, 0, 0);	
  for(var i=0; i < clickX.length; i++) {
    drawPoint(clickX[i], clickY[i]);
  }
  if (!(drawed)) {
    if (drawed === "c") {
      drawInterpolationCubicLagrange(parseFloat($('#lambda').val()));
    } else if (drawed === "q") {
      drawInterpolationQuadraticLagrange(parseFloat($('#lambda').val()));
    }
  }
}

function drawInterpolationQuadraticLagrange(lambda) {
  var k = clickX.length-1;
  if (clickX.length % 2 == 0)
  {
    k = k-1;
  }
  for(var j=0;j<k;j = j+2) {    
    var td0 = 0;
    var n_x = clickX[j+1] - clickX[j+0];
    var n_y = clickY[j+1] - clickY[j+0];
    var td1 = Math.pow(Math.sqrt(Math.pow(n_x,2) + Math.pow(n_y,2)),lambda);
    n_x = clickX[j+2] - clickX[j+1];
    n_y = clickY[j+2] - clickY[j+1];
    var td2 = Math.pow(Math.sqrt(Math.pow(n_x,2) + Math.pow(n_y,2)),lambda) + td1;
    var q0_x = clickX[j+0];
    var q0_y = clickY[j+0];
    var q1_x = clickX[j+1];
    var q1_y = clickY[j+1];
    var q2_x = clickX[j+2];
    var q2_y = clickY[j+2];
    
    var range = td2 - td0;
    var one_step = range/1000;
    for(var i=0;i<(td2*(1/one_step));i++) {
      var t = i*one_step;
      var x = q0_x*(((t - td1)*(t - td2))/((td0 - td1)*(td0 - td2))) + 
       q1_x*(((t - td0)*(t - td2))/((td1 - td0)*(td1 - td2))) +
       q2_x*(((t - td0)*(t - td1))/((td2 - td1)*(td2 - td0)));

      var y = q0_y*(((t - td1)*(t - td2))/((td0 - td1)*(td0 - td2))) + 
        q1_y*(((t - td0)*(t - td2))/((td1 - td0)*(td1 - td2))) +
        q2_y*(((t - td0)*(t - td1))/((td2 - td1)*(td2 - td0)));
      setPixel(x,y);
    }

  }
}

function drawInterpolationCubicLagrange(lambda) {
  var k = clickX.length-1;
  if (k % 3 == 1)
  {
    k = k-1;
  }
  if (k % 3 == 2)
  {
    k = k-2;
  }
  for(var j=0;j<k;j = j+3) {    
    var td0 = 0;
    var n_x = clickX[j+1] - clickX[j+0];
    var n_y = clickY[j+1] - clickY[j+0];
    var td1 = Math.pow(Math.sqrt(Math.pow(n_x,2) + Math.pow(n_y,2)),lambda);
    n_x = clickX[j+2] - clickX[j+1];
    n_y = clickY[j+2] - clickY[j+1];
    var td2 = Math.pow(Math.sqrt(Math.pow(n_x,2) + Math.pow(n_y,2)),lambda) + td1;
    n_x = clickX[j+3] - clickX[j+2];
    n_y = clickY[j+3] - clickY[j+2];
    var td3 = Math.pow(Math.sqrt(Math.pow(n_x,2) + Math.pow(n_y,2)),lambda) + td2;
    var q0_x = clickX[j+0];
    var q0_y = clickY[j+0];
    var q1_x = clickX[j+1];
    var q1_y = clickY[j+1];
    var q2_x = clickX[j+2];
    var q2_y = clickY[j+2];
    var q3_x = clickX[j+3];
    var q3_y = clickY[j+3];
    var range = td3 - td0;
    var one_step = range/1000;
      for(var i=0;i<(td3*(1/one_step));i++) {
        var t = i*one_step;
        var x = q0_x*(((t - td1)*(t - td2)*(t - td3))/((td0 - td1)*(td0 - td2)*(td0 - td3))) + 
          q1_x*(((t - td0)*(t - td2)*(t - td3))/((td1 - td0)*(td1 - td2)*(td1 - td3))) +
          q2_x*(((t - td0)*(t - td1)*(t - td3))/((td2 - td1)*(td2 - td0)*(td2 - td3))) +
          q3_x*(((t - td0)*(t - td1)*(t - td2))/((td3 - td1)*(td3 - td0)*(td3 - td2)));

        var y = q0_y*(((t - td1)*(t - td2)*(t - td3))/((td0 - td1)*(td0 - td2)*(td0 - td3))) + 
          q1_y*(((t - td0)*(t - td2)*(t - td3))/((td1 - td0)*(td1 - td2)*(td1 - td3))) +
          q2_y*(((t - td0)*(t - td1)*(t - td3))/((td2 - td1)*(td2 - td0)*(td2 - td3))) +
          q3_y*(((t - td0)*(t - td1)*(t - td2))/((td3 - td1)*(td3 - td0)*(td3 - td2)));
        setPixel(x,y,255);
      }

  }
}

function clear() {
  clickX = new Array();
  clickY = new Array();
  redraw();
}

function undo() {
  clickX.pop();
  clickY.pop();
  redraw();
}

$(document).ready(function() {  
 
  prepareCanvas();
  $('#drawInterpQ').on('click', function() {
    var lambda = parseFloat($('#lambda').val());
    drawInterpolationQuadraticLagrange(lambda);
    drawed = 'q';
  });
  $('#drawInterpC').on('click', function() {
    var lambda = parseFloat($('#lambda').val());
    drawInterpolationCubicLagrange(lambda);
    drawed = 'c';
  });
  $('#clear').on('click', function() {
    clear();
  });
  $('#undo').on('click', function() {
    undo();
  });
  $('#less').on('click', function() {
    var lambda = parseFloat($('#lambda').val())*10;
    lambda = lambda - 1;
    if (lambda < 0) {
      lambda = 0;
    }
    $('#lambda').val(lambda/10);
  });
  $('#more').on('click', function() {
    var lambda = parseFloat($('#lambda').val())*10;
    lambda = lambda + 1;
    if (lambda > 10) {
      lambda = 10;
    }
    $('#lambda').val(lambda/10);
  });
  $('#lambda').on('change', function() {
    var lambda = parseFloat($('#lambda').val());
    if (lambda > 1) {
      $('#lambda').val(1);
    } else if (lambda < 0) {
      $('#lambda').val(0);      
    }
  })

});