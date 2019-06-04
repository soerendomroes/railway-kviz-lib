function getAbsolutePosition(elem) {
   if (elem) {
      var parentPos
      var pos = getTranslation(elem)

      if (elem.parentNode !== null) {
         parentPos = getAbsolutePosition(elem.parentNode)
         return [pos[0] + parentPos[0], pos[1] + parentPos[1]]
      }
      return [pos[0], pos[1]]
   }
   return [0, 0]
}
function writeToCanvas(svg, img, canvas) {
	var xml = new XMLSerializer().serializeToString(svg);
	// make it base64
	console.log(xml)
	var svg64 = btoa(xml);
	console.log(svg64)
	var b64Start = "data:image/svg+xml;base64,";
	
	// prepend a "header"
	var image64 = b64Start + svg64;
	
	// set it as the source of the img element
	img.src = image64;
	document.querySelector("img").onload = function() {
	   var canvas = document.querySelector("canvas")
	   var ctx = canvas.getContext("2d")
	   canvas.setAttribute("width", img.clientWidth)
	   canvas.setAttribute("height", img.clientHeight)
	   ctx.drawImage(this, 0, 0, 1500, 1880, 0, 0, 1500, 1880);
	   // hide image and svg, only the canvas is displayed
	   img.style.display = "none"
	   svg.style.display = "none"
	
	}
}
function getTranslation(elem) {

   var transform
   try {
      transform = elem.getAttribute("transform")
      //console.log("Got attribute transform: " + transform)
   } catch (e) {
      // this happens if the parent node is something outside of the svg
   }
   if (transform != null) {
      var translateIndex = transform.indexOf("translate")
      if (translateIndex >= 0) {
         var parameterList = transform.substring(translateIndex + "translate".length, transform.length)
         var openIndex = parameterList.indexOf("(")
         var closeIndex = parameterList.indexOf(")")
         if (openIndex >= 0 && closeIndex >= 0) {
            var parameters = parameterList.substring(openIndex + 1, closeIndex)
            var parametersArray = parameters.split(",")
            if (parametersArray.length >= 2) {
               var x = parseFloat(parametersArray[0])
               var y = parseFloat(parametersArray[1])
               //console.log("Return transform as " + x + ", " + y)
               return [x, y]
            }
         }
      }
   }
   //console.log("Not reached")
   return [0, 0]

}
function placeElemAt(elem, targetX, targetY, direction) {
   var x = Math.floor(elem.getBBox().x)
   var y = Math.floor(elem.getBBox().y)
   var height = Math.floor(elem.getBBox().height)
   var width = Math.floor(elem.getBBox().width)
   var translation = getTranslation(elem)
   //  var rotate = rotation(elem, [targetX, targetY], [translation[0] - lastX, translation[1] - lastY])
   var rotate = absRotation(elem, direction)
   elem.setAttribute("transform", "translate(" + (targetX + lastX) + ", " +
      (targetY + lastY) + ")" + rotate)
}
function absRotation(elem, direction) {
   var height = Math.floor(elem.getBBox().height)
   var width = Math.floor(elem.getBBox().width)
   return " rotate(" + direction + "," + (elem.getBBox().x + width / 2) + "," + (elem.getBBox().y + height / 2) + ")"
}
function rotation(elem, currentPos, lastPos) {
   if (lastPos[0] == -1 && lastPos[1] == -1) {
      return ""
   }
   if (!(lastPos[0] == currentPos[0] && lastPos[1] == currentPos[1])) {
      var deg = Math.atan2(lastPos[1] - currentPos[1], lastPos[0] - currentPos[0]) * (180 / Math.PI) + 180;
      var height = Math.floor(elem.getBBox().height)
      var width = Math.floor(elem.getBBox().width)
      var nextAngle = deg % 360
      return " rotate(" + nextAngle + "," + (elem.getBBox().x + width / 2) + "," + (elem.getBBox().y + height / 2) + ")"
   }
   // Default case, current and last position are the same
   return ""
}
