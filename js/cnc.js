/*
    Limpiar, ocultar, mostrar escena
    Unir varios mesh
*/


//----------------------------------------INITIALIZATION-----------------------------------------//

var obj = function (id) {
    return document.getElementById(id);
}; 							//obtiene objeto por id
var container = obj('canvas-container');												//contenedor
var renderer, scene, camera, persp, ortho, raycaster;                                   //escena
var gridHelper, cageHelper, sheetHelper, jointCSG, jointThree, ally, magic; 	        //geometrias auxiliares
var orbit, control, mouse = {x: 0, y: 0}, CONTROLED = false, INTERSECTED;		        //controles
var mode = "T", figures = [], SXs = [], SZs = [], SX = 0, SZ = 0;								//dimensionar
var user, email, code, id = 0, model;                                                     //datos de usuario
var mood = 0, OS = 0, defaultTone = 6, processing = 0, scanning = 0, letme = 0, hollow = 0;           //flags
var travel, originalpt;

init();
animate();
intro();

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0A0A0A);

    var aspect = window.innerWidth / window.innerHeight;
    persp = new THREE.PerspectiveCamera(40, aspect, 1, 150);
    ortho = new THREE.OrthographicCamera(50 * aspect / -2, 50 * aspect / 2, 50 / 2, 50 / -2, 1, 1000);
    space(1);

    light = new THREE.AmbientLight(0xBBBBBB);
    scene.add(light);
    lightF = new THREE.PointLight(0xffffff, 5, 100, 2);
    lightF.position.set(14, 30, 10);
    scene.add(lightF);
    lightB = new THREE.PointLight(0x333333, 5, 100, 1);
    lightB.position.set(-28, -1, -20);
    scene.add(lightB);

    raycaster = new THREE.Raycaster();
    gridHelper = new THREE.GridHelper(30, 30, 0x595959, 0x292929);
    scene.add(gridHelper);
    cageHelper = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshStandardMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.2
    }));
    cageHelper.material.side = THREE.DoubleSide;
    cageHelper.position.y = 10;
    sheetHelper = new THREE.Mesh(new THREE.BoxGeometry(20, 0.1, 20), new THREE.MeshStandardMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.2
    }));
    sheetHelper.position.y = 10;

    document.addEventListener('touchstart', touch, false);
    document.addEventListener('click', select, false);
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keydown', keyboard);
}

function animate() {
    if ((obj('colors').style.display == "block")) {
        picker();
    }
    if (INTERSECTED) {
        info();
    }
    control.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function intro() {
    showHome(50);
    originalpt = obj("pt").innerHTML;
    obj("home").style.backgroundColor = "#" + palette(defaultTone).toString(16);
    obj("hex").value = "#" + palette(defaultTone).toString(16);
    selectMode(1);
}

//--------------------------------------------FIGURES--------------------------------------------//

function addCube() {
    if (processing > 0) {
        return 0;
    }
    var geometry = new THREE.BoxGeometry(2, 2, 2);
    var cube = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: palette(defaultTone)}));
    cube.position.set(0, 1, 0);
    scene.add(cube);
    setScale(cube, cube);
}

function addPrism() {
    if (processing > 0) {
        return 0;
    }
    var geometry = new THREE.CylinderGeometry(Math.sqrt(2), Math.sqrt(2), 2, obj("sides").value, 1);
    var prism = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: palette(defaultTone)}));
    prism.position.set(0, 1, 0);
    scene.add(prism);
    setScale(prism, prism);
}

function addPyramid() {
    if (processing > 0) {
        return 0;
    }
    var geometry = new THREE.ConeGeometry(1, 2, 4, 1, false, Math.PI / 4);
    var pyramid = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: palette(defaultTone)}));
    pyramid.position.set(0, 1, 0);
    scene.add(pyramid);
    setScale(pyramid, pyramid);
}

function addSphere() {
    if (processing > 0) {
        return 0;
    }
    var geometry = new THREE.SphereGeometry(1, 50, 50);
    var sphere = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: palette(defaultTone)}));
    sphere.position.set(0, 1, 0);
    scene.add(sphere);
    setScale(sphere, sphere);
}

function addCylinder() {
    if (processing > 0) {
        return 0;
    }
    var geometry = new THREE.CylinderGeometry(1, 1, 2, 50, 1);
    var cylinder = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: palette(defaultTone)}));
    cylinder.position.set(0, 1, 0);
    scene.add(cylinder);
    setScale(cylinder, cylinder);
}

function addCone() {
    if (processing > 0) {
        return 0;
    }
    var geometry = new THREE.ConeGeometry(1, 2, 50, 1);
    var cone = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: palette(defaultTone)}));
    cone.position.set(0, 1, 0);
    scene.add(cone);
    setScale(cone, cone);
}

//-------------------------------------------DIMENSIONS------------------------------------------//

function setScale(fig, fig2size) {
    boundingBox = new THREE.Box3().setFromObject(fig2size);
    size = boundingBox.getSize();
    figures.push(fig);
    SXs.push(size.x);
    SZs.push(size.z);
}

function getScale() {
    for (var x = 0; x < figures.length; x++) {
        if (INTERSECTED == figures[x]) {
            SX = SXs[x];
            SZ = SZs[x];
            x = figures.length;
            ID = x;
        }
    }
}

