cwifs={
    map:{
        files:[],
        lusables:0
    },
    file:{
        write:(name,contents)=>{
            usectors=[]
            ssector=cwifs.map.lusables
            sector=cwifs.map.lusables
            str=contents.split("").map(x => ((xa)=>{usectors.push(sector);cwifs.device.string.write(xa,sector);sector+=1})(x))
            esector=sector
            cwifs.map.lusables=(esector+1)
            file={
                name:name,
                range:`${ssector.toString()}-${esector.toString()}`.toString(),
                start:ssector,
                end:esector,
                used:usectors
            }
            cwifs.map.files.push(file)
        },
        read:(name)=>{
            output=""
            for(file in cwifs.map.files){
                if(cwifs.map.files[file].name==name){
                        for(sector in cwifs.map.files[file].used){
                            output+=cwifs.device.string.read(sector)
                        }
                }
            }
            return output
        },
        delete:(name)=>{
            for(file in cwifs.map.files){
                if(cwifs.map.files[file].name==name){
                        uusec=cwifs.map.files[file].used
                        cwifs.map.files.pop(file)
                        for(fd in uusec){
                            xxlocation=cwifs.device.locate(uusec[fd]*7)
                            cwifs.device.fs[xxlocation.GB][xxlocation.MB][xxlocation.KB][xxlocation.B]=cwifs.types.__byte()
                        }
                        cwifs.map.lusables=uusec[0]
                }
            }
        }
    },
    types:{
        __bit:()=>{
            return Number(0)
        },
        __byte:()=>{
            //I know that 1Byte=8Bits but v8 can't process it.
            return Array(7).fill(cwifs.types.__bit())
        },
        __kilobyte:()=>{
            return Array(1000).fill(cwifs.types.__byte())
        },
        __megabyte:()=>{
            return Array(1000).fill(cwifs.types.__kilobyte())
        },
        gigabyte:()=>{
            return Array(1000).fill(cwifs.types.__megabyte())
        }
    },
    device:{
        locate:(bit)=>{
            byte=bit/7
            byte=byte.toFixed()
            Kbyte=byte/1000
            Kbyte=Kbyte.toFixed()
            Mbyte=Kbyte/1000
            Mbyte=Mbyte.toFixed()
            Gbyte=Mbyte/1000
            Gbyte=Gbyte.toFixed()
            return {GB:Gbyte,MB:Mbyte,KB:Kbyte,B:byte,b:bit}
        },
        string:{
            read:(byte)=>{
                str=""
                xxxlocation=cwifs.device.locate(byte*7)
                bytesector=cwifs.device.fs[xxxlocation.GB][xxxlocation.MB][xxxlocation.KB][xxxlocation.B].map(x => x=x.toString()).map(x => str+=x)
                str=String.fromCharCode(parseInt(str,2))
                return str
            },
            write:(letter,byte)=>{
                xxxlocation=cwifs.device.locate(byte*7)
                byte=letter.charCodeAt(0).toString(2).split("").map(x => x=parseInt(x))
                cwifs.device.fs[xxxlocation.GB][xxxlocation.MB][xxxlocation.KB][xxxlocation.B]=byte
            }
        }
    },
    setup:(()=>{
        cwifs.device.fs=cwifs.types.gigabyte()
    })
}