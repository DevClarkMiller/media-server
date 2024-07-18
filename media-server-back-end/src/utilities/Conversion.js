module.exports = () =>{
    const ffmpeg = require('fluent-ffmpeg');
    const fs = require('fs');

    const downScaleVideo = (filepath, outputname="temp.mp4", ext="mp4", width = 320) =>{
        return new Promise((resolve, reject) =>{
            try{
                fs.mkdirSync(process.env.TEMP_FILES_PATH, { recursive: true });    //Creates temp filepath if it doesn't exist
                const outputPath = `${process.env.TEMP_FILES_PATH}/${outputname}`;
                //Replace with actual file pathW    
                const command = ffmpeg(filepath);
                command
                .size(`${width}x?`)
                .saveToFile(outputPath)
                .on('error', (err) => {
                    console.error('Error during ffmpeg process:', err);
                    reject(err);    //Passes error upwards
                })
                .on('end', () =>{
                    console.log('Conversion is finished!');
                    resolve(outputPath);
                })
            }catch(err){
                reject(err);
            }
        });
    }

    const downScaleAudio = (filepath, outputname="temp.mp3", ext="mp3", bitrate = 64) =>{
        return new Promise((resolve, reject) =>{
            console.log(ext);
            try{
                fs.mkdirSync(process.env.TEMP_FILES_PATH, { recursive: true });    //Creates temp filepath if it doesn't exist
                const outputPath = `${process.env.TEMP_FILES_PATH}/${outputname}`;
                //Replace with actual file path
                const command = ffmpeg(filepath);
                command
                .audioCodec((ext !== 'ogg') ? 'libmp3lame' : 'libopus')
                .audioBitrate(`${bitrate}k`)
                .save(outputPath)
                .on('error', (err) => {
                    console.error('Error during ffmpeg process:', err);
                    reject(err);    //Passes error upwards
                })
                .on('end', () =>{
                    console.log('Conversion is finished!');
                    resolve(outputPath);
                })
                //.run()
            }catch(err){
                reject(err);
            }
        });
    }

    return{
        downScaleVideo,
        downScaleAudio
    }
}