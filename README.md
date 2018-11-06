# God rays for BabylonJS

Geometry based godrays for BabylonJS. Few times faster comparing to a built-in post-effect based ones. Configurable rotation speed, colors, size, density.

![God rays](https://media.giphy.com/media/d7na8bnglKVf54foMw/giphy.gif)

## How to use

`npm install babylonjs-godrays --save`

```
import { Godrays } from "babylonjs-godrays";
const godrays = new Godrays(scene);
godrays.position = new Vector3(x, y, z);
```

Look for a demo source code for more insights.

## API

* `godrays.start(multConfig)` Starts rays smoothly applying config passed as an argument.

Config interface:

```
interface GodraysConfig {
    colors: Array<Color3>; // Colors of rays
    scale: number; // Default is 1
    minSpeed: number; // Minimal rotation speed
    maxSpeed: number; // Maximum rotation speed
    density: number; // From 0 to 1 defines density of the rays
}
```

* `godrays.stop()` Stops rays smoothly.

* `godrays.setColors(Array<Color3>)` Sets colors of rays.

* `godrays.setRaysScale(number)` Sets scale of rays.

* `godrays.setRotataionSpeed(minSpeed: number, maxSpeed: number)` Sets min, max rotation speed applied to rays.

* `godrays.setDensity(number)` Sets a density of rays. 


## License

MIT: http://mit-license.org/

Copyright 2018 Denis Radin aka [PixelsCommander](http://pixelscommander.com)


## Credits

Inspired by my work at [Evolution Gaming](https://www.evolutiongamingcareers.com/search-jobs/?department=Engineering&country=)
