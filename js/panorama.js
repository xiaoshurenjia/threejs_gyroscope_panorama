(function ($) {
$.fn.panorama =function (CanvasBody,img) {
       Scene = void 0,
        Camera = void 0,
        Renderer = void 0,
        FpsStats = void 0,
        AnimateFrame = void 0,
        Controls = void 0,
        Devices = void 0 // 场景，照相机，渲染器，FPS监视器，渲染定时器，控制器，陀螺仪
       
    var onDevice = document.getElementById("onDevice");
//  var isDeviceing = 1; // 陀螺仪状态
    /* 初始化函数 */
    // 初始化场景
    function initScene() {
        Scene = new THREE.Scene();    
    }
    // 初始化照相机
    function initCamera() {
        Camera = new THREE.PerspectiveCamera(60, CanvasBody.clientWidth / CanvasBody.clientHeight, 1, 3000); // 透视相机(视角，长宽比，开始看到的渲染距离，最远的渲染距离)
        Camera.position.set(1, 0, 0);
// Camera.position.set(100, 50, 0);
        Camera.lookAt(new THREE.Vector3(20, 0, 20));//设置相机朝向位置为(20,0,20) 
    }
    // 初始化渲染器
    function initRenderer() {
        Renderer = new THREE.WebGLRenderer();
        Renderer.setSize(CanvasBody.clientWidth, CanvasBody.clientHeight);//指定渲染器的高宽（和画布框大小一致）  
        Renderer.setClearColor(0x000000, 1);   //设置canvas背景色(clearColor) 
        CanvasBody.appendChild(Renderer.domElement);
    }
   
    // 初始化陀螺仪
    function initDevices() {
        Devices = new THREE.DeviceOrientationControls(Camera);    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
           // 申请陀螺仪权限
           DeviceOrientationEvent.requestPermission()
               .then(permissionState => {
                 if (permissionState === 'granted') {
                   // handle data
                 } else {
                            // handle denied
                 }
               })
               .catch((err) => {
                   console.log(err)
               });
           } else {
             // han
             console.log(typeof DeviceOrientationEvent)
           }
    }
    /* 窗口改变事件 */
    function windowChange() {
        initCamera();
        Renderer.setSize(CanvasBody.clientWidth, CanvasBody.clientHeight);
        initDevices();
    }
     /* 动画 */
    function animate(time) {
        Renderer.clear();
        Devices.update();
        Renderer.render(Scene, Camera);
        AnimateFrame = requestAnimationFrame(animate);
    }
        // 初始化
        initScene();
        initCamera();
        initRenderer();
        initDevices();
        // 初始化绑定陀螺仪
        Devices.connect();
        window.addEventListener("resize", windowChange, false);
        window.addEventListener("deviceorientation", orientationHandler, false);
        AnimateFrame = requestAnimationFrame(animate);
         
     var text = "";
    function orientationHandler(event) {
        text = ""
        var arrow = document.getElementById("arrow");
        text += "左右旋转：rotate alpha{" + Math.round(event.alpha) + "deg)<p>";
        text += "前后旋转：rotate beta{" + Math.round(event.beta) + "deg)<p>";
        text += "扭转设备：rotate gamma{" + Math.round(event.gamma) + "deg)<p>";
        console.log(text)
    }
    

        
      
}
   
   })(jQuery);
//})(document.getElementById("CanvasBody"), window);


    
  
    