function info() { //las escalas deben de ser del tamaño del objeto al momento de crearse, por eso deben almacenarse
    if (mode == "E") {

        getScale();														//obtiene las escalas

        var RX = INTERSECTED.rotation.x;								//guarda angulo original
        var RY = INTERSECTED.rotation.y;
        var RZ = INTERSECTED.rotation.z;

        for (var x = 0; x < 5; x++) {											//posiciona la figura en angulos 0
            INTERSECTED.rotateX(-INTERSECTED.rotation.x);
            INTERSECTED.rotateY(-INTERSECTED.rotation.y);
            INTERSECTED.rotateZ(-INTERSECTED.rotation.z);
        }

        size = (new THREE.Box3().setFromObject(INTERSECTED)).getSize(); //mide figura tamaño real

        if (size.x < .1) {
            size.x = .1;
        } 									//si el nuevo objetivo es menor a .1 lo redondea a .1
        if (size.y < .1) {
            size.y = .1;
        }
        if (size.z < .1) {
            size.z = .1;
        }

        INTERSECTED.scale.x = Math.round(size.x * 10) / (SX * 10);
        INTERSECTED.scale.y = Math.round(size.y * 10) / (2 * 10);
        INTERSECTED.scale.z = Math.round(size.z * 10) / (SZ * 10);

        boundingBox = new THREE.Box3().setFromObject(INTERSECTED);		//mide figura escalada tamaño real
        size = boundingBox.getSize();
        obj("dim").innerHTML = "Ancho: " + Math.round(size.x * 10) / 10 + " cm &nbsp;&nbsp;Alto: " + Math.round(size.y * 10) / 10 + " cm &nbsp;&nbsp;Profundo: " + Math.round(size.z * 10) / 10 + " cm &nbsp;&nbsp;";

        for (var x = 0; x < 5; x++) {											//regresa figura a angulo original
            INTERSECTED.rotation.x = RX;
            INTERSECTED.rotation.y = RY;
            INTERSECTED.rotation.z = RZ;
        }

    } else if (mode == "R") {
        INTERSECTED.rotation.x = (THREE.Math.degToRad(Math.round(INTERSECTED.rotation.x * 180 / Math.PI)));
        INTERSECTED.rotation.y = (THREE.Math.degToRad(Math.round(INTERSECTED.rotation.y * 180 / Math.PI)));
        INTERSECTED.rotation.z = (THREE.Math.degToRad(Math.round(INTERSECTED.rotation.z * 180 / Math.PI)));
        obj("dim").innerHTML = "X: " + Math.round(INTERSECTED.rotation.x * 180 / Math.PI) + " deg &nbsp;&nbsp;Y: " + Math.round(INTERSECTED.rotation.y * 180 / Math.PI) + " deg &nbsp;&nbsp;Z: " + Math.round(INTERSECTED.rotation.z * 180 / Math.PI) + " deg &nbsp;&nbsp;";
    } else {
        INTERSECTED.position.x = Math.floor(INTERSECTED.position.x * 10) / 10;
        INTERSECTED.position.y = Math.floor(INTERSECTED.position.y * 10) / 10;
        INTERSECTED.position.z = Math.floor(INTERSECTED.position.z * 10) / 10;
        obj("dim").innerHTML = "X: " + INTERSECTED.position.x + " cm &nbsp;&nbsp;Y: " + INTERSECTED.position.y + " cm &nbsp;&nbsp;Z: " + INTERSECTED.position.z + " cm &nbsp;&nbsp;";
    }

    if (mood == 1) { //mete las figuras dentro de la caja si sobrepasan los limites mientras son dimensionadas
        var maxX, maxY, minY, maxZ;
        size = (new THREE.Box3().setFromObject(INTERSECTED)).getSize();
        //10 es la distancia maxima desde el centro
        maxX = 10 - size.x / 2, maxY = 20 - size.y / 2, maxZ = 10 - size.z / 2, minY = size.y / 2;

        if (INTERSECTED.position.x > maxX) {
            INTERSECTED.position.x = maxX;
        }
        if (INTERSECTED.position.x < -maxX) {
            INTERSECTED.position.x = -maxX;
        }
        if (INTERSECTED.position.y > maxY) {
            INTERSECTED.position.y = maxY;
        }
        if (INTERSECTED.position.y < minY) {
            INTERSECTED.position.y = minY;
        }
        if (INTERSECTED.position.z > maxZ) {
            INTERSECTED.position.z = maxZ;
        }
        if (INTERSECTED.position.z < -maxZ) {
            INTERSECTED.position.z = -maxZ;
        }

        INTERSECTED.position.x = Math.floor(INTERSECTED.position.x * 10) / 10;
        INTERSECTED.position.y = Math.floor(INTERSECTED.position.y * 10) / 10;
        INTERSECTED.position.z = Math.floor(INTERSECTED.position.z * 10) / 10;

        //20 es el valor maximo de tamaño
        if (size.x > 20) {
            for (var x = 0; x < 5; x++) {
                INTERSECTED.rotation.y = 0;
                INTERSECTED.rotation.z = 0;
            }
            INTERSECTED.scale.x = Math.round(20 * 10) / (SX * 10);
        }
        if (size.z > 20) {
            for (var x = 0; x < 5; x++) {
                INTERSECTED.rotation.y = 0;
                INTERSECTED.rotation.x = 0;
            }
            INTERSECTED.scale.z = Math.round(20 * 10) / (SZ * 10);
        }
        if (size.y > 20) {
            INTERSECTED.scale.y = Math.round(20 * 10) / (2 * 10);
        }
    }
}

function reDimension() {
    for (var i = 0; i < 5; i++) {
        for (var x = 0; x < figures.length; x++) {
            INTERSECTED = figures[x];
            info();
        }
    }
}

//--------------------------------------------COLORS---------------------------------------------//

function color(tone) {
    if (INTERSECTED) {
        INTERSECTED.material.color.set(palette(tone));
        INTERSECTED = null;
    }
    defaultTone = tone;
    orbit.enabled = true;
    obj('box').style.display = "none";
    obj('colors').style.display = "none";
    obj("home").style.backgroundColor = "#" + palette(defaultTone).toString(16);
    obj("hex").value = "#" + palette(defaultTone).toString(16);
}

function picker() {
    defaultTone = 0;
    obj("home").style.backgroundColor = obj('hex').value;
    if (INTERSECTED) {
        INTERSECTED.material.color.set(obj('hex').value);
    }
}

function palette(tone) {
    switch (tone) {
        //case 0: return +('0x'+obj('hex').value);   //tono propio
        case 0:
            return obj('hex').value;   //tono propio
        case 1:
            return +(obj("c1").getAttribute('fill').replace('#', '0x'));
        case 2:
            return +(obj("c2").getAttribute('fill').replace('#', '0x'));
            ;
        case 3:
            return +(obj("c3").getAttribute('fill').replace('#', '0x'));
            ;
        case 4:
            return +(obj("c4").getAttribute('fill').replace('#', '0x'));
            ;
        case 5:
            return +(obj("c5").getAttribute('fill').replace('#', '0x'));
            ;
        case 6:
            return +(obj("c6").getAttribute('fill').replace('#', '0x'));
            ;
        case 7:
            return +(obj("c7").getAttribute('fill').replace('#', '0x'));
            ;
        case 8:
            return +(obj("c8").getAttribute('fill').replace('#', '0x'));
            ;
    }
}

