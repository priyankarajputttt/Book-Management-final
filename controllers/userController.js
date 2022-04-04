
const userModel = require("../models/userModel.js")
const jwt = require("jsonwebtoken")
const validation = require("../middleware/validation")



const registerUser = async (req, res) => {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "No input" })
        }
        const { title, name, phone, email, password } = data;
        if (!validation.valid(title)) {
            return res.status(400).send({ status: false, msg: "No title provided by user" })
        }



       
if (! validation.isValidTitle(title)) {
            return res.status(400).send({ Satus: false, msg: "Title can only be Mr , Mrs and Miss" })
        }

        if (!validation.valid(name)) {
            return res.status(400).send({ status: false, msg: "Name not provided by user" })
        }

        if (!validation.valid(phone)) {
            return res.status(400).send({ status: false, msg: "Phone not provided by user" })
        }

        if (!validation.isValidPhone(phone)) {
            return res.status(400).send({ status: false, msg: "Enter valid 10 digit indian mobile number " });
        }

        const phoneExt = await userModel.findOne({ phone: data.phone })
        if (phoneExt) {
            return res.status(400).send({ msg: "phone Number already exists" })
        }


        if (!validation.valid(email)) {
            return res.status(400).send({ status: false, msg: "No email provided by user" })
        }
        if (!validation.isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: "Enter a valid email address " });
        }
        const emailExt = await userModel.findOne({ email: data.email })
        if (emailExt) {
            return res.status(400).send({ msg: " Email already exists " })
        }

        if (!validation.valid(password)) {
            return res.status(400).send({ status: false, msg: "No password provided by user" })
        }
        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ msg: "Password minimum length is 8 and maximum length is 15" })
        }


        let saveData = await userModel.create(data);
        return res.status(201).send({ status: true, msg: saveData })
    }
    catch (error) {
        
        return res.status(500).send({ status: false, msg: error.message });
    }
}


const loginUser = async (req, res) => {
    try {
        Data = req.body

        if (Object.keys(Data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please provide the input" })
        }

        const { email, password } = Data;


        if (!validation.valid(email)) {
            return res.status(400).send({ status: false, msg: "Insert email" })
        }

        if (!validation.isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: "Enter  valid email address " });
        }
        if (!validation.valid(password)) {
            return res.status(400).send({ status: false, msg: "Insert Password" })
        }

        const findUser = await userModel.findOne({ email: email, password: password })
        if (!findUser) {
            return res.status(404).send({ status: false, msg: "No user with this email or password was found found" })
        }

        const token = jwt.sign({
            userId: findUser._id,

        }, "Project-Three", { expiresIn: "24h" }

        );

        return res.status(200).send({ status: true, msg: "Successful Login", Token: token })
    }
    catch (err) {
       
        return res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports.loginUser = loginUser
module.exports.registerUser = registerUser