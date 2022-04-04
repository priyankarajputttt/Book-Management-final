const express = require('express');
const removeUploadedFiles = require('multer/lib/remove-uploaded-files');
const router = express.Router();
const aws = require("aws-sdk")




// S3 and cloud storage 
// step 1: multer will be used as usual to get access to the file in nodejs( from previous session learnings)
// step 2(BEST PRACTICE): always write s2 uploadFile function seperately- in a seperate file/function..expect it to take file as input and return the url of the uploaded file as output
// step 3: aws-sdk install - as package
// step 4: Setup config for aws authentication- use code below as plugin keys that are given to you
// step 5: build the uploadFile function for uploading file - use the code below and edit what is marked HERE only

// PROMISES:-
// - you can never use await on callback..if you have awaited something , then you can be sure that it is inside a promise
// - how to write promise:- wrap your entire code inside: "return new Promise( function(resolve, reject) { "...and when error - return reject( err )..else when all ok and you have data, return resolve (data)

aws.config.update(
    {
        accessKeyId: "AKIAY3L35MCRVFM24Q7U",
        secretAccessKeyId: "qGG1HE0qRixcW1T1Wg1bv+08tQrIkFVyDFqSft4J",
        region: "ap-south-1"
    }
)

let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        //this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: "2006-03-01" }) //we will be using s3 service of aws
       
        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket", // HERE
            Key: "radhika/" + file.originalname, // HERE "radhika/smiley.jpg"
            Body: file.buffer
        }

        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }

            console.log(data)
            console.log(" file uploaded succesfully ")
            return resolve(data.Location) // HERE
        }
        )

        // let data= await s3.upload(uploadParams)
        // if (data) return data.Location
        // else return "there is an error"

    }
    )


}

const awsLinkCreator = async function (req, res) {
    try {
        let files = req.files
        if (files && files.length > 0) {
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL = await uploadFile(files[0])
            res.status(201).send({ msg: "file uploaded succesfully", data: uploadedFileURL })
        }
        else {
            res.status(400).send({ msg: "No file found" })
        }
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }
}


module.exports.awsLinkCreator = awsLinkCreator;