//--------------------------------------EXPORT FINALS---------------------------------------//

function exportToObj2() {
    scene.remove(gridHelper);
    var exploter = new THREE.OBJExporter();
    var result = exploter.parse(magic);
    scene.add(gridHelper);
    var blob = new Blob([result], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "modelo.obj");
}

function exportASCII2() {
    var exporter = new THREE.STLExporter();
    var result = exporter.parse(magic);
    var blob = new Blob([result], {type: 'text/plain'});
    saveAs(blob, "modelo ascii.stl");
}

function exportBinary2() {
    var exporter = new THREE.STLExporter();
    var result = exporter.parse(magic, {binary: true});
    var blob = new Blob([result], {type: 'application/octet-stream'});
    saveAs(blob, "modelo binario.stl");
}

//--------------------------------------EXPORTERS AND SAVE---------------------------------------//

function exportToObj() {
    deselect();
    scene.remove(gridHelper);
    var exploter = new THREE.OBJExporter();
    var result = exploter.parse(scene);
    scene.add(gridHelper);
    var blob = new Blob([result], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "modelo.obj");
}

function loadObj() {
    var loader = new THREE.OBJLoader();
    loader.load('escenes/plane.obj', function (object) {
        alert("intenta");
        scene.add(object);
        setScale(object, object);
    });
}

function exportASCII() {
    deselect();
    scene.remove(cageHelper);
    var exporter = new THREE.STLExporter();
    var result = exporter.parse(scene);
    var blob = new Blob([result], {type: 'text/plain'});
    saveAs(blob, "modelo ascii.stl");
}

function exportBinary() {
    scene.remove(cageHelper);
    var exporter = new THREE.STLExporter();
    var result = exporter.parse(scene, {binary: true});
    var blob = new Blob([result], {type: 'application/octet-stream'});
    saveAs(blob, "modelo binario.stl");
}

function exportJSON(type) {
    var model;
    if (type == 1) {
        model = $('#model').val();
    } else {
        model = $('#pmodel').val();
    }

    if (model == "") {
        obj("warnS").innerHTML = "*Escribe el nombre de tu modelo";
        return 0;
    }

    deselect();
    scene.remove(gridHelper);
    scene.remove(light);
    scene.remove(lightB);
    scene.remove(lightF);

    // Obtain date in format YYYY-MM-DD
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
    var date = `${year}-${month}-${day}`;

    var sceneJson = JSON.stringify(scene);
    var pack = "id=" + id + "&model=" + model + "&date=" + date + "&file=" + sceneJson;

    $.ajax({
        type: "post",
        url: 'php/upload.php',
        data: pack,
        success: function (data) {
            if (type == 1) {
                obj("warnS").innerHTML = "*El modelo ha sido guardado";
                showList();
            } else {
                obj("psave").style.color = "green";
                obj("psave").innerHTML = "Guardado";
            }
        }
    });

    scene.add(gridHelper);
    scene.add(light);
    scene.add(lightB);
    scene.add(lightF);
}

function resetSave() {
    obj("psave").style.color = "#000000";
    obj("psave").innerHTML = "Guardar";
}

function loadJSON() {
    var pack = "id=" + id + "&model=" + obj("model").value;

    $.ajax({
        type: "post",
        url: 'php/download.php',
        data: pack,
        success: function (data) {
            if (data == 0) {
                obj("warnS").innerHTML = "*El modelo no existe";
            } else {
                var loader = new THREE.ObjectLoader();

                loader.load(data,
                    function (obj) {
                        loadScene(obj.children.length, data);
                    }
                );
                obj("warnS").innerHTML = "*El modelo ha sido cargado";
                showList();
            }
        }
    });
}

function loadScene(pieces, urlroot) {
    var part = 0;
    for (var h = 0; h < pieces; h++) {
        var loader = new THREE.ObjectLoader();
        loader.load(urlroot,
            function (obj) {
                setScale(obj.children[part], obj.children[part]);
                scene.add(obj.children[part]);
                part++;
            }
        );
    }

}

function remove() {
    var model;
    if ($('#model').val() != "") {
        model = $('#model').val();
    } else {
        model = $('#pmodel').val();
    }

    if (model == "") {
        obj("warnS").innerHTML = "*Escribe el nombre de tu modelo";
        return 0;
    }

    var pack = "id=" + id + "&model=" + model;

    $.ajax({
        type: "post",
        url: 'php/remove.php',
        data: pack,
        success: function (data) {
            if (data == 0) {
                obj("warnS").innerHTML = "*El modelo no existe";
            } else {
                obj("warnS").innerHTML = "*El modelo ha sido eliminado";
                showList();
            }
        }
    });

}


//---------------------------------------------EVENTS---------------------------------------------//

