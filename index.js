import slib, { argv } from "@randajan/simple-lib";

const { isBuild } = argv;

slib(
    isBuild,
    {
        lib:{
            entries:[
                "MapMap.js",
                "MapSet.js",
                "MapArray.js",
            ]
        }
    }
);