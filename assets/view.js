import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';
import { AlvaARConnectorTHREE } from './alva_ar_three.js'
import { OBJLoader } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/OBJLoader.js";

class ARCamView
{
    constructor( container, width, height, x = 0, y = 0, z = -10, scale = 1.0, object = "A_10.obj", texture=null)
    {
        this.applyPose = AlvaARConnectorTHREE.Initialize( THREE );

        this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
        this.renderer.setClearColor( 0, 0 );
        this.renderer.setSize( width, height );
        this.renderer.setPixelRatio( window.devicePixelRatio );

        this.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
        this.camera.rotation.reorder( 'YXZ' );
        this.camera.updateProjectionMatrix();
        var that=this
        const loader = new OBJLoader();
        loader.load(object, function (obj) {
            const model = obj;
            
            // Assuming the loaded model contains only one mesh
            model.children.forEach(mesh => {
                const geometry = mesh.geometry;
                console.log(geometry)
                
                // Create a new mesh using the extracted geometry
                if (texture!==null) {
                    var material = new THREE.MeshMatcapMaterial({
                        matcap: new THREE.TextureLoader().load(texture)
                    });
                } else {
                    var material=new THREE.MeshNormalMaterial( { flatShading: true } )
                }
                const newMesh = new THREE.Mesh(geometry, material);
                that.object = newMesh
                that.object.scale.set( scale, scale, scale );
                that.object.position.set( x, y, z );
                that.object.visible = false;
                that.scene.add( that.object );
            });;
            
            // Extract geometry from the loaded mesh
            
            
            // Optionally, you can set the position, rotation, and scale of the new mesh
            // newMesh.position.set(x, y, z);
            // newMesh.rotation.set(rx, ry, rz);
            // newMesh.scale.set(sx, sy, sz);
            
            // Add the new mesh to your scene
            // that.object = newMesh
        }, undefined, function (error) {
            console.error(error);
        });

        this.object = new THREE.Mesh( new THREE.IcosahedronGeometry( 1, 0 ), new THREE.MeshNormalMaterial( { flatShading: true } ) );
        this.object.scale.set( scale, scale, scale );
        this.object.position.set( x, y, z );
        this.object.visible = false;

        this.scene = new THREE.Scene();
        this.scene.add( new THREE.AmbientLight( 0x808080 ) );
        this.scene.add( new THREE.HemisphereLight( 0x404040, 0xf0f0f0, 1 ) );
        this.scene.add( this.camera );

        container.appendChild( this.renderer.domElement );

        const render = () =>
        {
            requestAnimationFrame( render.bind( this ) );

            this.renderer.render( this.scene, this.camera );
        }

        render();
    }

    updateCameraPose( pose )
    {
        this.applyPose( pose, this.camera.quaternion, this.camera.position );

        this.object.visible = true;
    }

    lostCamera()
    {
        this.object.visible = false;
    }
}

export { ARCamView }