function touch(event) {
    if (processing > 0) {
        return 0;
    }
    //evita deseleccion cuando se  hace click sobre ciertos elementos
    if (event.target == obj("hex") || event.target == obj("hex-text") || event.target == obj("colors") || event.target == obj("translate") || event.target == obj("rotate") || event.target == obj("scale")) {
    }

    //oculta elementos cuando se hace click sobre cierto elemento
    else if (event.target == obj('box') || event.target == obj('welcome')) {
        escape();
    }

    //si hay objetos los selecciona mientras no se haya presionado sobre el control transoformacion
    else if (CONTROLED === false) {
        event.preventDefault();

        mouse.x = ((event.targetTouches[0].pageX - renderer.domElement.offsetLeft) / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -((event.targetTouches[0].pageY - renderer.domElement.offsetTop) / renderer.domElement.clientHeight) * 2 + 1;

        scene.remove(gridHelper);											//remueve el grid para que no interfiera
        raycaster.setFromCamera(mouse, camera);							//genera un rayo con la camara y posicion mouse
        var intersects = raycaster.intersectObjects(scene.children);		//obtiene las intersecciones
        scene.add(gridHelper);											//devuelve el grid

        if (intersects.length) {    							//si hay intersecciones
            if (intersects[0].object == cageHelper) {
                if (intersects.length > 2) {
                    intersects[0].object = intersects[1].object;
                }
            } else if (INTERSECTED != intersects[0].object) { 		//y es diferente a lo que este guardado como intersectado
                INTERSECTED = intersects[0].object;								//se guarda la primero que se intersecto
                for (var x = 0; x < figures.length; x++) {
                    if (figures[x] == INTERSECTED) {
                        figures[x].material.transparent = false;
                    } else {
                        figures[x].material.transparent = true;
                        figures[x].material.opacity = 0.4;
                    }
                }
                control.attach(INTERSECTED);
                scene.add(control);
                obj("arrow-controls").style.display = "block";
            } else {
                deselect();
            }								//si la interseccion ya se tenia, se deselecciona
        }
        //else { deselect(); }									//si se hizo click sobre el lienzo se deselecciona
    }
    CONTROLED = false;
}

function select(event) {
    if (processing > 0) {
        return 0;
    }
    //evita deseleccion cuando se  hace click sobre ciertos elementos
    if (event.target == obj("hex") || event.target == obj("hex-text") || event.target == obj("colors") || event.target == obj("translate") || event.target == obj("rotate") || event.target == obj("scale")) {
    }

    //oculta elementos cuando se hace click sobre cierto elemento
    else if (event.target == obj('box') || event.target == obj('welcome')) {
        escape();
    }

    //si hay objetos los selecciona mientras no se haya presionado sobre el control transoformacion
    else if (CONTROLED === false) {
        event.preventDefault();

        mouse.x = ((event.clientX - renderer.domElement.offsetLeft) / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - renderer.domElement.offsetTop) / renderer.domElement.clientHeight) * 2 + 1;

        scene.remove(gridHelper);											//remueve el grid para que no interfiera
        raycaster.setFromCamera(mouse, camera);							//genera un rayo con la camara y la posicion del mouse
        var intersects = raycaster.intersectObjects(scene.children);		//obtiene las intersecciones
        scene.add(gridHelper);											//devuelve el grid

        //Intersecatar algo no depende de que este guardado en figures, solo de sea interceptador por raycaster
        if (intersects.length) {    							//si hay intersecciones
            if (intersects[0].object == cageHelper) {
                if (intersects.length > 2) {
                    intersects[0].object = intersects[1].object;
                }
            } //si es el cage se recorre al siguiente
            else if (INTERSECTED != intersects[0].object) { 		//y es diferente a lo que este guardado como intersectado
                INTERSECTED = intersects[0].object;								//se guarda la primero que se intersecto
                for (var x = 0; x < figures.length; x++) {
                    if (figures[x] == INTERSECTED) {
                        figures[x].material.transparent = false;
                    } else {
                        figures[x].material.transparent = true;
                        figures[x].material.opacity = 0.4;
                    }
                }
                control.attach(INTERSECTED);
                scene.add(control);
                obj("arrow-controls").style.display = "block";
            } else {
                deselect();
            }								//si la interseccion ya se tenia, se deselecciona
        } else {
            deselect();
        }									//si se hizo click sobre el lienzo se deselecciona
    }
    CONTROLED = false;
}

function deselect() {
    for (var x = 0; x < figures.length; x++) {
        figures[x].material.transparent = false;
    }
    control.detach(INTERSECTED);
    scene.remove(control);
    INTERSECTED = null;
    obj("dim").innerHTML = "";
    obj("arrow-controls").style.display = "none";
}

function onWindowResize() {
    var aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.left = 50 * aspect / -2;
    camera.right = 50 * aspect / 2;
    camera.top = 50 / 2;
    camera.bottom = 50 / -2;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
}

function keyboard(event) {
    switch (event.keyCode) {
        case 8:
            erase();
            break; 	//delete
        case 13:
            ok();
            break; 	//return ok
        case 27:
            escape();
            break; 	//ESC deseleccionar
        case 84:
            selectMode(1);
            break;  //T control transladar
        case 82:
            selectMode(2);
            break;  //R control escalar
        case 69:
            selectMode(3);
            break;  //E control escalar
        case 187:
            camera.position.x *= .97;
            camera.position.y *= .97;
            camera.position.z *= .97;
            break; //+ in
        case 189:
            camera.position.x *= 1.03;
            camera.position.y *= 1.03;
            camera.position.z *= 1.03;
            break;  //- out
        //case 187: case 107: control.setSize( control.size + 0.1 ); break; //+	tamaño transform control
        //case 189: case 10: control.setSize( Math.max(control.size - 0.1, 0.1 ) ); break; //- 
    }
}

//--------------------------------------------ACTIONS---------------------------------------------//

function escape() {
    if (processing > 0) {
    } else if (id == 0) {
    } else if (mood == 0) {
    } else {
        if (INTERSECTED) {
            deselect();
        }
        if (obj("info").style.visibility == "visible") {
            obj("info").style.visibility = "hidden";
            obj("h-info").style.color = "#777777";
            obj('h-info').style.borderColor = "#777777";
            obj("h-user").style.color = "#777777";
            obj('h-user').style.borderColor = "#777777";
            OS = 0;
        }
        obj('welcome').style.display = "none";
        obj("canvas-container").style.marginTop = "3px";
        obj('box').style.display = "none";
        obj('prisms').style.display = "none";
        obj('views').style.display = "none";
        obj('colors').style.display = "none";
        obj('downloads').style.display = "none";
        obj('clean').style.display = "none";
        orbit.enabled = true;
        if ($('#model').css('display') == 'inline') {
            obj("model").style.display = "none";
        }
    }
}

function ok() {
    if (document.activeElement.id == "lcode" || document.activeElement.id == "lmail") {
        login();
    } else if (document.activeElement.id == "rname" || document.activeElement.id == "rmail" || document.activeElement.id == "rcodeA" || document.activeElement.id == "rcodeB") {
        signup();
    } else if ((obj('prisms').style.display == "block")) {
        if (2 < obj("sides").value && obj("sides").value < 21) {
            orbit.enabled = true;
            obj('box').style.display = "none";
            obj('prisms').style.display = "none";
            addPrism();
        }
    }
}

