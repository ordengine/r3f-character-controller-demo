//
// use this commented version of the vite config to build for normal web:
//
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import { visualizer } from 'rollup-plugin-visualizer'

// export default defineConfig({
//     plugins: [
//         react(),
//         visualizer({ open: true }),
//     ],
//     build: {
//         rollupOptions: {
//             external: [
//                 "useCollider",
//                 "ecs",
//                 "world-tools-1",
//                 "shaderNoiseFunctions",
//                 "gltfAndDraco",
//                 "vrm-utils",
//                 "three",
//                 'react',
//                 'react-dom/client',
//                 '@react-three/fiber',
//                 'shaderNoiseFunctions', 'bitmon', 'bitmapOCI', 'boxelGeometry', 'boxels-shader',
//                     'GridFloor', 'useCollider', 'three', 'react', 'react-dom', 'react-dom/client',
//                     'react/jsx-runtime', '@use-gesture/react', '@react-three/fiber', '@react-three/drei',
//                     '@react-three/postprocessing', '@react-three/cannon', '@react-three/a11y',
//                     '@react-three/csg', 'three-custom-shader-material', 'leva', 'randomish',
//                     'material-composer', 'material-composer-r3f', 'shader-composer',
//                     'vfx-composer', 'vfx-composer-r3f', '@react-spring/three', '@react spring/web',
//                     'statery', 'maath', 'r3f-perf', 'suspend-react', 'miniplex', 'miniplex-react',
//                     'simplex-noise', 'alea', 'FBXLoader', 'three-mesh-bvh', '@pixiv/three-vrm'
//
//             ],
//             output: {
//                 paths: {
//                     // "useCollider": "https://ordinals.com/content/a2fc9311fabf1243566aaeb4f1c7bcc62b72849b82fd358ed2cc00a61a582c7di0",
//                     // "ecs": "https://ordinals.com/content/eccced167a28a837669318b8b3446cc7570d42fcb16f973981504a25b947fefbi0",
//                     // "world-tools-1": "https://ordinals.com/content/609dacfa9f257635b4f25a6196a4cbed59701462fa27925bf7554d24bebeeeb9i0",
//                     // "shaderNoiseFunctions": "https://ordinals.com/content/f4207b8dd437c7ae421756397d1b5022a0caa6b7b4908cb0f174587d0da69625i0",
//                     // "gltfAndDraco": "https://ordinals.com/content/d3d336842ef829556f1c76f12e6ed13e272fe0274f29bd1dfc46e2112304d3ffi0",
//                     // "vrm-utils": "https://ordinals.com/content/609b9d7e45010b9c4fe894089d7de52bf69134b39a42d073839aed5c2081f6afi0",
//                     // react: `https://esm.sh/react@19`,
//                     // 'react-dom/client': `https://esm.sh/react-dom@19/client`,
//                 },
//             },
//         },
//     },
// })


//
// ordinal inscription builder:
//

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import glsl from 'vite-plugin-glsl';
import { promises as fs } from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import packageJson from './package.json';
import { transform } from '@babel/core';
import babelPresetReact from '@babel/preset-react';
import babelPresetTS from '@babel/preset-typescript';
import { parse } from '@babel/parser';

const externalModules = packageJson.inscriptions || {};

