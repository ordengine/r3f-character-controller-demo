# R3F character controller demo


![image](https://raw.githubusercontent.com/ordengine/r3f-character-controller-demo/refs/heads/main/Screenshot%20from%202026-02-10%2014-21-00.png)

## local development

1. install

   `npm install`
   or
   `yarn install`

2. run

   `npm run dev`
   or
   `yarn dev`

## build inscription

`npm run build`
or
`yarn build`

your app will be fully bundled into a single HTML file inside the `build` folder

![image](https://github.com/user-attachments/assets/aab7f744-3764-42e5-81bb-e092bc5474ee)

test here: https://ordinals.com/inscription/33633842


## using existing inscriptions recursively

add  the content url to the `inscriptions` section in `package.json`:

![image](https://github.com/user-attachments/assets/9a2b02a7-ffc8-418f-a307-90ac14d6471d)

then import via alias name
`import {GridFloor} from 'GridFloor'`