function space(zone) {
    if (zone < 3) {
        camera = persp;
        if (zone == 1) {
            camera.position.set(18, 7, 18); 	//para evitar errores  la posicion de define antes de crear el control
            orbit = new THREE.OrbitControls(camera);
            camera.lookAt(0, 2, 0);
            orbit.target = new THREE.Vector3(0, 2, 0);
        } else {
            camera.position.set(45, 33, 45);
            orbit = new THREE.OrbitControls(camera);
            camera.lookAt(0, 8, 0);
            orbit.target = new THREE.Vector3(0, 8, 0);
        }
    } else {
        camera = ortho;
        camera.position.set(0, 50, 0);
        orbit = new THREE.OrbitControls(camera);
        camera.lookAt(0, 0, 0);
        orbit.target = new THREE.Vector3(0, 0, 0);
    }
    control = new THREE.TransformControls(camera, renderer.domElement);
    control.addEventListener('mouseDown', function () {
        orbit.enabled = false;
        CONTROLED = true;
    });
    //si se hace click sobre el control de transformacion se desactiva el orbit, mientas controled sea true (osea que este siendo controlada una pieza) evita que la funcion de seleccion seleccione una nueva geometria y para que la pieza seleccionada no se deseleccione (en este caso mientas se este presionando sobre el control de transformacion se mantendra como true)
    control.addEventListener('mouseUp', function () {
        orbit.enabled = true;
    });
    obj('views').style.display = "none";	//forza una accion minimo antes de otro cambio de espacio para no 'quebrar' orbit
    obj('box').style.display = "none";		//y oculta views si esta activo al seleccionar una vista
}

function duplicate() {
    if (processing > 0) {
        return 0;
    }
    if (INTERSECTED) {
        var newy = INTERSECTED.clone();
        newy.material = new THREE.MeshStandardMaterial({color: palette(defaultTone)});
        scene.add(newy);
        setScale(newy, newy);
    }
}

function erase() {
    if (processing > 0 || obj('prisms').style.display == "block") {
        return 0;
    }
    if (INTERSECTED) {
        for (var x = 0; x < figures.length; x++) {
            if (INTERSECTED == figures[x]) {
                figures.splice(x, 1);
                SXs.splice(x, 1);
                SZs.splice(x, 1);
            }
        }
        INTERSECTED.geometry.dispose();	//eliminar la  geometria: no es necesario pero a la larga mejora eficiencia
        INTERSECTED.material.dispose();	//eliminar el  material: no es necesario pero a la larga mejora eficiencia
        scene.remove(INTERSECTED);
        deselect();
    } else {
        showClean();
    }
}

function cleanScene() {
    for (var x = 0, n = figures.length; x < n; x++) {
        var figurita = figures.pop();
        scene.remove(figurita);
        figurita.geometry.dispose();
        figurita.material.dispose();
        SXs.pop;
        SZs.pop;
    }
    escape();
}

function hideScene() {
    for (var x = 0, n = figures.length; x < n; x++) {
        scene.remove(figures[x]);
    }
}

function showScene() {
    for (var x = 0, n = figures.length; x < n; x++) {
        scene.add(figures[x]);
    }
}

function scanSolid() {
    scanning = 1;
    sheetHelper.position.y = 20;
    scene.add(sheetHelper);
    travel = setInterval(trip, 5);
}

function trip() {
    sheetHelper.position.y -= 0.1;

    var more = 1;
    var sheetcsg = THREE.CSG.fromMesh(sheetHelper);
    for (var x = 0, n = figures.length; x < n; x++) {
        var solidcsg = THREE.CSG.fromMesh(figures[x]);
        var result = solidcsg.intersect(sheetcsg);
        if (result.toString().length > 11 || letme == 1) {
            if (letme == 0) {
                letme = 1;
                jointCSG = result;
                ally = result;
                jointThree = THREE.CSG.toMesh(jointCSG, new THREE.MeshStandardMaterial({color: palette(7)}));
            } else if (hollow < -5) {
                jointCSG = sheetcsg;
                ally = ally.union(jointCSG);
                jointThree = THREE.CSG.toMesh(jointCSG, new THREE.MeshStandardMaterial({color: palette(7)}));
            } else {
                if (more == 1) {
                    hollow -= 0.1;
                    more = 0;
                }
                jointCSG = result.union(THREE.CSG.fromMesh(jointThree));
                ally = ally.union(jointCSG);
                jointThree = THREE.CSG.toMesh(jointCSG, new THREE.MeshStandardMaterial({color: palette(7)}));
            }
        }
    }

    //var mesh = THREE.CSG.toMesh(jointCSG, new THREE.MeshStandardMaterial( { color: palette(8)  } ));
    //scene.add(mesh);
    jointThree.position.y -= 0.1;
    if (sheetHelper.position.y < 0) {
        hideScene();
        scene.remove(sheetHelper);
        clearInterval(travel);
        joinAll();
    }
}

function joinAll() {
    magic = THREE.CSG.toMesh(ally, new THREE.MeshStandardMaterial({color: palette(7)}));
    scene.add(magic);
    //cleanScene(); //se requiere para eliminar la pieza
    ally = null;    //parece ser que sobrescribir la variable, sigue  guardando datos anteriores, fui forzado 
    letme = 0;      //a ponerla en null, y aunque no tenga relacion hasta que no lo hice no pude cambiar el valor de letme
    hollow = 0;
    scanning = 0;
    obj("pt").innerHTML = '<div id="ptt"><span id="assist">Paso 2:<br>Validar geometrias del dibujo</span><br><br>CNC Artesano realiza la operacion de corte desde la parte superior hacia la parte inferior, tomando como limite la primer superficie que intersecte la herramienta de corte, este limite no podra ser mayor a 5cm de profundidad.<br><br>Si existen espacios vacios despues del primer limite estos no podran ser cortados. A continuacion el asistente de maquinado generara un solido que contenga las geometrias del dibujo validas.<br><br>Listo puedes continuar!</div>'
}

//-----------------------------------------TOOLS INTERFACE---------------------------------------//

function selectMode(m) {
    CONTROLED = true;	//evita que al hacer click  en la herramienta se desactive
    obj("translate").style.opacity = .4;
    obj("rotate").style.opacity = .4;
    obj("scale").style.opacity = .4;
    if (m == 1) {
        mode = "T";
        control.setMode("translate");
        obj("translate").style.opacity = 1;
    } else if (m == 2) {
        mode = "R";
        control.setMode("rotate");
        obj("rotate").style.opacity = 1;
    } else {
        mode = "E";
        control.setMode("scale");
        obj("scale").style.opacity = 1;
    }
}

