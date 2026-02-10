import {useThree} from "@react-three/fiber";
import {useEffect, useRef} from "react";

import 'webgl-memory'
import {getPerf} from 'r3f-perf'

import {useGUI} from 'ecs'
import {TorusKnot} from "@react-three/drei";

function formatMemory(bytes) {

    const kb = (bytes / 1024).toFixed(2);
    const mb = (bytes / (1024 * 1024)).toFixed(2);

    // return '' + numberWithCommas + ' - ' + `${kb} KB, ${mb} MB`
    return `${mb} MB`
}


const getFps = () => new Promise(resolve => {
    let repaint = 0;
    const start = performance.now();
    const withRepaint = () => {
        requestAnimationFrame(() => {
            if ((performance.now() - start) < 1000) {
                repaint += 1;
                withRepaint();
            } else {
                resolve(repaint);
            }
        });
    };
    withRepaint();
});


export const MemoryPerformanceMonitor = () => {


    const {gl, scene} = useThree()

    const report = useRef()


    useGUI(
        <div className={' text-[18px] bg-neutral-800/90 opacity-90 hover:opacity-90 ring-2 p-2 absolute bottom-32 left-[500px] text-orange-300 flex flex-col'}>

            <div id={'cpu1'}>
                00
            </div>
            <div id={'gpu1'}>
                00
            </div>
            <div id={'mem1'}>
                00
            </div>
            <div id={'draws1'}>
                00
            </div>
        </div>
    )

    useEffect(() => {

        const intt = setInterval(() => {
            report.current = getPerf()
            // console.log(report.current)

            const rep = report.current.getReport()
            // console.log(rep)
            try {

                if (report.current?.log?.cpu) {
                    document.getElementById('cpu1').innerText = 'cpu: ' + report.current?.log?.cpu.toFixed(3) + ' (avg: ' + rep.log.cpu.toFixed(3) + ')'
                }
                if (report.current?.log?.gpu) {
                    document.getElementById('gpu1').innerText = 'gpu: ' + report.current?.log?.gpu.toFixed(3) + ' (avg: ' + rep.log.gpu.toFixed(3) + ')'
                }
                if (report.current?.log?.mem) {
                    document.getElementById('mem1').innerText = 'mem: ' + report.current?.log?.mem.toFixed(3) + ' (avg: ' + rep.log.gpu.toFixed(3) + ')'
                }
                if (report.current?.gl) {
                    document.getElementById('draws1').innerText = 'draw calls: ' + report.current?.gl.info.render.calls.toLocaleString()
                }
            } catch (e) {
            }
        }, 1000)

        const onDown = async (e) => {
            // console.log(e.key)
            if (e.key === 'o') {
                // gl.forceContextLoss();
                // gl.context = null;
                // gl.domElement = null;
                // gl.dispose();
                // gl = null;
            }
            if (e.key === 'p') {


                report.current = getPerf()
                console.log('cpu:' + report.current.log.cpu.toFixed(3))
                console.log('gpu:' + report.current.log.gpu.toFixed(3))
                console.log('fps:' + report.current.log.fps.toFixed(3))
                console.log('mem:' + report.current.log.mem.toFixed(3))


                if (performance.memory) {
                    console.log('totalJSHeapSize: ' + formatMemory(performance.memory.totalJSHeapSize) + ' / ' + formatMemory(performance.memory.jsHeapSizeLimit))
                    console.log('usedJSHeapSize: ' + formatMemory(performance.memory.usedJSHeapSize))
                }

                // console.log(gl.info)
                const ext = gl.extensions.get('GMAN_webgl_memory');
                if (ext) {
                    // memory info
                    const info = ext.getMemoryInfo();
                    const textures = ext.getResourcesInfo(WebGLTexture);
                    const buffers = ext.getResourcesInfo(WebGLBuffer);

                    console.log(info)
                    console.log(textures)
                    console.log(buffers)

                    console.log('webgl memory: ' + formatMemory(info.memory.total))
                    console.log('calls: ' + gl.info.render.calls.toLocaleString())
                    console.log('triangles: ' + gl.info.render.triangles.toLocaleString())
                    console.log('textures: ' + gl.info.memory.textures + ' / ' + info.resources.texture)
                    console.log('tex memory: ' + formatMemory(info.memory.texture))
                    console.log('geometries: ' + gl.info.memory.geometries.toLocaleString())

                    // console.log({
                    //     glinfo: gl.info,
                    //     memory: {
                    //         info: info,
                    //         textures: textures,
                    //         buffers: buffers,
                    //     }
                    // })

                    // console.log('\n without post/shadows/env:')
                    // console.log('calls: ' + (gl.info.render.calls - 2))
                    // console.log('tris: ' + (gl.info.render.triangles - 113))
                    // console.log('tex mem: ' + formatMemory(info.memory.texture - 32000000))
                }
            }
        }


        window.document.addEventListener('keydown', onDown)

        return () => {
            clearInterval(intt)
            window.document.removeEventListener('keydown', onDown)
        }
    }, [gl])



}