function extractComponentName(code) {
    const match = code.match(/(?:const|function|export\s+default\s+function)\s+([A-Z][A-Za-z0-9_]*)/) ||
        code.match(/export\s+default\s+const\s+([A-Z][A-Za-z0-9_]*)/) ||
        code.match(/const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\(/);
    return match?.[1] || null;
}

function findUsedComponents(code, allComponentNames) {
    if (!(allComponentNames instanceof Set)) {
        console.error('allComponentNames is not a Set:', allComponentNames);
        return [];
    }
    const matches = [...code.matchAll(/<([A-Z][A-Za-z0-9_]*)\b/g)];
    const used = matches.map(m => m[1]);
    const missing = used.filter(dep => !allComponentNames.has(dep));
    if (missing.length > 0) {
        console.warn(`Missing components used in code: ${missing.join(', ')}`);
    }
    return used;
}

function topologicalSortComponents(components) {
    const graph = new Map();
    const visited = new Set();
    const result = [];

    for (const { name, code, deps } of components) {
        graph.set(name, { code, deps: new Set(deps) });
    }

    function visit(name) {
        if (visited.has(name)) return;
        visited.add(name);
        const node = graph.get(name);
        if (!node) return;
        for (const dep of node.deps) {
            visit(dep);
        }
        result.push(node.code);
    }

    for (const name of graph.keys()) {
        visit(name);
    }

    return result;
}

function downloadExternalModulesWithErrorTracking() {
    const errors = [];

    return {
        name: 'cache-external-modules',
        async resolveId(source) {
            if (source.startsWith('/content/')) {
                const fileName = source.replace('/content/', '');
                const resolvedPath = path.resolve(__dirname, `cached_inscriptions/content/${fileName}`);
                return resolvedPath;
            }
            return null;
        },
        async load(id) {
            if (id.includes('cached_inscriptions/content/')) {
                const fileName = path.basename(id);
                const filePath = path.resolve(__dirname, `cached_inscriptions/content/${fileName}`);
                let content;
                try {
                    await fs.access(filePath);
                    content = await fs.readFile(filePath, 'utf-8');
                } catch (err) {
                    const fileUrl = `https://ordinals.com/content/${fileName}`;
                    try {
                        const res = await fetch(fileUrl);
                        if (!res.ok) throw new Error(`Failed to fetch ${fileUrl}: ${res.status}`);
                        content = await res.text();
                        await fs.mkdir(path.dirname(filePath), { recursive: true });
                        await fs.writeFile(filePath, content);
                        console.log(`Cached inscription: ${fileName}`);
                    } catch (fetchErr) {
                        errors.push(`Error caching ${fileUrl}: ${fetchErr.message}`);
                        return null;
                    }
                }

                const importMatches = content.matchAll(/import\s+.+?\s+from\s+['"](\/content\/.+?)['"]/g);
                const nestedImports = [...importMatches].map(match => match[1]);

                for (const nestedSource of nestedImports) {
                    const nestedFileName = nestedSource.replace('/content/', '');
                    const nestedFilePath = path.resolve(__dirname, `cached_inscriptions/content/${nestedFileName}`);
                    try {
                        await fs.access(nestedFilePath);
                    } catch {
                        const nestedUrl = `https://ordinals.com/content/${nestedFileName}`;
                        try {
                            const res = await fetch(nestedUrl);
                            if (!res.ok) throw new Error(`Failed to fetch ${nestedUrl}: ${res.status}`);
                            const nestedContent = await res.text();
                            await fs.mkdir(path.dirname(nestedFilePath), { recursive: true });
                            await fs.writeFile(nestedFilePath, nestedContent);
                            console.log(`Cached nested inscription: ${nestedFileName}`);
                        } catch (fetchErr) {
                            errors.push(`Error caching nested ${nestedUrl}: ${fetchErr.message}`);
                        }
                    }
                }

                return content;
            }
            return null;
        },
        async closeBundle() {
            if (errors.length > 0) {
                console.error('Caching errors encountered:');
                errors.forEach(err => console.error(`- ${err}`));
            } else {
                console.log('All inscriptions cached successfully.');
            }
        }
    };
}



function transpileJsxComponents() {
    return {
        name: 'transpile-jsx-components',
        async generateBundle() {
            const srcDir = path.resolve(__dirname, 'src');
            const outFile = path.resolve(__dirname, 'build/bappModule.mjs');

            const externalUsages = new Map();
            const namespaceUsages = new Map();
            const componentBlocks = [];
            const allComponentNames = new Set();

            try {
                const files = await fs.readdir(srcDir, { recursive: true });

                for (const file of files) {
                    if (file.endsWith('.jsx') || file.endsWith('.tsx')) {
                        const filePath = path.join(srcDir, file);
                        const fileContent = await fs.readFile(filePath, 'utf-8');

                        const { code: transpiledCode } = await transform(fileContent, {
                            presets: [
                                [babelPresetReact, { runtime: 'automatic' }],
                                babelPresetTS,
                            ],
                            filename: file,
                            sourceMaps: false,
                        });

                        let ast;
                        try {
                            ast = parse(transpiledCode, {
                                sourceType: 'module',
                                plugins: ['jsx', 'typescript'],
                            });
                        } catch (e) {
                            console.warn(`Failed to parse ${file}`);
                            ast = null;
                        }

                        if (ast) {
                            for (const node of ast.program.body) {
                                if (
                                    node.type === 'ImportDeclaration' &&
                                    !node.source.value.startsWith('.') &&
                                    !node.source.value.startsWith('/')
                                ) {
                                    const source = node.source.value;
                                    if (node.importKind === 'type') continue;

                                    const set = externalUsages.get(source) || new Set();

                                    if (node.specifiers.length === 0) {
                                        set.add('side-effect');
                                    } else if (node.specifiers[0].type === 'ImportNamespaceSpecifier') {
                                        const local = node.specifiers[0].local.name;
                                        namespaceUsages.set(local, { source, used: new Set(), keepNamespace: true });
                                    } else {
                                        for (const spec of node.specifiers) {
                                            if (spec.type === 'ImportDefaultSpecifier') {
                                                set.add('default');
                                            } else if (spec.type === 'ImportSpecifier') {
                                                set.add(spec.imported.name);
                                            }
                                        }
                                    }
                                    externalUsages.set(source, set);
                                }
                            }
                        }

                        const nsRegex = /(\w+)\.([A-Za-z0-9_$]+)/g;
                        let match;
                        while ((match = nsRegex.exec(transpiledCode)) !== null) {
                            const [_, ns, prop] = match;
                            if (namespaceUsages.has(ns)) {
                                namespaceUsages.get(ns).used.add(prop);
                            }
                        }

                        const lines = transpiledCode.split('\n');
                        let cleanedCode = `\n\n\n\n///// component: ${file} \n///// JSX source:\n///\n`;
                        cleanedCode += fileContent.split('\n').map(l => '// ' + l).join('\n') + '\n\n';

                        for (const line of lines) {
                            const trimmed = line.trim();
                            if (trimmed.startsWith('import') && trimmed.includes('from')) {
                                continue;
                            }
                            cleanedCode += line + '\n';
                        }

                        const name = extractComponentName(cleanedCode);
                        if (name) {
                            allComponentNames.add(name);
                            componentBlocks.push({ name, code: cleanedCode, deps: [] });
                        }
                    }
                }

                for (const block of componentBlocks) {
                    block.deps = findUsedComponents(block.code, allComponentNames).filter(d => d !== block.name);
                }

                const importLines = new Set();

                importLines.add(`import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';`);

                const reactSet = externalUsages.get('react') || new Set();
                const reactHooks = Array.from(reactSet).filter(n => n !== 'default').sort().join(', ');
                importLines.add(`import React${reactHooks ? ', { ' + reactHooks + ' }' : ''} from 'react';`);

                let threeUsedNamed = new Set();
                let threeNamespaceLocal = null;

                for (const [local, info] of namespaceUsages) {
                    if (info.source === 'three') {
                        threeNamespaceLocal = local;
                        if (info.used.size > 0) {
                            threeUsedNamed = info.used;
                        }
                        importLines.add(`import * as ${local} from 'three';`);
                        externalUsages.delete('three');
                        break;
                    }
                }

                if (threeUsedNamed.size > 0) {
                    const list = Array.from(threeUsedNamed).sort().join(', ');
                    importLines.add(`import { ${list} } from 'three';`);
                }

                for (const [local, { source, used }] of namespaceUsages) {
                    if (source === 'three') continue;
                    if (used.size > 0) {
                        const list = Array.from(used).sort().join(', ');
                        importLines.add(`import { ${list} } from '${source}';`);
                        externalUsages.delete(source);
                    }
                }

                // todo: fix defaults
                const trueDefaultPackages = {
                    'react-dom/client': 'ReactDOM',
                    'three-custom-shader-material': 'CustomShaderMaterial',
                };

                const bvhSet = externalUsages.get('three-mesh-bvh');
                if (bvhSet) {
                    const namedFromBvh = Array.from(bvhSet)
                        .filter(n => n !== 'default' && n !== 'side-effect')
                        .sort();
                    if (namedFromBvh.length > 0) {
                        importLines.add(`import { ${namedFromBvh.join(', ')} } from 'three-mesh-bvh';`);
                    } else {
                        importLines.add(`import 'three-mesh-bvh';`);
                    }
                    externalUsages.delete('three-mesh-bvh');
                }

                for (const [source, names] of externalUsages) {
                    if (source === 'react' || source.includes('jsx-runtime') || source === 'three-mesh-bvh' || source === 'three') continue;

                    const hasDefault = names.has('default');
                    const named = Array.from(names)
                        .filter(n => n !== 'default' && n !== 'side-effect')
                        .sort();

                    const defaultLocal = trueDefaultPackages[source];

                    if (defaultLocal) {
                        if (named.length > 0) {
                            importLines.add(`import ${defaultLocal}, { ${named.join(', ')} } from '${source}';`);
                        } else {
                            importLines.add(`import ${defaultLocal} from '${source}';`);
                        }
                    } else if (named.length > 0) {
                        importLines.add(`import { ${named.join(', ')} } from '${source}';`);
                    }
                }

                const sortedImports = Array.from(importLines).sort();

                const ROOT_COMPONENTS = new Set(['App', 'WorldWrapper']);

                const tempOrder = topologicalSortComponents(componentBlocks);

                const rootBlocks = [];
                const nonRootBlocks = [];

                tempOrder.forEach(code => {
                    const isRoot = Array.from(ROOT_COMPONENTS).some(rootName => {
                        const regex = new RegExp(`(?:const|function)\\s+${rootName}\\b`);
                        return regex.test(code);
                    });

                    if (isRoot) rootBlocks.push(code);
                    else nonRootBlocks.push(code);
                });

                const sortedComponents = [...nonRootBlocks, ...rootBlocks];

                const finalCode = sortedImports.join('\n') + '\n\n' + sortedComponents.join('\n\n');

                await fs.mkdir(path.dirname(outFile), { recursive: true });
                await fs.writeFile(outFile, finalCode);

                console.log('✅ Components combined – THREE namespace + named exports (Vector3, etc.) both available!');
            } catch (err) {
                console.error('Error in transpile-jsx-components plugin:', err);
                throw err;
            }
        },
    };
}




export default defineConfig(({ command }) => {
    const isProduction = command === 'build';

    let aliases = {};
    Object.keys(externalModules).forEach(name => {
        aliases[name] = isProduction
            ? ('https://ordinals.com/content/' + externalModules[name])
            : path.resolve(__dirname, 'cached_inscriptions/content/' + externalModules[name]);
    });

    let removeImportMap = command === 'build' ? {
        name: 'remove-importmap-plugin',
        transformIndexHtml(html) {
            return html.replace(/<script type="importmap">[\s\S]*?<\/script>/g, '');
        }
    } : null;

    let hdrFix = command === 'build' ? {
        name: 'hdr-fix-plugin',
        transform(code, id) {
            if (id.endsWith('.js') || id.endsWith('.jsx') || id.endsWith('.ts') || id.endsWith('.tsx')) {
                return {
                    code: code.replace(/\?\.\s*hdr/g, ''),
                    map: null
                };
            }
            return null;
        }
    } : null;

    function postBuildReplacePlugin() {
        return {
            name: 'post-build-replace-plugin',
            async closeBundle() {
                const buildDir = path.resolve(__dirname, 'build');
                const htmlFile = path.join(buildDir, 'index.html');
                let htmlContent = await fs.readFile(htmlFile, 'utf-8');
                Object.keys(externalModules).forEach(identifier => {
                    const url = externalModules[identifier];
                    const regex = new RegExp(`(["'])(${identifier})(["'])`, 'g');
                    htmlContent = htmlContent.replace(regex, `$1${url}$3`);
                });
                await fs.writeFile(htmlFile, htmlContent);
            }
        };
    }

    return {
        optimizeDeps: {
            exclude: ['useGUI'],
        },
        resolve: {
            alias: aliases,
        },
        plugins: [
            react(),
            downloadExternalModulesWithErrorTracking(),
            viteSingleFile(),
            glsl({ compress: true }),
            removeImportMap,
            hdrFix,
            postBuildReplacePlugin(),
            transpileJsxComponents(),
        ],
        server: {
            logLevel: 'error',
            port: 4000,
            proxy: {
                '/content': { target: 'https://ordinals.com', changeOrigin: true, rewrite: p => p, secure: false },
                '/r': { target: 'https://ordinals.com', changeOrigin: true, rewrite: p => p, secure: false },
                '/blockheight': { target: 'https://ordinals.com', changeOrigin: true, rewrite: p => p, secure: false },
                '/blockhash': { target: 'https://ordinals.com', changeOrigin: true, rewrite: p => p, secure: false },
                '/blocktime': { target: 'https://ordinals.com', changeOrigin: true, rewrite: p => p, secure: false },
            },
        },
        build: {
            legalComments: 'inline',
            modulePreload: { polyfill: false },
            outDir: 'build',
            sourcemap: false,
            rollupOptions: {
                external: Object.keys(externalModules).concat([
                    'shaderNoiseFunctions', 'bitmon', 'bitmapOCI', 'boxelGeometry', 'boxels-shader',
                    'GridFloor', 'useCollider', 'three', 'react', 'react-dom', 'react-dom/client',
                    'react/jsx-runtime', '@use-gesture/react', '@react-three/fiber', '@react-three/drei',
                    '@react-three/postprocessing', '@react-three/cannon', '@react-three/a11y',
                    '@react-three/csg', 'three-custom-shader-material', 'leva', 'randomish',
                    'material-composer', 'material-composer-r3f', 'shader-composer',
                    'vfx-composer', 'vfx-composer-r3f', '@react-spring/three', '@react spring/web',
                    'statery', 'maath', 'r3f-perf', 'suspend-react', 'miniplex', 'miniplex-react',
                    'simplex-noise', 'alea', 'FBXLoader', 'three-mesh-bvh', '@pixiv/three-vrm'
                ]),
            },
        },
    };
});