function showPrism() {
    if (processing > 0) {
        return 0;
    }
    orbit.enabled = false;
    obj('box').style.display = "block";
    obj('prisms').style.display = "block";
    obj('sides').focus();
    obj('sides').setSelectionRange(1, 1);
}

function showViews() {
    if (processing > 0) {
        return 0;
    }
    orbit.enabled = false;					//se desactiva orbit para que no haya movimiento sobre el slider views
    obj('box').style.display = "block";		//y se desactiva orbit antes de cambiar de espacio para no generar errores
    obj('views').style.display = "block";
}

function showColor() {
    if (processing > 0) {
        return 0;
    }
    if (INTERSECTED) {					//si hay interseccion
        CONTROLED = true;				//evita que se deseleccione cuando se presiona sobre colores
        control.detach(INTERSECTED);	//pero quita el control
        scene.remove(control);		//y lo elimina de la escena
    }
    orbit.enabled = false;
    obj('box').style.display = "block";
    obj('colors').style.display = "block";
    obj('hex').setSelectionRange(6, 6);
}

function showClean() {
    obj('box').style.display = "block";
    obj("clean").style.display = "block";
    obj("cc").style.backgroundColor = "#" + palette(defaultTone).toString(16);
}

function showDownload() {
    if (processing > 0) {
        return 0;
    }
    orbit.enabled = false;
    obj('box').style.display = "block";
    obj('downloads').style.display = "block";
    var by = document.getElementsByClassName("by");
    for (var i = 0, len = by.length; i < len; i++) {
        by[i].style.backgroundColor = "#" + palette(defaultTone).toString(16);
    }
    resetSave();
    obj("pmodel").value = "";
}

function process() {
    if (scanning == 1) {
        return 0;
    }
    if (processing == 0) {
        escape();
        obj("pt").innerHTML = originalpt;
        obj('process').style.display = "block";
        obj("pc").style.backgroundColor = "#" + palette(defaultTone).toString(16);
        obj("ps").style.backgroundColor = "#" + palette(defaultTone).toString(16);
        if ((INTERSECTED)) {
            deselect();
        }
        scene.add(cageHelper);
        orbit.enabled = false;					//se desactiva orbit antes de cambiar de espacio para no generar errores
        space(2);
        processing = 1;
    } else if (processing == 1) {
        obj("pt").innerHTML = '<div id="ptt"><span id="assist">Paso 2:<br>Validar geometrias del dibujo</span><br><br>CNC Artesano realiza la operacion de corte desde la parte superior hacia la parte inferior, tomando como limite la primer superficie que intersecte la herramienta de corte, este limite no podra ser mayor a 5cm de profundidad.<br><br>Si existen espacios vacios despues del primer limite estos no podran ser cortados. A continuacion el asistente de maquinado generara un solido que contenga las geometrias del dibujo validas.<br><br>Espere...</div>'
        selectMood(1);
        scene.remove(cageHelper);
        scanSolid();
        processing = 2;
    } else {
        obj("pt").innerHTML = '<div id="ptt"><span id="assist">Paso 3:<br>Cargar dibujo en la aplicacion de maquinado</span><br><br>Tu modelo esta listo, exportalo y cargalo en la aplicacion de maquinado:<br><br><div onclick="exportASCII2()">STL Ascii</div><br><div onclick="exportBinary2()">STL binary</div><br><div onclick="exportToObj2()">OBJ</div></div>'
    }
}

function cancel() {
    if (scanning == 1) {
        return 0;
    }
    if (processing == 1) {
        scene.remove(cageHelper);
    }
    if (processing == 2) {
        showScene();
        scene.remove(magic);
    }

    orbit.enabled = false; 				//se desactiva orbit antes de cambiar de espacio para no generar errores
    space(1);
    obj('process').style.display = "none";
    processing = 0;

}

function sacu() {
    obj("acu").style.visibility = "visible";
}

function hacu() {
    obj("acu").style.visibility = "hidden";
}

function sacy() {
    obj("acy").style.visibility = "visible";
}

function hacy() {
    obj("acy").style.visibility = "hidden";
}

function saco() {
    obj("aco").style.visibility = "visible";
}

function haco() {
    obj("aco").style.visibility = "hidden";
}

function sapr() {
    obj("apr").style.visibility = "visible";
}

function hapr() {
    obj("apr").style.visibility = "hidden";
}

function sapy() {
    obj("apy").style.visibility = "visible";
}

function hapy() {
    obj("apy").style.visibility = "hidden";
}

function sasp() {
    obj("asp").style.visibility = "visible";
}

function hasp() {
    obj("asp").style.visibility = "hidden";
}

//-----------------------------------------HOME INTERFACE----------------------------------------//

function showHome() {
    if (processing > 0) {
        return 0;
    }
    orbit.enabled = false;			//se tiene  que desactivar orbit para poder seleccionar otros elementos como un form input
    obj('box').style.display = "block";
    obj("home").style.display = "block";
    obj("canvas-container").style.marginTop = "50px";
}

function selectMood(m) {
    if (id == 0) {
        return 0;
    }
    if (mood == 0) {
        obj("arrow").style.display = "none";
        obj("welcome").innerHTML += "<br><br>¡COMIENZA YA, PRESIONA EN CUALQUIER LADO!";
        camera.position.set(18, 7, 18);
        camera.lookAt(0, 2, 0);
    }

    mood = m;
    if (mood == 1) {
        obj('h-cnc').style.color = "#F0F8FF";
        obj('h-cnc').style.borderColor = "#F0F8FF";
        obj('h-free').style.color = "#777777";
        obj('h-free').style.borderColor = "#777777";
        reDimension();
    } else {
        obj('h-cnc').style.color = "#777777";
        obj('h-cnc').style.borderColor = "#777777";
        obj('h-free').style.color = "#F0F8FF";
        obj('h-free').style.borderColor = "#F0F8FF";
    }
}

