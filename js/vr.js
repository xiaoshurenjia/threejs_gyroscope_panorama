function vr(image) {
    const CanvasBody = document.getElementById('CanvasBody');

    var Scene = void 0,
        Camera = void 0,
        Renderer = void 0,
        FpsStats = void 0,
        AnimateFrame = void 0,
        Controls = void 0,
        Devices = void 0; // 场景，照相机，渲染器，FPS监视器，渲染定时器，控制器，陀螺仪

    var isDeviceing = 1; // 陀螺仪状态：0-用手机滑动控制，1-用陀螺仪控制
    var hasGyroPermission = false; // 是否已经获取到陀螺仪权限

    /* 初始化函数 */
    // 初始化场景
    function initScene() {
        Scene = new THREE.Scene();
    }
    // 初始化照相机
    function initCamera() {
        Camera = new THREE.PerspectiveCamera(90, CanvasBody.clientWidth / CanvasBody.clientHeight, 1, 3000);
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
        CanvasBody.appendChild(FpsStats.domElement);
        FpsStats.domElement.style.cssText = "position: absolute;top: 0;left: 0;";
    }
    // 初始化控制器
    function initControls() {
        Controls = new THREE.OrbitControls(Camera);
    }
    // 初始化陀螺仪
    function initDevices() {
        Devices = new THREE.DeviceOrientationControls(Camera);
        Devices.connect();
    }

    /* 窗口改变事件 */
    function windowChange() {
        initCamera();
        Renderer.setSize(CanvasBody.clientWidth, CanvasBody.clientHeight);
        initControls();
        // 窗口变化后需要重新申请陀螺仪权限
        hasGyroPermission = false;
        requestDeviceOrientationPermission();
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
        if (isDeviceing === 0) {
            Controls.update()
        } else {
            if (hasGyroPermission == true) Devices.update();
        }
        Renderer.render(Scene, Camera);
        AnimateFrame = requestAnimationFrame(animate);
    }
    /* 添加全景球 */
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
    /* 初始化场景内物体 */
    function initSceneObjects() {
        addimg(image); // 全景球
        var al = new THREE.AmbientLight(0xffffff); // 灯光
        Scene.add(al);
    };

    /* 申请陀螺仪权限 */
    function requestDeviceOrientationPermission() {
        if (hasGyroPermission == true) return;

        if (typeof DeviceOrientationEvent !== 'function') {
            hasGyroPermission = true;
            initDevices();
            console.log('DeviceOrientationEvent not detected')
            return;
        }
        if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
            hasGyroPermission = true;
            initDevices();
            console.log('DeviceOrientationEvent.requestPermission not detected')
            return;
        }

        DeviceOrientationEvent.requestPermission().then(function (result) {
            console.log('RESULT: ' + result);
            if (result === "granted") {
                initDevices();
                hasGyroPermission = true;
            }
        });
    }

    /* 初始化 */
    function init() {
        // 初始化
        initScene();
        initCamera();
        initRenderer();
        initControls();
        initFpsStats();
        initSceneObjects();

        window.addEventListener("resize", windowChange, false);
        window.addEventListener("click", controlDevice, false);
        document.body.addEventListener("touchstart", function (event) {
            isDeviceing = 0;
        })
        document.body.addEventListener("touchend", function () {
            isDeviceing = 1;
            requestDeviceOrientationPermission();
        });
        AnimateFrame = requestAnimationFrame(animate);
    }

    init();
}