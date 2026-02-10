import * as THREE from "three";

class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}
export class LRUCache {
    constructor(maxSize) {
        this.maxSize = maxSize;
        this.cache = {};
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    has(key) {
        return Object.prototype.hasOwnProperty.call(this.cache, key);
    }

    get(key) {
        const node = this.cache[key];
        if (!node) return null;
        this._moveToFront(node);
        return node.value;
    }

    set(key, value) {
        let node = this.cache[key];
        if (node) {
            node.value = value;
            this._moveToFront(node);
        } else {
            node = new Node(key, value);
            this.cache[key] = node;
            this._addToFront(node);
            this.size++;
            if (this.size > this.maxSize) {
                this._removeLeastRecent();
            }
        }
    }

    delete(key) {
        const node = this.cache[key];
        if (!node) return false;
        this._removeNode(node);
        delete this.cache[key];
        this.size--;
        return true;
    }

    clear() {
        for (const key in this.cache) {
            const node = this.cache[key];
            if (node.value instanceof THREE.Texture) {
                node.value.dispose();
            }
            delete this.cache[key];
        }
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    // New .entries method to mimic Map.prototype.entries
    *entries() {
        for (const key in this.cache) {
            if (this.has(key)) {
                yield [key, this.cache[key].value];
            }
        }
    }

    _moveToFront(node) {
        if (node === this.head) return;
        this._removeNode(node);
        this._addToFront(node);
    }

    _addToFront(node) {
        if (!this.head) {
            this.head = this.tail = node;
        } else {
            node.next = this.head;
            this.head.prev = node;
            this.head = node;
        }
    }

    _removeNode(node) {
        if (node.prev) {
            node.prev.next = node.next;
        } else {
            this.head = node.next;
        }
        if (node.next) {
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev;
        }
    }

    _removeLeastRecent() {
        if (!this.tail) return;
        const { key, value } = this.tail;
        if (value instanceof THREE.Texture) {
            value.dispose();
        }
        delete this.cache[key];
        this._removeNode(this.tail);
        this.size--;
    }
}


// Initialize texture cache with max 100 textures
const textureCache = new LRUCache(25);

// Load texture with cache
export function loadTexture(url, onLoad = () => {}, onError = (err) => console.error(`Error loading texture ${url}:`, err)) {

    // console.log('load tex ' + url)

    // console.log(window.gl)

    const cachedTexture = textureCache.get(url);
    if (cachedTexture) {
        onLoad(cachedTexture);
        return cachedTexture;
    }

    const loader = new THREE.TextureLoader();
    const texture = loader.load(url, (tex) => {
        textureCache.set(url, tex);
        onLoad(tex);
    }, undefined, onError);

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.encoding =  THREE.sRGBEncoding

    return texture;
}

export function clearTextureCache() {
    textureCache.clear();
}


export const loadTexturePromise = (url) =>
    new Promise((resolve, reject) => {
        loadTexture(url, (texture) => {
            resolve(texture);
        }, undefined, (error) => {
            reject(error);
        });
    });


export function bakeTexture(name, {

                                uniforms,
                                materialRef, // Optional: Reference to a material to apply the texture
                                resolution = 1024,
                                // minFilter = THREE.LinearMipmapLinearFilter,
                                // magFilter = THREE.NearestFilter,
                                minFilter = THREE.LinearMipmapLinearFilter,
                                magFilter = THREE.LinearFilter,
                                anisotropy = 16,
                                wrapS = THREE.RepeatWrapping,
                                wrapT = THREE.RepeatWrapping,
                                encoding = THREE.sRGBEncoding,
                                format = THREE.RGBAFormat,
                                generateMipmaps = true,
                                frag = `

      varying vec2 vUv;

      void main() {
        vec3 color = vec3(1.0, 0.5, 0.0);

        gl_FragColor = vec4(color, 1.);
      }
                                    `,
                                vert = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `
                            } = {}, gl, camera) {

    const cachedTexture = textureCache.get(name);
    if (cachedTexture) {
        return cachedTexture;
    }


    const renderTarget = new THREE.WebGLRenderTarget(resolution, resolution, {
        minFilter: minFilter,
        magFilter: magFilter,
        format: THREE.RGBAFormat,
        generateMipmaps: true,
        anisotropy: anisotropy || gl.capabilities.getMaxAnisotropy(),
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        encoding: THREE.sRGBEncoding,
    })

    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: vert,
        fragmentShader: frag
    })

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        shaderMaterial
    )

    // todo MAY NEED TO GET CONTROLS HERE TO RESET BACK TO WHAT IT WAS
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 0


    gl.setRenderTarget(renderTarget);
    gl.render(plane, camera);
    gl.generateMipmaps = true;
    renderTarget.texture.generateMipmaps = true;
    gl.setRenderTarget(null);
    const texture = renderTarget.texture;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    texture.minFilter = minFilter;
    texture.magFilter = magFilter;
    texture.encoding = THREE.sRGBEncoding;
    texture.premultiplyAlpha = false;
    texture.format = THREE.RGBAFormat
    texture.anisotropy = anisotropy || gl.capabilities.getMaxAnisotropy()
    texture.needsUpdate = true;

    // console.log(texture)

    textureCache.set(name, texture)

    // Clean up
    // renderTarget.dispose();
    // shaderMaterial.dispose();
    // plane.geometry.dispose();

    return texture;
}