function showInfo(IS) {
    if (id == 0) {
        return 0;
    }
    if (IS == OS) {
        obj("canvas-container").style.marginTop = "50px";
        obj("info").style.visibility = "hidden";
        obj("h-user").style.color = "#777777";
        obj('h-user').style.borderColor = "#777777";
        obj("h-info").style.color = "#777777";
        obj('h-info').style.borderColor = "#777777";
        OS = 0;
    } else {
        obj("canvas-container").style.marginTop = "500px";
        obj("info").style.visibility = "visible";

        if (IS == 1) {
            obj("h-user").style.color = "#F0F8FF";
            obj('h-user').style.borderColor = "#F0F8FF";
            obj("h-info").style.color = "#777777";
            obj('h-info').style.borderColor = "#777777";
            obj("menu1").innerHTML = 'Modeloteca';
            obj("menu2").innerHTML = 'Mi Cuenta';
            obj("menu3").innerHTML = 'Cerrar';
            OS = 1;
        } else {
            obj("h-user").style.color = "#777777";
            obj('h-user').style.borderColor = "#777777";
            obj("h-info").style.color = "#F0F8FF";
            obj('h-info').style.borderColor = "#F0F8FF";
            obj("menu1").innerHTML = 'CNC Artesano';
            obj("menu2").innerHTML = 'Artesano Sketch';
            obj("menu3").innerHTML = 'Herramientas';
            OS = 2;
        }
        menu1();
    }
}

function showList() {
    var pack = "id=" + id;
    $.ajax({
        type: "post",
        url: 'php/uplist.php',
        data: pack,
        success: function (data) {
            if (data == 0) {
                obj("list").innerHTML = "No tienes modelos guardados";
            } else {
                var list = "Modelos guardados:<br><br><table id=\"models\">";
                var quantity = data.substring(0, data.indexOf(","));
                var draw = "";
                for (var i = 0; i < quantity; i++) {
                    if (i == quantity - 1) {
                        draw = data.substring(data.indexOf(i.toString() + "=") + (i.toString() + "=").length, data.length);
                    } else {
                        draw = data.substring(data.indexOf(i.toString() + "=") + (i.toString() + "=").length, data.indexOf((i + 1).toString() + "="));
                    }
                    var date = draw.substring(0, 10);
                    var name = draw.substring(10, draw.lenght);
                    list += "<tr><td style='width: 80px;'>" + date + "</td><td style='padding-left: 5px; text-align: left;'><div onclick='draw(\"" + name + "\")'>" + name + "</div></td></tr>";
                }
                obj("list").innerHTML = list + "</table>";
            }
        }
    });
}

function draw(draw) {
    obj("model").value = draw;
}

function resetMenu(menu) {
    obj("menu1").style.borderBottom = "0px";
    obj("menu2").style.borderBottom = "0px";
    obj("menu3").style.borderBottom = "0px";
    obj(menu).style.borderBottom = "2px solid #F0F8FF";
}

function menu1() {
    resetMenu("menu1");

    if (OS == 1) {
        obj("display").innerHTML = 'Modeloteca<br><br>Guardar modelo<br><input type="text" id="model" maxlength="28" value=""><br><button id="save" onclick="exportJSON(1)">Guardar</button><button id="delete" onclick="remove()">Borrar</button><button id="load" onclick="loadJSON()">Cargar</button><br><span id="warnS"></span><br><br><div id="list"></div>';
        showList();
    } else {
        obj("display").innerHTML = 'CNC Artesano<br><br>Es un proyecto innovador para la realizacion de piezas en madera, el proyecto incluye el CNC Artesano y la plataforma de diseño Artesano Sketch online enfocada a usuarios con o sin experiencia en el maquinado de piezas ni conocimientos previos de dibujo por computadora 3D.<br><br>CNC artesano es una maquina de corte de bloques de madera, la herramienta de corte se mueve a traves de tres ejes:  ancho, largo y alto y permite cortar sobre 5 caras del bloque, permitiendo realizar diseños sobre los bloques a una profunidad definida por la herramienta.<br><br>Las aplicaciones de este proyecto abarca desde diseños personalizados sobre la superficie del bloque hasta la fabricacion de piezas u objetos mas complejos a partir del ensamblado de piezas sencillas. Este proyecto va dirigido especialmente a escuelas para niños, personas que quieran emprender sus propios proyectos, o incluso en pequeños talleres.<br><br>Especificaciones del CNC:<br><span id="tab">-Maquinado sobre piezas de madera<br>-Dimensiones de trabajo: 30cm x 30cm x 20cm</span>';
    }
}

function menu2() {
    resetMenu("menu2");

    if (OS == 1) {
        obj("display").innerHTML = 'Mi Cuenta<br><br>Nombre<br><input type="text" id="uname" maxlength="30" value=""><br><br>Email<br><input type="text" id="umail" maxlength="30" value=""><br><span id="warnE"></span><br>Cambiar contraseña<br><input type="password" id="unewcode" maxlength="30" value="" placeholder="nueva contraseña"><br><input type="password" id="ucode" maxlength="30" value="" placeholder="contraseña anterior"><br><span id="warnN"></span><br><br><button id="update" onclick="update()">Actualizar</button><br><span id="warnU"></span>';
        obj("uname").value = user;
        obj("umail").value = email;
        //<br>Tema<br><svg width="275px" height="30px"><circle id="e1" onClick="e(1)" cx="15"  cy="15" r="14" fill="#7838EB" /><circle id="e2" onClick="e(2)" cx="50"  cy="15" r="14" fill="#2E67EA" /><circle id="e3" onClick="e(3)" cx="85"  cy="15" r="14" fill="#2de3e3" /><circle id="e4" onClick="e(4)" cx="120" cy="15" r="14" fill="#57d645" /><circle id="e5" onClick="e(5)" cx="155" cy="15" r="14" fill="#ffe13b" /><circle id="e6" onClick="e(6)" cx="190" cy="15" r="14" fill="#e57514" /><circle id="e7" onClick="e(7)" cx="225" cy="15" r="14" fill="#DD124E" /><circle id="e8" onClick="e(8)" cx="260" cy="15" r="14" fill="#d843a4" /></svg>
    } else {
        obj("display").innerHTML = 'Artesano Sketch<br><br>Es una plataforma de diseño  online para dibujar piezas en tercera dimension, para utilizarla no requieres conocimientos previos de dibujo ya que para construir un modelo basta con agregar piezas y moverlas a la posicion que  quieras.<br><br>Mediante Artesano Sketch podras dibujar modelos con la posibilidad de traerlos al mundo real con CNC Artesano, nosotros te guiaremos en cada paso del proceso. Ademas puedes crear tu perfil para guardar tus proyectos o descargarlos en archivos .STL u .OBJ<br><br>Proceso de modelado para CNC artesano:<br><span id="tab">1. Selecciona el modo de diseño CNC. Este modo te permitira dibujar respetando las dimensiones de trabajo.<br><br>2. Agrega geometrias, muevelas, rotalas o escalas al tamaño deseado para crear tu modelo.<br><br>3. Haz clic en siguiente, aqui veras las dimensiones finales de tu diseño.<br><br>4.Ingresa el tamaño de tu bloque, si tienes un bloque menor tu modelo sera escalado.<br><br>5. Se generara 5 archivo .STL u .OBJ uno por cada lado del bloque. Una vez que los descargues estaras listo para maquinar tu pieza en CNC Artesano.</span><br><br>';
    }
}

