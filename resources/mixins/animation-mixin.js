window.animationMixin = Vue.mixin({
    
})

//         <style>
// #container {
//   width: 400px;
//   height: 400px;
//   position: relative;
//   background: yellow;
// }
// #animate {
//   width: 50px;
//   height: 50px;
//   position: absolute;
//   background-color: red;
// }
// </style>
// <body>

// <p><button onclick="myMove()">Click Me</button></p> 

// <div id ="container">
//   <div id ="animate"></div>
// </div>

// <script>
// function myMove() {
//   var elem = document.getElementById("animate");   
//   var pos = 0;
//   var id = setInterval(frame, 4);
  
//   var flag = false
  
//   function frame() {
//     if (pos === 350) {
//     	flag = true
//     } else if (pos === 0){
//     	flag = false
//     }
    
//     if (flag === false) {
//       pos++;  
//       elem.style.left = pos + "px"; 
//     } else {
//     	pos--
//        elem.style.left = pos + "px";
//     }
//   }
// }
// </script>
        

        // function myMove() {
        //     var elem = document.getElementById("an");   
        //     var pos = 0;
        //     var id = setInterval(frame, 5);
        //     function frame() {
        //         if (pos == 350) {
        //             clearInterval(id);
        //         } else {
        //             pos++; 
        //             elem.style.top = pos + "px"; 
        //             elem.style.left = pos + "px"; 
        //         }
        //     }
// }


//// ANOTHER VERSION

        // ANIMATION
        // var start = null;
        // var element = document.getElementById('an');

        // function step(timestamp, direction) {
        //     if (!start) start = timestamp;
        //     var progress = timestamp - start;
            
        //     direction !== "backward" ? element.style.transform = 'translateX(' + Math.min(progress / 10, 200) + 'px)' : element.style.transform = 'translateX(' - Math.min(progress / 10, 200) + 'px)'
            
        //     if (progress < 2000) {
        //         window.requestAnimationFrame(step);
        //     } else {
        //         window.requestAnimationFrame(step(undefined, "backward"));
        //     }
        // }

        // window.requestAnimationFrame(step);
        // // ANIMATION
