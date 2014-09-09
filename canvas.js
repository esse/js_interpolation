var canvas;
var context;
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;
var onePixel;
var d;

  
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
	
	function addClick(x, y, dragging)
  {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
  }
  
  $('#canvas').mousedown(function(e){
     var mouseX = e.pageX - this.offsetLeft;
     var mouseY = e.pageY - this.offsetTop;

     paint = true;
     addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
     redraw();
   });


   // $('#canvas').mousemove(function(e){
   //     if(paint){
   //       addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
   //       redraw();
   //     }
   //   });

   $('#canvas').mouseup(function(e){
     paint = false;
   });

   $('#canvas').mouseleave(function(e){
     paint = false;
   });

   var paint;
}

function setPixel(x,y) {
  context.putImageData(onePixel, x, y);
  // ctx.fillStyle = "rgba("+255+","+0+","++","+(a/255)+")";
  // ctx.fillRect( x, y, 1, 1 );
}

function redraw(){
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  
  context.strokeStyle = "#df4b26";
  context.lineJoin = "round";
  context.lineWidth = 2;
			
  for(var i=0; i < clickX.length; i++) {		
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.stroke();
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

$(document).ready(function() {
  
 
  prepareCanvas();
  $('#drawInterpQ').on('click', function() {
    drawInterpolationQuadraticLagrange(1);
  });
  $('#drawInterpC').on('click', function() {
    drawInterpolationCubicLagrange(1);
  });

});