function menu3() {
    resetMenu("menu3");

    if (OS == 1) {
        obj("display").innerHTML = 'Cerrar Session<br><br>Los dibujos que aun no hayas guardado se perderan, ¿deseas continuar?<br><br><button id="close" onclick="finish()">Cerrar sesion</button>';
    } else {
        obj("display").innerHTML = '<div id="s1" class="s"><img src="resources/home.png"><span>Abre la barra  de inicio.</span></div><div id="s2" class="s"><img src="resources/view.png"><span>Cambia a vista est&aacute;ndar, completa o superior.</span></div><div id="s3" class="s"><img src="resources/color.png"><span>Cambia el color por defecto, si tienes una figura seleccionada tambien cambiara su color.</span></div><div id="s4" class="s"><img src="resources/clone.png"><span>Realiza una copia de  la  figura seleccionada.</span></div><div id="s5" class="s"><img src="resources/trash.png"><span>Elimina la figura seleccionada (delete).</span></div><div id="s6" class="s"><img src="resources/download.png"><span>Opciones de descarga.</span></div>';
    }
}

//--------------------------------------------USUARIOS---------------------------------------------//

function login() {
    var lemail = obj("lmail").value;
    var lcode = obj("lcode").value;

    if (lemail == "" || lcode == "") {
        obj("warnI").innerHTML = "*Ingresa tu usuario y contraseña";
        return 0;
    }
    var pack = "email=" + lemail + "&code=" + lcode;

    $.ajax({
        type: "post",
        url: 'php/login.php',
        data: pack,
        success: function (data) {
            if (data == 0) {
                obj("warnI").innerHTML = "*Usuario o contraseña incorrectos";
            } else {
                start(data);
            }
        }
    });
}

function signup() {
    var error = 0;
    var rname = obj("rname").value;
    var remail = obj("rmail").value;
    var rcodeA = obj("rcodeA").value;
    var rcodeB = obj("rcodeB").value;

    if (rname == "" || remail == "" || rcodeA == "" || rcodeB == "") {
        obj("warnR").innerHTML = "*Ingresa todos los datos";
        error = 1;
    } else {
        if (rcodeA != rcodeB) {
            obj("warnR").innerHTML = " *Tu constraseña no coincide";
            error = 1;
        } else {
            obj("warnR").innerHTML = "";
        }
    }
    if (!remail.includes("@")) {
        obj("warnM").innerHTML = "*Ingresa un correo valido";
        error = 1;
    } else {
        obj("warnM").innerHTML = "";
    }
    if (error == 1) {
        return 0;
    }

    var pack = "name=" + rname + "&email=" + remail + "&code=" + rcodeA;

    $.ajax({
        type: "post",
        url: 'php/signup.php',
        data: pack,
        success: function (data) {
            if (data == 0) {
                obj("warnM").innerHTML = "*Este correo ya esta registrado";
            } else {
                start(data);
            }
        }
    });
}

function start(data) {
    obj("start").style.display = "none";
    obj("welcome").style.display = "block";
    obj("arrow").style.display = "block";
    user = data.substring(5, data.indexOf("mail="));
    email = data.substring(data.indexOf("mail=") + 5, data.indexOf("code="));
    code = data.substring(data.indexOf("code=") + 5, data.indexOf("id="));
    id = data.substring(data.indexOf("id=") + 3, data.length);
    selectMood(1);
    escape();
}

function update() {
    var error = 0;
    var uname = obj("uname").value;
    var umail = obj("umail").value;
    var ucode = obj("ucode").value;
    var unewcode = obj("unewcode").value;

    if (uname == "" || umail == "" || ucode == "" || unewcode == "") {
        obj("warnU").innerHTML = "*Ingresa todos los datos";
        error = 1;
    } else {
        obj("warnU").innerHTML = "";
    }
    if (ucode == "") {
        obj("warnN").innerHTML = "";
    } else if (ucode != code) {
        obj("warnN").innerHTML = " *Tu contraseña es incorrecta";
        error = 1;
    } else {
        obj("warnN").innerHTML = "";
    }
    if (!umail.includes("@")) {
        obj("warnE").innerHTML = "*Ingresa un correo valido";
        error = 1;
    } else {
        obj("warnE").innerHTML = "";
    }
    if (error == 1) {
        return 0;
    }

    var pack = "name=" + uname + "&email=" + umail + "&code=" + unewcode + "&id=" + id;

    $.ajax({
        type: "post",
        url: 'php/update.php',
        data: pack,
        success: function (data) {
            user = obj("uname").value;
            email = obj("umail").value;
            code = obj("unewcode").value;
            obj("unewcode").value = "";
            obj("ucode").value = "";
            obj("warnU").innerHTML = "*Datos actualizados correctamente";
        }
    });
}

function finish() {
    window.location.assign("https://localhost:8080")
}


//--------------------------------------------AXULIARES---------------------------------------------//

function printScales() {
    var text = "";
    for (var x = 0; x < figures.length; x++) {
        text += "SX " + SXs[x] + " SZ " + SZs[x] + "\n";
    }
    alert(text);
}

function printPosition(n) {
    alert("x " + figures[n].position.x + " y " + figures[n].position.y + " z " + figures[n].position.z);
}
