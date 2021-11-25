const express = require('express')
const multer = require('multer')

const app = express()
app.use(express.static('/public'))

//задаем имя файлу и папку, в которой он будет храниться
const storeConf = multer.diskStorage({
    destination: (null, 'uploaded_images'),
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

// переменная, что бы можно было ошибки из фильтров вытягивать
let answ = {
    status: '',
    send: ''
}

const filetrConf = (req, file, cb) => {
    const fileSize = parseInt(req.headers['content-length']) // измеряем размер файла при помощи заголовков
    if (fileSize <= 1900000) {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") { // проверяем разрешения файлов
            cb(null, true)
        } else {
            answ.status = 415;
            answ.send = 'File is unsuppoted'
            cb(null, false)
        }
    } else {
        answ.status = 416;
        answ.send = 'File is too big'
        cb(null, false)
    }
}

app.use(multer({
    storage: storeConf,
    fileFilter: filetrConf,
    limits: {
        fileSize: 2000000  //синтаксис лимитов. лимиты: fieldNameSize, fieldSize, fields, fileSize, files, parts, headerPairs
    }
}).single("image"))

app.post('/upload', (req, res) => {
    const file = req.file // любой файл из мультера передается в req.file или req.files 
    console.log(file)
    if (!file) {
        res.status(answ.status).send(answ.send)
    } else {
        res.status(200).send('Ok')
    }
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.listen(3000, () => console.log('Started'))