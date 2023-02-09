(function (CanvasBody, _window) {
    $.fn.vr = function (image) {
        var Scene = void 0,
            Camera = void 0,
            Renderer = void 0,
            FpsStats = void 0,
            AnimateFrame = void 0,
            Controls = void 0,
            Devices = void 0; // 场景，照相机，渲染器，FPS监视器，渲染定时器，控制器，陀螺仪
        var onDevice = document.getElementById("onDevice");
        var isDeviceing = 1; // 陀螺仪状态
        /* 初始化函数 */
        // 初始化场景
        function initScene() {
            Scene = new THREE.Scene();
        }
        // 初始化照相机
        function initCamera() {
            Camera = new THREE.PerspectiveCamera(60, CanvasBody.clientWidth / CanvasBody.clientHeight, 1, 3000);
            Camera.position.set(1, 0, 0);
            Camera.lookAt({ x: 200, y: 0, z: 0 });
        }
        // 初始化渲染器
        function initRenderer() {
            Renderer = new THREE.WebGLRenderer();
            Renderer.setSize(CanvasBody.clientWidth, CanvasBody.clientHeight);
            Renderer.setClearColor(0x000000, 1);
            CanvasBody.appendChild(Renderer.domElement);
        }
        // 初始化监视器
        function initFpsStats() {
            FpsStats = new Stats();
            //      CanvasBody.appendChild(FpsStats.domElement);
            //      FpsStats.domElement.style.cssText = "position: absolute;top: 0;left: 0;";
        }
        // 初始化控制器
        function initControls() {
            Controls = new THREE.OrbitControls(Camera);
        }

        // 初始化陀螺仪
        function initDevices() {
            Devices = new THREE.DeviceOrientationControls(Camera);

            console.log("initDevices")

            console.log(typeof (DeviceOrientationEvent.requestPermission))

            alert(typeof (DeviceOrientationEvent.requestPermission));

            // 苹果手机申请陀螺仪权限
            if (DeviceOrientationEvent && typeof (DeviceOrientationEvent.requestPermission) === "function") {
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {

                        if (permissionState === 'granted') {
                            // handle data
                            alert("handle data");
                            console.log("handle data")
                        } else {
                            // handle denied
                            alert("handle denied");
                            console.log("handle denied");
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        alert("requestPermission failed: " + err);
                    });
            } else {
                // han
                console.log("DeviceOrientationEvent.requestPermission : " + typeof DeviceOrientationEvent)
                alert("DeviceOrientationEvent.requestPermission : " + typeof DeviceOrientationEvent);
            }
        }

        /* 窗口改变事件 */
        function windowChange() {
            initCamera();
            Renderer.setSize(CanvasBody.clientWidth, CanvasBody.clientHeight);
            initDevices();
            initControls();
        }
        /* 控制陀螺仪 */
        function controlDevice(event) {
            if (isDeviceing === 0) {
                isDeviceing = 1;
            } else {
                isDeviceing = 0;
            }
        }
        /* 动画 */
        function animate(time) {
            Renderer.clear();
            isDeviceing === 0 ? Controls.update() : Devices.update();
            Renderer.render(Scene, Camera);
            AnimateFrame = requestAnimationFrame(animate);
        }
        function addimg(image) {
            var r = Math.sqrt(5000 * 1827 / 4 / Math.PI);
            var texture = THREE.ImageUtils.loadTexture(image, {}, function () {
                var geometry = new THREE.SphereGeometry(r, 100, 100);
                var material = new THREE.MeshLambertMaterial({
                    map: texture,
                    side: THREE.DoubleSide
                });
                var mesh = new THREE.Mesh(geometry, material);
                Scene.add(mesh);
                mesh.position.set(0, 0, 0);

            });

        }
        /* 初始化 */
        function init() {
            // 初始化
            initScene();
            initCamera();
            initRenderer();
            initControls();
            initDevices();
            // 初始化绑定陀螺仪
            Devices.connect();
            _window.addEventListener("resize", windowChange, false);
            onDevice.addEventListener("click", controlDevice, false);
            AnimateFrame = requestAnimationFrame(animate);

        }
        $('body').bind("touchstart", function (event) {
            isDeviceing = 0;
        })
        $('body').bind("touchend", function () {

            isDeviceing = 1;
        });


        var index = 0;
        var img = "sun.jpg";
        $(".prev").tap(function () {
            index++;
            if (index == 1) {
                addimg("snow.jpg");
            }
        })
        $(".next").tap(function () {
            index--;
            if (index == 0) {
                addimg("sun.jpg");
            }

        })
        init();

        /* 场景内物体 */
        (function () {
            addimg(image);
            var al = new THREE.AmbientLight(0xffffff);
            Scene.add(al);
        })();
    }
})(CanvasBody, window);
